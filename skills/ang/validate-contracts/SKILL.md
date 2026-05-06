---
name: ang-validate-contracts
description: "Use when checking that API contracts between frontend and backend (or between microservices) are still honored"
---

---
name: validate-contracts
description: "Validate route and component compatibility legacy vs new Angular"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
context: fork
---

# Skill: Validate Contracts

## Purpose

Verify that all routes, components, and flows from the legacy are covered in the new project.

## Verifications

### Mode A: Legacy vs New Validation (Migration)

#### 1. Routes
```
LEGACY                    NEW                  STATUS
/notes                    /notes               ✅ Match
/notes/:id                /notes/:id           ✅ Match
/admin/settings           (does not exist)     ❌ MISSING
```

#### 2. Components
```
LEGACY                    NEW                  STATUS
NotesListComponent        NotesPage            ✅ Migrated
NoteDetailComponent       NoteDetailPage       ✅ Migrated
AdminSettingsComponent    (does not exist)     ❌ MISSING
```

#### 3. Services / Use Cases
```
LEGACY                    NEW                  STATUS
NotesService              NotesUseCases        ✅ Migrated
  getAllNotes()            getAllNotes()         ✅ Method exists
  deleteNote()            (does not exist)     ❌ MISSING
```

#### 4. Breaking Changes

| Change | Type | Impact | Action |
|--------|------|--------|--------|
| Route /old → /new | Breaking | Users with bookmarks | Redirect? |

### Mode B: Frontend vs Backend .NET Validation (Cross-Repo)

**Activates when**: the prompt includes the path to a .NET backend project (read-only).

#### 1. Scan the backend project

1. Locate `Controllers/` folder in the .NET project
2. For each controller, extract:
   - Routes: `[Route("api/[controller]")]`, `[HttpGet]`, `[HttpPost("{id}")]`, etc.
   - Request DTOs (method parameters, `[FromBody]`)
   - Response DTOs (return types, `ActionResult<T>`)
   - Auth attributes: `[Authorize]`, `[AllowAnonymous]`

#### 2. Compare with Angular adapters

```
BACKEND CONTROLLER         FRONTEND ADAPTER           STATUS
NotesController            ApiBffNotesService
  GET api/notes            getNotes()                 ✅ Match
  GET api/notes/{id}       getNoteById(id)            ✅ Match
  POST api/notes           createNote(input)          ✅ Match
  DELETE api/notes/{id}    (does not exist)           ❌ MISSING
```

#### 3. Compare DTOs

```
BACKEND DTO                FRONTEND DTO               STATUS
NoteOutput                 NoteOutput
  .Id (int)                .id (number)               ✅ Compatible
  .Title (string)          .title (string)            ✅ Compatible
  .Category (NoteCategory) .category (string)         ⚠️ Enum vs string
  .CreatedAt (DateTime)    (does not exist)           ❌ MISSING
```

#### 4. Verify Auth

```
BACKEND                    FRONTEND                   STATUS
[Authorize] on controller  Guard on route             ✅ Protected
[AllowAnonymous]           No guard                   ✅ Match
[Authorize(Roles="Admin")] RoleGuard("Admin")         ✅ Match
[Authorize]                No guard                   ❌ UNPROTECTED
```

#### 5. Report

Generate report with:
- Total backend endpoints vs frontend adapters
- Matches, missing, and discrepancies
- Compatible vs incompatible DTOs
- Auth protection status

**IMPORTANT**: This mode is **read-only** — NEVER modify files in the backend project.

## Rules

- Breaking changes BLOCKED by default — require explicit approval
- Missing routes are BLOCKER
- Missing methods in services are BLOCKER
- In Mode B (cross-repo): NEVER modify the backend project — only read and report
- DTO discrepancies are WARNING (may be intentional)
- Frontend endpoints unprotected when backend is protected are BLOCKER
