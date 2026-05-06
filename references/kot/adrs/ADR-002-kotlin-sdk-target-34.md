# ADR-002: Kotlin SDK Target 34+

## Status
Accepted

## Date
2024-04-18 (Factoria-Kot v1.0.0)

## Context
Android platform evolves continuously with new APIs, security requirements, and Play Store policies. We need to standardize on a minimum SDK version that balances reach with modern capabilities.

## Decision
Target Android SDK 34 (Android 14) or higher for all new projects:

### SDK Configuration

```kotlin
android {
    compileSdk = 34
    
    defaultConfig {
        minSdk = 26      // Android 8.0 (Oreo)
        targetSdk = 34   // Android 14
    }
}
```

### Kotlin Version

```kotlin
kotlin {
    jvmToolchain(17)
}

// Kotlin version
kotlin = "2.0.0"
```

### Rationale

- **minSdk 26**: Covers 95%+ of active devices, enables modern APIs (BiometricPrompt, WorkManager, etc.)
- **targetSdk 34**: Required for Play Store compliance, security patches, new features
- **Kotlin 2.0**: K2 compiler, improved performance, better null safety

## Consequences

- Must handle runtime permissions properly
- Must comply with Android 14 behavior changes
- Background execution restrictions apply
- Scoped storage is mandatory
- Foreground service type declaration required
- All dependencies must be K2 compatible
