# Skill: Update Architecture Documentation

## Purpose
Update the architecture documentation (`current.md`) when architectural changes
are made, ensuring it stays in sync with the actual iOS/Swift project state.
Scans the project for structural changes, validates module boundaries, and
reports drift from ADRs.

## When to Use
- After a new ADR is accepted that changes the architecture
- After adding new SPM modules or feature packages
- After adding new infrastructure providers (API, database, auth)
- After changing cross-cutting concerns (encryption, logging, analytics)
- After modifying the module dependency graph
- After changing Coordinator navigation flows

## Inputs Required
1. **Change description** — What changed in the architecture
2. **Related ADR** — The ADR that motivated this change (if applicable)
3. **Affected sections** — Which parts of `current.md` need updating

## Output
Updated `.cloud/architecture/current.md` with the changes reflected.

## Process

### Step 1: Scan Project Structure
1. Read all `Package.swift` files to map SPM module graph
2. Identify all feature modules and their dependencies
3. Map Core → CoreUI → Feature module hierarchy
4. List all third-party dependencies from each Package.swift

### Step 2: Validate Module Boundaries
1. Check that no feature module directly depends on another feature module
2. Verify Core does not import any feature module
3. Verify CoreUI only depends on Core and Dependencias
4. Verify Dependencias has no internal module imports
5. Check for circular dependency chains

### Step 3: Detect ADR Drift
1. Read all accepted ADRs in `.cloud/architecture/decisions/`
2. For each ADR, verify the decision is still reflected in the code:
   - ADR-001 (MVVM + SPM): Verify module structure follows the pattern
   - ADR-009 (Factory DI): Verify DI registration pattern in Proveedor files
   - ADR-010 (Coordinator): Verify navigation flows use Coordinators
3. Report any drift between ADRs and actual implementation

### Step 4: Update Documentation
1. Read current `.cloud/architecture/current.md`
2. Update the module dependency diagram
3. Update the layer details table
4. Update cross-cutting concerns section
5. Add change history entry with date and description

### Step 5: Validate Consistency
1. Verify diagram matches the text description
2. Verify all ADRs are reflected in the architecture doc
3. Verify no orphaned modules (modules not in the dependency graph)
4. Generate drift report if inconsistencies found

## Auto-Shielding
- **ABORT** if unable to parse Package.swift files — SPM structure is required
- **ABORT** if circular dependencies are detected — fix before documenting
- **WARN** if more than 2 ADRs show drift — significant architectural divergence

## Rules
1. Never remove history — add new sections or update existing ones
2. Keep the module dependency diagram in sync with Package.swift files
3. Update the technology stack table if dependencies change
4. Update the cross-cutting concerns section if those change
5. Maintain the same markdown structure and formatting
6. Report all ADR drift findings to the user before updating
7. Include SPM module count and dependency depth in the summary
