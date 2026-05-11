import os
import time
import asyncio
import json
import anthropic
import chromadb
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

# ── Constants ─────────────────────────────────────────────────────────────────
SERVICE  = "research-agent"
MODEL    = "claude-haiku-4-5-20251001"
HAIKU_IN  = 0.25  / 1_000_000   # $ per input token
HAIKU_OUT = 1.25  / 1_000_000   # $ per output token

# ── OTel setup ────────────────────────────────────────────────────────────────
resource = Resource.create({SERVICE_NAME: SERVICE})
provider = TracerProvider(resource=resource)
provider.add_span_processor(BatchSpanProcessor(
    OTLPSpanExporter(endpoint=os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://localhost:4317"))
))
trace.set_tracer_provider(provider)
tracer = trace.get_tracer(SERVICE)

# ── Prometheus custom metrics ─────────────────────────────────────────────────
llm_cost    = Counter("llm_cost_usd_total",      "Cumulative LLM cost USD",          ["service", "agent_role"])
llm_latency = Histogram("llm_latency_seconds",   "LLM call duration",                ["service", "agent_role"],
                         buckets=[0.5, 1, 2, 3, 5, 8, 13, 21, 34])
llm_retries = Counter("llm_retries_total",       "LLM retry attempts",               ["service"])
llm_errors  = Counter("llm_errors_total",        "LLM errors by type",               ["service", "error_type"])
rag_chunks  = Histogram("rag_chunks_retrieved",  "Chunks retrieved per query",       ["service"], buckets=[1,2,3,4,5,10])
rag_score   = Histogram("rag_relevance_score",   "Top chunk relevance (0-1)",        ["service"],
                         buckets=[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0])

# ── Knowledge base docs (seeded into ChromaDB on startup) ─────────────────────
KNOWLEDGE_BASE = [
    {"id": "ai_agents",      "text": "AI agents are autonomous systems combining LLMs with tools, memory, and planning. They execute multi-step tasks, call APIs, browse the web, write code, and maintain context across complex workflows. Key patterns include ReAct (Reason+Act), Plan-and-Execute, and multi-agent collaboration."},
    {"id": "ai_healthcare",  "text": "AI in healthcare is transforming diagnostics, drug discovery, and patient care. FDA-approved AI tools now detect diabetic retinopathy and lung cancer in imaging. LLMs assist clinical documentation, reducing physician burnout by 30-40%. Challenges include data privacy, algorithmic bias, and regulatory approval timelines."},
    {"id": "llm_trends",     "text": "Large Language Models (LLMs) in 2024-2025: GPT-4o, Claude 3.5, and Gemini 1.5 achieved near-human reasoning. Context windows expanded to 1M+ tokens. Open-source models (Llama 3, Mistral) now rival closed models. Inference costs dropped 90% since 2023. Key trends: multimodality, tool use, and long-context reasoning."},
    {"id": "climate_tech",   "text": "Climate technology investments reached $1.8T globally in 2024. Solar power became the cheapest electricity source in history at $0.02/kWh. Battery storage capacity quadrupled. Carbon capture costs fell to $300/ton. AI is used to optimize energy grids, predict weather, and accelerate materials science for clean energy."},
    {"id": "software_eng",   "text": "AI-assisted software engineering: GitHub Copilot adopted by 1M+ developers, boosting productivity 55%. AI agents now autonomously fix bugs, write tests, and review PRs. Key challenges: code correctness, security vulnerabilities in AI-generated code, and over-reliance. Best practice: AI augments, human reviews."},
    {"id": "quantum_comp",   "text": "Quantum computing milestones: Google achieved 1M physical qubits in 2024. IBM's error correction reached practical thresholds. Near-term applications: drug simulation, logistics optimization, cryptography. Full fault-tolerant quantum computing still 10-15 years away. Post-quantum cryptography is now a critical enterprise priority."},
    {"id": "fintech_ai",     "text": "AI in finance: fraud detection accuracy improved to 99.9%, saving $40B annually. Algorithmic trading accounts for 70% of US equity volume. LLMs now draft earnings reports and analyst summaries. Regulatory focus intensifies on explainability and model risk management. Embedded finance reaches $7T market by 2030."},
    {"id": "space_tech",     "text": "Space technology: SpaceX Starship achieved full orbital flight in 2024. Satellite internet (Starlink, OneWeb) connected 5M users globally. Lunar missions resumed with NASA Artemis. Commercial space market valued at $600B by 2030. AI used for autonomous navigation, debris tracking, and telescope data analysis."},
    {"id": "cybersecurity",  "text": "Cybersecurity in 2024-2025: AI-powered attacks increased 300%, including deepfake social engineering and automated vulnerability discovery. Zero-trust architecture adoption reached 60% of enterprises. Average data breach cost hit $4.9M. Agentic AI for autonomous threat hunting is the emerging frontier."},
    {"id": "robotics",       "text": "Robotics advances: humanoid robots (Figure 01, Boston Dynamics Atlas) entered manufacturing pilots. Boston Dynamics deployed 1,000+ Spot robots in industrial inspection. Surgical robots achieved sub-millimeter precision. Warehouse automation reduced picking costs by 70%. Key bottleneck: dexterous manipulation and real-world generalization."},
]

# ── ChromaDB (embedded, no separate service needed) ───────────────────────────
chroma = chromadb.Client()
kb_collection = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global kb_collection
    kb_collection = chroma.get_or_create_collection("knowledge_base")
    if kb_collection.count() == 0:
        kb_collection.add(
            documents=[d["text"] for d in KNOWLEDGE_BASE],
            ids=[d["id"] for d in KNOWLEDGE_BASE],
        )
        print(f"[research-agent] Seeded {len(KNOWLEDGE_BASE)} documents into ChromaDB")
    yield


# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="Research Agent", lifespan=lifespan)
FastAPIInstrumentor.instrument_app(app)
Instrumentator().instrument(app).expose(app)

llm = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are a senior research analyst. Using the provided context, produce a concise research brief with:
- 3-5 key facts or trends (grounded in the context)
- Current state of the field
- Notable recent developments
Keep it under 300 words. Be specific and data-driven. Only assert what is supported by the context."""


class ResearchRequest(BaseModel):
    topic: str


@app.post("/api/research")
async def research(req: ResearchRequest):
    with tracer.start_as_current_span("agent.research") as span:
        span.set_attribute("agent.name", SERVICE)
        span.set_attribute("agent.role", "researcher")
        span.set_attribute("research.topic", req.topic)
        try:
            # Step 1 — RAG: retrieve relevant context from knowledge base
            context, rag_meta = retrieve_context(req.topic)
            span.set_attribute("rag.chunks_retrieved", rag_meta["chunks"])
            span.set_attribute("rag.top_relevance_score", rag_meta["top_score"])
            span.set_attribute("rag.context_length", len(context))

            # Step 2 — LLM: research with retrieved context grounding the answer
            prompt = f"Topic: {req.topic}\n\nRelevant context:\n{context}\n\nProvide your research brief."
            findings = await call_claude("researcher", SYSTEM_PROMPT, prompt)

            span.set_attribute("research.findings_length", len(findings))
            return {"topic": req.topic, "findings": findings}

        except Exception as e:
            span.record_exception(e)
            span.set_status(StatusCode.ERROR, str(e))
            raise HTTPException(status_code=500, detail=str(e))


def retrieve_context(topic: str, n_results: int = 3) -> tuple[str, dict]:
    """Query ChromaDB and return retrieved text + RAG evaluation metrics."""
    with tracer.start_as_current_span("rag.retrieve") as span:
        span.set_attribute("rag.query", topic)
        span.set_attribute("rag.n_results", n_results)

        results = kb_collection.query(query_texts=[topic], n_results=n_results)
        docs      = results["documents"][0]
        distances = results["distances"][0]  # lower = more similar (L2 distance)

        # Convert L2 distance to a 0-1 relevance score
        top_score = max(0.0, 1.0 - (min(distances) / 2.0))

        # Emit Prometheus metrics
        rag_chunks.labels(service=SERVICE).observe(len(docs))
        rag_score.labels(service=SERVICE).observe(top_score)

        span.set_attribute("rag.top_score", round(top_score, 4))
        span.set_attribute("rag.chunks_returned", len(docs))

        context = "\n\n---\n\n".join(docs)
        return context, {"chunks": len(docs), "top_score": round(top_score, 4)}


async def call_claude(agent_role: str, system: str, user_message: str, max_retries: int = 3) -> str:
    """
    Anthropic API wrapper with:
    - Prompt + completion tracing
    - Token / cost tracking
    - LLM latency histogram
    - Exponential backoff retry
    """
    with tracer.start_as_current_span("gen_ai chat") as span:
        span.set_attribute("gen_ai.system",            "anthropic")
        span.set_attribute("gen_ai.operation.name",    "chat")
        span.set_attribute("gen_ai.request.model",     MODEL)
        span.set_attribute("gen_ai.request.max_tokens", 1024)
        span.set_attribute("agent.role",               agent_role)
        # Prompt tracing — truncated to keep span storage reasonable
        span.set_attribute("gen_ai.prompt", user_message[:1000])

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

                # Span attributes
                span.set_attribute("gen_ai.usage.input_tokens",        input_tok)
                span.set_attribute("gen_ai.usage.output_tokens",       output_tok)
                span.set_attribute("gen_ai.response.finish_reasons",   [response.stop_reason])
                span.set_attribute("gen_ai.response.model",            response.model)
                span.set_attribute("llm.cost_usd",                     round(cost, 6))
                span.set_attribute("llm.latency_seconds",              round(duration, 3))
                span.set_attribute("llm.retry_count",                  attempt)
                span.set_attribute("gen_ai.completion",                text[:1000])

                # Prometheus metrics
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

        raise last_exc  # should not reach here


@app.get("/health")
def health():
    return {"status": "up", "service": SERVICE}
