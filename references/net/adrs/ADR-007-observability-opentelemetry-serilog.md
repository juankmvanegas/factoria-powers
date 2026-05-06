# ADR-007: OpenTelemetry + Serilog for Observability

## Status
Accepted

## Date
2023-12-22 (Blueprint v2.1.3)

## Context
Distributed microservices require centralized tracing, metrics, and structured logging
for debugging, monitoring, and performance analysis.

## Decision
Implement a dual observability stack:

### OpenTelemetry (Traces + Metrics)
- `OpenTelemetryInstrumentor` in `Application/Common/Utilities/`
- Configured via `AddCustomOpenTelemetry` extension method
- Configuration in `appsettings.json` under `OpenTelemetryConfigurationSettings`
- Packages: `OpenTelemetry.Exporter.OpenTelemetryProtocol`, `OpenTelemetry.Extensions.Hosting`,
  `OpenTelemetry.Instrumentation.AspNetCore`, `OpenTelemetry.Instrumentation.Http`

### Serilog (Structured Logging)
- Configured in `appsettings.json` under `Serilog` section
- `ManageLogs` abstraction in `Application/Common/Helpers/`
- Interface: `IManageLogs` for testability
- Log level configurable via `TrySetLogLevel` at runtime

### Log Requirements (from security policy)
- Date/time in GMT
- Origin and destination
- Error code and severity
- Description
- Must log: access, writes, deletions, parameter changes, errors, sensitive data access

## Consequences
- All services must call `AddCustomOpenTelemetry` during startup
- `ManageLogs` is injected via DI, not used statically
- Log configuration is centralized in `appsettings.json`
- Observability was added in v2.1.3 of the blueprint
