# Agent Pipeline Demo — OpenTelemetry + Claude LLM

Three Spring Boot microservices that simulate a real-world **multi-agent AI workflow**, fully instrumented with OpenTelemetry distributed tracing.

## Architecture

```
User  →  Orchestrator (8080)
              │
              ├─ HTTP → Research Agent (8081) → Claude LLM (researcher role)
              │
              └─ HTTP → Writer Agent (8082)   → Claude LLM (writer role)
```

Trace context (`traceparent` W3C header) flows automatically across service boundaries via OTel auto-instrumentation. Each Claude LLM call appears as a child span with **GenAI semantic convention** attributes:
- `gen_ai.system` = `anthropic`
- `gen_ai.request.model` = `claude-haiku-4-5-20251001`
- `gen_ai.usage.input_tokens` / `gen_ai.usage.output_tokens`
- `gen_ai.response.finish_reasons`

## Stack

| Component        | Purpose                                |
|------------------|----------------------------------------|
| OTel Collector   | Receives OTLP, fans out to Jaeger + Prometheus |
| Jaeger           | Distributed trace UI (:16686)          |
| Prometheus       | Metrics storage (:9090)                |
| Grafana          | Dashboards — latency, errors, JVM (:3000) |

## Quick Start

### Option A — Run services locally (fastest for dev)

**1. Start the observability stack:**
```bash
cd agent-pipeline-demo
docker-compose up otel-collector jaeger prometheus grafana
```

**2. Set your API key:**
```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

**3. Build and run each service in separate terminals:**
```bash
# Terminal 1
mvn -pl research-agent spring-boot:run

# Terminal 2
mvn -pl writer-agent spring-boot:run

# Terminal 3
mvn -pl orchestrator spring-boot:run
```

**4. Send a request:**
```bash
curl -s -X POST http://localhost:8080/api/pipeline \
  -H "Content-Type: application/json" \
  -d '{"topic": "Impact of AI agents on software engineering"}' | jq .
```

**5. View the trace in Jaeger:** http://localhost:16686
- Select service: `orchestrator`
- Click the trace — you'll see one unified trace spanning all 3 services and both LLM calls

**6. View metrics in Grafana:** http://localhost:3000 (admin/admin)
- Dashboard: Agent Pipeline Telemetry

---

### Option B — Full Docker (build first)

```bash
cd agent-pipeline-demo

# Build all JARs
mvn package -DskipTests

# Copy .env
cp .env.example .env
# edit .env and set ANTHROPIC_API_KEY

# Start everything
docker-compose up
```

---

## What you'll see in Jaeger

```
POST /api/pipeline  [orchestrator]  ~4-6s total
  └─ agent.orchestrate
       ├─ agent.call research-agent
       │    └─ POST /api/research  [research-agent]  ~2-3s
       │         └─ agent.research
       │              └─ gen_ai chat  ← Claude API call
       │                   gen_ai.usage.input_tokens = 87
       │                   gen_ai.usage.output_tokens = 312
       └─ agent.call writer-agent
            └─ POST /api/write  [writer-agent]  ~2-3s
                 └─ agent.write
                      └─ gen_ai chat  ← Claude API call
                           gen_ai.usage.input_tokens = 452
                           gen_ai.usage.output_tokens = 587
```

## Key OTel Concepts Demonstrated

| Concept | Where |
|---------|-------|
| **Auto-instrumentation** | Spring MVC endpoints and RestClient HTTP calls instrumented automatically by `opentelemetry-spring-boot-starter` |
| **Distributed context propagation** | `traceparent` header injected on outbound HTTP, extracted on inbound — stitches cross-service spans into one trace |
| **Manual spans** | `agent.orchestrate`, `agent.research`, `agent.write` created via OTel SDK |
| **GenAI semantic conventions** | `gen_ai.*` attributes on every Claude API call |
| **OTLP fan-out** | Collector receives once, exports to Jaeger (traces) and Prometheus (metrics) simultaneously |
| **Trace + log correlation** | `trace_id` and `span_id` injected into log pattern — grep logs by trace ID to follow one request |

## Adding More Agents

To add a third agent (e.g. a `fact-checker-agent`):
1. Copy `research-agent/` to `fact-checker-agent/`, change port to `8083`
2. Add the module to the root `pom.xml`
3. Call it from `PipelineService` — trace propagation is automatic
