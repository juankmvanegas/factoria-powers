---
name: swf-sprint
description: "Sprint planning assistance — analyze stories, estimate complexity, identify dependencies, propose order"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Sprint Planning

## Purpose

Assist with sprint planning for iOS/Swift development. Analyzes user stories, estimates complexity using the project's architecture patterns, identifies inter-story dependencies, and proposes an optimal implementation order.

## Execution Flow — 6 Strict Steps

### Step 1: Collect User Stories

1. Accept user stories from the user (list or one at a time)
2. For each story, capture:
   - Title
   - Description / acceptance criteria
   - Priority (if provided)
   - External dependencies (API readiness, design, etc.)

### Step 2: Analyze Each Story

For each user story, determine:

| Factor | Assessment |
|--------|-----------|
| Modules affected | Which SPM modules need changes |
| New vs modify | Creating new code or modifying existing |
| API dependency | New endpoints needed? BFF changes? |
| UI complexity | Number of screens, CoreUI components |
| Business logic | Combine chains, state management |
| Testing effort | Mocks needed, edge cases |
| Risk | Breaking changes, shared module modifications |

### Step 3: Estimate Complexity

Use a point scale based on architecture effort:

| Points | Criteria |
|--------|----------|
| 1 | Single file change, no new patterns (bug fix, text change) |
| 2 | Single module, follows existing patterns (new field, simple view) |
| 3 | Single module, moderate logic (new ViewModel method, API endpoint) |
| 5 | Multiple modules, new patterns (new feature with data+presentation) |
| 8 | Multiple modules, complex logic, new Coordinator flows |
| 13 | Cross-cutting change, architecture impact, multiple features |

### Step 4: Identify Dependencies

1. Map inter-story dependencies (Story B requires Story A's API)
2. Map external dependencies (backend API, design assets, certificates)
3. Identify shared module changes that block multiple stories
4. Flag stories that can be parallelized

### Step 5: Propose Implementation Order

Generate an ordered plan:

```markdown
## Sprint Plan

### Day 1-2: Foundation
1. [Story-ID] Setup shared module changes (2 pts) — Unblocks: Story B, C
2. [Story-ID] API models and protocols (3 pts) — Unblocks: Story D

### Day 3-5: Core Features
3. [Story-ID] Feature A ViewModel + Views (5 pts) — Depends on: #1
4. [Story-ID] Feature B ViewModel + Views (5 pts) — Depends on: #1, #2
   ↳ Can run in parallel with #3

### Day 6-7: Integration & Polish
5. [Story-ID] Navigation integration (3 pts) — Depends on: #3, #4
6. [Story-ID] Bug fixes and edge cases (2 pts)

### Buffer: 1 day for unexpected issues

Total: XX points | Estimated: X days
```

### Step 6: Generate Sprint Summary

```markdown
# Sprint Plan — Sprint [N]
## Date: [Start] → [End]

## Velocity Target: [X points]

## Stories
| ID | Title | Points | Priority | Dependencies | Assignable |
|----|-------|--------|----------|-------------|------------|
| ... | ... | ... | ... | ... | Day N+ |

## Dependency Graph
[Text-based or Mermaid diagram]

## Risks
- [Risk 1: description and mitigation]
- [Risk 2: description and mitigation]

## External Dependencies
- [API endpoint X needed by Day N]
- [Design for screen Y needed by Day N]
```

## Auto-Shielding

- **WARN** if total points exceed team velocity — suggest reducing scope
- **WARN** if a single story exceeds 13 points — suggest breaking down
- **WARN** if critical external dependency has no confirmed date
- **WARN** if more than 30% of stories modify shared modules

## Rules

1. Every story must have a point estimate
2. Dependencies must be explicitly mapped
3. Shared module changes go first in the sprint
4. Buffer at least 10% of sprint capacity for unexpected work
5. Stories with external dependencies should have a fallback plan
6. Include testing time in estimates (not separate stories)
7. Flag stories that need PRP (> 8 points or high risk)
