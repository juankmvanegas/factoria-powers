---
name: next-documentacion
description: "Use when documentation (CHANGELOG, README, API docs, comments) needs to be generated or updated after code changes"
---

---
name: documentacion
description: "Automatic documentation — CHANGELOG, architecture, ADRs"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: false
---

# Skill: Documentacion (Auto-Activated)

## Purpose

Automatically update project documentation after significant code changes. Maintains the CHANGELOG, architecture documentation, and ADR registry in sync with the actual codebase. Documentation is written in Spanish following the Keep a Changelog format.

## Activates automatically when

- After significant code changes (new features, migrations, refactors)
- At the end of the automatic chain (after `calidad` passes)
- After ADR creation or modification
- When the user explicitly requests documentation updates
- After `/add-feature`, `/migration-execute`, or `/sprint` complete successfully

## Does NOT activate when

- Changes only in test files (no user-facing impact)
- Changes only in Factoria configuration files
- Trivial formatting or comment-only changes

## Updates Performed

### 1. CHANGELOG.md (Always)

Follow the **Keep a Changelog** format strictly:

```markdown
# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

## [Sin publicar]

### Agregado
- Nueva pagina de dashboard con graficas de progreso (#42)
- Endpoint POST /api/notes para crear notas

### Cambiado
- Migrado servicio de autenticacion de pages/ a app/ router

### Corregido
- Error en calculo de descuento para pedidos mayores a $10,000

### Eliminado
- Componente legacy NotesListOld ya no utilizado
```

Categories (in Spanish):
- **Agregado** — new features, pages, endpoints, components
- **Cambiado** — modifications to existing functionality
- **Corregido** — bug fixes
- **Eliminado** — removed features or deprecated code
- **Seguridad** — security-related changes
- **Obsoleto** — deprecated features (still present but marked for removal)

### 2. Architecture Documentation (When structural changes occur)

Update `.cloud/architecture/current.md` if:
- New layers or modules added
- Route structure changed (new route groups, API routes)
- New dependencies added to `package.json`
- Component hierarchy changed significantly

Delegate to `/update-architecture` skill for detailed updates.

### 3. ADR Registry (When new ADRs are created)

Update the ADR table in `CLAUDE.md` and `.cloud/architecture/current.md`:
- Add new ADR entry with number, title, and status
- Verify no duplicate ADR numbers

### 4. README.md (When new routes or endpoints are added)

Update relevant sections:
- API endpoint list (if new `/api/*` routes)
- Environment variables (if new ones required)
- Getting started instructions (if setup steps changed)

## Report

```
Documentacion Updated
═════════════════════
  ✅ CHANGELOG.md — 3 entries added (1 Agregado, 1 Cambiado, 1 Corregido)
  ✅ .cloud/architecture/current.md — route map updated
  ⏭️ README.md — no changes needed
  ⏭️ ADR registry — no new ADRs
```

## Rules

- ALWAYS update CHANGELOG.md — this is non-negotiable for any code change
- ALWAYS use Keep a Changelog format with Spanish category names
- NEVER write generic documentation ("se actualizaron archivos") — be specific about what changed
- ALWAYS use present tense in CHANGELOG entries
- NEVER duplicate existing CHANGELOG entries — check before adding
- Documentation language: Spanish for content, English for technical terms
- ALWAYS place new entries under `[Sin publicar]` section — version tagging is done at release time
- If CHANGELOG.md does not exist, create it with the standard header
