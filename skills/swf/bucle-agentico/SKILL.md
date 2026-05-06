---
name: swf-bucle-agentico
description: "Agentic loop — implement, test, review, fix, repeat until quality gates pass"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Agentic Loop

## Purpose

Execute the implementation of complex features following the BLUEPRINT approach: for each phase of the approved plan, map the real context, generate subtasks just-in-time, execute, and validate. Never pre-plan all subtasks in advance.

## Prerequisite

- An approved plan or DRP with clear phases MUST exist
- If there is no approved plan, tell the user to create one first

## Execution Flow

### For each PHASE in the Plan:

#### Step 1: MAP (Map Real Context)

Read the current code relevant to this specific phase:

1. Open the files this phase will touch
2. Read the protocols to be implemented or extended
3. Verify the current state of tests
4. Identify real dependencies (not those assumed in the plan)
5. Detect if anything changed since the plan was created
6. Check Package.swift for module dependencies

**Output**: Concrete list of files to create/modify with real context.

#### Step 2: GENERATE (Generate Subtasks)

With the mapped real context, generate concrete subtasks for THIS phase:

1. List each file to create or modify
2. Define the execution order (always Models → Api → ViewModel → View → Coordinator → DI → Tests)
3. Identify validations needed after each subtask

**Output**: Ordered list of concrete subtasks.

#### Step 3: EXECUTE (Execute)

Execute each subtask in order:

1. Create/modify the code
2. Verify it compiles: `swift build` or Xcode build
3. If there are affected tests, run: `swift test`
4. If it fails, apply **auto-shielding** (see section)

**Auto-chaining**: After each code change:
1. `generate-feature-tests` generates/updates tests for modified ViewModels
2. `calidad` verifies quality gates
3. `documentacion` updates docs and CHANGELOG.md automatically

#### Step 4: VALIDATE (Validate)

Verify that the phase completed correctly:

1. `swift build` — must compile without errors
2. `swift test` — all tests must pass
3. `swiftlint` — no warnings or errors
4. Verify plan success criteria that apply to this phase
5. Confirm no anti-patterns were introduced (analyze-viewmodels)

### Upon completing all phases:

1. Verify ALL plan success criteria
2. Run final build and tests
3. Update plan status to `COMPLETED`
4. Update CHANGELOG.md with feature summary
5. Record completion in audit trail

## Auto-Shielding

When an error occurs during execution:

1. **Capture** the full error (compiler error, test failure, runtime crash)
2. **Analyze** the root cause:
   - Missing import? → Add the correct SPM module import
   - Type mismatch? → Check API model mapping
   - @MainActor isolation? → Verify async context
   - Combine publisher error? → Check operator chain
3. **Fix** — Apply the minimal fix
4. **Retry** — Re-execute the failed subtask
5. **Escalate** — If 3 retries fail, stop and report to the user with full context

## Rules

1. Never implement more than one phase at a time
2. Each phase must pass validation before moving to the next
3. If a phase requires architectural changes not in the plan, STOP and propose an ADR
4. Always run tests after code changes — never skip
5. The loop continues until ALL quality gates pass or the user explicitly stops
6. Record every phase completion in the audit trail
7. Maximum 3 auto-fix retries per error before escalating
