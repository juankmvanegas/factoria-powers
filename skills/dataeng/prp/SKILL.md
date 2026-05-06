---
name: dataeng-prp
description: "Product Requirements Proposal — unified planning document before implementation"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: PRP (Product Requirements Proposal)

## Purpose

Create a complete planning document before any implementation. The PRP is the contract between the user and the agent about WHAT will be done, WHY, and HOW it will be validated. It merges the concepts of PRP (Product Requirements Proposal) and DRP (Design Requirements Proposal).

## State Flow

```
PENDING → APPROVED → IN PROGRESS → COMPLETED
```

- **PENDING**: PRP created, awaiting user approval
- **APPROVED**: User confirmed, ready to implement
- **IN PROGRESS**: Implementation underway (via `/bucle-agentico` or `/add-feature`)
- **COMPLETED**: All success criteria verified

## Execution Flow

### Phase 1: Interview (if needed)

If the user provides a vague or incomplete description:

1. Ask for the concrete objective
2. Ask for measurable success criteria
3. Ask for known constraints
4. Ask for dependencies with other features

If the user gives a clear and complete description, skip to Phase 2.

### Phase 2: Codebase Investigation

Before drafting the PRP, investigate the existing code:

1. Search for related entities in `Core/Entities/`
2. Search for related services in `Application/Services/`
3. Search for relevant interfaces
4. Check if data migrations are needed
5. Review ADRs that may affect the implementation
6. Identify code that will be reused vs. new code

### Phase 3: PRP Generation

Create the file in `.cloud/planning/PRP-{NNN}-{kebab-case-name}.md` with the following structure:

```markdown
# PRP-{NNN}: {Title}

**Status**: PENDING
**Date**: {date}
**Author**: {user/agent}

## Objective
{What is to be achieved — one clear sentence}

## Why
{Business justification — why this matters}

## What (Success Criteria)
- [ ] {Measurable criterion 1}
- [ ] {Measurable criterion 2}
- [ ] {Measurable criterion N}

## Context (Existing Code)
- **Related entities**: {list with paths}
- **Related services**: {list with paths}
- **Existing APIs**: {relevant endpoints}
- **Reusable code**: {what can be reused}

## Architectural Impact
- **Affected layers**: {Core / Application / Infrastructure / Api}
- **New dependencies**: {if applicable}
- **Related ADRs**: {references}
- **Requires new ADR?**: {Yes/No — justify}

## Data Changes
- **New entities**: {list}
- **Modifications to existing entities**: {list}
- **Required migrations**: {description}

## API Changes
- **New endpoints**: {method, route, description}
- **Modifications to existing endpoints**: {list}
- **Breaking changes**: {Yes/No — detail}

## Testing Plan
- **Unit tests**: {which services/methods to cover}
- **Required test doubles**: {which mocks/stubs}
- **Edge cases**: {list}

## Security Checklist
- [ ] Does not expose sensitive data
- [ ] Input validation on all endpoints
- [ ] Authorization verified
- [ ] No hardcoded secrets
- [ ] Logging without PII data
- [ ] {Additional feature-specific checks}

## Blueprint (PHASES ONLY)
1. **Phase 1**: {name} — {high-level description}
2. **Phase 2**: {name} — {high-level description}
3. **Phase N**: {name} — {high-level description}

> ⚠️ Subtasks for each phase are generated just-in-time during execution, NOT here.

## Learnings
{Lessons from previous PRPs that apply to this one}

## Gotchas
- {Known traps or identified risks}

## Anti-Patterns to Avoid
- {Anti-patterns specific to this feature}
```

### Phase 4: Await Approval

Present the complete PRP to the user and wait for explicit confirmation:

- If the user approves: change status to `APPROVED`
- If the user requests changes: modify and present again
- If the user rejects: change status to `REJECTED` and document the reason

## Rules

- NEVER implement code during PRP creation
- NEVER generate detailed subtasks in the Blueprint — only high-level phases
- ALWAYS investigate the codebase before drafting
- ALWAYS include all sections even if some are "N/A"
- ALWAYS wait for explicit user approval
- Success criteria MUST be measurable and verifiable
- The Blueprint ONLY contains phases, subtasks are generated just-in-time in `/bucle-agentico`
- Number PRPs sequentially (check the last existing number)
