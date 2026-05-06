# ADR-006: Azure Service Bus for Async Messaging

## Status
Accepted

## Date
2023-04-19 (migrated to Azure.Messaging.ServiceBus in v2.1.4)

## Context
Microservices need asynchronous communication for event-driven workflows,
command dispatching, and async query responses.

## Decision
Use Azure Service Bus with three message patterns:

### Message Patterns (ModelData)
1. **CommandServiceBus** - Point-to-point commands via queues
2. **EventServiceBus** - Publish/subscribe events via topics
3. **AsyncQueryServiceBus** - Async request/response queries

### Generic Infrastructure
- `GenericServiceBusServiceMultiple` - Multi-client service bus handler
- `ServiceBusMultiple` - Configuration for multiple service bus connections
- `NotificationServiceBusService` - Push notification specific adapter

### Consumer Side (MessagingService)
- `SubscriptionBase` - Base class for all subscriptions
- `ISubscription` - Subscription contract
- `TransferSubscriptionsHostedService` - Background service managing all subscriptions

### Configuration
```json
{
  "ServiceBusSettings": {
    "ConnectionString": "from-keyvault",
    "Queues": [...],
    "Topics": [...]
  }
}
```

## Consequences
- Library: `Azure.Messaging.ServiceBus` 7.17.3 (migrated from Reactive.Commons in v2.1.4)
- Service Bus connection strings stored in Azure Key Vault
- Queues for commands, Topics for events
- DataModels moved to Infrastructure layer (changed in v2.1.4)
