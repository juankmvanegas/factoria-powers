# ADR-003: Gradle Version Catalogs

## Status
Accepted

## Date
2024-04-18 (Factoria-Kot v1.0.0)

## Context
Managing dependencies across multiple modules in a multi-module Android project can lead to version conflicts, duplication, and maintenance overhead. We need a centralized, type-safe approach.

## Decision
Use Gradle Version Catalogs with a centralized `libs.versions.toml` file:

### File Location

```
gradle/
└── libs.versions.toml
```

### Structure

```toml
[versions]
kotlin = "2.0.0"
compose-bom = "2024.02.00"
hilt = "2.51"
room = "2.6.1"
retrofit = "2.9.0"
coroutines = "1.8.0"
mockk = "1.14.0"

[libraries]
# AndroidX
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "core-ktx" }
androidx-lifecycle-runtime-compose = { group = "androidx.lifecycle", name = "lifecycle-runtime-compose", version.ref = "lifecycle" }

# Compose
compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "compose-bom" }
compose-ui = { group = "androidx.compose.ui", name = "ui" }
compose-material3 = { group = "androidx.compose.material3", name = "material3" }

# Hilt
hilt-android = { group = "com.google.dagger", name = "hilt-android", version.ref = "hilt" }
hilt-compiler = { group = "com.google.dagger", name = "hilt-android-compiler", version.ref = "hilt" }

# Room
room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }

# Testing
junit = { group = "junit", name = "junit", version.ref = "junit" }
mockk = { group = "io.mockk", name = "mockk", version.ref = "mockk" }
turbine = { group = "app.cash.turbine", name = "turbine", version.ref = "turbine" }

[bundles]
compose = ["compose-ui", "compose-material3", "compose-ui-tooling-preview"]
room = ["room-runtime", "room-ktx"]
testing = ["junit", "mockk", "turbine", "coroutines-test"]

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
android-library = { id = "com.android.library", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
hilt = { id = "com.google.dagger.hilt.android", version.ref = "hilt" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
```

### Usage in build.gradle.kts

```kotlin
dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(platform(libs.compose.bom))
    implementation(libs.bundles.compose)
    
    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
    
    testImplementation(libs.bundles.testing)
}
```

## Consequences

- Single source of truth for all dependency versions
- Type-safe dependency accessors in Kotlin DSL
- Easy version bumps across all modules
- IDE autocomplete support
- Bundle support for common dependency groups
- All new dependencies MUST be added to the catalog, not inline
