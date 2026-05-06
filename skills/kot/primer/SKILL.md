---
name: kot-primer
description: "Generate introductory documentation for new team members"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Primer — Onboarding for New Members

## Purpose

Generate a document that explains the architecture, conventions, and how to start working on the Android/Kotlin project.

## Primer Contents

```markdown
# 📱 [Project] — Developer Primer

## 1. Welcome

This document will guide you to understand and contribute to the project.

## 2. Architecture

### 2.1 MVVM + Feature Modules
[Mermaid architecture diagram]

### 2.2 Modules
| Module | Purpose | Depends on |
|--------|---------|------------|
| app | Entry point, Navigation | All |
| core | Entities, Result type | - |
| domain | UseCases, Interfaces | core |
| data | Repositories, DAOs | core, domain |
| feature-* | UI + ViewModels | core, domain, core-ui |

### 2.3 Data Flow
User → Screen → ViewModel → UseCase → Repository → DataSource

## 3. Technology Stack

- **Kotlin** 2.0+ — Main language
- **Jetpack Compose** — Declarative UI
- **Dagger Hilt** — Dependency injection
- **Room + SQLCipher** — Encrypted local database
- **StateFlow** — UI state
- **Coroutines** — Asynchrony
- **MockK + Turbine** — Testing

## 4. Code Conventions

### Naming
- Code in Spanish (classes, variables, functions)
- Folders and suffixes in English
- ViewModels: `{Feature}ViewModel`
- Screens: `{Feature}Screen`
- UseCases: `{Action}{Entity}UseCase`

### Patterns
- Result type for operations that can fail
- State hoisting in Compose
- One ViewModel per Screen

## 5. How to Add a Feature

1. Create module `feature-{name}`
2. Create ViewModel with StateFlow
3. Create Screen with Composables
4. Connect in AppNavGraph
5. Write tests

## 6. How to Run

```bash
# Build
./gradlew assembleDebug

# Tests
./gradlew test

# Lint
./gradlew lint
```

## 7. Important ADRs

The following ADRs are MANDATORY to read:
- ADR-001: MVVM Architecture
- ADR-009: Dagger Hilt DI
- ADR-011: MockK + Turbine Testing
- ADR-013: Result Type Pattern

## 8. Resources

- [Policies](.cloud/policies/)
- [Architecture](.cloud/architecture/current.md)
- [CHANGELOG](CHANGELOG.md)
```

## Output

Save to `docs/PRIMER.md`
