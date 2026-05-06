---
name: wps-bucle-agentico
description: "Code-Test-Review-Fix iterative loop until all checks pass"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Bucle Agentico

## Purpose

Execute an iterative Code-Test-Review-Fix loop that continues until all quality checks pass. Each iteration writes or modifies code, runs tests, reviews against policies and coding standards, and fixes any failures. The loop exits only when tests pass, linting is clean, and policy compliance is verified. This prevents shipping incomplete or non-compliant code.

## Execution Flow — 5 Strict Steps

### Step 1 — Code (Implement or Modify)

- Apply the requested change (new block, component, fix, refactor).
- Follow existing project conventions detected via Grep/Glob on the codebase.
- Ensure the change aligns with applicable ADRs and policies.

### Step 2 — Test

- Run `npm test` (Jest + @testing-library/react) for affected blocks/components.
- Run `npm run lint` (ESLint + Stylelint) for modified files.
- Run `npm run build` to confirm the block compiles without errors.
- Capture all output (exit codes, error messages, failing test names).

### Step 3 — Review

- Compare the change against:
  - `.cloud/policies/coding-standards.md` (BEM naming, file structure, patterns).
  - `.cloud/policies/security-policy.md` (sanitization, escaping, nonce usage).
  - `.cloud/policies/testing-policy.md` (coverage thresholds, required test types).
- Check for regressions: did previously passing tests start failing?
- Verify block.json schema compliance if blocks were modified.

### Step 4 — Fix

- If any test, lint, or build error exists: diagnose the root cause and apply a targeted fix.
- If a policy violation is detected: correct the code to comply.
- Do NOT fix unrelated issues — scope fixes to the current change only.

### Step 5 — Loop or Exit

- Re-run Step 2 (Test) after fixes.
- If all checks pass: exit the loop and report success with a summary of iterations.
- If checks still fail: return to Step 4.
- **Maximum iterations: 5.** If not resolved after 5 iterations, stop and report the remaining failures with diagnostic details for human review.

## Rules

- NEVER ship code that has failing tests — the loop must pass before completion.
- NEVER skip the lint step — style violations compound if left unchecked.
- NEVER fix unrelated code during the loop — scope is limited to the current change.
- ALWAYS report the iteration count and what was fixed in each iteration.
- ALWAYS stop after 5 iterations maximum and escalate to the user.
- NEVER disable tests or lint rules to make the loop pass.
- ALWAYS run the full test suite, not just individual test files, on the final iteration.
