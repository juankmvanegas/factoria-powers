---
name: kot-new-project
description: "Scaffolds a new Android/Kotlin project"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# New Project — Create New Project

## Purpose

Create the complete structure of an Android/Kotlin project following the MVVM + Feature Modules architecture defined in Factoria.

## Structure to Generate

```
[ProjectName]/
├── app/
│   ├── src/main/
│   │   ├── java/com/santander/[app]/
│   │   │   ├── MainActivity.kt
│   │   │   ├── MainApplication.kt
│   │   │   └── navigation/
│   │   │       └── AppNavGraph.kt
│   │   └── AndroidManifest.xml
│   └── build.gradle.kts
│
├── core/
│   ├── src/main/java/com/santander/[app]/core/
│   │   ├── entities/
│   │   ├── extensions/
│   │   ├── constants/
│   │   └── result/
│   │       └── Resultado.kt
│   └── build.gradle.kts
│
├── core-ui/
│   ├── src/main/java/com/santander/[app]/coreui/
│   │   ├── components/
│   │   └── theme/
│   └── build.gradle.kts
│
├── domain/
│   ├── src/main/java/com/santander/[app]/domain/
│   │   ├── usecases/
│   │   └── repositories/
│   └── build.gradle.kts
│
├── data/
│   ├── src/main/java/com/santander/[app]/data/
│   │   ├── repositories/
│   │   ├── local/
│   │   │   ├── database/
│   │   │   └── datastore/
│   │   └── mappers/
│   └── build.gradle.kts
│
├── network/
│   ├── src/main/java/com/santander/[app]/network/
│   │   ├── api/
│   │   ├── dto/
│   │   └── interceptors/
│   └── build.gradle.kts
│
├── feature-home/  (example)
│   ├── src/main/java/com/santander/[app]/feature/home/
│   │   ├── HomeViewModel.kt
│   │   └── HomeScreen.kt
│   └── build.gradle.kts
│
├── gradle/
│   └── libs.versions.toml
│
├── build.gradle.kts
├── settings.gradle.kts
├── CHANGELOG.md
├── README.md
└── .cloud/
    ├── architecture/
    │   ├── current.md
    │   └── decisions/
    ├── policies/
    └── planning/
```

## Key Files

### libs.versions.toml
Configure version catalog with all dependencies:
- Kotlin, Compose, Hilt, Room, Navigation
- Testing: JUnit, MockK, Turbine
- Firebase, MSAL, etc.

### settings.gradle.kts
Include all modules with aliases.

### build.gradle.kts (root)
Plugins and common configuration.

## Post-Creation

1. Initialize git: `git init`
2. Create appropriate `.gitignore`
3. Generate initial `CHANGELOG.md`
4. Create first commit: "chore: initial project setup"
