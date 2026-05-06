# Current Architecture

## Overview

Factoria-Kot implements MVVM architecture with modular structure by features for Android native development using Kotlin and Jetpack Compose.

## Technology Stack

| Category | Technology |
|----------|------------|
| Language | Kotlin 2.0+ |
| SDK Target | Android 34+ |
| UI | Jetpack Compose |
| Architecture | MVVM + Feature Modules |
| DI | Dagger Hilt |
| Network | Retrofit + OkHttp |
| Database | Room + SQLCipher |
| Preferences | DataStore |
| Concurrency | Coroutines + Flow |
| Navigation | Navigation Compose |
| Auth | Azure B2C (MSAL) |
| Testing | JUnit + MockK + Turbine |

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION                          │
│  ViewModels, UI State, Composables, Navigation           │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                       DOMAIN                             │
│  UseCases, Repository Interfaces, Domain Models          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                        DATA                              │
│  Repository Impl, DataSources, DTOs, API Services        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                        CORE                              │
│  Shared utilities, Base classes, Extensions              │
└─────────────────────────────────────────────────────────┘
```

## Module Structure

```
app/                         # Application entry point
├── SisteApp.kt              # @HiltAndroidApp
└── MainActivity.kt          # @AndroidEntryPoint

core/                        # Shared core module
├── core_datos/              # Shared data layer
│   ├── interceptor/
│   └── di/modulos/
├── core_dominio/            # Shared domain layer
│   ├── casouso/
│   ├── modelo/
│   └── repositorio/
└── utils/
    ├── despachadores/
    ├── Resultado.kt
    └── extensiones/

core-ui/                     # Shared UI components
├── componente/
│   ├── atomos/
│   ├── moleculas/
│   └── organismos/
├── theme/
└── util/

[feature-modules]/           # Feature modules
└── feature_name/
    ├── feature_datos/
    │   ├── fuente/
    │   ├── repositorio/
    │   └── di/
    ├── feature_dominio/
    │   ├── casouso/
    │   ├── modelo/
    │   ├── repositorio/
    │   └── di/
    └── feature_presentacion/
        ├── viewmodels/
        ├── pantallas/
        ├── estados/
        └── componentes/
```

## Data Flow

```
UI Event
    │
    ▼
ViewModel
    │
    ├── Calls UseCase
    │
    ▼
UseCase (Domain)
    │
    ├── Calls Repository Interface
    │
    ▼
Repository Implementation (Data)
    │
    ├── DataSource (Local/Remote)
    │
    ▼
API Service / Room DAO
    │
    ▼
Response (DTO)
    │
    ├── Mapped to Domain Model
    │
    ▼
Result<T> wrapped in Flow
    │
    ▼
ViewModel collects
    │
    ├── Updates StateFlow
    │
    ▼
UI observes with collectAsStateWithLifecycle()
```

## Key Decisions (ADRs)

| ADR | Decision |
|-----|----------|
| ADR-001 | MVVM + Feature Module Architecture |
| ADR-002 | Kotlin SDK Target 34+ |
| ADR-003 | Gradle Version Catalogs |
| ADR-004 | Multiple Build Types (debug/staging/release/huawei) |
| ADR-005 | Repository Pattern with Room + SQLCipher |
| ADR-006 | Firebase Services Integration |
| ADR-007 | Observability with Firebase |
| ADR-008 | Secrets via BuildConfig |
| ADR-009 | Dagger Hilt for DI |
| ADR-010 | StateFlow/SharedFlow for UI State |
| ADR-011 | MockK + Turbine for Testing |
| ADR-012 | Architecture Tests |
| ADR-013 | Result Type Pattern |
| ADR-014 | Azure B2C with MSAL |
