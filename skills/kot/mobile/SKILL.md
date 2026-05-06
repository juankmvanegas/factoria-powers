---
name: kot-mobile
description: "Android/Kotlin specialist — automatically applies enterprise standards"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Mobile Android/Kotlin — Enterprise Standards

This skill activates automatically when writing Android/Kotlin code: ViewModels, UseCases, Repositories, Composables, or any mobile component.

## MVVM + Feature Modules Architecture

Always respect the dependency hierarchy (current ADR):

1. **core** — Entities, extensions, constants, Result type. No external dependencies.
2. **domain** — UseCases, Repository interfaces. Depends only on core.
3. **data** — Repository implementations, DAOs, DataStore. Depends on core and domain.
4. **network** — Retrofit services, API DTOs. Depends on core.
5. **feature-{name}** — ViewModels, Screens (Compose). Depends on domain and core-ui.

Dependencies flow **always inward**: feature → domain → core. Never in the opposite direction.

## Dependency Injection with Hilt

- Every dependency is injected through its interface, never as a concrete implementation.
- Use `@Inject constructor` for all injectable classes.
- Use `@HiltViewModel` for ViewModels.
- Use `@Module` and `@Provides` for external dependencies.
- Use `@Binds` for interface → implementation binding.
- Use appropriate scopes: `@Singleton`, `@ViewModelScoped`, `@ActivityScoped`.

## Error Handling with Result Type

- Use `Resultado<T>` (sealed class) for operations that can fail.
- Never throw exceptions for business errors.
- Always handle `Resultado.Exito` and `Resultado.Error` in the ViewModel.
- Errors propagate as state, not as exceptions.

```kotlin
sealed class Resultado<out T> {
    data class Exito<T>(val datos: T) : Resultado<T>()
    data class Error(val mensaje: String, val codigo: Int? = null) : Resultado<Nothing>()
}
```

## StateFlow for UI State

- Use `MutableStateFlow` for ViewModel internal state.
- Expose as `StateFlow<UiState>` (immutable).
- One single `UiState` data class per screen.
- Loading/error/success states included in UiState.

```kotlin
data class LoginUiState(
    val cargando: Boolean = false,
    val error: String? = null,
    val usuarioLogueado: Boolean = false
)
```

## SharedFlow for One-Shot Events

- Use `MutableSharedFlow` for events that should not survive recomposition.
- Navigate, show snackbar, etc. are events, not state.
- `replay = 0` for one-shot events.

## Coroutines and Dispatchers

- Use `viewModelScope` in ViewModels.
- Inject dispatchers with `@IoDispatcher`, `@MainDispatcher`, `@DefaultDispatcher`.
- I/O operations always on `Dispatchers.IO`.
- UI updates always on `Dispatchers.Main`.

## Compose Best Practices

- Composables without business logic (UI only).
- State hoisting: state lives in the ViewModel, not in composables.
- Use `remember` and `derivedStateOf` for optimization.
- Preview with sample data.
- Modifier as first optional parameter.

## Repository Pattern with Flow<Resultado<T>>

All repositories MUST return `Flow<Resultado<T>>`. This is the standard data flow pattern:

```kotlin
class ComprasRepositorioImpl @Inject constructor(
    private val fuenteComprasRemoto: FuenteComprasRemoto
) : IComprasRepositorio {

    override fun crearTransaccion(...): Flow<Resultado<Contenido>> = flow {
        emit(
            try {
                Resultado.Correcto(datos = fuenteComprasRemoto.crearTransaccion(...))
            } catch (e: Exception) {
                Resultado.Error(
                    mensaje = ClasificacionError
                        .getClasificacionError(Util.obtenerCodigoError(e))
                        .clave.toString(),
                    excepcion = e
                )
            }
        )
    }
}
```

## UseCase Aggregator Pattern

Group related UseCases in a single data class for ViewModel injection:

```kotlin
@Keep
data class ModuloComprasCasoUso @Inject constructor(
    val crearCompraCasoUso: CrearCompraCasoUso,
    val obtenerComprasCasoUso: ObtenerComprasCasoUso,
)
```

## Server-Driven UI (SDUI)

For screens defined by backend JSON, follow ADR-015:

```
JSON API → DTO (Componente) → TipoComponentes.crearComponente()
        → FabricaComponentes (sealed) → ConstruirComponentes.PintarComponentes()
        → Composable rendered
```

- Top-level components registered in `Contenedores` enum
- Subcomponents registered in `Anidados` enum
- Unknown types fallback to `Blanco` — never crash
- All factory data classes use `@Keep` for ProGuard
- Use `component-builder` skill for creating new SDUI components

## Feature Module Layer Structure

Each feature module has exactly 3 layer packages: `{modulo}_datos/`, `{modulo}_dominio/`, `{modulo}_presentacion/`. See `coding-standards.md` section 11 for the full directory structure and naming table.
