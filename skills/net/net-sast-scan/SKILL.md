---
name: net-sast-scan
description: "Run and report static application security testing"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: SAST Scan

## Purpose

Execute formal static security validation and report findings by severity.

## Output
- `.cloud/qa/reports/{date}/sast/report.md`

## Rules
- Classify findings by severity.
- Distinguish new findings from existing accepted risk when possible.
- Critical and high findings block release unless an approved exception exists.
