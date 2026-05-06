# ADR-004: Multiple Build Configurations (Debug, QA, Release)

## Status
Accepted

## Date
2025-01-15

## Context
The application must operate across multiple environments — development, QA/staging, and production — each with distinct API endpoints, authentication tenants (Azure B2C), Firebase projects, feature flag defaults, and logging levels. Without a structured build configuration strategy, developers risk shipping debug settings to production, hardcoding environment-specific values, or maintaining error-prone manual switching processes.

## Decision
We adopt **three build configurations** — Debug, QA, and Release — managed through Xcode schemes, `xcconfig` files, and per-environment resource bundles.

### Build Configurations

| Configuration | Purpose | Optimizations | Logging | Analytics |
|---------------|---------|---------------|---------|-----------|
| **Debug** | Local development | None (`-Onone`) | Verbose | Disabled |
| **QA** | Testing / Staging | None (`-Onone`) | Info | Enabled (QA project) |
| **Release** | Production | Full (`-O`) | Error only | Enabled (Prod project) |

### Xcode Schemes

- **App-Debug**: Uses Debug configuration. Points to development API.
- **App-QA**: Uses QA configuration. Points to staging API.
- **App-Release**: Uses Release configuration. Points to production API.

### xcconfig Files

Environment-specific values are defined in `.xcconfig` files:

```
// Config/Debug.xcconfig
API_BASE_URL = https:$(SLASH)$(SLASH)api-dev.example.com
B2C_TENANT = dev-tenant.onmicrosoft.com
B2C_CLIENT_ID = xxxxxxxx-dev-xxxx
FIREBASE_ENV = debug
LOG_LEVEL = verbose

// Config/QA.xcconfig
API_BASE_URL = https:$(SLASH)$(SLASH)api-qa.example.com
B2C_TENANT = qa-tenant.onmicrosoft.com
B2C_CLIENT_ID = xxxxxxxx-qa-xxxx
FIREBASE_ENV = qa
LOG_LEVEL = info

// Config/Release.xcconfig
API_BASE_URL = https:$(SLASH)$(SLASH)api.example.com
B2C_TENANT = prod-tenant.onmicrosoft.com
B2C_CLIENT_ID = xxxxxxxx-prod-xxxx
FIREBASE_ENV = release
LOG_LEVEL = error
```

### Info.plist Integration

`xcconfig` values are exposed through Info.plist:

```xml
<key>APIBaseURL</key>
<string>$(API_BASE_URL)</string>
<key>B2CTenant</key>
<string>$(B2C_TENANT)</string>
<key>B2CClientID</key>
<string>$(B2C_CLIENT_ID)</string>
```

Accessed at runtime:

```swift
enum AppConfig {
    static let apiBaseURL: URL = {
        let urlString = Bundle.main.infoDictionary?["APIBaseURL"] as! String
        return URL(string: urlString)!
    }()
    
    static let b2cTenant: String = {
        Bundle.main.infoDictionary?["B2CTenant"] as! String
    }()
}
```

### Firebase Configuration per Environment

Each environment uses its own `GoogleService-Info.plist`:

```
Resources/
  Firebase/
    Debug/GoogleService-Info.plist
    QA/GoogleService-Info.plist
    Release/GoogleService-Info.plist
```

A Run Script build phase copies the correct file based on the active configuration:

```bash
FIREBASE_DIR="${PROJECT_DIR}/Resources/Firebase/${CONFIGURATION}"
cp "${FIREBASE_DIR}/GoogleService-Info.plist" "${BUILT_PRODUCTS_DIR}/${PRODUCT_NAME}.app/GoogleService-Info.plist"
```

## Consequences

### Positive
- Clear separation of environment-specific settings eliminates manual switching.
- Developers cannot accidentally ship debug API URLs to production.
- Firebase Analytics and Crashlytics data is isolated per environment.
- Azure B2C tenant separation prevents test users from polluting production identity stores.
- `xcconfig` files are human-readable, diffable, and version-controlled.

### Negative
- Three configurations multiply the number of schemes and build settings to maintain.
- `xcconfig` syntax for URLs requires workarounds (`$(SLASH)` for `//`).
- Build phase scripts add complexity to the Xcode project.
- QA testers need the correct provisioning profile for the QA scheme.

### Risks
- **Risk**: A new environment-specific variable is added to one config but forgotten in others. **Mitigation**: CI validates that all three xcconfig files declare the same set of keys.
- **Risk**: GoogleService-Info.plist copy script fails silently. **Mitigation**: The script exits with a non-zero code if the source file is missing; CI catches the failure.
- **Risk**: Developers run the wrong scheme during local development. **Mitigation**: Debug scheme is the default; scheme names are clearly labeled in Xcode.
