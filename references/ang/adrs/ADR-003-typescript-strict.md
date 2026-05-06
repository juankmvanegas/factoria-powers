# ADR-003: TypeScript Strict Mode

## Status
Accepted

## Context
We need to maximize type safety to prevent runtime errors.

## Decision
Enable all TypeScript and Angular strict options:
- `strict: true`
- `noImplicitOverride: true`
- `noPropertyAccessFromIndexSignature: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- `strictInjectionParameters: true`
- `strictTemplates: true`
- `strictInputAccessModifiers: true`

## Consequences
- Positive: Fewer runtime errors, better autocompletion, safe refactoring
- Negative: More type verbosity, occasional casting required
