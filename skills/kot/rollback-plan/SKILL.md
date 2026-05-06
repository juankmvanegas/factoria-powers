---
name: kot-rollback-plan
description: "Generate rollback plan for significant changes"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Rollback Plan — Reversion Plan

## Purpose

Create documentation on how to revert changes if something goes wrong in production.

## When to Generate

- Before production releases
- After significant features
- After database migrations
- After authentication changes

## Plan Contents

```markdown
# Rollback Plan — [Feature/Release]

## Metadata
- **Feature:** [Name]
- **Version:** [X.Y.Z]
- **Date:** YYYY-MM-DD
- **Author:** [Name]

## 1. Change Summary
[What was changed and why]

## 2. Affected Components
- [ ] App module
- [ ] Feature-X module
- [ ] Database (Room entities)
- [ ] API integrations
- [ ] Firebase config
- [ ] Azure B2C config

## 3. Rollback Procedure

### 3.1 Code
```bash
# Revert to previous version
git revert [commit-hash]
# or
git checkout [previous-tag] -- [files]

# Build and deploy
./gradlew assembleRelease
```

### 3.2 Database (if applicable)
```kotlin
// Room migration DOWN is not natively supported
// Strategy:
// 1. Delete local data (DESTRUCTIVE)
// 2. Or create forward migration that reverts changes
```

### 3.3 Firebase Remote Config (if applicable)
- Revert values in Firebase Console
- Force fetch in app

### 3.4 Play Store
- Halt staged rollout
- Or upload previous version as hotfix

## 4. Points of No Return ⚠️
[List of changes that CANNOT be easily reverted]
- Migration X that deletes columns
- Schema change that loses data

## 5. User Impact
- During rollback: [expected impact]
- After rollback: [final state]

## 6. Communication
- [ ] Notify stakeholders
- [ ] Update status page (if exists)
- [ ] Document in incident report

## 7. Post-Rollback Verification
- [ ] App works on previous version
- [ ] Data was not lost (or was lost expectedly)
- [ ] Metrics return to normal
- [ ] No new crashes in Crashlytics
```

## Output

Save to `.cloud/planning/rollback-{feature-name}.md`
