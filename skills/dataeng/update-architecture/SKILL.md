# Skill: Update Architecture Documentation

## Purpose
Update the architecture documentation (`current.md`) when architectural changes
are made, ensuring it stays in sync with the actual system state.

## When to Use
- After a new ADR is accepted that changes the architecture
- After adding new service types or layers
- After adding new infrastructure providers
- After changing cross-cutting concerns
- After modifying deployment strategy

## Inputs Required
1. **Change description** - What changed in the architecture
2. **Related ADR** - The ADR that motivated this change
3. **Affected sections** - Which parts of `current.md` need updating

## Output
Updated `.cloud/architecture/current.md` with the changes reflected.

## Rules
1. Never remove history - add new sections or update existing ones
2. Keep the architecture diagram in sync with the text
3. Update the layer details table if layers change
4. Update the cross-cutting concerns section if those change
5. Update the deployment section if CI/CD changes
6. Maintain the same markdown structure and formatting

## Process
1. Read the related ADR
2. Read current `.cloud/architecture/current.md`
3. Identify which sections need updating
4. Update the document
5. Verify consistency between diagram and text
6. Verify all ADRs are reflected in the architecture doc
