import os
import asyncio
from neo4j import AsyncGraphDatabase
from opentelemetry import trace
from opentelemetry.trace import StatusCode


class GraphMemory:
    """
    Neo4j client for the orchestrator.

    Stores full PipelineRun nodes linked to Topics and Reports,
    with DecisionTrace chains capturing each agent step.
    Provides the /api/memory query endpoint.

    Graph schema additions (orchestrator-side):
        (:PipelineRun {id, timestamp, total_cost_usd, duration_seconds,
                       hallucination_risk, hallucination_confidence})
        (:Report {id, content, created_at})
        (:DecisionTrace {step, agent, action, observation})

        (:PipelineRun)-[:RESEARCHED]->(:Topic)
        (:PipelineRun)-[:PRODUCED]->(:Report)
        (:PipelineRun)-[:HAS_TRACE]->(:DecisionTrace)
        (:DecisionTrace)-[:NEXT]->(:DecisionTrace)
    """

    def __init__(self, tracer):
        self.driver = AsyncGraphDatabase.driver(
            os.getenv("NEO4J_URI", "bolt://localhost:7687"),
            auth=(os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD", "password")),
        )
        self.tracer = tracer

    async def await_ready(self, retries: int = 10, delay: float = 3.0):
        for attempt in range(retries):
            try:
                async with self.driver.session() as session:
                    await session.run("RETURN 1")
                print("[orchestrator] Neo4j is ready")
                return
            except Exception:
                print(f"[orchestrator] Waiting for Neo4j ({attempt + 1}/{retries})...")
                await asyncio.sleep(delay)
        raise RuntimeError("Neo4j did not become ready in time")

    async def close(self):
        await self.driver.close()

    async def store_pipeline_run(
        self,
        topic: str,
        findings: str,
        report: str,
        hallucination: dict,
        total_cost: float,
        duration: float,
    ):
        """
        Persist a complete pipeline run as a graph:
        PipelineRun → Topic, Report, and a chain of DecisionTrace nodes.
        """
        with self.tracer.start_as_current_span("neo4j.store_pipeline_run") as span:
            span.set_attribute("db.system",          "neo4j")
            span.set_attribute("graph.topic",        topic)
            span.set_attribute("graph.cost_usd",     round(total_cost, 6))
            span.set_attribute("graph.duration_s",   round(duration, 3))
            span.set_attribute("graph.hallucination_risk", hallucination.get("risk_level", "unknown"))

            try:
                async with self.driver.session() as session:
                    # Create PipelineRun linked to Topic and Report
                    result = await session.run(
                        """
                        MERGE (t:Topic {name: $topic})
                        CREATE (run:PipelineRun {
                            id:                     randomUUID(),
                            timestamp:              datetime(),
                            total_cost_usd:         $cost,
                            duration_seconds:       $duration,
                            hallucination_risk:     $risk,
                            hallucination_confidence: $confidence
                        })
                        CREATE (rep:Report {
                            id:         randomUUID(),
                            content:    $report,
                            created_at: datetime()
                        })
                        CREATE (run)-[:RESEARCHED]->(t)
                        CREATE (run)-[:PRODUCED]->(rep)
                        RETURN run.id AS run_id
                        """,
                        topic=topic,
                        cost=round(total_cost, 6),
                        duration=round(duration, 3),
                        risk=hallucination.get("risk_level", "unknown"),
                        confidence=hallucination.get("confidence_score", 0.0),
                        report=report,
                    )
                    record = await result.single()
                    run_id = record["run_id"] if record else "unknown"
                    span.set_attribute("graph.run_id", run_id)

                    # Decision trace chain: Research → Write → Verify
                    steps = [
                        ("research-agent", "retrieve_and_research",  findings[:400]),
                        ("writer-agent",   "write_report",           report[:400]),
                        ("fact-checker",   "verify_hallucination",   str(hallucination)[:400]),
                    ]
                    prev_trace_id = None
                    for i, (agent, action, observation) in enumerate(steps):
                        r = await session.run(
                            """
                            MATCH (run:PipelineRun {id: $run_id})
                            CREATE (dt:DecisionTrace {
                                id:          randomUUID(),
                                step:        $step,
                                agent:       $agent,
                                action:      $action,
                                observation: $observation,
                                timestamp:   datetime()
                            })
                            CREATE (run)-[:HAS_TRACE]->(dt)
                            RETURN dt.id AS trace_id
                            """,
                            run_id=run_id,
                            step=i + 1,
                            agent=agent,
                            action=action,
                            observation=observation,
                        )
                        rec = await r.single()
                        trace_id = rec["trace_id"] if rec else None

                        # Link to previous trace step
                        if prev_trace_id and trace_id:
                            await session.run(
                                """
                                MATCH (prev:DecisionTrace {id: $prev_id})
                                MATCH (curr:DecisionTrace {id: $curr_id})
                                CREATE (prev)-[:NEXT]->(curr)
                                """,
                                prev_id=prev_trace_id,
                                curr_id=trace_id,
                            )
                        prev_trace_id = trace_id

            except Exception as e:
                span.record_exception(e)
                span.set_status(StatusCode.ERROR, str(e))
                raise

    async def get_knowledge_graph(self) -> dict:
        """
        Return the full knowledge graph state for the /api/memory endpoint.
        Includes all topics, their entities, relationships, and recent pipeline runs.
        """
        with self.tracer.start_as_current_span("neo4j.get_knowledge_graph") as span:
            span.set_attribute("db.system", "neo4j")
            try:
                async with self.driver.session() as session:
                    # Topics + entities + relationships
                    topics_result = await session.run(
                        """
                        MATCH (t:Topic)
                        OPTIONAL MATCH (t)-[:INVOLVES]->(e:Entity)
                        OPTIONAL MATCH (t)-[r:RELATED_TO]-(t2:Topic)
                        WITH t,
                             collect(DISTINCT {name: e.name, type: e.type}) AS entities,
                             collect(DISTINCT {topic: t2.name, shared_entities: r.shared_entities}) AS related
                        RETURN t.name AS topic, entities, related
                        ORDER BY t.created_at DESC
                        """
                    )
                    topics = await topics_result.data()

                    # Recent pipeline runs
                    runs_result = await session.run(
                        """
                        MATCH (run:PipelineRun)-[:RESEARCHED]->(t:Topic)
                        RETURN t.name          AS topic,
                               toString(run.timestamp)          AS timestamp,
                               run.hallucination_risk           AS hallucination_risk,
                               run.hallucination_confidence     AS hallucination_confidence,
                               run.total_cost_usd               AS cost_usd,
                               run.duration_seconds             AS duration_seconds
                        ORDER BY run.timestamp DESC LIMIT 20
                        """
                    )
                    runs = await runs_result.data()

                    span.set_attribute("graph.topic_count", len(topics))
                    span.set_attribute("graph.run_count",   len(runs))

                    return {"topics": topics, "recent_runs": runs}

            except Exception as e:
                span.record_exception(e)
                span.set_status(StatusCode.ERROR, str(e))
                return {"topics": [], "recent_runs": []}
