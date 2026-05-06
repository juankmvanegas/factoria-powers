# ADR-006: Azure Service Bus Messaging

## Status
Accepted

## Date
2026-02-18 (Blueprint v1.0.0)

## Context
The BFF may need to participate in event-driven communication — publishing events on frontend actions or subscribing to backend notifications. Azure Service Bus is the organization's standard messaging platform. While the BFF does not run as a standalone message consumer (ADR-004), it needs the ability to publish messages and optionally subscribe to topics within its REST API lifecycle.

## Decision
Use `@azure/service-bus` SDK for Azure Service Bus integration:

- **@azure/service-bus** as the primary SDK. Optionally `@nestjs/microservices` with custom transport for hybrid patterns.
- Service Bus infrastructure in `infrastructure/services/service-bus/` with producers and optional consumers subfolders.
- Abstraction defined in `application/abstractions/infrastructure/` with `publishToQueue` and `publishToTopic` methods.
- All messages include `correlationId` from the original HTTP request. Message body always JSON serializable.
- Topic/queue naming convention: `{domain}.{action}.{version}` (e.g., `orders.created.v1`).
- Connection string stored in Azure Key Vault (ADR-008). `ServiceBusClient` created once per module lifecycle.
- Senders/receivers closed after use. Graceful shutdown via `onModuleDestroy`.

## Consequences
- Native Azure Service Bus integration using official SDK
- BFF can participate in event-driven patterns without becoming a standalone consumer
- Abstractions allow testing use cases without real Service Bus connections
- Adds operational complexity; consumers must be lightweight
- Service Bus connection is an additional failure point requiring retry and circuit breaker
