---
name: next-calidad
description: "Use when code quality needs to be checked — linting, conventions, patterns, and coding standards compliance"
---

---
name: calidad
description: "Quality gates — testing and automatic validation"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Calidad (Quality Gates — Auto-Activated)

## Purpose

Enforce quality gates by running tests, linting, and build validation automatically after code changes. Ensures that no code is delivered without passing all quality checks. Acts as the automated quality guardian for the Next.js project.

## Activates automatically when

- Tests are written, modified, or deleted
- Source code in `src/` or `app/` is modified
- Quality validations are requested
- After `/add-feature`, `/migration-execute`, or `/sprint` complete their code changes
- After `security-scan` passes (part of the automatic chain)

## Does NOT activate when

- Changes only in documentation (`.md` files)
- Changes only in `.cloud/` configuration files
- Changes only in Factoria factory files (skills, commands, agents)

## Automatic Validations

### 1. Build Check

```bash
npm run build
```

- **PASS**: Build completes with exit code 0
- **FAIL**: Any build error → BLOCKER — must fix before delivery

### 2. Lint Check

```bash
npm run lint
```

- **PASS**: No errors or warnings
- **WARN**: Warnings present → report but do not block
- **FAIL**: Errors present → BLOCKER — must fix before delivery

### 3. Type Check

```bash
npx tsc --noEmit
```

- **PASS**: No type errors
- **FAIL**: Type errors → BLOCKER — must fix before delivery

### 4. Test Suite

```bash
npm test -- --watchAll=false --coverage
```

- **PASS**: All tests pass
- **FAIL**: Any test fails → BLOCKER — must fix before delivery

### Quality Gates (Minimum Thresholds)

| Layer | Coverage Target | Rationale |
|-------|----------------|-----------|
| Application (use cases) | 100% | Core business logic — zero tolerance |
| Infrastructure (adapters) | 100% | External integrations must be fully tested |
| API Route Handlers | 100% | Entry points must handle all cases |
| Presentation (components) | 80% | UI components tested for key interactions |
| Domain (entities) | 90% | Business rules must be verified |
| Overall project | 85% | Minimum aggregate coverage |

### 5. Bundle Size Check (optional)

If configured in `next.config.js`:
```bash
npx @next/bundle-analyzer
```

Report if any page bundle exceeds 200KB (first load JS).

## Report

```
Quality Gates — {Project Name}
═══════════════════════════════

Build:      ✅ PASS (14.2s)
Lint:       ✅ PASS (0 errors, 0 warnings)
TypeCheck:  ✅ PASS (0 errors)
Tests:      ✅ 89/89 passing
Coverage:   87% overall
  Application:    100% ✅
  Infrastructure: 100% ✅
  API Routes:     95%  ⚠️ (target: 100%)
  Presentation:   82%  ✅
  Domain:         91%  ✅

Result: PASS (1 warning — API route coverage below target)
```

## Chain Integration

This skill runs as part of the automatic chain:

```
Code → [security-scan] → verify-logic → [calidad] → /documentacion
```

If quality gates fail, the chain stops until resolution.

## Rules

- NEVER deliver code that fails the build
- NEVER deliver code with failing tests
- NEVER ignore lint errors — fix them or justify with a disable comment + reason
- ALWAYS run the full test suite, not just changed files
- ALWAYS report coverage per layer, not just aggregate
- NEVER lower coverage thresholds to make gates pass — fix the code instead
- Architecture tests are IMMUTABLE — if they fail, fix the production code
