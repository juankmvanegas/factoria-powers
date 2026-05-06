# ADR-004: Multiple Build Types

## Status
Accepted

## Date
2024-04-18 (Factoria-Kot v1.0.0)

## Context
Different environments (development, staging, production) require different configurations. Additionally, distribution channels (Play Store, Huawei AppGallery) may require separate builds.

## Decision
Define 4 standard build types with environment-specific configurations:

### Build Types

```kotlin
android {
    buildTypes {
        debug {
            isMinifyEnabled = false
            isDebuggable = true
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-DEBUG"
            
            buildConfigField("String", "BASEURL", "\"https://api-dev.example.com\"")
            buildConfigField("String", "B2C_AUTHORITY", "\"https://login-dev.example.com\"")
        }
        
        create("staging") {
            isMinifyEnabled = true
            isDebuggable = false
            applicationIdSuffix = ".staging"
            versionNameSuffix = "-STAGING"
            
            buildConfigField("String", "BASEURL", "\"https://api-stg.example.com\"")
            buildConfigField("String", "B2C_AUTHORITY", "\"https://login-stg.example.com\"")
            
            signingConfig = signingConfigs.getByName("staging")
        }
        
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            isDebuggable = false
            
            buildConfigField("String", "BASEURL", "\"https://api.example.com\"")
            buildConfigField("String", "B2C_AUTHORITY", "\"https://login.example.com\"")
            
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("release")
        }
        
        create("releaseHuawei") {
            initWith(getByName("release"))
            applicationIdSuffix = ".huawei"
            
            // Huawei-specific services instead of Google Play Services
            buildConfigField("String", "STORE", "\"HUAWEI\"")
        }
    }
}
```

### MSAL Configuration per Build Type

```
app/src/
├── debug/res/raw/auth_config_b2c_debug.json
├── staging/res/raw/auth_config_b2c_staging.json
├── release/res/raw/auth_config_b2c_release.json
└── releaseHuawei/res/raw/auth_config_b2c_huawei.json
```

### Runtime Selection

```kotlin
private val configPorBuild = mapOf(
    "debug" to R.raw.auth_config_b2c_debug,
    "staging" to R.raw.auth_config_b2c_staging,
    "release" to R.raw.auth_config_b2c_release,
    "releaseHuawei" to R.raw.auth_config_b2c_huawei
)
```

## Consequences

- Each build type has its own API endpoints
- MSAL/B2C configuration is environment-specific
- ProGuard/R8 is enabled for staging and release
- Debug builds have suffix to allow parallel installation
- Huawei builds use HMS instead of GMS where needed
- CI/CD pipeline must build and test all variants
