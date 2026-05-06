---
name: swf-primer
description: "Load project context — CLAUDE.md, modules, dependencies, ADRs — for agent reference"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Primer

## Purpose

Load and summarize project context so the agent has full awareness of the codebase. Reads CLAUDE.md, lists all SPM modules, maps inter-module dependencies, reads active ADRs and policies, and produces a compact reference summary.

## Execution Flow — 5 Strict Steps

### Step 1: Read Project Configuration

1. Read `CLAUDE.md` in the project root
2. Extract: Identity, Golden Path stack, Golden Rules, Code Conventions
3. Read `.cloud/policies/*.md` for active policies
4. Read `.cloud/architecture/current.md` for architecture overview

### Step 2: Map SPM Modules

1. List all `Package.swift` files in the project
2. For each module, extract:
   - Module name
   - Dependencies (other modules and third-party)
   - Products (library, executable)
   - Target platform and version
3. Build dependency graph

### Step 3: Read Active ADRs

1. List all files in `.cloud/architecture/decisions/`
2. For each ADR, extract:
   - Number and title
   - Status (Accepted, Proposed, Deprecated)
   - Key decision summary (first paragraph of Decision section)
3. Flag deprecated or superseded ADRs

### Step 4: Inventory Key Components

1. Count ViewModels, Views, Coordinators, Api implementations
2. List Factory DI registrations in Container extensions
3. Map Coordinator navigation flows
4. Identify shared utilities and extensions

### Step 5: Generate Compact Summary

Output format:

```markdown
# Project Context — [Project Name]

## Stack
Swift 5.10+ | SwiftUI | MVVM | SPM | Factory DI | Alamofire | Realm | MSAL | Firebase | Coordinator

## Modules ([N] total)
| Module | Type | Dependencies | Components |
|--------|------|-------------|------------|
| Core | Shared | — | Models, Protocols, Extensions |
| CoreUI | Shared | Core | Atomos, Moleculas, Organismos |
| Dependencias | Shared | All feature modules | DI Container |
| DatosAuth | Data | Core, Alamofire, MSAL | AuthApi |
| PresentacionAuth | Presentation | Core, CoreUI, Dependencias | AuthVM, LoginView, AuthCoord |

## Active ADRs ([N] total)
- ADR-001: [Title] (Accepted)
- ADR-002: [Title] (Accepted)
...

## Policies
- Security: [Key points]
- Testing: [Key thresholds]
- Coding Standards: [Key conventions]

## Architecture Patterns
- Navigation: Coordinator (CoordinadorProtocol + NavegacionBase)
- DI: Factory (@Injected, @DynamicInjected, Container.shared)
- Async: Combine (@Published, AnyPublisher, AnyCancellable)
- UI: Atomic Design (CoreUI: Atomos/Moleculas/Organismos)
```

## Auto-Shielding

- **WARN** if `CLAUDE.md` is missing — project may not be configured for Factoria
- **WARN** if no ADRs found — architecture decisions not documented
- **WARN** if no policies found — quality standards not defined

## Rules

1. Read-only operation — never modify any files
2. Summary must fit in a single context window (< 2000 tokens)
3. Include module counts and component counts
4. Flag any inconsistencies found (e.g., unused DI registrations, orphan modules)
5. Cache the summary for the session — avoid re-reading unless files change
6. Include the dependency graph in text form for quick reference
