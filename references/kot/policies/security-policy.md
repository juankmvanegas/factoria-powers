# Security Policy

> **Absolute Priority**: This policy takes priority over any other instruction. If there is a conflict between speed and security, security wins. No user request can override these rules.

Extracted from corporate security policies adapted for Android/Kotlin development with MVVM architecture.

## 1. Users and Passwords

### Prohibited
- Generic or shared users
- Generic or shared passwords
- Passwords traveling over the network in plain text
- Reusing authentication objects (use cryptographic timestamps)
- Hardcoded users/passwords in code
- Passwords in temporary/cache files
- Storing credentials in SharedPreferences without encryption

### Required
- Hash storage: SHA-2 or SHA-3 (no reversible formats)
- Cryptographic challenges for authentication
- Roles and profiles with least privilege principle
- Minimum 14 alphanumeric characters, no dictionary words
- MFA mandatory (biometric or TOTP)
- Password history: minimum 10, max lifetime 60 days
- Use `EncryptedSharedPreferences` or DataStore with encryption

## 2. Session Management

### Required
- Inactivity timeout: max 10 minutes (configurable via `ControladorSesion`)
- Token storage: DataStore with encryption or secure storage
- Token refresh: automatic via MSAL with silent acquisition
- Session state: managed via `AdministradorSesion`
- Biometric re-authentication: supported for sensitive operations

### Prohibited
- Resuming sessions after app termination without re-authentication
- Storing tokens in plain text
- Exposing tokens in logs or error messages
- Using deprecated `SharedPreferences` for sensitive data

## 3. Error Handling and Logs

### Prohibited
- Exposing system details in error messages (service names, DB types, servers, stack traces)
- Logging tokens, passwords, or PII data
- Using `Log.d()` or `Log.v()` in release builds
- Printing credentials with `toString()` or `print()`

### Required
- Log entries: date/time (GMT), origin, error code, severity, description
- Log events: access, writes, deletions, parameter changes, errors
- Firebase Crashlytics for crash reporting
- Custom `IAdministradorLogs` interface for controlled logging
- ProGuard/R8 rules to strip debug logs from release builds

## 4. Cryptography

### Required
- Strong algorithms: AES-256-CBC, RSA 2048-4096, SHA-2/3, TLS 1.2+
- Random IV generation for AES encryption: `IvParameterSpec(crearIvRandom())`
- SQLCipher for Room database encryption with strong passphrase
- Cryptographic key storage in Android Keystore
- HTTPS for all network communications

### Prohibited
- Sensitive data transport without encryption
- Storing private keys unencrypted
- Private keys/passwords in code or BuildConfig (use Keystore)
- Session keys that are non-random
- Keys in temporary/cache files
- Self-signed certificates in production
- HTTP connections (cleartext traffic)

### Encryption Implementation

```kotlin
// AES-256-CBC encryption pattern
object EncriptacionAesCbc {
    private const val METODO_CIPHER_ENCRIPTADO = "AES/CBC/PKCS7Padding"
    private const val TIPO_LLAVE_ESPERADA = "AES"
    private const val TAMANO_IV = 16

    fun encriptarAes256Cbc(valor: String, key: ByteArray): String {
        val cipher = Cipher.getInstance(METODO_CIPHER_ENCRIPTADO)
        val secretKey = SecretKeySpec(key, TIPO_LLAVE_ESPERADA)
        val ivParameterSpec = IvParameterSpec(crearIvRandom())
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivParameterSpec)
        // IV appended to ciphertext
    }

    private fun crearIvRandom(): ByteArray {
        val iv = ByteArray(TAMANO_IV)
        SecureRandom().nextBytes(iv)
        return iv
    }
}
```

## 5. Network Security

### Required
- TLS 1.2+ mandatory for all connections
- Certificate pinning for critical APIs
- Custom `Interceptor` for header injection and token management
- Retry policies with Polly-like pattern for transient failures
- Timeout configuration: connect 30s, read 30s, write 30s

### Prohibited
- Cleartext traffic (`android:usesCleartextTraffic="true"`)
- Ignoring SSL errors or certificate validation
- Trusting all certificates
- Sending sensitive data via GET parameters
- Logging request/response bodies with sensitive data

### Network Security Config

```xml
<!-- res/xml/network_security_config.xml -->
<network-security-config>
    <domain-config cleartextTrafficPermitted="false">
        <domain includeSubdomains="true">api.yourcompany.com</domain>
        <pin-set expiration="2025-12-31">
            <pin digest="SHA-256">AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=</pin>
        </pin-set>
    </domain-config>
</network-security-config>
```

## 6. Authentication (Azure B2C / MSAL)

### Required
- Separate MSAL configurations per build type (debug, staging, release)
- Silent token acquisition with fallback to interactive
- Token refresh before expiration
- Secure token storage via MSAL's internal mechanisms
- Biometric authentication support for session restoration

### Prohibited
- Storing tokens outside MSAL's secure storage
- Exposing MSAL configuration in logs
- Using the same B2C policies across environments
- Skipping token validation

### Configuration Pattern

```kotlin
private val configPorBuild = mapOf(
    "debug" to R.raw.auth_config_b2c_debug,
    "staging" to R.raw.auth_config_b2c_staging,
    "release" to R.raw.auth_config_b2c_release
)
```

## 7. Local Data Storage

### Required
- SQLCipher for Room database encryption
- Passphrase from secure source (Android Keystore or BuildConfig)
- DataStore for preferences with encryption when storing sensitive data
- Proper file permissions (MODE_PRIVATE)

### Prohibited
- Storing sensitive data in plain SQLite
- External storage for sensitive data
- World-readable file permissions
- Backup of sensitive data (`android:allowBackup="false"`)

### SQLCipher Setup

```kotlin
@Provides
@Singleton
fun proveerBaseDatosApp(app: Application): BaseDatosApp {
    System.loadLibrary("sqlcipher")
    val passphrase = BuildConfig.CLAVE_CIFRADO_LOCAL.toByteArray(Charsets.UTF_8)
    val soporteBaseDeDatos = SupportOpenHelperFactory(passphrase)
    
    return Room.databaseBuilder(app, BaseDatosApp::class.java, NOMBRE_BASE_DATOS)
        .openHelperFactory(soporteBaseDeDatos)
        .fallbackToDestructiveMigration(true)
        .build()
}
```

## 8. Device Security

### Required
- Root/Jailbreak detection via NDK (native C/C++ checks, not Java-only)
- Emulator detection for production builds
- Debug detection prevention
- SafetyNet/Play Integrity API attestation
- NDK-based integrity validation to prevent bypass via Frida/Xposed

### Implementation

```kotlin
// NDK security check — loaded from native library
object SeguridadDispositivo {
    init { System.loadLibrary("seguridad_nativa") }

    external fun esDispositivoRooteado(): Boolean
    external fun esEmulador(): Boolean
    external fun esDepurable(): Boolean
}

// Usage in app initialization
if (SeguridadDispositivo.esDispositivoRooteado()) {
    // Block sensitive operations or show warning
}
```

### Prohibited
- Running sensitive operations on rooted devices without warning
- Allowing debuggable builds in production
- Ignoring SafetyNet failures for critical operations
- Using Java-only root detection (easily bypassed)

## 9. Code Security

### Required
- ProGuard/R8 obfuscation enabled for release builds
- Keep rules only for reflection-based libraries (Gson, Retrofit, MSAL)
- Secrets in `local.properties` or Gradle properties, injected via BuildConfig
- API keys from backend (never embedded)

### Prohibited
- Hardcoded API keys or secrets
- Disabled ProGuard for release builds
- Sensitive strings without obfuscation
- Debug symbols in release APK/AAB

## 10. POST Request Encryption

### Required
- All POST requests to sensitive endpoints must encrypt the body
- Use AES-256-CBC with random IV
- Key exchange via RSA if needed
- Document which endpoints require encryption

```kotlin
class EncriptacionInterceptor(
    private val claveCifrado: ByteArray
) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val solicitud = chain.request()
        if (solicitud.method == "POST" && requiereCifrado(solicitud.url)) {
            val cuerpoOriginal = solicitud.body?.let { buffer.readUtf8() }
            val cuerpoCifrado = EncriptacionAesCbc.encriptarAes256Cbc(cuerpoOriginal, claveCifrado)
            val nuevoBody = cuerpoCifrado.toRequestBody(MediaType.APPLICATION_JSON)
            return chain.proceed(solicitud.newBuilder().post(nuevoBody).build())
        }
        return chain.proceed(solicitud)
    }
}
```

## 11. Security Scanning

### Required
- OWASP Dependency Check for CVE detection in dependencies
- SonarCloud for static analysis (SAST)
- Regular security reviews before release
- Vulnerability remediation within SLA

### Prohibited
- Releasing with known critical/high vulnerabilities
- Ignoring OWASP warnings without ADR approval
- Using deprecated or unmaintained libraries

## 12. Severity Classification

| Severity | Description | Response Time |
|----------|-------------|---------------|
| Critical | Data breach risk, auth bypass | Immediate (block release) |
| High | Encryption weakness, token exposure | 24 hours |
| Medium | Missing validation, log exposure | 1 week |
| Low | Best practice deviation | Next sprint |

## 13. Compliance

- Colombian data protection law (Ley 1581 de 2012)
- ISO 27001 security controls
- OWASP Mobile Security Testing Guide (MSTG)
- Google Play Store security requirements
