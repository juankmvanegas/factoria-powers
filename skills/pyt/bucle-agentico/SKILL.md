---
name: pyt-bucle-agentico
description: "Use when an approved PRP exists and complex implementation should proceed phase by phase with just-in-time context mapping"
---

---
name: bucle-agentico
description: "Implement complex features phase by phase using BLUEPRINT methodology"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Bucle Agentico (Agentic Loop)

## Purpose

Execute complex multi-phase feature implementations using the BLUEPRINT approach. Loads a PRP, executes each phase with just-in-time context loading, validates after each phase, and maintains progress tracking throughout.

## When to Use

- Features with 3+ implementation phases
- Work that spans multiple layers and requires careful sequencing
- Migration tasks that need phase-by-phase execution with validation gates
- Any task where a PRP has been created and approved

## Execution Flow â€” 7 Strict Steps

1. **Load PRP** â€” Read the approved PRP from `.claude/PRPs/`. Validate it has phases, success criteria, and testing plan. If no PRP exists, redirect to the `prp` skill first.

2. **Initialize progress tracker** â€” Create or update `.cloud/planning/progress-{prp-slug}.md` with:
   - Phase list with status (pending/in-progress/done/blocked)
   - Start timestamp
   - Current phase indicator

3. **For each phase, execute the BLUEPRINT cycle:**

   a. **B â€” Build context** â€” Load ONLY the files needed for this phase (just-in-time). Read relevant policies and ADRs. Do NOT load the entire codebase.
   
   b. **L â€” Lay out the plan** â€” List the specific files to create/modify in this phase. Confirm with the execution order (domain â†’ application â†’ infrastructure â†’ api).
   
   c. **U â€” Undertake implementation** â€” Write the code for this phase following all coding standards and layer rules.
   
   d. **E â€” Evaluate with tests** â€” Run tests specific to this phase. Unit tests for new use cases, integration tests for new endpoints. All must pass.
   
   e. **P â€” Police compliance** â€” Run `ruff check`, `mypy`, `import-linter`. Verify no policy violations.
   
   f. **R â€” Record progress** â€” Update progress tracker. Document any deviations from the PRP.
   
   g. **I â€” Inspect before next** â€” Review phase output against success criteria. If criteria not met, fix before proceeding.
   
   h. **N â€” Next phase gate** â€” Confirm phase completion. Ask user for approval if the phase had significant deviations.
   
   i. **T â€” Transition** â€” Clear phase context, load next phase context.

4. **Handle blockers** â€” If a phase is blocked:
   - Document the blocker in progress tracker
   - Assess if subsequent phases can proceed independently
   - If not, pause and report to user

5. **Cross-phase validation** â€” After all phases complete, run the full test suite to verify no regressions across phases.

6. **Final compliance check** â€” Run all architecture tests, lint, and type checks on the entire affected area.

7. **Close PRP** â€” Update PRP status to "Implemented". Update progress tracker to "Complete". Update CHANGELOG.md.

## Auto-Shielding

- NEVER skip the evaluation step (tests) within a phase
- NEVER proceed to next phase if current phase tests fail
- NEVER load entire codebase â€” use just-in-time context loading
- ALWAYS update the progress tracker after each phase
- If a phase modifies domain entities, RE-RUN all dependent tests

## Rules

- A PRP MUST exist before starting the agentic loop
- Each phase MUST be independently testable
- Context loading is just-in-time â€” only load what the current phase needs
- Progress tracker is the source of truth for execution state
- If the PRP needs modification during execution, document the change in both the PRP and progress tracker
- Maximum 3 retry attempts per phase before escalating to user
