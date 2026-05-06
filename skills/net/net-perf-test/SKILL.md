---
name: net-perf-test
description: "Plan and execute performance validation for critical flows"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Performance Test

## Purpose

Run or prepare performance validation for critical backend flows.

## Output
- `.cloud/qa/reports/{date}/performance/report.md`

## Execution Flow

1. Identify the endpoint or flow under test.
2. Define profile: baseline, load, stress, spike, or soak.
3. Record metrics required by the performance policy.
4. Save the report with thresholds and recommendation.

## Rules
- Never compare performance without stating the baseline.
- Include assumptions and environment limits.
