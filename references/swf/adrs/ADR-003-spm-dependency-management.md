# ADR-003: Swift Package Manager for All Dependencies

## Status
Accepted

## Date
2025-01-15

## Context
The project needs a consistent, reliable mechanism for managing both internal modules and third-party libraries. Historically, iOS projects used CocoaPods or Carthage, but these tools introduce additional build complexity, require separate installation, and are not integrated into the Swift toolchain. The team requires a dependency management solution that supports local packages for internal modules, version pinning for external libraries, and seamless Xcode integration.

## Decision
We adopt **Swift Package Manager (SPM)** as the sole dependency management tool. No CocoaPods or Carthage.

### Internal Modules — Local Packages

Internal modules reference each other via relative paths:

```swift
// FeatureHome/Package.swift
dependencies: [
    .package(path: "../Core"),
    .package(path: "../CoreUI"),
]
```

This enables:
- Instant source changes without publishing.
- Breakpoint debugging across module boundaries.
- Unified build graph in Xcode.

### External Dependencies — Version Pinning

All third-party dependencies are declared in the **Dependencias** module with explicit version constraints:

```swift
// Dependencias/Package.swift
dependencies: [
    .package(url: "https://github.com/Alamofire/Alamofire.git", .upToNextMajor(from: "5.9.0")),
    .package(url: "https://github.com/realm/realm-swift.git", exact: "10.49.0"),
    .package(url: "https://github.com/AzureAD/microsoft-authentication-library-for-objc.git", .upToNextMajor(from: "1.3.0")),
    .package(url: "https://github.com/firebase/firebase-ios-sdk.git", .upToNextMajor(from: "10.25.0")),
    .package(url: "https://github.com/auth0/SimpleKeychain.git", .upToNextMajor(from: "1.1.0")),
    .package(url: "https://github.com/krzyzanowskim/CryptoSwift.git", .upToNextMajor(from: "1.8.0")),
    .package(url: "https://github.com/hmlongco/Factory.git", .upToNextMajor(from: "2.3.0")),
]
```

### Dependencias Module as Re-Export Hub

The Dependencias module exposes all third-party products so downstream modules import from a single source:

```swift
// Dependencias/Sources/Dependencias/Dependencias.swift
@_exported import Alamofire
@_exported import RealmSwift
@_exported import MSAL
@_exported import FirebaseAnalytics
@_exported import FirebaseCrashlytics
@_exported import SimpleKeychain
@_exported import CryptoSwift
@_exported import Factory
```

Internal modules depend on Dependencias rather than declaring their own remote dependencies.

### Version Pinning Strategy

| Strategy | Use Case |
|----------|----------|
| `exact: "X.Y.Z"` | Libraries with known binary compatibility issues (e.g., Realm) |
| `.upToNextMajor(from: "X.Y.Z")` | Stable libraries following semantic versioning |
| `.upToNextMinor(from: "X.Y.Z")` | Libraries where minor versions may introduce breaking changes |

The `Package.resolved` file is committed to source control to ensure reproducible builds.

## Consequences

### Positive
- Single dependency management tool — no CocoaPods Gemfile, Podfile, or Carthage Cartfile.
- Local packages enable rapid iteration across module boundaries.
- Xcode natively resolves and builds SPM packages without plugins.
- `Package.resolved` ensures deterministic, reproducible builds across the team.
- Centralized dependency declaration in Dependencias simplifies auditing and updates.

### Negative
- Some older libraries may lack SPM support (increasingly rare).
- SPM resolution can be slow for large dependency graphs on first resolve.
- `@_exported` import is technically an underscored API, though widely used and stable.
- Binary frameworks (.xcframework) require wrapper packages for SPM compatibility.

### Risks
- **Risk**: A critical dependency drops SPM support or introduces incompatible changes. **Mitigation**: Pin versions, maintain a fork if necessary, and evaluate alternatives before upgrading.
- **Risk**: `Package.resolved` merge conflicts during simultaneous dependency updates. **Mitigation**: Designate a single team member per sprint for dependency updates; resolve conflicts by re-running `swift package resolve`.
- **Risk**: Build times increase as the dependency graph grows. **Mitigation**: Use binary targets for stable, infrequently-changed dependencies where available.
