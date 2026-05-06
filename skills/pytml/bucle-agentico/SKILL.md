---
name: pytml-bucle-agentico
description: "Implement complex features using the BLUEPRINT approach with just-in-time context"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Agentic Loop

## Purpose

Execute the implementation of complex features following the BLUEPRINT approach: for each phase of the approved PRP, map the real context, generate subtasks just-in-time, execute, and validate. Never pre-plan all subtasks in advance.

## Prerequisite

- An approved PRP with status `APPROVED` MUST exist
- If there is no approved PRP, tell the user to run `/prp` first

## Execution Flow

### For each PHASE in the PRP Blueprint:

#### Step 1: MAP (Map Real Context)

Read the current code relevant to this specific phase:

1. Open the files this phase will touch
2. Read the interfaces to be implemented or extended
3. Verify the current state of tests
4. Identify real dependencies (not those assumed in the PRP)
5. Detect if anything changed since the PRP was created

**Output**: Concrete list of files to create/modify with real context.

#### Step 2: GENERATE (Generate Subtasks)

With the mapped real context, generate concrete subtasks for THIS phase:

1. List each file to create or modify
2. Define the execution order (always Core → Application → Infrastructure → Api → Tests → Docs)
3. Identify validations needed after each subtask

**Output**: Ordered list of concrete subtasks.

#### Step 3: EXECUTE (Execute)

Execute each subtask in order:

1. Create/modify the code
2. Verify it compiles: `dotnet build`
3. If there are affected tests, run: `dotnet test`
4. If it fails, apply **auto-shielding** (see section)

**Auto-chaining**: After each code change:
1. If there is migration context: `/verify-logic` verifies logic against legacy before tests
2. `/generate-tests [affected-service]` generates/updates tests for modified services
3. `/documentacion` updates docs and CHANGELOG.md automatically

#### Step 4: VALIDATE (Validate)

Verify that the phase completed correctly:

1. `dotnet build` — must compile without errors
2. `dotnet test` — all tests must pass
3. Verify PRP success criteria that apply to this phase
4. Confirm no anti-patterns were introduced

### Upon completing all phases:

1. Verify ALL PRP success criteria
2. Run final build and tests
3. Update PRP status to `COMPLETED`
4. Update CHANGELOG.md with feature summary

## Auto-Shielding

When an error occurs during execution:

1. **Capture** the full error
2. **Analyze** the root cause
3. **Fix** without changing the architecture
4. **Verify** the fix does not break other tests
5. **Document** the error and solution in the PRP as a Learning

If after 3 attempts it is not resolved:
- STOP execution
- Report to the user with full context
- Suggest alternatives

## Rules

- NEVER pre-plan subtasks for future phases — only the current phase
- NEVER skip the MAP step — always read real context before generating subtasks
- NEVER continue to the next phase if the current one doesn't compile or has failing tests
- ALWAYS follow the order: Core → Application → Infrastructure → Api → Tests → Docs
- ALWAYS run `dotnet build` after each significant change
- ALWAYS run `dotnet test` at the end of each phase
- ALWAYS update CHANGELOG.md
- If the real context differs significantly from the PRP, INFORM the user before continuing
- Maximum 3 auto-shielding attempts per error before escalating to the user
