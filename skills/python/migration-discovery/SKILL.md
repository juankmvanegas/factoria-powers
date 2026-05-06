---
name: python-migration-discovery
description: "Use when the migration constraints are approved and legacy code analysis needs to begin"
---

---
name: migration-discovery
description: "Extract contracts and structure from legacy Django or Flask codebase"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Discovery

## Purpose

Extract all contracts, data models, routes, and business logic signatures from a legacy Python codebase. This is Phase 1 of the migration workflow — produces a complete inventory of what needs to be migrated.

## When to Use

- After `migration-start` has captured constraints
- When you need a complete map of the legacy system before planning migration
- To understand the full scope of a Django or Flask application

## Execution Flow — 8 Strict Steps

### For Django Projects:

1. **Extract models** — Parse all `models.py` files. Document each model: fields, relationships (FK, M2M, OneToOne), custom managers, model methods, Meta options. Output to `.cloud/planning/legacy-discovery/models.md`

2. **Extract views** — Parse all `views.py` and viewsets. Document: function-based vs class-based, decorators, permissions, serializers used, queryset logic. Output to `.cloud/planning/legacy-discovery/views.md`

3. **Extract URL patterns** — Parse all `urls.py`. Document: URL patterns, named routes, URL parameters, namespace structure. Output to `.cloud/planning/legacy-discovery/routes.md`

4. **Extract forms and serializers** — Parse `forms.py` and `serializers.py`. Document: validation rules, field mappings, custom validators. Output to `.cloud/planning/legacy-discovery/forms-serializers.md`

5. **Extract signals** — Find all signal handlers (`post_save`, `pre_delete`, etc.). Document: trigger model, handler logic, side effects. Output to `.cloud/planning/legacy-discovery/signals.md`

6. **Extract middleware** — Parse middleware classes. Document: request/response processing, order dependencies. Output to `.cloud/planning/legacy-discovery/middleware.md`

7. **Extract management commands** — Parse `management/commands/`. Document: command name, arguments, business logic. Output to `.cloud/planning/legacy-discovery/commands.md`

### For Flask Projects:

1. **Extract models** — Parse SQLAlchemy or MongoEngine models. Same output format as Django.

2. **Extract routes** — Parse route decorators and blueprint registrations. Document: methods, URL rules, decorators, request parsing.

3. **Extract blueprints** — Map blueprint structure, URL prefixes, template folders.

4. **Extract forms** — Parse WTForms or manual validation. Document validation rules.

5. **Extract extensions** — Catalog Flask extensions (Flask-Login, Flask-Mail, Flask-Migrate, etc.) and their configuration.

### Common (Both Frameworks):

8. **Generate discovery summary** — Write `.cloud/planning/legacy-discovery/SUMMARY.md` with:
   - Total entities/models count
   - Total routes/endpoints count
   - Total business logic functions count
   - External dependency map
   - Complexity per module
   - Migration priority recommendation

## Auto-Shielding

- NEVER modify legacy source code
- NEVER skip any discovery category even if it appears empty
- ALWAYS verify discovery output against actual file count
- ALWAYS flag undocumented or unusual patterns

## Rules

- Discovery is READ-ONLY — zero changes to source
- Every model field must be documented (type, constraints, defaults)
- Every route must include HTTP method, URL, and handler reference
- Signal handlers are critical — missing one causes silent data loss
- The SUMMARY.md is the gate document for migration-plan
