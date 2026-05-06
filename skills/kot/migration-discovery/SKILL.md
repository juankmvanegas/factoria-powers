---
name: kot-migration-discovery
description: "Discovery phase for legacy project migration"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Migration Discovery — Legacy Project Analysis

## Purpose

Analyze a legacy Android project to understand its structure, dependencies, patterns, and risk areas before migrating to the modern architecture.

## Analysis to Perform

### 1. Current Architecture
- MVC, MVP, MVVM, or other?
- Are layers defined?
- How do dependencies flow?

### 2. UI Framework
- Pure XML Views?
- Data Binding?
- View Binding?
- Partial Compose?
- Hybrid?

### 3. State Management
- LiveData?
- RxJava?
- Flow?
- Manual state?

### 4. Dependency Injection
- Dagger 2?
- Hilt?
- Koin?
- Manual?
- No DI?

### 5. Database
- Room?
- Raw SQLite?
- Realm?
- Other?

### 6. Networking
- Retrofit?
- Volley?
- Direct OkHttp?
- Ktor?

### 7. Threading
- Coroutines?
- RxJava?
- AsyncTask?
- ExecutorService?

### 8. Existing Tests
- Unit tests?
- Integration tests?
- UI tests?
- Current coverage?

### 9. Build System
- Gradle version
- AGP version
- Kotlin version
- minSdk/targetSdk

## Output

Save to `.cloud/planning/discovery-report.md`:

```markdown
# Discovery Report — [Legacy Project]
## Date: YYYY-MM-DD

## 1. Executive Summary
[Findings overview]

## 2. Current Architecture
[Describe architecture found]

## 3. Technology Stack
| Area | Current | Target |
|------|---------|--------|
| UI | XML + Data Binding | Jetpack Compose |
| State | LiveData | StateFlow |
| DI | Dagger 2 | Hilt |
| ...

## 4. Identified Risks
- [Risk 1]: [Impact] — [Mitigation]
- [Risk 2]: ...

## 5. Dependencies to Migrate/Remove
[Library list]

## 6. Effort Estimation
[Modules × complexity]

## 7. Recommendations
[Suggested strategy]
```

## Next Step

After discovery is approved → `/migration-plan`
