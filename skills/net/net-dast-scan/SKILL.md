---
name: net-dast-scan
description: "Run and report dynamic application security testing against approved environments"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: DAST Scan

## Purpose

Execute dynamic security validation on a deployed non-production environment and report exploitable findings.

## Output
- `.cloud/qa/reports/{date}/dast/report.md`

## Rules
- Never run against production without explicit approval.
- Document the target environment and authentication approach.
- Critical and high exploitable findings block release.
