---
name: swf-security-scan
description: "Auto-activated security scan — hardcoded secrets, force unwrapping, insecure storage, SSL pinning, PII in logs"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Security Scan (Auto-Activated)

## Purpose

Auto-activated security scan that runs on every code change. Checks for hardcoded secrets, force unwrapping of sensitive data, insecure storage, missing SSL pinning, PII in logs, and validates all findings against `security-policy.md`.

## Activation Triggers

This skill activates automatically when:
- Any `.swift` file is created or modified
- Configuration files are changed (`.plist`, `.xcconfig`, `.json`)
- Keychain or storage-related code is touched
- Network layer code is modified
- Authentication code is changed

## Security Checks

### Check 1: Hardcoded Secrets

Scan for patterns that indicate hardcoded credentials:

```
# Patterns to detect
"api_key", "apiKey", "API_KEY"
"secret", "password", "token"
"Bearer ", "Basic "
Base64-encoded strings > 20 chars
URLs with credentials in query params
```

**ALLOWED:** References to Keychain, SecureStore, environment variables, `.xcconfig` values.

### Check 2: Force Unwrapping Sensitive Data

Flag dangerous force unwraps on security-sensitive types:

```swift
// BLOCKED — force unwrap on credentials
let token = keychain.get("token")!
let credential = authResult.credential!

// ALLOWED — safe unwrap
guard let token = keychain.get("token") else { return }
if let credential = authResult.credential { ... }
```

### Check 3: Insecure Storage

| Storage | Allowed For | Blocked For |
|---------|-------------|-------------|
| UserDefaults | Preferences, non-sensitive settings | Tokens, passwords, PII |
| Keychain | Tokens, credentials, certificates | Large data, non-sensitive data |
| Realm (encrypted) | Sensitive local data | Unencrypted sensitive data |
| FileManager | Non-sensitive cache | Credentials, tokens |

### Check 4: SSL Pinning

1. Verify `ServerTrustManager` is configured in Alamofire
2. Check that certificate pinning files exist in bundle
3. Flag any `ServerTrustPolicy.disableEvaluation` usage
4. Verify `ATS` (App Transport Security) is not globally disabled in Info.plist

### Check 5: PII in Logs

Scan for logging statements that may leak PII:

```swift
// BLOCKED
print("User email: \(user.email)")
print("Token: \(accessToken)")
os_log("Password: %@", password)
NSLog("SSN: %@", ssn)

// ALLOWED
print("User action: login")
os_log("Auth status: %@", status.rawValue)
```

### Check 6: Authentication Security

1. Verify MSAL configuration is correct (no hardcoded client secrets)
2. Check B2C policy names are from configuration, not hardcoded
3. Verify token refresh logic exists
4. Check biometric authentication uses `ValidadorBiometrico`
5. Verify session timeout is configured

### Check 7: Data Transmission

1. All URLs use `https://`
2. Request bodies with sensitive data are encrypted
3. Response caching does not store sensitive data
4. Certificate pinning is active for API calls

## Output

When violations are found:

```
⚠️ SECURITY SCAN — [N] violations found

CRITICAL:
- [file:line] Hardcoded API key detected
- [file:line] PII logged in print statement

WARNING:
- [file:line] Force unwrap on optional credential
- [file:line] UserDefaults used for token storage

Validated against: security-policy.md
```

## Auto-Shielding

- **BLOCK COMMIT** if any CRITICAL violation found
- **WARN** on WARNING-level violations (allow commit with acknowledgment)
- **PASS** silently if no violations found

## Rules

1. Run on EVERY code change — no exceptions
2. Critical violations block the operation — cannot be overridden
3. Warning violations require explicit acknowledgment
4. Reference specific `security-policy.md` sections for each violation
5. Never log the actual secret value in the scan output
6. Check both source code AND configuration files
7. Include remediation suggestion for every finding
8. False positives can be suppressed with `// security-scan:ignore` comment (requires justification)
