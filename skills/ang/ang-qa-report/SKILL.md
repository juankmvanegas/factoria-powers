---
name: ang-qa-report
description: "Generate an Angular QA report and recommendation"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: QA Report

## Purpose

Create a concise QA summary with counts, risk, evidence, and a final recommendation.

## Rules
- Ensure the required upstream QA artifacts and suite reports already exist before consolidating.
- If a suite was executed without curated QA files in `.cloud/qa/`, create the missing structure and backfill the artifacts before reporting.
- Curated reports must stay in `.cloud/qa/reports/`.
- Performance summaries must reference the baseline and identify whether evidence came from the `k6` MCP flow or the Docker fallback.
