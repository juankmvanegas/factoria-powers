---
name: net-eject-factory
description: "Use when the project needs to be ejected from the factory — removing factory configuration and standing alone"
---

---
name: eject-factory
description: "Remove Factoria from a mature project (DESTRUCTIVE OPERATION)"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Eject Factory

## Purpose

Remove Factoria from a project that has matured and no longer needs the software factory. This is a DESTRUCTIVE and irreversible OPERATION. It removes Factoria's configuration directories but keeps all generated code intact.

## WARNING

This operation:
- Deletes `.claude/` (skills, agent configuration)
- Deletes `.cloud/` (ADRs, planning, architecture)
- Deletes `.ai/` if it exists (additional agent configuration)
- Is IRREVERSIBLE once executed
- The project will continue working but without Factoria assistance

## Execution Flow

### Step 1: Initial Confirmation

Request EXPLICIT confirmation from the user:

```
⚠️ DESTRUCTIVE OPERATION: Eject Factory

This will permanently delete:
- .claude/ (skills and agent configuration)
- .cloud/ (ADRs, architecture documentation, migration plans)
- .ai/ (additional configuration if it exists)

Generated code (src/, tests/, .sln, etc.) will NOT be touched.

Do you confirm you want to proceed? Type "CONFIRM EJECT" to continue.
```

Do NOT proceed unless the user types the exact confirmation.

### Step 2: Inventory

Before deleting, list EVERYTHING that will be removed:

1. List files in `.claude/`
2. List files in `.cloud/`
3. List files in `.ai/` if it exists
4. Count total affected files
5. Show list to the user

### Step 3: Backup

Create a backup before proceeding:

1. Create directory `_factoria-backup-{timestamp}/`
2. Copy `.claude/` to the backup
3. Copy `.cloud/` to the backup
4. Copy `.ai/` to the backup if it exists
5. Confirm the backup was created successfully

### Step 4: Preserve Useful Documentation

Before deleting, extract and preserve at the project root:

1. Copy ADRs to a `docs/architecture/decisions/` directory (create if it does not exist)
2. Copy `BUSINESS_LOGIC.md` to the root if it is not already there
3. Preserve CHANGELOG.md (should already be at the root)

### Step 5: Execution

1. Delete `.claude/`
2. Delete `.cloud/`
3. Delete `.ai/` if it exists
4. Verify the directories were deleted
5. Verify the project code is still intact

### Step 6: Post-Eject Verification

1. `dotnet build` — must compile without errors
2. `dotnet test` — all tests must pass
3. Verify there are no broken references to deleted files

### Step 7: Final Report

```
✅ Eject completed successfully.

Deleted:
- .claude/ ({N} files)
- .cloud/ ({N} files)
- .ai/ ({N} files)

Preserved:
- docs/architecture/decisions/ (ADRs)
- BUSINESS_LOGIC.md
- CHANGELOG.md
- All source code and tests

Backup created at: _factoria-backup-{timestamp}/

The project works independently of Factoria.
```

## Rules

- NEVER execute without explicit confirmation ("CONFIRM EJECT")
- NEVER delete source code, tests, or project files (.csproj, .sln)
- NEVER delete without creating a backup first
- ALWAYS preserve ADRs in docs/
- ALWAYS verify the project builds and tests pass after the eject
- ALWAYS create a backup with timestamp
- If the build fails after the eject, restore from backup immediately
