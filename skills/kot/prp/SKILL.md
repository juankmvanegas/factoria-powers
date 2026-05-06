---
name: kot-prp
description: "Plan a feature with PRP + DRP documents"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# PRP — Product Requirements Proposal

## Purpose

Create a structured planning document that defines requirements, scope, and design decisions for a feature BEFORE writing code.

## When to Use

- Before any new feature
- Before significant changes
- Before integrations with external services
- Before changes affecting multiple modules

## Process

1. **Interview** the user about the feature:
   - What problem does it solve?
   - Who uses it?
   - What acceptance criteria does it have?

2. **Generate PRP** using base template
3. **Generate DRP** with technical design
4. **Wait for approval** before any code

## PRP Template

```markdown
# PRP: [Feature Name]

## Metadata
- **Author:** [Name]
- **Date:** YYYY-MM-DD
- **Status:** Draft | In Review | Approved | Rejected

## 1. Summary
[1-2 paragraphs describing the feature]

## 2. Problem
[What problem does it solve?]

## 3. Proposed Solution
[High-level description]

## 4. Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## 5. Out of Scope
- Item NOT included
- Another excluded item

## 6. Dependencies
- Feature X must be completed
- API Y must be available

## 7. Risks
- Risk 1: [Description] — Mitigation: [...]
- Risk 2: ...

## 8. Estimated Timeline
- Development: X days
- Testing: Y days
- Total: Z days

---
## Approval
- [ ] Product Owner: _______ (date: ___)
- [ ] Tech Lead: _______ (date: ___)
```

## Output

1. Save PRP to `.cloud/planning/prp-{feature-name}.md`
2. Save DRP to `.cloud/planning/drp-{feature-name}.md`
3. Wait for explicit approval

## Post-Approval

PRP approved → Execute `add-feature` with the PRP as context
