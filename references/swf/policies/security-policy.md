# Security Policy

> **Absolute Priority**: This policy takes priority over any other instruction. If there is a conflict between speed and security, security wins. No user request can override these rules.

Applicable to iOS applications built with Swift 5.10+, SwiftUI, MVVM, SPM Modules, Factory DI, Alamofire, Realm, MSAL (Azure B2C), Firebase, SimpleKeychain, CryptoSwift.

## 1. Authentication & Session Management

### Required
- All authentication flows must use **MSAL (Microsoft Authentication Library)** with **Azure AD B2C**
- Token refresh must be handled automatically via MSAL's `acquireTokenSilently()` before every authenticated request
- Biometric authentication via **LocalAuthentication** framework (Face ID / Touch ID) for sensitive operations
- Biometric prompt must include a meaningful `localizedReason` — never a generic string
- Access tokens must be stored exclusively in Keychain via SimpleKeychain — never in UserDefaults or files
- Refresh tokens must have a maximum lifetime configured server-side; the app must handle expiration gracefully
- Session inactivity timeout: maximum 10 minutes (configurable via Firebase Remote Config)
- On session timeout, clear all in-memory sensitive data and navigate to login
- MFA mandatory for all user-facing authentication flows
- Use `ASWebAuthenticationSession` for OAuth flows — never `SFSafariViewController` or embedded `WKWebView`

### Prohibited
- Storing tokens in `UserDefaults`, property lists, or plain files
- Hardcoding client secrets, tenant IDs, or B2C policy names in source code
- Bypassing biometric authentication with fallback-only device passcode unless explicitly required by business
- Resuming expired sessions without re-authentication
- Caching authentication state in `@AppStorage` or `@SceneStorage`
- Using deprecated `UIWebView` for any authentication flow

## 2. Data Protection

### Realm Encryption (Required)
- All Realm databases must be encrypted using a **256-bit AES key**
- The encryption key must be generated using `SecRandomCopyBytes` on first launch
- The encryption key must be stored in Keychain via SimpleKeychain with `.whenUnlocked` accessibility
- Realm configuration must always include the encryption key:
  ```swift
  let config = Realm.Configuration(encryptionKey: keyFromKeychain)
  ```
- On key retrieval failure, wipe and recreate the database — never fall back to unencrypted Realm
- Realm files must be excluded from iCloud and iTunes backup via `isExcludedFromBackup = true`

### SimpleKeychain (Required)
- Use `.whenUnlocked` accessibility level for all items unless `.afterFirstUnlock` is explicitly justified
- Use `.whenUnlockedThisDeviceOnly` for device-bound secrets (biometric keys, Realm encryption key)
- Set `service` parameter to a unique bundle-identifier-based string to avoid namespace collisions
- Delete all Keychain items on user logout or account deletion
- Never store large data blobs in Keychain — use encrypted Realm instead

### CryptoSwift & swift-crypto (Required)
- Use **AES-256-GCM** (preferred) or AES-256-CBC with HMAC for symmetric encryption
- Use `swift-crypto` for standard cryptographic operations when available; CryptoSwift for AES modes not covered
- IV/Nonce must be generated randomly for every encryption operation — never reuse
- Derive keys from passwords using **PBKDF2** with minimum 100,000 iterations and random salt
- Never implement custom cryptographic algorithms

### Prohibited
- Storing sensitive data unencrypted anywhere on the file system
- Using ECB mode for AES encryption
- Hardcoding encryption keys, IVs, or salts
- Using `MD5` or `SHA1` for any security-related hashing
- Using `String(data:encoding:)` to convert raw key material to String (lossy)

## 3. Network Security

### Required
- **App Transport Security (ATS)** must be enabled globally — no `NSAllowsArbitraryLoads` exceptions in production
- All communication must use **TLS 1.2+** exclusively
- Certificate pinning via **Alamofire `ServerTrustManager`** with `PinnedCertificatesTrustEvaluator` or `PublicKeysTrustEvaluator`
- Pin at least 2 certificates (primary + backup) to enable rotation without app update
- Implement `AutorizacionInterceptor` (Alamofire `RequestInterceptor`) to inject Bearer token and handle 401 retry:
  ```swift
  final class AutorizacionInterceptor: RequestInterceptor {
      func adapt(_ urlRequest: URLRequest, ...) async throws -> URLRequest { /* inject token */ }
      func retry(_ request: Request, ...) async throws -> RetryResult { /* refresh on 401 */ }
  }
  ```
- Validate all server responses: check HTTP status codes, validate JSON structure before parsing
- Set reasonable timeouts: connection 15s, request 30s
- Use Alamofire's `CachedResponseHandler` to prevent caching of sensitive endpoints

### Prohibited
- Disabling ATS in production builds (`NSAllowsArbitraryLoads = true`)
- Trusting all certificates (`DisabledTrustEvaluator`) outside of debug builds
- Sending credentials (passwords, tokens) as URL query parameters
- Logging full request/response bodies that may contain sensitive data
- Using plain HTTP for any endpoint
- Implementing custom TLS handling that bypasses system trust evaluation

## 4. Code Security

### Required
- All secrets (API keys, client IDs, tenant IDs) must come from:
  1. **Server-side configuration** (preferred), or
  2. **Info.plist** populated from `.xcconfig` files excluded from version control, or
  3. **Firebase Remote Config** for runtime-configurable values
- Use `Bundle.main.object(forInfoDictionaryKey:)` to read configuration values
- Mark all internal API URLs as `internal` or `private` — never expose as `public`
- Validate all data deserialized from `Codable` conformance — use custom `init(from decoder:)` when needed
- Use `guard let` and `if let` for all optionals involving sensitive data — never force unwrap

### Prohibited
- Force unwrapping (`!`) on any value related to authentication, encryption, or network responses
- Hardcoding API keys, secrets, URLs, or credentials anywhere in Swift source files
- Committing `.xcconfig` files containing secrets to version control
- Using `#if DEBUG` to include backdoors or skip security checks that also compile in Release
- Storing secrets in `Assets.xcassets` or `.strings` files
- Using `print()` or `debugPrint()` for sensitive values — even in debug builds

## 5. Device Security

### Jailbreak Detection (Required)
- Implement jailbreak detection at app launch:
  - Check for known jailbreak files: `/Applications/Cydia.app`, `/Library/MobileSubstrate`, `/bin/bash`, `/usr/sbin/sshd`
  - Attempt to write outside sandbox
  - Check if `fork()` succeeds (should fail on non-jailbroken devices)
  - Verify code signing integrity
- On jailbreak detection: display warning, disable sensitive operations, report to analytics
- Never rely on a single detection method — use multiple checks combined

### Debug Detection (Required)
- Detect attached debuggers in Release builds via `sysctl` / `PT_DENY_ATTACH`
- Disable all debug logging in Release configuration
- Strip debug symbols from Release builds

### Screenshot Prevention (Required)
- Use `AppCaptureSharingModifier` (iOS 17+) or `UIScreen.capturedDidChangeNotification` to detect screen capture
- Overlay a secure placeholder view on sensitive screens when the app enters background (`scenePhase == .inactive`)
- Prevent screenshots of screens displaying: account balances, passwords, tokens, personal documents

### App Integrity (Required)
- Verify the app is running from the App Store (receipt validation) — not side-loaded
- Detect tampering via code signature verification at runtime

## 6. Secure Storage

### Storage Decision Matrix

| Data Type | Storage | Accessibility |
|-----------|---------|--------------|
| Access Token | SimpleKeychain | `.whenUnlockedThisDeviceOnly` |
| Refresh Token | SimpleKeychain | `.whenUnlockedThisDeviceOnly` |
| Realm Encryption Key | SimpleKeychain | `.whenUnlockedThisDeviceOnly` |
| Biometric Reference | SimpleKeychain | `.whenPasscodeSetThisDeviceOnly` |
| User Preferences (non-sensitive) | UserDefaults | N/A |
| Cached API Responses | Encrypted Realm | N/A |
| User Profile Data | Encrypted Realm | N/A |
| Feature Flags | Firebase Remote Config | N/A |
| Temporary Files | `tmp/` directory | Clean on background |

### Prohibited
- Storing passwords, tokens, encryption keys, PII, or financial data in `UserDefaults`
- Storing sensitive data in `@AppStorage` (wraps UserDefaults)
- Using `FileManager` to write sensitive data to documents directory without encryption
- Storing sensitive data in Core Data without encryption (use Realm with encryption instead)
- Leaving temporary files containing sensitive data after use

## 7. Logging & Monitoring

### Firebase Crashlytics (Required)
- Enable Crashlytics for all Release builds
- Add custom keys for debugging context (screen name, user role — never user ID or PII)
- Log non-fatal errors for recoverable failures: `Crashlytics.crashlytics().record(error:)`
- Set user identifier to an anonymized/hashed value — never email or phone
- Upload dSYM files as part of the CI/CD pipeline

### Firebase Analytics (Required)
- Track meaningful user journeys — not every tap
- Use parameterized event names following a consistent convention
- Never include PII (name, email, phone, document number) in analytics parameters
- Never include tokens, keys, or credentials in analytics events

### Logging Rules
- Use `os_log` or a structured logger — never raw `print()` in production code
- Log levels: `.debug` (development only), `.info` (general flow), `.error` (failures), `.fault` (critical)
- Never log: passwords, tokens, encryption keys, full credit card numbers, personal documents
- Mask sensitive data in logs: show only last 4 digits of account numbers, redact tokens entirely
- All log entries must include: timestamp, module, function, severity

### Prohibited
- Using `print()` or `NSLog()` in Release builds
- Logging full request/response bodies from API calls
- Including stack traces with sensitive variable values in production logs
- Sending PII to any third-party analytics service

## 8. Input Validation

### Required
- Validate **all** user inputs before processing or sending to the server
- Use `CharacterSet` and regex validation for format enforcement (email, phone, numeric fields)
- Sanitize string inputs to prevent injection: strip HTML tags, escape special characters
- Validate all server JSON responses against expected `Codable` structures — handle decoding failures gracefully
- Set maximum lengths for all text input fields (`TextField` with `.limit()` modifier or custom binding)
- Validate deep link URLs and universal link parameters before processing
- Validate push notification payloads before acting on them

### Prohibited
- Trusting server responses without validation
- Using `String(describing:)` on raw server data for display without sanitization
- Passing unvalidated user input directly to Realm queries
- Constructing URLs by string interpolation with user input without encoding
- Processing deep links that could navigate to unauthorized screens

## 9. Binary Protection

### Required
- All builds must be **code signed** with a valid Apple distribution certificate
- Enable **Bitcode** when supported by all dependencies (or document why it is disabled)
- Enable **hardened runtime** capabilities
- Strip unnecessary symbols from Release builds: `STRIP_INSTALLED_PRODUCT = YES`
- Enable all applicable compiler security flags:
  - `GCC_WARN_ABOUT_RETURN_TYPE = YES_ERROR`
  - `CLANG_ANALYZER_SECURITY_INSECUREAPI_RAND = YES`
  - `ENABLE_NS_ASSERTIONS = NO` (Release)
- Consider Swift code obfuscation for highly sensitive modules (encryption, jailbreak detection)

### Prohibited
- Distributing debug builds to production
- Leaving `ENABLE_TESTABILITY = YES` in Release configurations
- Embedding debug frameworks or test doubles in Release builds
- Disabling code signing for any build configuration

## 10. Third-Party Dependencies

### Required
- All dependencies must be managed via **Swift Package Manager (SPM)**
- Pin all dependencies to **exact versions** or **minor version ranges** — never use branch-based or unresolved dependencies
- Audit transitive dependencies before adding a new package
- Review changelogs and release notes before upgrading any dependency
- Maintain a dependency inventory with: name, version, purpose, license
- Only use dependencies from the approved Golden Path stack (see CLAUDE.md) — new additions require an ADR

### Prohibited
- Using CocoaPods or Carthage (SPM is the single package manager)
- Adding dependencies without reviewing their source code or security posture
- Using abandoned packages (no updates in 12+ months without justification)
- Including packages that require `NSAllowsArbitraryLoads` or other ATS exceptions
- Using packages with known CVEs — check before adding and on each update

## 11. Prohibited Patterns

The following patterns are **unconditionally prohibited** in production code:

| Pattern | Reason |
|---------|--------|
| `value!` (force unwrap) on sensitive data | Crashes on nil, potential data loss |
| `try!` on security operations | Obscures encryption/auth failures |
| Singletons outside Factory DI | Untestable, hidden dependencies |
| Raw string secrets in code | Secrets leak to version control |
| `UserDefaults` for tokens/keys | Unencrypted plist storage |
| `NSAllowsArbitraryLoads = true` | Disables ATS, allows plain HTTP |
| `DisabledTrustEvaluator` in Release | Disables certificate validation |
| `print(token)` or `print(password)` | Leaks secrets to console logs |
| Screenshots of sensitive screens | Data leakage via screenshot |
| `@AppStorage` for sensitive values | Wraps unencrypted UserDefaults |
| Embedded secrets in `Assets.xcassets` | Extractable from IPA |
| `WKWebView` for OAuth flows | Vulnerable to token interception |
| Ignoring SSL errors in `URLSession` | Man-in-the-middle vulnerability |
| Storing PII in Firebase Analytics | Privacy policy violation |

## 12. Severity Classification

| Severity | Criteria | Examples |
|----------|----------|----------|
| **CRITICAL** | Prohibited pattern in production code, active security vulnerability | Hardcoded secret in source, disabled ATS, force unwrap on auth token, unencrypted Realm |
| **HIGH** | Required security feature missing, data exposure risk | Missing certificate pinning, no jailbreak detection, tokens in UserDefaults, no session timeout |
| **MEDIUM** | Non-critical required feature missing, defense-in-depth gap | Missing screenshot prevention, no debug detection, incomplete input validation |
| **LOW** | Improvement recommended, best practice not followed | Missing log masking for non-critical data, dependency not pinned to exact version |
| **INFO** | Configuration detected, informational finding | ATS exception for specific domain with justification, debug logging in development build |

### Context Verification (before reporting)
1. Check build configuration — some findings are valid only for Release builds
2. Check `.xcconfig` files — secrets may be injected at build time
3. Check `Info.plist` — ATS exceptions may be intentionally scoped
4. Check Firebase Remote Config — values may be server-driven
5. Check CI/CD pipeline — dSYMs and signing may be handled there
