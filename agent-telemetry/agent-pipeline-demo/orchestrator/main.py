import os
import time
import asyncio
import json
import anthropic
import httpx
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from opentelemetry import trace
from opentelemetry.sdk.resources import Resource, SERVICE_NAME
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
from opentelemetry.trace import StatusCode
from prometheus_client import Counter, Histogram
from prometheus_fastapi_instrumentator import Instrumentator
from graph_memory import GraphMemory

# ── Constants ─────────────────────────────────────────────────────────────────
SERVICE   = "orchestrator"
MODEL     = "claude-haiku-4-5-20251001"
HAIKU_IN  = 0.25  / 1_000_000
HAIKU_OUT = 1.25  / 1_000_000

# ── OTel setup ────────────────────────────────────────────────────────────────
resource = Resource.create({SERVICE_NAME: SERVICE})
provider = TracerProvider(resource=resource)
provider.add_span_processor(BatchSpanProcessor(
    OTLPSpanExporter(endpoint=os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://localhost:4317"))
))
trace.set_tracer_provider(provider)
tracer = trace.get_tracer(SERVICE)
HTTPXClientInstrumentor().instrument()

# ── Prometheus metrics ────────────────────────────────────────────────────────
llm_cost           = Counter("llm_cost_usd_total",       "Cumulative LLM cost USD",           ["service", "agent_role"])
llm_latency        = Histogram("llm_latency_seconds",    "LLM call duration",                 ["service", "agent_role"],
                                buckets=[0.5, 1, 2, 3, 5, 8, 13, 21, 34])
llm_retries        = Counter("llm_retries_total",        "LLM retry attempts",                ["service"])
llm_errors         = Counter("llm_errors_total",         "LLM errors by type",               ["service", "error_type"])
hallucination_risk = Counter("hallucination_risk_total", "Hallucination risk events by level", ["service", "risk_level"])

# ── App lifespan ──────────────────────────────────────────────────────────────
graph: GraphMemory = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global graph
    graph = GraphMemory(tracer)
    await graph.await_ready()
    yield
    await graph.close()

app = FastAPI(title="Orchestrator", lifespan=lifespan)
FastAPIInstrumentor.instrument_app(app)
Instrumentator().instrument(app).expose(app)

llm = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

RESEARCH_URL = os.getenv("RESEARCH_AGENT_URL", "http://localhost:8081")
WRITER_URL   = os.getenv("WRITER_AGENT_URL",   "http://localhost:8082")

HALLUCINATION_SYSTEM = """You are a rigorous fact-checker.
Analyze whether a generated report makes claims not supported by the source research.
Respond ONLY with valid JSON — no markdown:
{"risk_level": "low|medium|high", "confidence_score": 0.0-1.0, "unsupported_claims": ["claim1"]}"""


class PipelineRequest(BaseModel):
    topic: str


@app.post("/api/pipeline")
async def pipeline(req: PipelineRequest):
    pipeline_start = time.perf_counter()
    total_cost = 0.0

    with tracer.start_as_current_span("agent.orchestrate") as span:
        span.set_attribute("agent.name",    SERVICE)
        span.set_attribute("pipeline.topic", req.topic)
        try:
            async with httpx.AsyncClient(timeout=60) as client:

                # ── Step 1: Research Agent ────────────────────────────────────
                with tracer.start_as_current_span("agent.call research-agent") as s:
                    s.set_attribute("agent.target", "research-agent")
                    r = await client.post(f"{RESEARCH_URL}/api/research", json={"topic": req.topic})
                    r.raise_for_status()
                    findings = r.json()["findings"]
                    s.set_attribute("agent.output_length", len(findings))

                # ── Step 2: Writer Agent ──────────────────────────────────────
                with tracer.start_as_current_span("agent.call writer-agent") as s:
                    s.set_attribute("agent.target", "writer-agent")
                    w = await client.post(f"{WRITER_URL}/api/write",
                                         json={"topic": req.topic, "research": findings})
                    w.raise_for_status()
                    report = w.json()["report"]
                    s.set_attribute("agent.output_length", len(report))

            # ── Step 3: Hallucination check ───────────────────────────────────
            hallucination, h_cost = await check_hallucination(findings, report)
            total_cost += h_cost

            duration = time.perf_counter() - pipeline_start

            span.set_attribute("pipeline.steps_completed",              3)
            span.set_attribute("pipeline.total_duration_seconds",       round(duration, 3))
            span.set_attribute("hallucination.risk_level",              hallucination["risk_level"])
            span.set_attribute("hallucination.confidence_score",        hallucination["confidence_score"])
            span.set_attribute("hallucination.unsupported_claim_count", len(hallucination["unsupported_claims"]))

            hallucination_risk.labels(
                service=SERVICE,
                risk_level=hallucination.get("risk_level", "unknown")
            ).inc()

            # ── Step 4: Persist pipeline run to knowledge graph ───────────────
            await graph.store_pipeline_run(
                topic=req.topic,
                findings=findings,
                report=report,
                hallucination=hallucination,
                total_cost=total_cost,
                duration=duration,
            )

            return {
                "topic":             req.topic,
                "researchFindings":  findings,
                "finalReport":       report,
                "hallucinationCheck": hallucination,
            }

        except Exception as e:
            span.record_exception(e)
            span.set_status(StatusCode.ERROR, str(e))
            raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/memory")
async def memory():
    """
    Return the full knowledge graph state — all topics, entities,
    relationships, and recent pipeline runs stored in Neo4j.
    """
    return await graph.get_knowledge_graph()


async def check_hallucination(research: str, report: str) -> tuple[dict, float]:
    with tracer.start_as_current_span("agent.hallucination_check") as span:
        span.set_attribute("agent.role",                    "fact-checker")
        span.set_attribute("hallucination.research_length", len(research))
        span.set_attribute("hallucination.report_length",   len(report))

        prompt = f"Research findings:\n{research}\n\nGenerated report:\n{report}"
        result_text, cost = await call_claude("fact-checker", HALLUCINATION_SYSTEM, prompt)

        try:
            clean = result_text.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
            result = json.loads(clean)
        except json.JSONDecodeError:
            result = {"risk_level": "unknown", "confidence_score": 0.0, "unsupported_claims": []}

        span.set_attribute("hallucination.risk_level",     result.get("risk_level", "unknown"))
        span.set_attribute("hallucination.confidence",     result.get("confidence_score", 0.0))
        span.set_attribute("hallucination.flagged_claims", str(result.get("unsupported_claims", [])))

        return result, cost


async def call_claude(agent_role: str, system: str, user_message: str, max_retries: int = 3) -> tuple[str, float]:
    """Returns (text, cost_usd)"""
    with tracer.start_as_current_span("gen_ai chat") as span:
        span.set_attribute("gen_ai.system",             "anthropic")
        span.set_attribute("gen_ai.operation.name",     "chat")
        span.set_attribute("gen_ai.request.model",      MODEL)
        span.set_attribute("gen_ai.request.max_tokens", 512)
        span.set_attribute("agent.role",                agent_role)
        span.set_attribute("gen_ai.prompt",             user_message[:1000])

        last_exc = None
        for attempt in range(max_retries):
            try:
                if attempt > 0:
                    wait = 2 ** attempt
                    llm_retries.labels(service=SERVICE).inc()
                    span.add_event(f"retry attempt {attempt}, waiting {wait}s")
                    await asyncio.sleep(wait)

                t0 = time.perf_counter()
                response = await llm.messages.create(
                    model=MODEL, max_tokens=512,
                    system=system,
                    messages=[{"role": "user", "content": user_message}],
                )
                duration = time.perf_counter() - t0
                input_tok  = response.usage.input_tokens
                output_tok = response.usage.output_tokens
                cost       = (input_tok * HAIKU_IN) + (output_tok * HAIKU_OUT)
                text       = response.content[0].text

                span.set_attribute("gen_ai.usage.input_tokens",      input_tok)
                span.set_attribute("gen_ai.usage.output_tokens",     output_tok)
                span.set_attribute("gen_ai.response.finish_reasons", [response.stop_reason])
                span.set_attribute("gen_ai.response.model",          response.model)
                span.set_attribute("llm.cost_usd",                   round(cost, 6))
                span.set_attribute("llm.latency_seconds",            round(duration, 3))
                span.set_attribute("llm.retry_count",                attempt)
                span.set_attribute("gen_ai.completion",              text[:1000])

                llm_cost.labels(service=SERVICE, agent_role=agent_role).inc(cost)
                llm_latency.labels(service=SERVICE, agent_role=agent_role).observe(duration)
                return text, cost

            except anthropic.RateLimitError as e:
                last_exc = e
                llm_errors.labels(service=SERVICE, error_type="rate_limit").inc()
                if attempt == max_retries - 1:
                    span.record_exception(e)
                    span.set_status(StatusCode.ERROR, "rate limit exceeded after retries")
                    raise
            except Exception as e:
                llm_errors.labels(service=SERVICE, error_type=type(e).__name__).inc()
                span.record_exception(e)
                span.set_status(StatusCode.ERROR, str(e))
                raise
        raise last_exc


@app.get("/health")
def health():
    return {"status": "up", "service": SERVICE}
