# Performance Testing Policy

> Mandatory for critical APIs, migration candidates, release candidates, and any flow expected to handle sustained load.

## 1. When Performance Testing is Required

Run performance validation when:
- A new critical endpoint is introduced
- Query complexity changes significantly
- Authentication/session behavior changes
- Bulk operations are added
- A migration replaces an existing legacy flow
- The team prepares a release candidate

## 2. Minimum Suite Types

Depending on risk, the suite may include:
- Baseline check
- Load test
- Stress test
- Spike test
- Soak test

At minimum, every critical API must have a documented baseline.

## 3. Required Metrics

Reports must capture:
- Throughput
- Average response time
- P95 response time
- P99 response time when available
- Error rate
- Concurrency level
- Resource observations if available

## 4. Gate Rules

Performance blocks delivery when:
- Error rate exceeds the accepted threshold
- P95 exceeds the agreed baseline without approval
- Throughput degrades materially versus the previous approved baseline
- No performance evidence exists for a critical flow

## 5. Environment Notes

The report must state:
- Environment used
- Test data assumptions
- Load profile
- Tooling used
- Limitations of the test

## 6. Reporting Format

Each run produces:
- Human-readable markdown report
- Machine-readable summary (`summary.json` when possible)
- Raw logs or artifacts in `.qa-reports/`
