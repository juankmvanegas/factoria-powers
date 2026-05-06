# ADR-012: httpx for Outbound REST Integrations

## Status

Accepted

## Decision

Outbound REST integrations use `httpx`.

## Consequences

- External HTTP access follows a single technical standard
- Async and modern HTTP usage remain consistent
- Adapters can be tested in a predictable way
