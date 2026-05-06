---
name: kot-add-feature
description: "Add a new feature following MVVM layer execution order"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Add Feature

## Purpose

Add a new feature to an Android/Kotlin project following strict MVVM layer execution order: Domain → Data → Presentation → Tests.

## When to Use

- Adding new screens
- Adding new functionality
- Implementing user stories
- Extending existing features

## Execution Flow — 6 Phases

### Phase 1: Feature Analysis

Before coding:
1. Identify feature scope
2. Determine affected module (existing or new)
3. List required components per layer
4. Check ADRs for relevant decisions

### Phase 2: Domain Layer

Execute first — business logic and contracts.

#### 2.1 Create Domain Model

```kotlin
// dominio/modelo/[Entity].kt
data class Nota(
    val id: Long,
    val titulo: String,
    val contenido: String,
    val fechaCreacion: Long
)
```

#### 2.2 Create Repository Interface

```kotlin
// dominio/repositorio/I[Entity]Repositorio.kt
interface INotasRepositorio {
    fun obtenerNotas(): Flow<Resultado<List<Nota>>>
    fun obtenerNotaPorId(id: Long): Flow<Resultado<Nota>>
    suspend fun guardarNota(nota: Nota): Resultado<Long>
    suspend fun eliminarNota(id: Long): Resultado<Unit>
}
```

#### 2.3 Create UseCases

```kotlin
// dominio/casouso/Obtener[Entity]CasoUso.kt
class ObtenerNotasCasoUso @Inject constructor(
    private val repositorio: INotasRepositorio
) {
    operator fun invoke(): Flow<Resultado<List<Nota>>> {
        return repositorio.obtenerNotas()
    }
}

// dominio/casouso/Guardar[Entity]CasoUso.kt
class GuardarNotaCasoUso @Inject constructor(
    private val repositorio: INotasRepositorio
) {
    suspend operator fun invoke(nota: Nota): Resultado<Long> {
        return repositorio.guardarNota(nota)
    }
}
```

#### 2.4 Create Domain DI Module

```kotlin
// dominio/di/DominioModulo[Feature].kt
@Module
@InstallIn(ViewModelComponent::class)
object DominioModuloNotas {
    
    @Provides
    fun proveerObtenerNotasCasoUso(
        repositorio: INotasRepositorio
    ) = ObtenerNotasCasoUso(repositorio)
    
    @Provides
    fun proveerGuardarNotaCasoUso(
        repositorio: INotasRepositorio
    ) = GuardarNotaCasoUso(repositorio)
}
```

### Phase 3: Data Layer

Execute second — implementations and data access.

#### 3.1 Create Entity (Room)

```kotlin
// datos/local/entidad/[Entity]Entidad.kt
@Entity(tableName = "notas")
data class NotaEntidad(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val titulo: String,
    val contenido: String,
    val fechaCreacion: Long
) {
    fun toDomain() = Nota(id, titulo, contenido, fechaCreacion)
    
    companion object {
        fun fromDomain(domain: Nota) = NotaEntidad(
            domain.id, domain.titulo, domain.contenido, domain.fechaCreacion
        )
    }
}
```

#### 3.2 Create DAO

```kotlin
// datos/local/dao/[Entity]Dao.kt
@Dao
interface NotaDao {
    @Query("SELECT * FROM notas ORDER BY fechaCreacion DESC")
    fun obtenerTodas(): Flow<List<NotaEntidad>>
    
    @Query("SELECT * FROM notas WHERE id = :id")
    suspend fun obtenerPorId(id: Long): NotaEntidad?
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertar(nota: NotaEntidad): Long
    
    @Delete
    suspend fun eliminar(nota: NotaEntidad)
}
```

#### 3.3 Create DataSource Interface and Implementation

```kotlin
// datos/fuente/IFuente[Entity]Local.kt
interface IFuenteNotasLocal {
    fun obtenerNotas(): Flow<List<NotaEntidad>>
    suspend fun obtenerNotaPorId(id: Long): NotaEntidad?
    suspend fun guardarNota(nota: NotaEntidad): Long
}

// datos/fuente/FuenteNotasLocalImpl.kt
class FuenteNotasLocalImpl @Inject constructor(
    private val notaDao: NotaDao
) : IFuenteNotasLocal {
    override fun obtenerNotas() = notaDao.obtenerTodas()
    override suspend fun obtenerNotaPorId(id: Long) = notaDao.obtenerPorId(id)
    override suspend fun guardarNota(nota: NotaEntidad) = notaDao.insertar(nota)
}
```

#### 3.4 Create Repository Implementation

```kotlin
// datos/repositorio/[Entity]RepositorioImpl.kt
class NotasRepositorioImpl @Inject constructor(
    private val fuenteLocal: IFuenteNotasLocal,
    @IoDispatcher private val despachadorIo: CoroutineDispatcher
) : INotasRepositorio {
    
    override fun obtenerNotas(): Flow<Resultado<List<Nota>>> = flow {
        emit(Resultado.Cargando())
        try {
            fuenteLocal.obtenerNotas().collect { entidades ->
                emit(Resultado.Correcto(datos = entidades.map { it.toDomain() }))
            }
        } catch (e: Exception) {
            emit(Resultado.Error(mensaje = e.message ?: "Error", excepcion = e))
        }
    }.flowOn(despachadorIo)
    
    override suspend fun guardarNota(nota: Nota): Resultado<Long> {
        return withContext(despachadorIo) {
            try {
                val id = fuenteLocal.guardarNota(NotaEntidad.fromDomain(nota))
                Resultado.Correcto(datos = id)
            } catch (e: Exception) {
                Resultado.Error(mensaje = e.message ?: "Error", excepcion = e)
            }
        }
    }
}
```

#### 3.5 Create Data DI Module

```kotlin
// datos/di/DatosModulo[Feature].kt
@Module
@InstallIn(SingletonComponent::class)
abstract class DatosModuloNotas {
    
    @Binds
    @Singleton
    abstract fun bindRepositorio(impl: NotasRepositorioImpl): INotasRepositorio
    
    @Binds
    @Singleton
    abstract fun bindFuenteLocal(impl: FuenteNotasLocalImpl): IFuenteNotasLocal
}
```

### Phase 4: Presentation Layer

Execute third — UI and state management.

#### 4.1 Create UI State

```kotlin
// presentacion/estados/[Feature]EstadoUi.kt
sealed class NotasEstadoUi {
    object Cargando : NotasEstadoUi()
    data class Correcto(val notas: List<Nota>) : NotasEstadoUi()
    data class Error(val mensaje: String, val reintentable: Boolean = true) : NotasEstadoUi()
}

// Events for one-time actions
sealed class NotasEventoUi {
    data class MostrarSnackbar(val mensaje: String) : NotasEventoUi()
    object NavegarADetalle : NotasEventoUi()
}
```

#### 4.2 Create ViewModel

```kotlin
// presentacion/viewmodels/[Feature]ViewModel.kt
@HiltViewModel
class NotasViewModel @Inject constructor(
    private val obtenerNotasCasoUso: ObtenerNotasCasoUso,
    private val guardarNotaCasoUso: GuardarNotaCasoUso
) : ViewModel() {
    
    private val _estadoUi = MutableStateFlow<NotasEstadoUi>(NotasEstadoUi.Cargando)
    val estadoUi: StateFlow<NotasEstadoUi> = _estadoUi.asStateFlow()
    
    private val _eventos = MutableSharedFlow<NotasEventoUi>()
    val eventos: SharedFlow<NotasEventoUi> = _eventos.asSharedFlow()
    
    init {
        cargarNotas()
    }
    
    fun cargarNotas() {
        viewModelScope.launch {
            obtenerNotasCasoUso().collect { resultado ->
                _estadoUi.value = when (resultado) {
                    is Resultado.Cargando -> NotasEstadoUi.Cargando
                    is Resultado.Correcto -> NotasEstadoUi.Correcto(resultado.datos ?: emptyList())
                    is Resultado.Error -> NotasEstadoUi.Error(resultado.mensaje ?: "Error")
                }
            }
        }
    }
}
```

#### 4.3 Create Composable Screen

```kotlin
// presentacion/pantallas/[Feature]Pantalla.kt
@Composable
fun NotasControladorPantalla(
    viewModel: NotasViewModel = hiltViewModel(),
    onNavegarADetalle: (Long) -> Unit
) {
    val estado by viewModel.estadoUi.collectAsStateWithLifecycle()
    
    LaunchedEffect(Unit) {
        viewModel.eventos.collect { evento ->
            when (evento) {
                is NotasEventoUi.NavegarADetalle -> { /* navigate */ }
                is NotasEventoUi.MostrarSnackbar -> { /* show snackbar */ }
            }
        }
    }
    
    NotasPantalla(
        estado = estado,
        onRecargar = viewModel::cargarNotas,
        onNotaClic = onNavegarADetalle
    )
}

@Composable
private fun NotasPantalla(
    estado: NotasEstadoUi,
    onRecargar: () -> Unit,
    onNotaClic: (Long) -> Unit
) {
    when (estado) {
        is NotasEstadoUi.Cargando -> IndicadorCarga()
        is NotasEstadoUi.Correcto -> ListaNotas(estado.notas, onNotaClic)
        is NotasEstadoUi.Error -> PantallaError(estado.mensaje, onRecargar)
    }
}
```

### Phase 5: Testing

Execute fourth — verify functionality.

```kotlin
// test/viewmodels/NotasViewModelTest.kt
@OptIn(ExperimentalCoroutinesApi::class)
class NotasViewModelTest {
    @get:Rule val mainDispatcherRule = MainDispatcherRule()
    
    private val obtenerNotasCasoUso: ObtenerNotasCasoUso = mockk()
    
    @Test
    fun `cargarNotas con datos actualiza estado correctamente`() = runTest {
        // ... test implementation
    }
}
```

### Phase 6: Documentation

Update CHANGELOG:
```markdown
## [Unreleased]
### Added
- New notes functionality (#123)
```

## Auto-Shielding

Before each phase:
- Verify previous phase completed
- Check for compilation errors
- Run security scan on new code

## Rules

- **Layer order is MANDATORY** — Domain → Data → Presentation
- **No skipping layers** — even for "simple" features
- **Spanish naming** — classes, methods, variables
- **StateFlow for state** — not LiveData
- **Sealed classes for UI state**
- **Tests after code** — not optional
- **Document changes** — CHANGELOG update
