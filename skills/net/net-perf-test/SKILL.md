---
name: net-perf-test
description: "Plan and execute performance validation for critical flows"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Performance Test

## Purpose

Run or prepare performance validation for critical backend flows.

This is the highest-value k6 use case inside Factoria because it validates backend contracts and scalability characteristics directly.

## Output
- `.cloud/qa/reports/{date}/performance/report.md`
- `.qa-reports/{timestamp}-performance/`

## Execution Flow

1. Identify the endpoint or flow under test.
   - Support `REST` endpoints and `gRPC` methods explicitly.
2. Define profile: baseline, load, stress, spike, or soak.
3. Choose the correct template before generating the test:
   - `.cloud/qa/tooling/k6/rest-smoke.js` for REST
   - `.cloud/qa/tooling/k6/grpc-smoke.js` for gRPC
4. Prefer the k6 MCP server to generate, validate, and run the k6 script if configured.
5. If the k6 MCP server is unavailable, use the Docker fallback under `.cloud/qa/tooling/scripts/run-perf.sh`.
6. Record metrics required by the performance policy.
7. Save the report with thresholds, raw evidence, and recommendation.

## Rules
- Never compare performance without stating the baseline.
- Include assumptions and environment limits.
- For backend scope, state whether the target is `REST`, `gRPC`, or mixed.
- Curated evidence goes in `.cloud/qa/reports/`; raw logs and k6 summaries go in `.qa-reports/`.
