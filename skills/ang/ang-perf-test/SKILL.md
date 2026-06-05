---
name: ang-perf-test
description: "Plan and execute Angular performance validation for critical user flows"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Performance Test

## Purpose

Run or prepare performance validation for rendering-heavy or business-critical flows.

In Angular, treat k6 as a complement for browser journeys and API-heavy flows, not as the sole frontend performance authority.

## Output
- `.cloud/qa/reports/{date}/performance/report.md`
- `.qa-reports/{timestamp}-performance/`

## Execution Flow

1. Identify the critical route or user flow and the baseline to compare against.
2. Prefer the `k6` MCP server to generate, validate, and run the k6 script, ideally with browser-oriented coverage when the concern is UX.
3. If the `k6` MCP server is unavailable, use the Docker fallback under `.cloud/qa/tooling/scripts/run-perf.sh`.
4. Capture response metrics, UX assumptions, and evidence paths.
5. Save the curated report and raw evidence.

## Rules
- Never report performance without a named baseline or explicit reason it does not yet exist.
- Be explicit when the result is API/protocol-level only and does not represent full browser UX performance.
- Curated evidence goes in `.cloud/qa/reports/`; raw logs and k6 summaries go in `.qa-reports/`.
