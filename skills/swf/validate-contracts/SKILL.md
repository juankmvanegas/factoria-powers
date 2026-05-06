---
name: swf-validate-contracts
description: "Validate API contracts between modules — protocol conformance, DI registrations, mock completeness"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Validate Contracts

## Purpose

Validate API contracts between SPM modules. Checks protocol conformance, Factory DI registrations, mock completeness for testing, and ensures all module boundaries are properly defined and enforced.

## Execution Flow — 6 Strict Steps

### Step 1: Catalog All Protocols

1. Scan all modules for protocol definitions
2. For each protocol, record:
   - Name and module
   - Methods and properties
   - Associated types or generics
   - Return types (especially `AnyPublisher`)

### Step 2: Validate Protocol Conformance

For each protocol:

1. Find all concrete implementations
2. Verify every protocol method is implemented
3. Check return types match exactly
4. Verify `@MainActor` consistency between protocol and implementation
5. Flag protocols with no implementation (dead interface)
6. Flag implementations with extra public methods not in the protocol

### Step 3: Validate Factory DI Registrations

1. Scan all `Container` extension files in Dependencias module
2. For each registration, verify:
   - The protocol type matches the generic parameter
   - The implementation exists and conforms to the protocol
   - Singleton vs transient scope is appropriate
3. Find unregistered protocols (used with `@Injected` but not registered)
4. Find orphaned registrations (registered but never injected)

```swift
// Valid registration
var featureApi: Factory<FeatureApiProtocol> {
    self { FeatureApiImplementacion() } // ✅ Conforms to FeatureApiProtocol
}

// Invalid — type mismatch
var featureApi: Factory<FeatureApiProtocol> {
    self { WrongImplementation() } // ❌ Does not conform
}
```

### Step 4: Validate Mock Completeness

For each protocol with a test mock:

1. Verify mock implements ALL protocol methods
2. Check mock has configurable return values for each method
3. Verify mock tracks call counts and arguments (Spy pattern)
4. Flag protocols without corresponding mocks in test targets
5. Check `nonisolated(unsafe)` on mock stored properties

### Step 5: Validate Module Boundaries

1. Check that Datos modules only export protocols (not implementations) to other modules
2. Verify Presentacion modules do not import Datos modules directly
3. Ensure Core module contains only shared models, protocols, and extensions
4. Verify CoreUI does not depend on feature modules
5. Check Dependencias is the only module that knows concrete implementations

### Step 6: Generate Contract Report

```markdown
# Contract Validation Report — [Date]

## Summary
| Check | Pass | Fail |
|-------|------|------|
| Protocol Conformance | X | X |
| DI Registrations | X | X |
| Mock Completeness | X | X |
| Module Boundaries | X | X |

## Violations
### Protocol Conformance
- [protocol:file] — Missing method implementation

### DI Registrations
- [protocol] — Not registered in Container
- [registration] — Orphaned (never injected)

### Mock Completeness
- [protocol] — No mock in test target
- [mock] — Missing spy tracking for method X

### Module Boundaries
- [module:file] — Imports concrete type from Datos

## Recommendations
[Ordered fix list]
```

## Auto-Shielding

- **ABORT** if no Dependencias module exists — DI not set up
- **WARN** if more than 3 unregistered protocols found — DI incomplete
- **WARN** if more than 5 protocols lack test mocks

## Rules

1. Every protocol must have at least one concrete implementation
2. Every protocol used with `@Injected` must be registered in Factory Container
3. Every protocol must have a corresponding mock in test targets
4. Mocks must implement the full Spy pattern (track calls, arguments, counts)
5. Module boundaries are strict — violations are blocking
6. Read-only operation — report findings but don't modify code
7. Include file paths and line numbers for all findings
