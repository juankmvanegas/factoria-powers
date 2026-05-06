---
name: pyt-sprint
description: "Use when planning or executing a sprint â€” multiple features or tasks to be implemented in sequence"
---

---
name: sprint
description: "Quick task or bug fix with minimal overhead following all policies"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Sprint

## Purpose

Execute quick tasks, bug fixes, and minor adjustments without the full planning overhead of a PRP or feature workflow. Still enforces all policies and triggers the automatic validation chain.

## When to Use

- Bug fixes that are well-understood
- Minor adjustments to existing features
- Configuration changes
- Small refactors within a single layer
- Documentation updates

## Execution Flow â€” 5 Strict Steps

1. **Understand the task** â€” Read the user's description. If ambiguous, ask ONE clarifying question (maximum). Identify affected layer(s) and file(s).

2. **Load context** â€” Read the affected files and their tests. Load relevant policy if the change touches security, testing, or coding standards.

3. **Implement the fix** â€” Make the minimal change required. Follow coding standards policy. Respect layer boundaries even for small changes.

4. **Validate** â€” Run affected tests (`pytest tests/ -k {relevant_test}`). Run `ruff check` on changed files. Run `mypy` on changed files. If any test fails, fix and re-run.

5. **Chain completion** â€” Automatic post-execution:
   - Run `import-linter` to verify architecture contracts
   - Update CHANGELOG.md if the change is user-facing
   - Report what was changed and validation results

## Auto-Shielding

- NEVER skip validation even for "trivial" changes
- NEVER modify architecture tests to make a fix pass
- ALWAYS run at least the tests related to the changed code
- If the fix requires changes across multiple layers, ESCALATE to add-feature skill

## Rules

- Sprint is for tasks completable in a single focused session
- If the task grows beyond 3 files across 2+ layers, switch to add-feature
- Every bug fix MUST include a regression test
- Security-related fixes MUST be validated against security policy
- The automatic chain (lint + type check + test) is NOT optional
