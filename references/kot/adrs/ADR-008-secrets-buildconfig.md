# ADR-008: Secrets Management with BuildConfig

## Status
Accepted

## Date
2024-04-18 (Factoria-Kot v1.0.0)

## Context
Android applications require API keys, encryption keys, and other secrets. These must not be hardcoded in source code but need to be available at build time.

## Decision
Use Gradle properties injected into BuildConfig for secret management:

### Secrets Structure

```
# local.properties (NOT committed to git)
CLAVE_CIFRADO_LOCAL=your-256-bit-key-here
AES_SECRET_KEY=your-aes-key-here
RSA_PUBLIC_KEY=your-rsa-public-key
BASEURL_INICIAL=https://api.example.com
SUSCRIPCION_OCP_APIM=your-apim-subscription-key
```

### Gradle Configuration

```kotlin
// build.gradle.kts (app module)
android {
    defaultConfig {
        // Load from local.properties
        val localProperties = gradleLocalProperties(rootDir, providers)
        
        buildConfigField(
            "String", 
            "CLAVE_CIFRADO_LOCAL", 
            "\"${localProperties.getProperty("CLAVE_CIFRADO_LOCAL", "")}\""
        )
        buildConfigField(
            "String", 
            "AES_SECRET_KEY", 
            "\"${localProperties.getProperty("AES_SECRET_KEY", "")}\""
        )
        buildConfigField(
            "String", 
            "BASEURL_INICIAL", 
            "\"${localProperties.getProperty("BASEURL_INICIAL", "")}\""
        )
    }
    
    buildFeatures {
        buildConfig = true
    }
}
```

### CI/CD Environment Variables

```yaml
# GitHub Actions example
env:
  CLAVE_CIFRADO_LOCAL: ${{ secrets.CLAVE_CIFRADO_LOCAL }}
  AES_SECRET_KEY: ${{ secrets.AES_SECRET_KEY }}

steps:
  - name: Create local.properties
    run: |
      echo "CLAVE_CIFRADO_LOCAL=$CLAVE_CIFRADO_LOCAL" >> local.properties
      echo "AES_SECRET_KEY=$AES_SECRET_KEY" >> local.properties
```

### Usage in Code

```kotlin
// Access via BuildConfig
val claveCifrado = BuildConfig.CLAVE_CIFRADO_LOCAL.toByteArray(Charsets.UTF_8)

// In DI module
@Provides
fun proveerClaveCifrado(): ByteArray {
    return BuildConfig.CLAVE_CIFRADO_LOCAL.toByteArray(Charsets.UTF_8)
}
```

### Gitignore

```gitignore
# Never commit secrets
local.properties
*.keystore
*.jks
google-services.json
```

### Alternative: Android Keystore (Runtime)

For secrets that change per user or session:

```kotlin
class AlmacenClaves @Inject constructor(
    private val contexto: Context
) {
    private val keyStore = KeyStore.getInstance("AndroidKeyStore").apply {
        load(null)
    }
    
    fun generarClaveAes(alias: String): SecretKey {
        val keyGenerator = KeyGenerator.getInstance(
            KeyProperties.KEY_ALGORITHM_AES,
            "AndroidKeyStore"
        )
        keyGenerator.init(
            KeyGenParameterSpec.Builder(
                alias,
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
            )
            .setBlockModes(KeyProperties.BLOCK_MODE_CBC)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_PKCS7)
            .build()
        )
        return keyGenerator.generateKey()
    }
}
```

## Consequences

- Secrets are injected at build time, not runtime
- `local.properties` never committed to git
- CI/CD uses environment variables or secret managers
- BuildConfig is obfuscated by ProGuard
- Key rotation requires app update (for build-time secrets)
- User-specific secrets use Android Keystore at runtime
- No secrets visible in decompiled APK
