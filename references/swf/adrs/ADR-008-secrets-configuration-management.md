# ADR-008: Secrets and Configuration Management

## Status
Accepted

## Date
2025-01-15

## Context
Mobile applications require access to sensitive configuration values — API keys, OAuth client IDs, Azure B2C tenant identifiers, Firebase configuration, and encryption keys. Hardcoding these values in source code exposes them in version control history, decompiled binaries, and CI logs. The team needs a systematic approach to inject environment-specific configuration at build time while keeping sensitive runtime secrets in secure storage. The solution must work across three build configurations (Debug, QA, Release) and prevent accidental secret leakage.

## Decision
We adopt a layered secrets and configuration management strategy:

### Layer 1: Build-Time Configuration via Info.plist + xcconfig

Non-secret, environment-specific values are injected through `.xcconfig` files into Info.plist (see ADR-004):

```
// Values in xcconfig → Info.plist → Bundle.main.infoDictionary
API_BASE_URL, B2C_TENANT, B2C_CLIENT_ID, FIREBASE_ENV, LOG_LEVEL
```

These are **not secrets** — they are environment identifiers that configure which backend services the app communicates with. They are safe to store in version control.

### Layer 2: Build-Time Secrets via Xcode Scheme Environment Variables

Actual secrets (API keys, signing tokens) are injected via Xcode scheme environment variables, populated by CI:

```xml
<!-- Scheme.xcscheme -->
<EnvironmentVariable key="API_SECRET_KEY" value="$(API_SECRET_KEY)" isEnabled="YES"/>
```

In CI (GitHub Actions / Azure DevOps):

```yaml
env:
  API_SECRET_KEY: ${{ secrets.API_SECRET_KEY }}
```

At build time, a Run Script phase writes secrets to a generated Swift file excluded from source control:

```bash
# generate-secrets.sh (Run Script Build Phase)
cat > "${SRCROOT}/Generated/Secrets.generated.swift" << EOF
// AUTO-GENERATED — DO NOT EDIT OR COMMIT
enum BuildSecrets {
    static let apiSecretKey = "${API_SECRET_KEY}"
}
EOF
```

`.gitignore` entry:
```
Generated/Secrets.generated.swift
```

### Layer 3: Runtime Secrets via Keychain

Secrets that arrive at runtime (OAuth tokens, refresh tokens, user credentials) are stored in **SimpleKeychain**:

```swift
import SimpleKeychain

enum SecureStorage {
    private static let keychain = SimpleKeychain(
        service: "com.app.secure",
        accessGroup: nil,
        accessibility: .afterFirstUnlockThisDeviceOnly
    )
    
    static func save(_ value: String, forKey key: StorageKey) throws {
        try keychain.set(value, forKey: key.rawValue)
    }
    
    static func get(forKey key: StorageKey) throws -> String {
        try keychain.string(forKey: key.rawValue)
    }
    
    static func delete(forKey key: StorageKey) throws {
        try keychain.deleteItem(forKey: key.rawValue)
    }
}

enum StorageKey: String {
    case accessToken = "com.app.accessToken"
    case refreshToken = "com.app.refreshToken"
    case realmEncryptionKey = "com.app.realm.encryptionKey"
    case userSessionID = "com.app.sessionID"
}
```

### Layer 4: Keychain Accessibility Levels

| Data | Accessibility | Rationale |
|------|--------------|-----------|
| OAuth tokens | `.afterFirstUnlockThisDeviceOnly` | Available after first unlock; not transferred to new devices |
| Realm encryption key | `.afterFirstUnlockThisDeviceOnly` | Must survive backgrounding but not device migration |
| Biometric-protected data | `.whenPasscodeSetThisDeviceOnly` | Requires device passcode |

### Prohibited Practices

1. **Never hardcode** API keys, tokens, client secrets, or encryption keys in Swift source files.
2. **Never commit** `Secrets.generated.swift`, `.env` files, or any file containing secrets.
3. **Never log** secrets to console, analytics, or crash reports.
4. **Never store** secrets in `UserDefaults` — it is an unencrypted plist on disk.
5. **Never embed** secrets in asset catalogs, string files, or other bundle resources.

### Source Control Safeguards

```gitignore
# .gitignore
Generated/Secrets.generated.swift
*.env
*.secret
**/*-secrets.plist
```

Pre-commit hook (optional, recommended):

```bash
#!/bin/bash
# Scan staged files for potential secrets
if git diff --cached --name-only | xargs grep -lE '(api[_-]?key|secret|token|password)\s*[:=]\s*"[^"]{8,}"' 2>/dev/null; then
    echo "ERROR: Potential secret detected in staged files."
    exit 1
fi
```

## Consequences

### Positive
- Clear separation between configuration (safe to commit) and secrets (never committed).
- CI pipelines inject secrets at build time without developer intervention.
- SimpleKeychain leverages the device's Secure Enclave for hardware-backed protection.
- Keychain items with `.thisDeviceOnly` suffix prevent secrets from leaking via iCloud backup.
- Pre-commit hooks catch accidental secret commits before they reach remote.
- Generated secrets file pattern is simple and auditable.

### Negative
- Developers must configure scheme environment variables for local builds or maintain a local `.env` file.
- The generated secrets file approach requires a build phase script, adding build complexity.
- Keychain operations can fail on simulators or under specific entitlement configurations.
- Secret rotation requires CI variable updates and a new build.

### Risks
- **Risk**: Developer commits `Secrets.generated.swift` despite `.gitignore`. **Mitigation**: Pre-commit hook blocks the commit. CI pipeline verifies the file is not in the repository.
- **Risk**: Decompiled IPA reveals build-time secrets embedded in the binary. **Mitigation**: Use code obfuscation for release builds. Rate-limit API keys server-side. Rotate keys periodically.
- **Risk**: Keychain is cleared by the OS or user action, losing runtime secrets. **Mitigation**: Detect missing tokens gracefully and trigger re-authentication flow.
- **Risk**: Secrets leak through CI logs. **Mitigation**: Mark all secret variables as masked in CI. Never echo secrets in build scripts.
