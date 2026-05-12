# Agent Pipeline Demo — OpenTelemetry + Claude LLM

Three Python FastAPI microservices wired into a real-world **multi-agent AI workflow**, fully instrumented with OpenTelemetry distributed tracing.

## Architecture

```
User  →  Orchestrator (8080)
              │
              ├─ HTTP → Research Agent (8081) → RAG (ChromaDB) → Claude LLM (researcher)
              │
              ├─ HTTP → Writer Agent (8082)   → Claude LLM (writer)
              │
              └─ Hallucination Check (inline) → Claude LLM (fact-checker)
```

Trace context (`traceparent` W3C header) propagates automatically across service boundaries via OTel auto-instrumentation. Each Claude LLM call appears as a child span with **GenAI semantic convention** attributes:
- `gen_ai.system` = `anthropic`
- `gen_ai.request.model` = `claude-haiku-4-5-20251001`
- `gen_ai.usage.input_tokens` / `gen_ai.usage.output_tokens`
- `gen_ai.response.finish_reasons`
- `gen_ai.prompt` / `gen_ai.completion`
- `llm.cost_usd` / `llm.latency_seconds` / `llm.retry_count`

## Stack

| Component      | Purpose                                                      |
|----------------|--------------------------------------------------------------|
| OTel Collector | Receives OTLP, fans out to Jaeger + Tempo + Prometheus       |
| Jaeger         | Distributed trace UI — light mode (:16686)                   |
| Grafana Tempo  | Trace backend for Grafana Explore — dark mode (:3000)        |
| Prometheus     | Metrics storage (:9090)                                      |
| Grafana        | 11-panel dashboard — cost, latency, RAG, hallucination (:3000) |
| ChromaDB       | Embedded vector store for RAG in research-agent              |

## Quick Start

**Prerequisites:** Docker Desktop running, an Anthropic API key.

```bash
cd agent-pipeline-demo

# 1. Set your API key
cp .env.example .env
# open .env and set ANTHROPIC_API_KEY=sk-ant-...

# 2. Build images and start everything
docker-compose up --build
```

First build takes ~3 minutes (pip install inside containers). Subsequent builds are fast.

**Send a request once all services are up:**
```bash
curl -s -X POST http://localhost:8080/api/pipeline \
  -H "Content-Type: application/json" \
  -d '{"topic": "Impact of AI agents on software engineering"}' | jq .
```

---

## Viewing Traces

| Option | URL | Theme |
|--------|-----|-------|
| Jaeger UI | http://localhost:16686 | Light |
| Grafana Explore → Tempo | http://localhost:3000 → Explore → Tempo datasource | **Dark** |

In Jaeger: select service `orchestrator` → Find Traces → click the trace.

In Grafana: left sidebar → Explore → switch datasource to **Tempo** → search by service name.

---

## What you'll see in the trace

```
POST /api/pipeline  [orchestrator]  ~8-12s total
  └─ agent.orchestrate
       ├─ agent.call research-agent
       │    └─ POST /api/research  [research-agent]
       │         └─ agent.research
       │              ├─ rag.retrieve
       │              │    rag.top_relevance_score: 0.82
       │              │    rag.chunks_retrieved: 3
       │              └─ gen_ai chat  [researcher]
       │                   gen_ai.usage.input_tokens: 412
       │                   gen_ai.usage.output_tokens: 287
       │                   llm.cost_usd: 0.000462
       │                   llm.latency_seconds: 2.3
       ├─ agent.call writer-agent
       │    └─ POST /api/write  [writer-agent]
       │         └─ agent.write
       │              └─ gen_ai chat  [writer]
       │                   gen_ai.usage.input_tokens: 623
       │                   gen_ai.usage.output_tokens: 412
       │                   llm.cost_usd: 0.000671
       │                   llm.latency_seconds: 3.1
       └─ agent.hallucination_check
            └─ gen_ai chat  [fact-checker]
                 hallucination.risk_level: "low"
                 hallucination.confidence_score: 0.94
                 hallucination.unsupported_claims: []
```

---

## Telemetry Coverage

| Signal | What's tracked |
|--------|----------------|
| **Prompt tracing** | `gen_ai.prompt` + `gen_ai.completion` (first 1000 chars) on every LLM span |
| **Token / cost monitoring** | Input + output tokens, cost in USD per call and as Prometheus counter |
| **LLM latency** | Histogram per service/agent role — p50/p95/p99 in Grafana |
| **Inference reliability** | Exponential backoff retry, `llm.retry_count` on span, error counters by type |
| **RAG evaluation** | Retrieval relevance score histogram, chunks retrieved per query |
| **Hallucination monitoring** | risk_level (low/medium/high), confidence score, flagged unsupported claims |
| **Distributed tracing** | One trace tree across all 3 services via W3C `traceparent` propagation |

---

## Key OTel Concepts Demonstrated

| Concept | Where |
|---------|-------|
| **Auto-instrumentation** | FastAPI routes and httpx HTTP calls instrumented automatically |
| **Distributed context propagation** | `traceparent` injected on outbound httpx, extracted on inbound — stitches cross-service spans |
| **Manual spans** | `agent.orchestrate`, `rag.retrieve`, `agent.hallucination_check` created via OTel SDK |
| **GenAI semantic conventions** | `gen_ai.*` attributes on every Claude API call |
| **OTLP fan-out** | Collector receives once, exports to Jaeger + Tempo (traces) and Prometheus (metrics) |

---

## Adding More Agents

1. Copy `research-agent/` to `new-agent/`, change port in `Dockerfile` CMD
2. Add the service to `docker-compose.yml`
3. Call it from `orchestrator/main.py` via `httpx` — trace propagation is automatic
