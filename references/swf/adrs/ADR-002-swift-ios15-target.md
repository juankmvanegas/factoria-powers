# ADR-002: Swift 5.10+ with iOS 15 Minimum Deployment Target

## Status
Accepted

## Date
2025-01-15

## Context
The team must decide on the minimum Swift language version and iOS deployment target. This decision affects which system APIs, SwiftUI features, and concurrency primitives are available. A higher minimum target provides access to newer APIs but excludes users on older devices. The project needs sufficient SwiftUI maturity for production-quality interfaces, Combine support for reactive data flows, and Swift concurrency (async/await) for modern asynchronous programming.

## Decision
We adopt **Swift 5.10+** as the minimum language version and **iOS 15** as the minimum deployment target.

### Swift 5.10+ Rationale
- Complete Swift concurrency model with strict concurrency checking.
- Full `Sendable` conformance enforcement for thread safety.
- Mature actor isolation model.
- Compatible with Xcode 15.3+ toolchains.

### iOS 15 Rationale
- **SwiftUI maturity**: `@StateObject`, `@FocusState`, `task {}` modifier, `AsyncImage`, `searchable()`, `refreshable()`, `swipeActions()`, and material backgrounds are all available.
- **Combine**: Full Combine framework support for reactive pipelines and ViewModel bindings.
- **Async/Await**: Native `async`/`await`, `AsyncSequence`, `TaskGroup`, structured concurrency.
- **System APIs**: `URLSession.data(for:)` async variant, `AttributedString`, improved `List` performance.
- **Market coverage**: iOS 15+ covers over 95% of active devices as of 2025.

### Package.swift Declaration

Every SPM module declares the platform requirement:

```swift
// Package.swift
let package = Package(
    name: "Core",
    platforms: [
        .iOS(.v15)
    ],
    // ...
)
```

### Availability Annotations

For APIs requiring iOS 16+ or iOS 17+ (e.g., `NavigationStack`, `Observable` macro), use `@available` annotations with fallback implementations:

```swift
@available(iOS 16.0, *)
struct ModernNavigationView: View { /* NavigationStack */ }

struct LegacyNavigationView: View { /* NavigationView */ }
```

## Consequences

### Positive
- Access to a mature SwiftUI API surface that covers the vast majority of UI requirements.
- Native async/await eliminates callback-based asynchronous code.
- Combine provides a unified reactive programming model.
- Broad device coverage ensures the app reaches nearly all active users.
- Swift 5.10 strict concurrency checking catches data races at compile time.

### Negative
- Cannot use SwiftUI navigation APIs introduced in iOS 16 (`NavigationStack`, `NavigationSplitView`) without availability checks and fallbacks.
- The `@Observable` macro (iOS 17) is unavailable; must use `@ObservableObject` protocol.
- `SwiftData` (iOS 17) is unavailable; Realm is used instead.
- Some visual effects and widgets require iOS 16+ availability wrappers.

### Risks
- **Risk**: iOS 15 market share drops below a meaningful threshold, making fallback code unnecessary maintenance. **Mitigation**: Review deployment target annually and raise when iOS 15 share falls below 5%.
- **Risk**: Overuse of `@available` annotations creates fragmented codepaths. **Mitigation**: Limit availability-gated code to CoreUI; feature modules use only iOS 15 APIs unless explicitly approved.
- **Risk**: Third-party dependencies raise their minimum target above iOS 15. **Mitigation**: Pin dependency versions and evaluate upgrade impact before adopting.
