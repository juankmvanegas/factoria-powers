---
name: swf-new-project
description: "Create a new iOS project from scratch with full architecture scaffolding"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: New Project

## Purpose

Create a new iOS/Swift project from scratch. Interviews the user for project details, then scaffolds the complete Xcode project with SPM modules, Factory DI, Firebase setup, MSAL configuration, SwiftLint, and the full MVVM + Coordinator architecture.

## Execution Flow — 10 Strict Steps

### Step 1: Interview User

Collect the following (skip if already provided):

1. **Project name** — Display name for the app
2. **Bundle ID** — e.g., `com.company.appname`
3. **Team** — Development team name
4. **Organization** — Organization identifier
5. **Minimum iOS version** — Default: iOS 15.0
6. **Modules needed** — List of feature modules
7. **Firebase needed** — Yes/No (Analytics, Crashlytics, Remote Config)
8. **Azure B2C needed** — Yes/No (MSAL authentication)
9. **Realm needed** — Yes/No (local database)

### Step 2: Create Xcode Project Structure

```
ProjectName/
├── ProjectName.xcodeproj/
├── ProjectName/
│   ├── App/
│   │   ├── ProjectNameApp.swift          # @main entry point
│   │   ├── AppDelegate.swift             # Firebase init, MSAL config
│   │   └── Info.plist
│   ├── Resources/
│   │   ├── Assets.xcassets/
│   │   ├── GoogleService-Info.plist      # If Firebase
│   │   └── Localizable.strings
│   └── Configuration/
│       ├── Debug.xcconfig
│       ├── Release.xcconfig
│       └── Shared.xcconfig
├── Packages/
│   ├── Core/                             # SPM: models, protocols, extensions
│   ├── CoreUI/                           # SPM: Atomic Design components
│   │   ├── Atomos/
│   │   ├── Moleculas/
│   │   └── Organismos/
│   ├── Dependencias/                     # SPM: Factory DI registrations
│   ├── Datos[Feature]/                   # SPM: API, persistence per feature
│   └── Presentacion[Feature]/            # SPM: ViewModels, Views, Coordinators
├── ProjectNameTests/
├── ProjectNameUITests/
├── .swiftlint.yml
└── .cloud/
    ├── policies/
    ├── architecture/
    │   ├── current.md
    │   └── decisions/
    └── migration/
```

### Step 3: Create SPM Package.swift for Each Module

```swift
// swift-tools-version: 5.10
import PackageDescription

let package = Package(
    name: "Core",
    platforms: [.iOS(.v15)],
    products: [
        .library(name: "Core", targets: ["Core"]),
    ],
    targets: [
        .target(name: "Core"),
        .testTarget(name: "CoreTests", dependencies: ["Core"]),
    ]
)
```

### Step 4: Configure Factory DI (Dependencias Module)

```swift
import Factory

extension Container {
    // APIs
    var authApi: Factory<AuthApiProtocol> {
        self { AuthApiImplementacion() }
    }
    // Coordinators
    var appCoordinador: Factory<AppCoordinadorProtocol> {
        self { AppCoordinador() }
    }
}
```

### Step 5: Configure Alamofire Networking

1. Create `EnrutadorApi` base with URL routing
2. Create `AutorizacionInterceptor` for token injection
3. Configure `ServerTrustManager` for SSL pinning
4. Set up error mapping middleware

### Step 6: Configure Firebase (if needed)

1. Add `GoogleService-Info.plist` placeholder
2. Configure `FirebaseApp.configure()` in AppDelegate
3. Set up Crashlytics dSYM upload in build phases
4. Configure Analytics tracking helpers
5. Set up Remote Config defaults

### Step 7: Configure MSAL (if needed)

1. Add MSAL configuration JSON
2. Configure B2C policies (SignIn, SignUp, PasswordReset)
3. Set up URL schemes for auth redirect
4. Create `AuthManager` wrapper for MSAL
5. Configure `ValidadorBiometrico` for FaceID/TouchID

### Step 8: Configure SwiftLint

```yaml
# .swiftlint.yml
opt_in_rules:
  - force_unwrapping
  - empty_count
  - closure_end_indentation
disabled_rules:
  - todo
excluded:
  - Packages/*/Tests
  - .build
line_length:
  warning: 120
  error: 150
```

### Step 9: Create Initial Coordinator

```swift
final class AppCoordinador: CoordinadorProtocol {
    private let navegacion: NavegacionBase

    func iniciar() {
        // Check auth state
        // Navigate to login or home
    }
}
```

### Step 10: Generate Documentation

1. Create `CLAUDE.md` for the project
2. Create initial ADR-001 for architecture decisions
3. Create `.cloud/architecture/current.md` with initial diagram
4. Generate README.md with setup instructions

## Auto-Shielding

- **ABORT** if project name contains spaces or special characters
- **ABORT** if bundle ID format is invalid
- **WARN** if iOS target below 15.0 — some patterns require iOS 15+
- **WARN** if no modules specified — create at least one feature module

## Rules

1. All SPM modules must compile independently
2. Factory DI configured from the start — no manual init chains
3. Coordinator pattern from day one — no direct NavigationLink navigation
4. SwiftLint configured and passing with zero violations
5. Folder structure follows Atomic Design for CoreUI
6. Every module has a corresponding test target
7. Configuration files (.xcconfig) for environment separation
8. Never hardcode API URLs — use configuration files
9. Include `.gitignore` for Xcode/SPM artifacts
