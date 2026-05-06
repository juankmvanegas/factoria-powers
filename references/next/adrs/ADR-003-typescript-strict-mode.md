# ADR-003: TypeScript Strict Mode

## Status

Accepted

## Date

2026-04-05

## Context

TypeScript allows configuring different levels of type checking. A project can compile without errors with lax settings but contain hidden bugs that only manifest at runtime. A TypeScript configuration standard is needed that maximizes type safety and early error detection, consistent with the other Factoria factories.

## Decision

Enable all strict TypeScript options in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": false
  }
}
```

The `strict: true` flag automatically enables: `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitAny`, `noImplicitThis`, `alwaysStrict`, `useUnknownInCatchVariables`.

Additionally, extra flags are enabled to cover cases that `strict` does not include.

`exactOptionalPropertyTypes` is left as `false` because it generates too much friction with third-party libraries in the React/Next.js ecosystem.

## Alternatives Considered

- **strict: false with gradual activation:** Allows incremental adoption but leaves windows of time without protection. Discarded because new projects must be born with maximum safety.
- **Only strict: true without additional flags:** Covers 90% of cases but leaves implicit overrides and unchecked index signature access uncovered.
- **JSDoc in plain JavaScript:** Alternative without compilation. Discarded due to limited inference and lack of support for advanced types.

## Consequences

### Positive

- Error detection at compile time instead of runtime.
- `strictNullChecks` eliminates the most common class of errors in JavaScript.
- `noUncheckedIndexedAccess` forces verification of array and dynamic object access.
- Consistency with the .NET and Angular factories that also use strict mode.
- Better autocompletion experience in IDEs.

### Negative

- Greater verbosity in code due to necessary type assertions and type guards.
- Some third-party libraries have incomplete typings that require workarounds.
- Learning curve for developers accustomed to JavaScript or lax TypeScript.

### Neutral

- Next.js 14 generates a base `tsconfig.json` that already includes `strict: true`. Only the extra flags are added.
- Type definition `.d.ts` files are generated automatically by the compiler.
