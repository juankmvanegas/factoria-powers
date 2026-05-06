---
name: wps-prp
description: "Planning Review Proposal for complex features (scope, risk, implementation plan, DRP)"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: PRP (Planning Review Proposal)

## Purpose

Create a structured Planning Review Proposal for complex WordPress block theme features that span multiple blocks, components, or templates. The PRP defines scope, risk assessment, phased implementation plan, Definition of Ready/Done, and a Disaster Recovery Plan (DRP) to ensure controlled delivery.

## Execution Flow — 8 Strict Steps

### Step 1 — Define Feature Scope

- Describe the feature in detail: what it does, who uses it, what it changes.
- List all affected areas: blocks, components, templates, patterns, theme.json, functions.php, REST API endpoints.
- Define what is IN scope and what is OUT of scope.
- Identify the WordPress core blocks and APIs involved.

### Step 2 — Assess Risk

- Rate overall risk: LOW / MEDIUM / HIGH / CRITICAL.
- Risk factors:
  - Number of files affected.
  - Database changes (custom post types, meta, options).
  - Theme.json schema changes.
  - Breaking changes to existing blocks or patterns.
  - Third-party plugin dependencies.
  - Performance impact (additional queries, asset loading).
- For each risk, document: likelihood, impact, mitigation strategy.

### Step 3 — Check Architecture Compliance

- Read active ADRs from `.cloud/architecture/decisions/`.
- Verify the feature design complies with:
  - Clean architecture layers (if applicable).
  - Atomic Design component hierarchy.
  - Block registration patterns (ADR for block architecture).
  - Security policy (sanitization, escaping, nonces).
  - Coding standards (naming, file structure).
- Flag any ADR violations and propose resolution.

### Step 4 — Design Implementation Plan

- Break the feature into ordered implementation steps.
- Each step includes:
  - Description of the change.
  - Files to create or modify.
  - Dependencies on previous steps.
  - Estimated complexity (S / M / L).
  - Validation criteria.
- Group steps into phases if the feature is large.

### Step 5 — Define Testing Strategy

- Unit tests: block render output, component behavior, PHP function coverage.
- Integration tests: block interactions, REST API endpoints, template rendering.
- E2E tests: editor interactions, frontend rendering, responsive behavior.
- Visual regression: screenshots of affected templates/blocks before and after.
- Specify minimum coverage thresholds per testing policy.

### Step 6 — Create DRP (Disaster Recovery Plan)

- Define rollback triggers: build failure, test regression, visual breakage, runtime error.
- For each phase of implementation:
  - Git-based rollback strategy (branch, commit reference).
  - Database rollback (if schema changes involved).
  - Theme.json rollback (version-controlled settings restoration).
  - Block deactivation procedure (if new blocks are registered).
- Define communication plan for rollback scenarios.

### Step 7 — Define DoR and DoD

- **Definition of Ready (DoR):**
  - Feature scope approved.
  - ADR compliance verified.
  - Design mockups available (if UI changes).
  - Dependencies identified and available.
  - Test environment ready.
- **Definition of Done (DoD):**
  - All implementation steps complete.
  - All tests pass (unit, integration, E2E).
  - Security scan passes (security-scan skill).
  - Code review approved.
  - Documentation updated (architecture docs, block documentation).
  - Build succeeds with no warnings.

### Step 8 — Output PRP Document

- Write the PRP to `.claude/PRPs/PRP-{feature-slug}.md`.
- Use the standard PRP template format.
- Include all sections: Scope, Risk, Architecture Compliance, Implementation Plan, Testing Strategy, DRP, DoR, DoD.
- Add metadata: author, date, status (Draft / In Review / Approved).

## Rules

- NEVER start implementation without an approved PRP for features rated MEDIUM or above.
- ALWAYS check ADR compliance before finalizing the implementation plan.
- ALWAYS include a DRP — no feature is too small for a rollback strategy.
- NEVER underestimate risk for changes affecting theme.json (it affects the entire site).
- ALWAYS reference specific policy sections when documenting security or testing requirements.
- NEVER include estimated time — only complexity ratings (S / M / L).
- ALWAYS version-control the PRP document alongside the code.
