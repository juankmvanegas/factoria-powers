---
name: ang-migration-start
description: "Use when starting a migration of a legacy system — first step before any code analysis"
---

---
name: migration-start
description: "Migration step 0 — capture constraints and legacy path for Angular"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Start

## Purpose

Step 0 of the migration flow. Prepare everything before starting: capture constraints, legacy project path, and generate ADRs for new decisions.

## Execution Flow

### Phase 0: Obtain Legacy Path

BEFORE anything else:

1. Ask the user: **"What is the path of the legacy Angular project we are going to migrate?"**
2. Validate that the path exists and contains an Angular project (`angular.json`, `package.json`)
3. Validate that the path is DIFFERENT from the destination project
4. Save in `.cloud/planning/migration-constraints.md`

### Phase 1: Constraints Interview

Ask the user about each category:

1. **Legacy Angular version**: What version? (AngularJS, Angular 2+, etc.)
2. **Legacy structure**: Does it have Clean Architecture? Other structure?
3. **State Management**: Does it use NgRx, Akita, BehaviorSubject, other?
4. **Routing**: Lazy loading? Guards? Resolvers?
5. **Auth**: MSAL? Custom JWT? Other?
6. **CSS**: SCSS? CSS modules? CSS framework?
7. **Testing**: Does it have tests? Framework?
8. **Module Federation**: Is it a micro-frontend?
9. **APIs**: What backends does it consume?
10. **Acceptable breaking changes**: Can routes be changed? APIs? Behavior?

### Phase 2: Generate Documents

1. **migration-constraints.md**:
   ```markdown
   # Migration Constraints

   ## Legacy Path
   {path}

   ## Constraints
   | Category | Legacy | Destination | Decision |
   |----------|--------|-------------|----------|
   | Angular Version | {X} | 16.2.12 | Migrate |
   | State Management | {X} | Services + Events | {decision} |
   ...
   ```

2. **New ADRs** for each significant technical decision

### Phase 3: Approval

Show summary to the team. Wait for explicit approval before proceeding to `/migration-discovery`.

## Rules

- NEVER proceed without the legacy path
- NEVER modify the legacy project — READ ONLY
- ALWAYS document constraints before discovery
