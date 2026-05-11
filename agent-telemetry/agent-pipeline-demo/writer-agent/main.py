import os
import time
import asyncio
import anthropic
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
SERVICE  = "writer-agent"
MODEL    = "claude-haiku-4-5-20251001"
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

# ── Prometheus custom metrics ─────────────────────────────────────────────────
llm_cost    = Counter("llm_cost_usd_total",    "Cumulative LLM cost USD",  ["service", "agent_role"])
llm_latency = Histogram("llm_latency_seconds", "LLM call duration",        ["service", "agent_role"],
                         buckets=[0.5, 1, 2, 3, 5, 8, 13, 21, 34])
llm_retries = Counter("llm_retries_total",     "LLM retry attempts",       ["service"])
llm_errors  = Counter("llm_errors_total",      "LLM errors by type",       ["service", "error_type"])

# ── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(title="Writer Agent")
FastAPIInstrumentor.instrument_app(app)
Instrumentator().instrument(app).expose(app)

llm = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SYSTEM_PROMPT = """You are a professional content writer specializing in technology and business.
Transform research findings into a polished, engaging report with:
- A clear executive summary (2-3 sentences)
- Key insights in a readable narrative (not just bullets)
- A forward-looking conclusion
Total: 300-400 words. Professional tone. Only assert what the research supports."""


class WriteRequest(BaseModel):
    topic: str
    research: str


@app.post("/api/write")
async def write(req: WriteRequest):
    with tracer.start_as_current_span("agent.write") as span:
        span.set_attribute("agent.name", SERVICE)
        span.set_attribute("agent.role", "writer")
        span.set_attribute("write.topic", req.topic)
        span.set_attribute("write.research_length", len(req.research))
        try:
            prompt = (
                f"Topic: {req.topic}\n\n"
                f"Research findings:\n{req.research}\n\n"
                f"Write a polished report based strictly on these findings."
            )
            report = await call_claude("writer", SYSTEM_PROMPT, prompt)
            span.set_attribute("write.report_length", len(report))
            return {"topic": req.topic, "report": report}

        except Exception as e:
            span.record_exception(e)
            span.set_status(StatusCode.ERROR, str(e))
            raise HTTPException(status_code=500, detail=str(e))


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

                span.set_attribute("gen_ai.usage.input_tokens",       input_tok)
                span.set_attribute("gen_ai.usage.output_tokens",      output_tok)
                span.set_attribute("gen_ai.response.finish_reasons",  [response.stop_reason])
                span.set_attribute("gen_ai.response.model",           response.model)
                span.set_attribute("llm.cost_usd",                    round(cost, 6))
                span.set_attribute("llm.latency_seconds",             round(duration, 3))
                span.set_attribute("llm.retry_count",                 attempt)
                span.set_attribute("gen_ai.completion",               text[:1000])

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
