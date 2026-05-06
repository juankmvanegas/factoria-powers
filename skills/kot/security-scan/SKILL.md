---
name: kot-security-scan
description: "Validate code against security policy - runs automatically on every code change"
allowed-tools: Read, Grep, Glob
user-invocable: false
auto-activate: true
---

# Skill: Security Scan

## Purpose

Automatically validate code changes against `.cloud/policies/security-policy.md`. Blocks delivery on critical violations.

## Activation Trigger

Runs automatically when:
- New code files created
- Existing code modified
- Dependencies updated
- Configuration files changed

## Execution Flow — 8 Checks

### Check 1: Hardcoded Secrets

Scan for hardcoded credentials:

```kotlin
// ❌ CRITICAL - Block
val apiKey = "sk-1234567890abcdef"
val password = "mypassword123"
const val SECRET_KEY = "hardcoded-secret"

// ✅ Correct
val apiKey = BuildConfig.API_KEY
val password = credentialManager.getPassword()
```

**Patterns to detect:**
- String literals with "key", "secret", "password", "token", "api"
- Base64 encoded strings
- JWT tokens
- AWS/Azure/GCP credentials

### Check 2: Insecure Logging

Scan for sensitive data in logs:

```kotlin
// ❌ CRITICAL - Block
Log.d("Auth", "Token: $tokenAcceso")
Timber.d("Usuario: $email, Password: $password")

// ✅ Correct
Log.d("Auth", "Token refreshed successfully")
logAdministrador.info("Auth", "Usuario autenticado")
```

### Check 3: Insecure Storage

Check for plaintext sensitive storage:

```kotlin
// ❌ HIGH - Block
sharedPrefs.edit().putString("token", token).apply()

// ✅ Correct
encryptedPrefs.edit().putString("token", token).apply()
dataStore.edit { it[TOKEN_KEY] = encryptedToken }
```

### Check 4: SQLCipher Usage

Verify Room database is encrypted:

```kotlin
// ❌ HIGH - Block
Room.databaseBuilder(context, Database::class.java, "app_db").build()

// ✅ Correct
val passphrase = BuildConfig.DB_KEY.toByteArray()
val factory = SupportOpenHelperFactory(passphrase)
Room.databaseBuilder(context, Database::class.java, "app_db")
    .openHelperFactory(factory)
    .build()
```

### Check 5: Network Security

Check for insecure network calls:

```kotlin
// ❌ CRITICAL - Block
.baseUrl("http://api.example.com")  // HTTP not HTTPS

// ❌ HIGH - Block
hostnameVerifier { _, _ -> true }  // Trusts all hosts
trustManager that accepts all certificates

// ✅ Correct
.baseUrl("https://api.example.com")
// With certificate pinning
```

### Check 6: Error Exposure

Check for system detail exposure:

```kotlin
// ❌ MEDIUM
catch (e: SQLException) {
    Toast.makeText(context, "DB Error: ${e.message}", Toast.LENGTH_LONG)
}

// ✅ Correct
catch (e: SQLException) {
    crashlytics.recordException(e)
    mostrarError("Ha ocurrido un error. Intente de nuevo.")
}
```

### Check 7: POST Encryption

For sensitive endpoints, verify body encryption:

```kotlin
// Check if POST to sensitive endpoints encrypts body
// Reference: ADR-008, security-policy section 10
```

### Check 8: Dependency Vulnerabilities

Check for known vulnerable dependencies:

```kotlin
// Run OWASP dependency check
// Flag any HIGH or CRITICAL CVEs
```

## Severity Levels

| Severity | Response | Examples |
|----------|----------|----------|
| CRITICAL | Block immediately | Hardcoded secrets, HTTP |
| HIGH | Block before merge | Plaintext storage, no SQLCipher |
| MEDIUM | Warning, fix in sprint | Error exposure |
| LOW | Note for improvement | Missing best practice |

## Output Format

```markdown
## Security Scan Results

### 🔴 CRITICAL (Blocking)
- [ ] [File:Line] Hardcoded API key detected
- [ ] [File:Line] HTTP URL in production code

### 🟠 HIGH (Blocking)
- [ ] [File:Line] Sensitive data in SharedPreferences
- [ ] [File:Line] Room database without SQLCipher

### 🟡 MEDIUM (Warning)
- [ ] [File:Line] Exception details exposed to user

### 🟢 PASSED
- [x] No hardcoded secrets found
- [x] HTTPS enforced
- [x] SQLCipher configured
```

## Auto-Shielding

Before reporting:
- Verify file is production code (not test)
- Check if finding is in gitignored file
- Validate against `.cloud/policies/security-policy.md`

## Rules

- **NEVER allow CRITICAL issues to pass**
- **Report ALL findings, even LOWs**
- **Check both new and modified files**
- **Include line numbers for findings**
- **Link to relevant policy section**
- **Suggest specific fixes**
