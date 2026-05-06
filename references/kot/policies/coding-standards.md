# Coding Standards

> **Mandatory Compliance**: All code must follow these standards. Violations are flagged in code review and CI/CD.

## 1. Language and Naming

### Code Language: Spanish

All code elements MUST be written in Spanish:
- Class names
- Function names
- Variable names
- Comments
- Documentation strings

**Exception**: Technical terms remain in English (ViewModel, Flow, Composable, etc.)

```kotlin
// ✅ Correct
class NotasViewModel : ViewModel() {
    private val _estadoUi = MutableStateFlow<NotasEstadoUi>(NotasEstadoUi.Cargando)
    val estadoUi: StateFlow<NotasEstadoUi> = _estadoUi.asStateFlow()
    
    fun obtenerNotas() { ... }
    fun guardarNota(nota: Nota) { ... }
}

// ❌ Incorrect
class NotesViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(...)
    fun getNotes() { ... }
}
```

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Class | PascalCase (Spanish) | `GestorAutenticacion` |
| Interface | `I` prefix + PascalCase | `INotasRepositorio` |
| Function | camelCase (Spanish) | `obtenerUsuarioPorId()` |
| Variable | camelCase (Spanish) | `listaNotas` |
| Constant | SCREAMING_SNAKE | `TIEMPO_ESPERA_MAXIMO` |
| Package | lowercase (Spanish) | `com.empresa.app.notas.datos` |
| File | PascalCase matching class | `NotasRepositorio.kt` |

### Specific Naming Patterns

```kotlin
// Use Case
class ObtenerNotasCasoUso
class GuardarNotaCasoUso
class EliminarNotaCasoUso

// Repository
interface INotasRepositorio
class NotasRepositorioImpl

// DataSource
interface IFuenteNotasLocal
interface IFuenteNotasRemota
class FuenteNotasLocalImpl

// ViewModel
class NotasViewModel
class DetalleNotaViewModel

// UI State
sealed class NotasEstadoUi
data class DetalleNotaEstadoUi

// Composable
@Composable fun NotasPantalla()
@Composable fun NotasControladorPantalla()
@Composable fun TarjetaNota()

// DI Module
object DominioModuloNotas
abstract class DatosModuloNotas
```

## 2. Architecture Patterns

### StateFlow over LiveData

```kotlin
// ✅ Correct - StateFlow
private val _estadoUi = MutableStateFlow<EstadoUi>(EstadoUi.Inicial)
val estadoUi: StateFlow<EstadoUi> = _estadoUi.asStateFlow()

// ❌ Avoid - LiveData
private val _estadoUi = MutableLiveData<EstadoUi>()
val estadoUi: LiveData<EstadoUi> = _estadoUi
```

### Flows over Callbacks

```kotlin
// ✅ Correct - Flow
fun observarCambios(): Flow<List<Nota>> = flow {
    emit(fuenteLocal.obtenerNotas())
}

// ❌ Avoid - Callback
fun observarCambios(callback: (List<Nota>) -> Unit) {
    callback(fuenteLocal.obtenerNotas())
}
```

### Sealed Classes for State

```kotlin
// ✅ Correct - Sealed class
sealed class NotasEstadoUi {
    object Cargando : NotasEstadoUi()
    data class Correcto(val notas: List<Nota>) : NotasEstadoUi()
    data class Error(val mensaje: String) : NotasEstadoUi()
}

// ❌ Avoid - Data class with nullable fields
data class NotasEstadoUi(
    val cargando: Boolean = false,
    val notas: List<Nota>? = null,
    val error: String? = null
)
```

### UseCase with invoke Operator

```kotlin
// ✅ Correct
class ObtenerNotasCasoUso @Inject constructor(
    private val repositorio: INotasRepositorio
) {
    operator fun invoke(): Flow<Resultado<List<Nota>>> {
        return repositorio.obtenerNotas()
    }
}

// Usage
val resultado = obtenerNotasCasoUso()

// ❌ Avoid
class ObtenerNotasCasoUso {
    fun ejecutar(): Flow<...> { ... }
}
```

## 3. Coroutines and Concurrency

### Never Use GlobalScope

```kotlin
// ✅ Correct - viewModelScope
viewModelScope.launch {
    val resultado = obtenerDatos()
}

// ✅ Correct - lifecycle scope in Compose
val scope = rememberCoroutineScope()
scope.launch { ... }

// ❌ Forbidden
GlobalScope.launch {
    val resultado = obtenerDatos()
}
```

### Dispatcher Injection

```kotlin
// ✅ Correct - Injected dispatchers
class NotasRepositorioImpl @Inject constructor(
    private val fuenteRemota: IFuenteNotasRemota,
    @IoDispatcher private val despachadorIo: CoroutineDispatcher
) : INotasRepositorio {
    override fun obtenerNotas() = flow {
        withContext(despachadorIo) {
            // IO operation
        }
    }
}

// ❌ Avoid - Hardcoded dispatcher
withContext(Dispatchers.IO) { ... }
```

### Flow Collection in Compose

```kotlin
// ✅ Correct - lifecycle aware
val estado by viewModel.estadoUi.collectAsStateWithLifecycle()

// ❌ Avoid - not lifecycle aware
val estado by viewModel.estadoUi.collectAsState()
```

## 4. Dependency Injection

### Hilt Modules Structure

```kotlin
// Domain module - ViewModelComponent scoped
@Module
@InstallIn(ViewModelComponent::class)
object DominioModuloNotas {
    @Provides
    fun proveerObtenerNotasCasoUso(
        repositorio: INotasRepositorio
    ) = ObtenerNotasCasoUso(repositorio)
}

// Data module - SingletonComponent scoped
@Module
@InstallIn(SingletonComponent::class)
abstract class DatosModuloNotas {
    @Binds
    @Singleton
    abstract fun bindRepositorio(impl: NotasRepositorioImpl): INotasRepositorio
}
```

### Custom Qualifiers for Dispatchers

```kotlin
@Retention(AnnotationRetention.BINARY)
@Qualifier
annotation class IoDispatcher

@Retention(AnnotationRetention.BINARY)
@Qualifier
annotation class MainDispatcher

@Retention(AnnotationRetention.BINARY)
@Qualifier
annotation class DefaultDispatcher

@Module
@InstallIn(SingletonComponent::class)
object ModuloDespachadores {
    @IoDispatcher
    @Provides
    fun proveerDespachadorIo(): CoroutineDispatcher = Dispatchers.IO

    @MainDispatcher
    @Provides
    fun proveerDespachadorMain(): CoroutineDispatcher = Dispatchers.Main

    @DefaultDispatcher
    @Provides
    fun proveerDespachadorDefault(): CoroutineDispatcher = Dispatchers.Default
}
```

## 5. Jetpack Compose

### Stateless Composables

```kotlin
// ✅ Correct - Stateless, state hoisting
@Composable
fun TarjetaNota(
    nota: Nota,
    alHacerClic: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.clickable(onClick = alHacerClic)
    ) {
        Text(text = nota.titulo)
    }
}

// Controller handles state
@Composable
fun NotasControladorPantalla(
    viewModel: NotasViewModel = hiltViewModel()
) {
    val estado by viewModel.estadoUi.collectAsStateWithLifecycle()
    NotasPantalla(estado = estado, alHacerClic = viewModel::seleccionarNota)
}
```

### Remember and Derived State

```kotlin
// ✅ Correct usage of remember
@Composable
fun ListaNotas(notas: List<Nota>) {
    val notasOrdenadas = remember(notas) {
        notas.sortedBy { it.fechaCreacion }
    }
    
    val conteoNotas = remember(notas) {
        derivedStateOf { notas.size }
    }
}
```

### Avoid Recomposition Issues

```kotlin
// ✅ Correct - stable lambda
@Composable
fun BotonGuardar(viewModel: NotasViewModel) {
    val guardar = remember { { viewModel.guardarNota() } }
    Button(onClick = guardar) { Text("Guardar") }
}

// ❌ Avoid - new lambda on each recomposition
@Composable
fun BotonGuardar(viewModel: NotasViewModel) {
    Button(onClick = { viewModel.guardarNota() }) { Text("Guardar") }
}
```

## 6. Navigation

### Command Pattern for Navigation

```kotlin
// Navigation commands
sealed class ComandoNavegacion {
    object IrAInicio : ComandoNavegacion()
    data class IrADetalle(val id: Long) : ComandoNavegacion()
    object Regresar : ComandoNavegacion()
}

// ViewModel emits commands
class NotasViewModel : ViewModel() {
    private val _comandoNavegacion = MutableSharedFlow<ComandoNavegacion>()
    val comandoNavegacion: SharedFlow<ComandoNavegacion> = _comandoNavegacion.asSharedFlow()
    
    fun navegarADetalle(id: Long) {
        viewModelScope.launch {
            _comandoNavegacion.emit(ComandoNavegacion.IrADetalle(id))
        }
    }
}

// UI collects and navigates
LaunchedEffect(Unit) {
    viewModel.comandoNavegacion.collect { comando ->
        when (comando) {
            is ComandoNavegacion.IrADetalle -> navController.navigate("detalle/${comando.id}")
            ComandoNavegacion.Regresar -> navController.popBackStack()
            // ...
        }
    }
}
```

## 7. Error Handling

### Business Exception Pattern

```kotlin
class ExcepcionNegocio(
    val tipo: TipoExcepcionNegocio,
    message: String,
    cause: Throwable? = null
) : Exception(message, cause)

enum class TipoExcepcionNegocio {
    NO_ENCONTRADO,
    VALIDACION_FALLIDA,
    NO_AUTORIZADO,
    CONFLICTO,
    ERROR_SERVIDOR
}
```

### Result Type Usage

```kotlin
// In Repository
override fun obtenerNota(id: Long): Flow<Resultado<Nota>> = flow {
    emit(Resultado.Cargando())
    try {
        val nota = fuenteLocal.obtenerNota(id)
        if (nota != null) {
            emit(Resultado.Correcto(Estado.CORRECTO, nota))
        } else {
            emit(Resultado.Error(Estado.ERROR, "Nota no encontrada"))
        }
    } catch (e: Exception) {
        emit(Resultado.Error(Estado.ERROR, e.message ?: "Error desconocido", excepcion = e))
    }
}
```

## 8. Code Organization

### File Structure

```kotlin
// 1. Package declaration
package com.empresa.app.notas.datos.repositorio

// 2. Imports (sorted: Android, Kotlin, Java, Third-party, Project)
import android.content.Context
import kotlinx.coroutines.flow.Flow
import javax.inject.Inject
import com.empresa.app.notas.dominio.modelo.Nota

// 3. Class documentation
/**
 * Notes repository implementation.
 * 
 * Manages retrieval and storage of notes from local and remote sources.
 */

// 4. Class declaration
class NotasRepositorioImpl @Inject constructor(
    private val fuenteLocal: IFuenteNotasLocal,
    private val fuenteRemota: IFuenteNotasRemota
) : INotasRepositorio {

    // 5. Companion object (constants)
    companion object {
        private const val TIEMPO_CACHE_MS = 60_000L
    }

    // 6. Properties
    private var ultimaActualizacion: Long = 0

    // 7. Public methods
    override fun obtenerNotas(): Flow<Resultado<List<Nota>>> = ...

    // 8. Private methods
    private fun necesitaActualizacion(): Boolean = ...
}
```

### Maximum Line Length

- **120 characters** maximum
- Break long function signatures:

```kotlin
// ✅ Correct
fun procesarNota(
    nota: Nota,
    configuracion: ConfiguracionProceso,
    callback: (Resultado<Nota>) -> Unit
): Flow<EstadoProceso> {
    // ...
}
```

## 9. Documentation

### KDoc for Public APIs

```kotlin
/**
 * Gets all notes from the repository.
 * 
 * First tries to get data from the local cache. If the cache is expired,
 * syncs with the remote server.
 * 
 * @return Flow that emits [Resultado] with the list of notes
 * @throws ExcepcionNegocio if there is no connection and no cache
 */
override fun obtenerNotas(): Flow<Resultado<List<Nota>>>
```

### TODO Comments

```kotlin
// TODO(JIRA-123): Implement pagination when the backend supports it
// FIXME(JIRA-456): This workaround should be removed after release 2.0
```

## 10. Prohibited Practices

- `!!` operator without documented reason
- `lateinit` in Composables
- Mutable public properties in ViewModels
- Business logic in Composables
- Direct database access from ViewModel
- Nested callbacks (callback hell)
- `Thread.sleep()` or blocking calls on main thread
- Hardcoded strings in UI (use string resources)
- Magic numbers without constants
- Empty catch blocks
- Print statements (`println`, `print`)

## 11. Feature Module Layer Structure

Each feature module MUST have exactly 3 layer packages:

```
{modulo}/src/main/java/com/sistecredito/*app*/
├── {modulo}_datos/              # Data Layer
│   ├── di/
│   │   ├── {Feature}ModuloDatos.kt       # @Provides
│   │   └── {Feature}BindModuloDatos.kt   # @Binds
│   ├── fuente/
│   │   ├── api/
│   │   │   └── Ruta{Feature}Modulo.kt    # Retrofit interface
│   │   └── Fuente{Feature}Remoto.kt      # Calls the API
│   └── repositorio/
│       └── {Feature}RepositorioImpl.kt   # Implementation
│
├── {modulo}_dominio/            # Domain Layer
│   ├── di/
│   │   ├── {Feature}ModuloDominio.kt
│   │   └── {Feature}BindModuloDominio.kt
│   ├── repositorio/
│   │   └── I{Feature}Repositorio.kt      # Interface
│   └── casouso/
│       ├── {Accion}{Entidad}CasoUso.kt
│       └── Modulo{Feature}CasoUso.kt     # Aggregator
│
└── {modulo}_presentacion/       # Presentation Layer
    ├── di/
    ├── evento/
    │   ├── {Feature}EstadoUi.kt          # Sealed interface
    │   └── {Feature}Evento.kt            # Sealed class
    ├── viewmodels/
    │   └── {Feature}ViewModel.kt
    └── pantalla/
        └── {Feature}Pantalla.kt          # Composable
```

### Detailed Naming Table

| Artifact | Pattern | Example |
|----------|---------|---------|
| ViewModel | `{Feature}ViewModel.kt` | `FormularioComprasViewModel.kt` |
| UseCase | `{Accion}{Entidad}CasoUso.kt` | `ObtenerCreditoDetalleCasoUso.kt` |
| UseCase Aggregator | `Modulo{Feature}CasoUso.kt` | `ModuloComprasCasoUso.kt` |
| Repository (interface) | `I{Entidad}Repositorio.kt` | `IComprasRepositorio.kt` |
| Repository (impl) | `{Entidad}RepositorioImpl.kt` | `ComprasRepositorioImpl.kt` |
| DataSource | `Fuente{Entidad}{Tipo}.kt` | `FuenteComprasRemoto.kt` |
| Retrofit API | `Ruta{Entidad}Modulo.kt` | `RutaComprasModulo.kt` |
| Screen Composable | `{Nombre}Pantalla.kt` | `FormularioComprasPantalla.kt` |
| UI State | `{Feature}EstadoUi.kt` | `ComprasEstadoUi.kt` |
| Navigation Events | `EstadoNavegacion{Feature}.kt` | `EstadoNavegacionCompras.kt` |
| Screen Events | `{Feature}Evento.kt` | `DashboardEvento.kt` |
| DI Module (Data) | `{Feature}ModuloDatos.kt` | `ComprasModuloDatos.kt` |
| DI Module (Domain) | `{Feature}ModuloDominio.kt` | `ComprasModuloDominio.kt` |
| DI Bind (Data) | `{Feature}BindModuloDatos.kt` | `ComprasBindModuloDatos.kt` |
| DI Bind (Domain) | `{Feature}BindModuloDominio.kt` | `ComprasBindModuloDominio.kt` |

### Test Naming Convention

```kotlin
// Format: `cuando {condition}, entonces {expected result}`
@Test
fun `cuando se invoca el caso de uso con datos validos, entonces se llama el repositorio`()

@Test
fun `cuando el servidor retorna error 500, entonces el estado es Error`()
```

## 12. CoreUI Atomic Design

The `core-ui` module organizes reusable components following atomic design:

| Level | Description | Example |
|-------|-------------|---------|
| `/Atomos` | Basic building blocks | `BotonPrimario`, `CampoTexto`, `TarjetaInformacion` |
| `/Moleculas` | Atom combinations | `FormularioInicioSesion`, `ListaElementos`, `EncabezadoPantalla` |
| `/Organismos` | Molecule combinations | `PantallaPerfil`, `Dashboard`, `PantallaConfiguracion` |
| `/Plantillas` | Organism combinations | `PantallaPrincipal`, `PantallaDetalles`, `PantallaLista` |

Always check CoreUI before creating new components. If a design requires a component not available in CoreUI, consult whether to create new or modify existing.
