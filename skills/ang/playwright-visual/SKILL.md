---
name: ang-playwright-visual
description: "Use when working with playwright-visual in a ang project"
---

---
name: playwright-visual
description: "Auto visual validation after changes to components, styles, or layouts"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Playwright Visual (Auto-Activated)

## Purpose

Automatically validate that visual changes look correct by capturing screenshots with Playwright CLI. This skill activates **without user intervention** as part of the automatic chain.

## Activates automatically when

- **Components** are created or modified (`.ts` with `template:`)
- ITCSS **styles** are modified (`_settings/`, `_components/`, `_objects/`, `_trumps/`)
- **Pages** or **views** are created or modified
- **Layouts** or visual routing structures are modified
- Legacy components are migrated with `/migration-execute`

## Does NOT activate when

- Changes only in services, use cases, adapters (pure logic)
- Changes only in DTOs, enums, helpers
- Changes only in tests (`.spec.ts`)
- Changes only in documentation
- `ng serve` is not running (skip with notice)

## Prerequisite

Playwright must be installed:
```bash
npx playwright install chromium
```

## Automatic Flow

```
Visual change detected
    ↓
1. Verify that ng serve is running
   ├── NO → Notify: "Skipping visual validation — ng serve not detected"
   └── YES ↓
2. Capture screenshot of the affected route
    ↓
3. Visually analyze the screenshot
    ↓
4. Does it look correct?
   ├── YES → Continue chain (→ /generate-tests → /documentacion)
   └── NO → Fix code → Recapture (max 3 iterations)
              └── If 3 fail → Escalate to user with screenshots
```

## Execution

### Step 1: Detect affected route

Determine the URL to capture based on the modified component:

```
Modified View/Page              → Corresponding URL
├── notes.page.ts              → http://localhost:4200/notes
├── note-detail.page.ts        → http://localhost:4200/notes/1
├── presentation.container.ts  → http://localhost:4200
└── Modal/Dialog               → Navigate + open modal first
```

### Step 2: Capture screenshot

```bash
npx playwright screenshot http://localhost:4200/{route} \
  --output .qa-reports/visual-checks/$(date +%Y-%m-%d)-{component}.png
```

### Step 3: Analyze

Read the screenshot and evaluate:

- Is the layout aligned correctly?
- Are texts readable and not cut off?
- Do colors and spacing look intentional?
- Are there broken, overlapping, or invisible elements?
- Are ITCSS prefixes respected (.o-, .c-, .u-)?

### Step 4: Auto-correct if needed

```
Iteration 1: Identify problem → Fix CSS/template → Recapture
Iteration 2: If it persists → Adjust approach → Recapture
Iteration 3: If it persists → STOP — Escalate to user
```

When escalating, show:
```
"I could not resolve the visual problem after 3 attempts.
Current screenshot: .qa-reports/visual-checks/{file}.png
Detected problem: {description}
How would you prefer I resolve it?"
```

## Storage

```
.qa-reports/
└── visual-checks/
    ├── {YYYY-MM-DD}-{component}.png
    ├── {YYYY-MM-DD}-{component}-fix1.png  (if there was a correction)
    └── {YYYY-MM-DD}-{component}-fix2.png  (if there was a second)
```

Only screenshots are saved — no formal report is generated (that is the responsibility of `/playwright-cli` when the user invokes it manually).

## Difference from playwright-cli

| Aspect | playwright-visual (this) | playwright-cli |
|---|---|---|
| Activation | Automatic (post-visual change) | Manual (`/playwright-cli`) |
| Scope | One screenshot of the affected route | Complete 6-phase QA |
| Output | Only screenshot in `visual-checks/` | Report + screenshots + snapshots |
| Interaction | No (only capture and validate) | Yes (click, fill, navigate) |
| Purpose | Quick sanity check | Exhaustive testing |

## Integration in the Automatic Chain

This skill is the **first link** in the visual chain:

```
Visual code → [playwright-visual] → /generate-tests → /documentacion
```

If visual validation passes, it automatically invokes the next skill in the chain. If it fails and escalates to the user, the chain pauses until resolution.

## Rules

- NEVER skip validation if there were visual changes and `ng serve` is running
- NEVER do more than 3 correction iterations — escalate to user
- ALWAYS save screenshots in `.qa-reports/visual-checks/`
- ALWAYS inform the user if something was auto-corrected (brief, 1 line)
- ALWAYS continue the automatic chain after successful validation
- DO NOT generate formal reports — that is the job of `/playwright-cli`
