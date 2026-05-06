# ADR-001: MVVM Architecture with Feature Module Structure

## Status
Accepted

## Date
2024-04-18 (Factoria-Kot v1.0.0)

## Context
The organization needed a standardized mobile architecture for Android/Kotlin applications that enforces separation of concerns, testability, maintainability, and scalability across all teams.

## Decision
Adopt MVVM (Model-View-ViewModel) architecture with modular structure by features:

### Layers per Feature Module

1. **datos (Data Layer)** - Data sources, repository implementations, DTOs, DI modules
2. **dominio (Domain Layer)** - Use cases, repository interfaces, domain models, DI modules  
3. **presentacion (Presentation Layer)** - ViewModels, UI state, Composables, UI components

### Project Structure

```
app/                         # Application entry point
core/                        # Shared core module
├── core_datos/              # Shared data layer
├── core_dominio/            # Shared domain layer
└── utils/                   # Crosscutting concerns
core-ui/                     # Shared UI components
[feature-modules]/           # Feature modules
├── feature_datos/
├── feature_dominio/
└── feature_presentacion/
```

### Standard Data Flow

```
ApiService → FuenteDatos → Repositorio → CasoUso → ViewModel → UI
```

### Dependency Rule

```
presentacion → dominio → datos
                 ↓
               core
```

## Consequences

- Feature modules can be developed independently
- Clear separation between data, business logic, and UI
- Repositories are the single source of truth
- DTOs NEVER reach the UI - they are mapped to domain models
- ViewModels only expose state via StateFlow/SharedFlow
- UI components are stateless (state hoisting)
- New features follow the same modular structure
- Architecture tests enforce layer dependencies
