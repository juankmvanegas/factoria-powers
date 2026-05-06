# ADR-007: Observability Through Firebase

## Status
Accepted

## Date
2025-01-15

## Context
Production mobile applications require comprehensive observability to diagnose crashes, understand user behavior, and control feature rollouts at runtime. Without structured observability, the team operates blind — unable to detect regressions, measure feature adoption, or triage production issues. The observability stack must cover three pillars: crash reporting (stability), analytics (behavior), and runtime configuration (control). Given the Firebase adoption decision (ADR-006), the observability strategy leverages Firebase's integrated services for a unified approach.

## Decision
We implement observability through three Firebase services, centralized via shared abstractions in the Core module.

### Pillar 1: Crash Reporting — Firebase Crashlytics

Crashlytics captures unhandled exceptions, non-fatal errors, and breadcrumbs:

```swift
// Core/Sources/Observability/CrashReporter.swift
import FirebaseCrashlytics

public final class CrashReporter {
    public static let shared = CrashReporter()
    
    /// Log a non-fatal error with context
    public func recordError(_ error: Error, context: [String: Any] = [:]) {
        let nsError = error as NSError
        Crashlytics.crashlytics().record(error: nsError, userInfo: context)
    }
    
    /// Add a breadcrumb for crash context
    public func log(_ message: String) {
        Crashlytics.crashlytics().log(message)
    }
    
    /// Set user identifier for crash correlation (non-PII)
    public func setUserID(_ id: String) {
        Crashlytics.crashlytics().setUserID(id)
    }
    
    /// Set custom key-value pairs for crash reports
    public func setCustomValue(_ value: Any, forKey key: String) {
        Crashlytics.crashlytics().setCustomValue(value, forKey: key)
    }
}
```

### Pillar 2: User Behavior — Firebase Analytics

Analytics tracks user actions through structured events via `FirebaseAnalyticsLogger` (see ADR-006):

```swift
// Structured event naming convention
public enum AnalyticsEvent {
    // Screen views
    static let screenView = "screen_view"
    
    // User actions: {domain}_{action}
    static let profileUpdated = "profile_updated"
    static let documentDownloaded = "document_downloaded"
    static let searchPerformed = "search_performed"
    
    // Feature engagement: feature_{name}_{action}
    static let featureOnboardingCompleted = "feature_onboarding_completed"
    static let featurePaymentInitiated = "feature_payment_initiated"
}
```

**Event Naming Rules:**
- Lowercase with underscores: `user_logged_in`, not `UserLoggedIn`.
- Domain prefix for feature-specific events: `profile_updated`, `settings_changed`.
- Maximum 40 characters per event name (Firebase limit).
- Maximum 25 custom parameters per event.
- **No PII**: Never log email, phone, name, address, or any personally identifiable information.

### Pillar 3: Runtime Control — Firebase Remote Config

Remote Config provides runtime toggles without app updates:

```swift
// Core/Sources/Observability/RuntimeToggle.swift
public enum RuntimeToggle: String, CaseIterable {
    case newHomeScreenEnabled = "new_home_screen_enabled"
    case maintenanceMode = "maintenance_mode"
    case maxUploadSizeMB = "max_upload_size_mb"
    case minimumAppVersion = "minimum_app_version"
    case apiTimeoutSeconds = "api_timeout_seconds"
    
    public var boolValue: Bool {
        FeatureFlagProvider.shared.isFeatureEnabled(rawValue)
    }
    
    public var stringValue: String {
        FeatureFlagProvider.shared.stringValue(forKey: rawValue)
    }
}
```

### Integration: Crash + Analytics Correlation

When a crash occurs, Crashlytics includes the last analytics events as breadcrumbs. To enhance this:

```swift
// In every ViewModel or Coordinator action
CrashReporter.shared.log("User tapped submit on ProfileEditView")
FirebaseAnalyticsLogger.shared.logEvent("profile_edit_submitted", parameters: [
    "fields_changed": changedFields.count
])
```

### PII Protection Policy

| Data Type | Allowed in Analytics | Allowed in Crashlytics |
|-----------|---------------------|----------------------|
| User ID (opaque UUID) | Yes | Yes |
| Screen name | Yes | Yes (as breadcrumb) |
| Feature flag state | Yes | Yes (as custom key) |
| Error codes | Yes | Yes |
| Email / Phone / Name | **NO** | **NO** |
| IP address | **NO** | **NO** |
| Device IDFA | Only with ATT consent | **NO** |

## Consequences

### Positive
- Unified observability through a single vendor reduces operational overhead.
- Crashlytics + Analytics correlation enables rapid triage (identify which user segment is affected).
- Remote Config enables kill switches, gradual rollouts, and A/B testing without deployments.
- Structured event naming ensures consistent, queryable analytics data.
- Strict PII policy ensures compliance with privacy regulations.

### Negative
- Firebase Analytics has inherent data processing delay (~1 hour for standard events).
- Crashlytics dSYM upload must be configured in CI for symbolicated crash reports.
- Remote Config fetch failures fall back to defaults, which may not reflect the latest configuration.
- Three separate Firebase consoles (per environment) must be monitored.

### Risks
- **Risk**: Developers log PII in analytics or crash reports. **Mitigation**: Code review checklist includes PII verification. Lint rules scan for known PII patterns in logging calls. QA periodically audits Firebase logs for PII.
- **Risk**: Remote Config is misconfigured (e.g., maintenance mode enabled in production accidentally). **Mitigation**: Remote Config changes require two-person approval. Default values in the plist are always safe.
- **Risk**: Crashlytics dSYM upload fails, leaving crash reports unsymbolicated. **Mitigation**: CI pipeline validates dSYM upload step; alerts on failure.
