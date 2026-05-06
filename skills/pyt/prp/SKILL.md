---
name: pyt-prp
description: "Use when starting any non-trivial feature â€” before writing any code, to produce a Product Requirements Proposal with measurable success criteria"
---

---
name: prp
description: "Create Product Requirements Proposal with planning, architecture impact, and testing plan"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: PRP (Product Requirements Proposal)

## Purpose

Create a structured planning document before implementing complex features. The PRP captures requirements, breaks work into phases, assesses architecture impact, and defines success criteria and testing strategy.

## When to Use

- Features that span 3+ layers or 5+ files
- New capabilities that may require architectural decisions (ADRs)
- Features with unclear or evolving requirements
- Any work that benefits from upfront planning before code

## Execution Flow â€” 6 Strict Steps

1. **Interview the user** â€” Gather requirements through structured questions:
   - What is the feature? (one-sentence summary)
   - Who is the consumer? (API client, internal service, user)
   - What data does it need? (inputs, outputs, persistence)
   - What are the constraints? (performance, security, compatibility)
   - What is the definition of done?

2. **Analyze architecture impact** â€” Read current `CLAUDE.md` and `.cloud/architecture/current.md`. Identify:
   - New domain entities or modifications to existing ones
   - New ports/adapters required
   - Infrastructure dependencies (DB, external APIs, queues)
   - API surface changes

3. **Generate PRP document** â€” Write to `.claude/PRPs/PRP-{NNN}-{slug}.md` with sections:
   - Summary (1 paragraph)
   - Requirements (numbered list)
   - Architecture Impact (entities, ports, adapters, routes)
   - Phases (ordered implementation steps)
   - Success Criteria (measurable outcomes)
   - Testing Plan (unit, integration, e2e scenarios)
   - Risks and Mitigations
   - ADR Required? (yes/no with justification)

4. **Estimate phases** â€” Break into phases of 1-3 files each. Each phase must be independently testable. Define dependencies between phases.

5. **Present for approval** â€” Show the PRP to the user. Highlight any architectural decisions that need an ADR. Wait for explicit approval before proceeding.

6. **Link to execution** â€” Once approved, the PRP becomes input for either `add-feature` (simple) or `bucle-agentico` (complex multi-phase).

## Auto-Shielding

- NEVER start implementation without an approved PRP for complex features
- NEVER skip the architecture impact analysis
- ALWAYS check if the feature requires a new ADR
- ALWAYS define at least one test scenario per phase

## Rules

- PRP files follow the naming convention `PRP-{NNN}-{kebab-case-name}.md`
- Each phase MUST be independently testable
- The PRP MUST reference relevant existing ADRs and policies
- If the feature conflicts with an existing ADR, flag it â€” do NOT silently override
- PRPs are living documents â€” update them as implementation reveals new information
