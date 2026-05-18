import os
import time
import asyncio
import json
import anthropic
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from opentelemetry import trace
from opentelemetry.sdk.resources import Resource, SERVICE_NAME
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.trace import StatusCode
from prometheus_client import Counter, Histogram
from prometheus_fastapi_instrumentator import Instrumentator
from graph_memory import GraphMemory

# ── Constants ─────────────────────────────────────────────────────────────────
SERVICE   = "research-agent"
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

# ── Prometheus metrics ────────────────────────────────────────────────────────
llm_cost    = Counter("llm_cost_usd_total",       "Cumulative LLM cost USD",        ["service", "agent_role"])
llm_latency = Histogram("llm_latency_seconds",    "LLM call duration",              ["service", "agent_role"],
                         buckets=[0.5, 1, 2, 3, 5, 8, 13, 21, 34])
llm_retries = Counter("llm_retries_total",        "LLM retry attempts",             ["service"])
llm_errors  = Counter("llm_errors_total",         "LLM errors by type",             ["service", "error_type"])
graph_hits  = Counter("graph_cache_hits_total",   "Prior research cache hits",      ["service"])
graph_enrichments = Counter("graph_enrichments_total", "Runs enriched by related topics", ["service"])

# ── App lifespan ──────────────────────────────────────────────────────────────
graph: GraphMemory = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global graph
    graph = GraphMemory(tracer)
    await graph.await_ready()
    await graph.create_indexes()
    yield
    await graph.close()

app = FastAPI(title="Research Agent", lifespan=lifespan)
FastAPIInstrumentor.instrument_app(app)
Instrumentator().instrument(app).expose(app)

llm = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are a senior research analyst. Produce a concise research brief with:
- 3-5 key facts or trends
- Current state of the field
- Notable recent developments
Keep it under 300 words. Be specific and data-driven.
If prior research context is provided, build on it — reference what's already known and focus on new angles."""


class ResearchRequest(BaseModel):
    topic: str


@app.post("/api/research")
async def research(req: ResearchRequest):
    with tracer.start_as_current_span("agent.research") as span:
        span.set_attribute("agent.name", SERVICE)
        span.set_attribute("agent.role", "researcher")
        span.set_attribute("research.topic", req.topic)
        try:
            # ── Step 1: Check graph for prior research on this exact topic ────
            prior = await graph.get_prior_research(req.topic)
            if prior:
                graph_hits.labels(service=SERVICE).inc()
                span.set_attribute("graph.prior_research_found", True)
            else:
                span.set_attribute("graph.prior_research_found", False)

            # ── Step 2: Find related topics via shared entities ───────────────
            related = await graph.find_related_context(req.topic)
            if related:
                graph_enrichments.labels(service=SERVICE).inc()
            span.set_attribute("graph.related_topics_found", len(related))

            # ── Step 3: Build enriched prompt with graph context ──────────────
            prompt = build_prompt(req.topic, prior, related)
            span.set_attribute("research.prompt_has_prior", prior is not None)
            span.set_attribute("research.prompt_has_related", len(related) > 0)

            # ── Step 4: LLM call with full graph context ──────────────────────
            findings = await call_claude("researcher", SYSTEM_PROMPT, prompt)
            span.set_attribute("research.findings_length", len(findings))

            # ── Step 5: Extract POLE+O entities and store in graph ────────────
            entities = await extract_entities(findings)
            span.set_attribute("graph.entities_extracted", len(entities))
            await graph.store_research(req.topic, findings, entities)

            return {"topic": req.topic, "findings": findings}

        except Exception as e:
            span.record_exception(e)
            span.set_status(StatusCode.ERROR, str(e))
            raise HTTPException(status_code=500, detail=str(e))


def build_prompt(topic: str, prior: str | None, related: list[dict]) -> str:
    parts = [f"Research this topic: {topic}"]
    if prior:
        parts.append(f"\n\n--- Prior research on this exact topic ---\n{prior}\n\nBuild on the above — focus on new angles or deeper analysis.")
    if related:
        parts.append("\n\n--- Related topics already in our knowledge graph ---")
        for r in related:
            parts.append(f"\n[{r['related_topic']}] (shares {r['shared_entities']} entities):\n{r['findings'][:300]}...")
        parts.append("\n\nConsider how this topic connects to or differs from the above.")
    return "\n".join(parts)


async def extract_entities(findings: str) -> list[dict]:
    """
    Use Claude to extract POLE+O entities (Person, Organization, Location, Event, Object)
    from findings. These become nodes in the knowledge graph.
    """
    with tracer.start_as_current_span("agent.extract_entities") as span:
        span.set_attribute("agent.role", "entity-extractor")
        try:
            response = await llm.messages.create(
                model=MODEL,
                max_tokens=512,
                system=(
                    "Extract named entities from text. "
                    "Return ONLY a valid JSON array, no markdown, no explanation:\n"
                    '[{"name": "...", "type": "Person|Organization|Location|Event|Object"}]\n'
                    "Maximum 10 entities. Only include clearly named, specific entities."
                ),
                messages=[{"role": "user", "content": f"Extract entities:\n{findings}"}],
            )
            text = response.content[0].text.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
            entities = json.loads(text)
            span.set_attribute("graph.entity_count", len(entities))
            return entities
        except Exception as e:
            span.record_exception(e)
            return []  # Degrade gracefully — entity extraction is non-critical


async def call_claude(agent_role: str, system: str, user_message: str, max_retries: int = 3) -> str:
    with tracer.start_as_current_span("gen_ai chat") as span:
        span.set_attribute("gen_ai.system",             "anthropic")
        span.set_attribute("gen_ai.operation.name",     "chat")
        span.set_attribute("gen_ai.request.model",      MODEL)
        span.set_attribute("gen_ai.request.max_tokens", 1024)
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
                    model=MODEL, max_tokens=1024,
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
                return text

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
