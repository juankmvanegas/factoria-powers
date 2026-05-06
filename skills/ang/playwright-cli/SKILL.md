---
name: ang-playwright-cli
description: "Use when working with playwright-cli in a ang project"
---

---
name: playwright-cli
description: "Visual testing and browser automation — screenshots, forms, navigation, auto-correction"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Playwright CLI

## Purpose

Automate visual and interaction testing in the browser. Capture screenshots, navigate pages, fill forms, and allow the agent to **see** what the user sees for auto-correction.

## Philosophy

**CLI is preferred over MCP** because:
- MCP injects complete snapshots into context (expensive in tokens)
- CLI saves data to disk (screenshots/YAML) for on-demand inspection
- Less context pollution, better for known flows

**Use MCP only when**: interactive exploration or real-time debugging is needed.

## Prerequisites

Install Playwright (chromium only):
```bash
npx playwright install chromium
```

## Main Commands

```bash
# Capture screenshot
npx playwright screenshot http://localhost:4200 --output screenshot.png

# Capture screenshot of specific route
npx playwright screenshot http://localhost:4200/notes --output notes-view.png

# Navigate (opens browser)
npx playwright navigate http://localhost:4200

# Click element
npx playwright click "text=Sign In"

# Fill form
npx playwright fill "#email" "test@example.com"
npx playwright fill "#password" "Test123!"

# Accessibility snapshot (DOM as YAML)
npx playwright snapshot http://localhost:4200
```

## QA Flow (6 Phases)

### Phase 1: SETUP
- Define what to test (route, component, flow)
- Verify that `ng serve` is running
- Define visual success criteria

### Phase 2: PROVISION
- Prepare test data if needed
- Configure authentication state (mock or real)
- Clean previous state if applicable

### Phase 3: NAVIGATE
- Navigate to the target page
- Capture BEFORE screenshot (initial state)
- Save in `.qa-reports/[YYYY-MM-DD]-[name]/screenshots/`

```bash
mkdir -p .qa-reports/$(date +%Y-%m-%d)-notes-crud/screenshots
npx playwright screenshot http://localhost:4200/notes \
  --output .qa-reports/$(date +%Y-%m-%d)-notes-crud/screenshots/01-initial.png
```

### Phase 4: TEST
- Execute interactions (clicks, forms, navigation)
- Capture AFTER screenshot after each significant step
- Visually verify that the result is correct

```bash
# Example: Create a note
npx playwright click "text=New Note"
npx playwright screenshot http://localhost:4200/notes/new \
  --output .qa-reports/.../screenshots/02-form-open.png

npx playwright fill "#title" "Test note"
npx playwright fill "#content" "Test content"
npx playwright click "text=Save"

npx playwright screenshot http://localhost:4200/notes \
  --output .qa-reports/.../screenshots/03-after-save.png
```

### Phase 5: DOCUMENT
- Save accessibility snapshots as YAML
- Document each executed step
- Record results (pass/fail per step)

### Phase 6: REPORT
Generate markdown report:

```markdown
# QA Report: {test name}

**Date**: {date}
**Route tested**: {route}
**Status**: PASS / FAIL

## Executed Steps

| # | Action | Screenshot | Result |
|---|--------|-----------|--------|
| 1 | Navigate to /notes | [01-initial.png] | ✅ |
| 2 | Click "New Note" | [02-form-open.png] | ✅ |
| 3 | Fill form | - | ✅ |
| 4 | Save | [03-after-save.png] | ✅ |

## Screenshots

### Initial State
![01-initial](screenshots/01-initial.png)

### Form Open
![02-form-open](screenshots/02-form-open.png)

### After Save
![03-after-save](screenshots/03-after-save.png)

## Observations
{agent observations}
```

## Visual Auto-Correction

The visual feedback loop works like this:

```
1. Agent writes code (component, style, layout)
     ↓
2. `ng serve` renders in browser
     ↓
3. Playwright captures screenshot
     ↓
4. Agent visually analyzes the screenshot
     ↓
5. Does it look correct?
   ├── YES → Continue
   └── NO → Identify problem → Fix code → Back to step 2
```

### When to use auto-correction

- After creating/modifying visual components
- After layout or CSS changes (ITCSS)
- When the user reports a visual problem
- To validate responsive design
- To verify that modals/dialogs display correctly
- After migrating legacy components

### Auto-correction example

```
// Agent creates a table component
→ Captures screenshot
→ "The table has no borders and the header is not distinguishable"
→ Adds ITCSS classes: .c-table, .c-table--bordered
→ Captures screenshot again
→ "Now it looks correct, borders are present and header has background"
→ Continues
```

## Integration with Other Skills

### With `/sprint`
- After a visual fix, capture screenshot to confirm
- Use screenshots to understand the problem before fixing

### With `/bucle-agentico`
- At the end of each UI phase, capture validation screenshots
- Document visual state per phase

### With `/migration-execute`
- Capture screenshots of the legacy (if it's running)
- Capture screenshots of the new
- Visually compare that the migration is faithful

### With `/smoke-tests`
- Capture screenshots of each migrated route
- Verify that all views render

### With `/add-feature`
- Screenshot before implementing (current state)
- Screenshot after (new state)
- Document the visual change

## MCP (Alternative Usage)

When interactive exploration is needed, use Playwright MCP:

```typescript
// Available methods via MCP
playwright_navigate({ url: 'http://localhost:4200/notes' })
playwright_screenshot()
playwright_click({ selector: 'text=New Note' })
playwright_fill({ selector: '#title', value: 'Test' })
playwright_snapshot()  // Accessibility tree
```

**When to use MCP vs CLI:**
- **CLI**: Known flows, automated QA, CI/CD
- **MCP**: Interactive debugging, exploration, unknown problems

## Artifact Storage

```
.qa-reports/
├── {YYYY-MM-DD}-{name}/
│   ├── screenshots/
│   │   ├── 01-initial.png
│   │   ├── 02-step-name.png
│   │   └── 03-final.png
│   ├── snapshots/
│   │   └── accessibility.yaml
│   └── report.md
```

## Rules

- ALWAYS save screenshots in `.qa-reports/` (not in temporary folders)
- ALWAYS capture BEFORE and AFTER visual changes
- NEVER trust only the build — verify visually
- ALWAYS document screenshot observations
- Use ChromeHeadless in CI, regular Chrome in development
- Screenshots must have descriptive names, not generic ones
- Auto-correction: maximum 3 visual iterations before escalating
