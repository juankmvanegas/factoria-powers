# ADR-009: Dagger Hilt for Dependency Injection

## Status
Accepted

## Date
2024-04-18 (Factoria-Kot v1.0.0)

## Context
Dependency injection is essential for testability, modularity, and clean architecture. Android requires a DI framework that integrates with the component lifecycle.

## Decision
Use Dagger Hilt as the standard dependency injection framework:

### Setup

```kotlin
// build.gradle.kts (app)
plugins {
    id("com.google.dagger.hilt.android")
    id("com.google.devtools.ksp")
}

dependencies {
    implementation(libs.hilt.android)
    ksp(libs.hilt.compiler)
    implementation(libs.hilt.navigation.compose)
    
    // Testing
    testImplementation(libs.hilt.android.testing)
    kspTest(libs.hilt.compiler)
}
```

### Application Entry Point

```kotlin
@HiltAndroidApp
class SisteApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize Firebase, etc.
    }
}
```

### Activity/Fragment

```kotlin
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    
    @Inject
    lateinit var controladorSesion: ControladorSesion
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            AppTheme {
                AppNavGraph()
            }
        }
    }
}
```

### ViewModel Injection

```kotlin
@HiltViewModel
class NotasViewModel @Inject constructor(
    private val obtenerNotasCasoUso: ObtenerNotasCasoUso,
    private val guardarNotaCasoUso: GuardarNotaCasoUso,
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {
    // ...
}

// In Composable
@Composable
fun NotasControladorPantalla(
    viewModel: NotasViewModel = hiltViewModel()
) {
    // ...
}
```

### Module Scopes

```kotlin
// Singleton - Application-wide
@Module
@InstallIn(SingletonComponent::class)
object CoreModuloDatos {
    
    @Singleton
    @Provides
    fun proveerBaseDatos(app: Application): BaseDatosApp {
        // ...
    }
    
    @Singleton
    @Provides
    @IoDispatcher
    fun proveerDespachadorIo(): CoroutineDispatcher = Dispatchers.IO
}

// ViewModelComponent - ViewModel-scoped
@Module
@InstallIn(ViewModelComponent::class)
object DominioModuloNotas {
    
    @Provides
    fun proveerObtenerNotasCasoUso(
        repositorio: INotasRepositorio
    ) = ObtenerNotasCasoUso(repositorio)
}

// Abstract module with Binds
@Module
@InstallIn(SingletonComponent::class)
abstract class DatosModuloNotas {
    
    @Binds
    @Singleton
    abstract fun bindRepositorio(
        impl: NotasRepositorioImpl
    ): INotasRepositorio
}
```

### Custom Qualifiers

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

@Retention(AnnotationRetention.BINARY)
@Qualifier
annotation class PreferenciasApp

// Module providing qualified dependencies
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

### Testing with Hilt

```kotlin
@HiltAndroidTest
class NotasViewModelTest {
    
    @get:Rule
    val hiltRule = HiltAndroidRule(this)
    
    @Inject
    lateinit var repositorio: INotasRepositorio
    
    @Before
    fun setup() {
        hiltRule.inject()
    }
    
    @Test
    fun testObtenerNotas() {
        // Test with real injected dependencies
    }
}

// Test module to replace dependencies
@Module
@InstallIn(SingletonComponent::class)
@TestInstallIn(replaces = [DatosModuloNotas::class])
abstract class TestDatosModuloNotas {
    
    @Binds
    @Singleton
    abstract fun bindRepositorio(
        impl: FakeNotasRepositorio
    ): INotasRepositorio
}
```

## Consequences

- All dependencies are constructor-injected
- ViewModels automatically injected in Composables via `hiltViewModel()`
- Testability improved with easy dependency replacement
- Module boundaries enforced by Hilt scopes
- Build time increased due to code generation (use KSP for speed)
- Compile-time verification of dependency graph
- No manual service locator patterns
