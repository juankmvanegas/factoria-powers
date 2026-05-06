# /perf-test

Runs or prepares performance validation for critical backend flows.

## What it does
Defines the performance profile, captures baseline/load metrics, and writes the result to `.cloud/qa/reports/{date}/performance/report.md`.

## Instructions
1. Identify the flow or endpoint to validate
2. Choose baseline/load/stress/spike/soak profile
3. Record throughput, latency, error rate, and assumptions
4. Save the report with recommendation

## Usage
```text
/perf-test [endpoint or flow]
```
