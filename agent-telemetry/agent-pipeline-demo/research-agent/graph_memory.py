import os
import asyncio
from neo4j import AsyncGraphDatabase
from opentelemetry import trace
from opentelemetry.trace import StatusCode


class GraphMemory:
    """
    Neo4j-backed knowledge graph for the research agent.

    Stores Topics, Findings, and Entities (POLE+O model) and builds
    RELATED_TO edges between topics that share entities — enabling
    cross-run contextual enrichment.

    Graph schema:
        (:Topic)-[:HAS_FINDING]->(:Finding)
        (:Topic)-[:INVOLVES]->(:Entity {type: Person|Organization|Location|Event|Object})
        (:Topic)-[:RELATED_TO {shared_entities: int}]-(:Topic)
        (:Finding)-[:MENTIONS]->(:Entity)
    """

    def __init__(self, tracer):
        self.driver = AsyncGraphDatabase.driver(
            os.getenv("NEO4J_URI", "bolt://localhost:7687"),
            auth=(os.getenv("NEO4J_USER", "neo4j"), os.getenv("NEO4J_PASSWORD", "password")),
        )
        self.tracer = tracer

    async def await_ready(self, retries: int = 10, delay: float = 3.0):
        """Wait for Neo4j to be ready before accepting requests."""
        for attempt in range(retries):
            try:
                async with self.driver.session() as session:
                    await session.run("RETURN 1")
                print("[research-agent] Neo4j is ready")
                return
            except Exception:
                print(f"[research-agent] Waiting for Neo4j ({attempt + 1}/{retries})...")
                await asyncio.sleep(delay)
        raise RuntimeError("Neo4j did not become ready in time")

    async def create_indexes(self):
        """Idempotent schema constraints — safe to run on every startup."""
        async with self.driver.session() as session:
            await session.run(
                "CREATE CONSTRAINT topic_name IF NOT EXISTS FOR (t:Topic) REQUIRE t.name IS UNIQUE"
            )
            await session.run(
                "CREATE CONSTRAINT entity_unique IF NOT EXISTS FOR (e:Entity) REQUIRE (e.name, e.type) IS UNIQUE"
            )

    async def close(self):
        await self.driver.close()

    # ── Read operations ───────────────────────────────────────────────────────

    async def get_prior_research(self, topic: str) -> str | None:
        """Return the most recent Finding for this exact topic, or None."""
        with self.tracer.start_as_current_span("neo4j.get_prior_research") as span:
            span.set_attribute("db.system", "neo4j")
            span.set_attribute("db.statement", "MATCH (t:Topic)-[:HAS_FINDING]->(f:Finding)")
            span.set_attribute("graph.topic", topic)
            try:
                async with self.driver.session() as session:
                    result = await session.run(
                        """
                        MATCH (t:Topic {name: $topic})-[:HAS_FINDING]->(f:Finding)
                        RETURN f.content AS findings
                        ORDER BY f.created_at DESC LIMIT 1
                        """,
                        topic=topic,
                    )
                    record = await result.single()
                    hit = record is not None
                    span.set_attribute("graph.cache_hit", hit)
                    return record["findings"] if hit else None
            except Exception as e:
                span.record_exception(e)
                span.set_status(StatusCode.ERROR, str(e))
                return None

    async def find_related_context(self, topic: str) -> list[dict]:
        """
        Find topics related to this one via shared entities.
        Returns up to 3 related topics with their most recent findings.
        """
        with self.tracer.start_as_current_span("neo4j.find_related_context") as span:
            span.set_attribute("db.system", "neo4j")
            span.set_attribute("db.statement", "MATCH (t1)-[r:RELATED_TO]-(t2)-[:HAS_FINDING]->(f)")
            span.set_attribute("graph.topic", topic)
            try:
                async with self.driver.session() as session:
                    result = await session.run(
                        """
                        MATCH (t1:Topic {name: $topic})-[r:RELATED_TO]-(t2:Topic)
                        MATCH (t2)-[:HAS_FINDING]->(f:Finding)
                        WITH t2, r, f ORDER BY f.created_at DESC
                        WITH t2, r, collect(f.content)[0] AS latest_finding
                        RETURN t2.name AS related_topic,
                               latest_finding AS findings,
                               r.shared_entities AS shared_entities
                        ORDER BY r.shared_entities DESC LIMIT 3
                        """,
                        topic=topic,
                    )
                    records = await result.data()
                    span.set_attribute("graph.related_count", len(records))
                    return records
            except Exception as e:
                span.record_exception(e)
                span.set_status(StatusCode.ERROR, str(e))
                return []

    # ── Write operations ──────────────────────────────────────────────────────

    async def store_research(self, topic: str, findings: str, entities: list[dict]):
        """
        Persist a new Finding under the Topic node, link extracted entities,
        then rebuild RELATED_TO edges for any topics that share entities.
        """
        with self.tracer.start_as_current_span("neo4j.store_research") as span:
            span.set_attribute("db.system", "neo4j")
            span.set_attribute("graph.topic", topic)
            span.set_attribute("graph.entity_count", len(entities))
            try:
                async with self.driver.session() as session:
                    # 1. Upsert Topic, create Finding
                    await session.run(
                        """
                        MERGE (t:Topic {name: $topic})
                          ON CREATE SET t.created_at = datetime()
                        CREATE (f:Finding {
                            id: randomUUID(),
                            content: $findings,
                            created_at: datetime()
                        })
                        MERGE (t)-[:HAS_FINDING]->(f)
                        """,
                        topic=topic,
                        findings=findings,
                    )

                    # 2. Upsert entities and wire to both Finding and Topic
                    for entity in entities:
                        await session.run(
                            """
                            MATCH (t:Topic {name: $topic})-[:HAS_FINDING]->(f:Finding)
                            WITH t, f ORDER BY f.created_at DESC LIMIT 1
                            MERGE (e:Entity {name: $name, type: $type})
                              ON CREATE SET e.created_at = datetime()
                            MERGE (f)-[:MENTIONS]->(e)
                            MERGE (t)-[:INVOLVES]->(e)
                            """,
                            topic=topic,
                            name=entity.get("name", ""),
                            type=entity.get("type", "Object"),
                        )

                    # 3. Rebuild RELATED_TO edges via shared entity count
                    await session.run(
                        """
                        MATCH (t1:Topic {name: $topic})-[:INVOLVES]->(e:Entity)<-[:INVOLVES]-(t2:Topic)
                        WHERE t1 <> t2
                        WITH t1, t2, count(e) AS shared
                        MERGE (t1)-[r:RELATED_TO]-(t2)
                        SET r.shared_entities = shared
                        """,
                        topic=topic,
                    )
            except Exception as e:
                span.record_exception(e)
                span.set_status(StatusCode.ERROR, str(e))
                raise
