# Skill: Update Architecture Documentation

## Purpose
Update the architecture documentation (`current.md`) when architectural changes are made,
ensuring it stays synchronized with the actual state of the system.

## When to Use
- After a new ADR is accepted and changes the architecture
- After adding new feature modules
- After adding new infrastructure providers
- After changing cross-cutting concerns (logging, analytics, auth)
- After modifying the deployment strategy

## Inputs Required
1. **Change description** — What changed in the architecture
2. **Related ADR** — The ADR that motivated this change
3. **Affected sections** — Which parts of `current.md` need updating

## Output
`.cloud/architecture/current.md` updated with the changes reflected.

## Rules
1. Never delete history — add new sections or update existing ones
2. Keep the architecture diagram synchronized with the text
3. Update the layer details table if layers change
4. Update the cross-cutting concerns section if those change
5. Update the deployment section if CI/CD changes
6. Maintain the same markdown structure and formatting
7. Update the feature modules list if new ones are added

## Process
1. Read the related ADR
2. Read the current `.cloud/architecture/current.md`
3. Identify which sections need updating
4. Update the document
5. Verify consistency between diagram and text
6. Verify that all ADRs are reflected in the architecture doc
7. Update Version Catalog if dependencies were added

## Sections to Check
- C4 module diagram
- Feature modules table
- Core dependencies (libs.versions.toml)
- Cross-cutting: Auth, Analytics, Crashlytics, RemoteConfig
- Build variants and flavors
- CI/CD pipelines
