# ADR-006: Firebase Services Suite

## Status
Accepted

## Date
2025-01-15

## Context
The application requires a comprehensive set of backend services for analytics, crash reporting, feature flags, remote configuration, and optional server-side capabilities. Implementing these individually with different providers increases integration complexity, vendor management overhead, and inconsistent data correlation. Firebase offers a unified suite of services with a single SDK, shared project context, and built-in cross-service data linking (e.g., crash-free users by analytics segment).

## Decision
We adopt the **Firebase iOS SDK** as the primary suite for analytics, crash reporting, remote configuration, and optional backend services. The following Firebase products are integrated:

### Firebase Products

| Product | Purpose | Module |
|---------|---------|--------|
| **Firebase Analytics** | User behavior tracking, event logging, audience segmentation | Core |
| **Firebase Crashlytics** | Crash reporting, non-fatal error logging, breadcrumbs | Core |
| **Firebase Remote Config** | Feature flags, dynamic configuration, A/B testing | Core |
| **Firebase Auth** | Anonymous auth for pre-login analytics correlation (optional) | Core |
| **Firebase Firestore** | Lightweight server-side data when REST API is insufficient (optional) | Feature-specific |

### Centralized Analytics Interface

All analytics operations go through a centralized `FirebaseAnalyticsLogger`:

```swift
// Core/Sources/Analytics/FirebaseAnalyticsLogger.swift
import FirebaseAnalytics

public final class FirebaseAnalyticsLogger: AnalyticsLogging {
    public static let shared = FirebaseAnalyticsLogger()
    
    public func logEvent(_ name: String, parameters: [String: Any]? = nil) {
        Analytics.logEvent(name, parameters: parameters)
    }
    
    public func setUserProperty(_ value: String?, forName name: String) {
        Analytics.setUserProperty(value, forName: name)
    }
    
    public func setUserID(_ userID: String?) {
        Analytics.setUserID(userID)
    }
    
    public func setDefaultEventParameters(_ parameters: [String: Any]?) {
        Analytics.setDefaultEventParameters(parameters)
    }
}
```

Feature modules never import `FirebaseAnalytics` directly — they use the `AnalyticsLogging` protocol from Core.

### Remote Config for Feature Flags

```swift
// Core/Sources/RemoteConfig/FeatureFlagProvider.swift
import FirebaseRemoteConfig

public final class FeatureFlagProvider {
    private let remoteConfig = RemoteConfig.remoteConfig()
    
    public func configure() {
        let settings = RemoteConfigSettings()
        settings.minimumFetchInterval = 3600 // 1 hour in production
        remoteConfig.configSettings = settings
        remoteConfig.setDefaults(fromPlist: "RemoteConfigDefaults")
    }
    
    public func fetchAndActivate() async throws {
        let status = try await remoteConfig.fetchAndActivate()
        // Handle status
    }
    
    public func isFeatureEnabled(_ key: String) -> Bool {
        remoteConfig.configValue(forKey: key).boolValue
    }
    
    public func stringValue(forKey key: String) -> String {
        remoteConfig.configValue(forKey: key).stringValue ?? ""
    }
}
```

### Firebase Initialization

Firebase is configured in the app delegate or `@main` entry point:

```swift
import FirebaseCore

@main
struct MyApp: App {
    init() {
        FirebaseApp.configure() // Uses GoogleService-Info.plist for current config
    }
}
```

### Environment Isolation

Each build configuration (Debug, QA, Release) uses its own Firebase project via separate `GoogleService-Info.plist` files (see ADR-004). This ensures analytics, crash reports, and remote config values are isolated per environment.

## Consequences

### Positive
- Unified SDK reduces integration complexity — one initialization, one project dashboard.
- Cross-service data correlation: crash-free user rates linked to analytics segments.
- Remote Config enables runtime feature toggling without app updates.
- Crashlytics provides real-time crash reporting with stack traces and breadcrumbs.
- Firebase Analytics is free and unlimited for standard event logging.
- Environment-isolated Firebase projects prevent test data pollution.

### Negative
- Firebase SDK adds significant binary size (~15-20 MB for the full suite).
- Firebase Analytics has a ~1 hour delay for event processing in the console.
- Remote Config fetch has network latency; stale values are served until activation.
- Firebase Auth adds complexity if only used for anonymous correlation.
- Vendor lock-in to Google's Firebase ecosystem.

### Risks
- **Risk**: Firebase SDK update introduces breaking changes or deprecations. **Mitigation**: Pin to `.upToNextMajor` in SPM; test SDK updates in QA before promoting to Release.
- **Risk**: Firebase Analytics data collection raises GDPR/privacy concerns. **Mitigation**: Implement consent management; disable analytics collection until user consents. Use `Analytics.setAnalyticsCollectionEnabled(false)` by default.
- **Risk**: Remote Config defaults are stale or misconfigured. **Mitigation**: Ship a `RemoteConfigDefaults.plist` with safe defaults; the app functions correctly even if Remote Config fetch fails.
