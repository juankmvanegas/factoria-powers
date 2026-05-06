---
name: kot-dashboard
description: "Progress dashboard for migrations and projects"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Dashboard — Migration and Project Progress

## Purpose

Generate a visual summary of project status: completed modules, passing tests, coverage, pending work.

## Data Sources

1. **Migration Plan** — `.cloud/planning/migration-plan.md`
2. **Audit Trail** — `.cloud/audit/audit-trail.md`
3. **Test Results** — Output from `./gradlew test`
4. **Coverage Report** — Output from Kover/Jacoco
5. **Lint Report** — Output from `./gradlew lint`

## Dashboard Format

```markdown
# 📊 Dashboard — [Project Name] — [Date]

## 🎯 Overall Progress

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Completed modules | 3/10 | 10 | 🟡 30% |
| Passing tests | 145/150 | 150 | 🟡 97% |
| Coverage | 72% | 80% | 🟡 |
| Lint issues | 12 | 0 | 🟠 |

## 📦 Modules

| Module | Discovery | Plan | Implementation | Tests | Status |
|--------|-----------|------|----------------|-------|--------|
| feature-login | ✅ | ✅ | ✅ | ✅ | ✅ Completed |
| feature-home | ✅ | ✅ | 🔄 80% | ⏳ | 🔄 In progress |
| feature-profile | ✅ | ⏳ | ⏳ | ⏳ | 📋 Planned |

## 🔥 Blockers

- [ ] Pending Room migration for feature-settings
- [ ] Missing ProGuard rules for new library

## 📈 Trend (last 7 days)

- Tests: +25 new
- Coverage: +5%
- Modules: +1 completed

## 🔮 Next Steps

1. Complete feature-home implementation
2. Start plan for feature-profile
3. Resolve Room migration blocker
```

## Update

The dashboard is regenerated:
- Manually with `/dashboard`
- Automatically after each completed module
- Automatically at the end of each sprint

## Output File

Save in `.cloud/dashboard.md` (always overwrite with latest version)
