# Testing Policy

> **Mandatory Compliance**: All code changes must include tests. Coverage gates are enforced in CI/CD pipeline. No exceptions without ADR approval.

## 1. Testing Pyramid

```
         ┌─────────┐
         │   UI    │  ← Compose UI Tests (slow, few)
         │  Tests  │
         ├─────────┤
         │Integra- │  ← Repository + DataSource tests
         │  tion   │
         ├─────────┤
         │  Unit   │  ← UseCases, ViewModels, Mappers (fast, many)
         │  Tests  │
         └─────────┘
```

## 2. Testing Frameworks

| Purpose | Framework | Version |
|---------|-----------|---------|
| Unit Testing | JUnit | 4.13.2 |
| Mocking | MockK | 1.14+ |
| Coroutines Testing | kotlinx-coroutines-test | 1.8+ |
| Flow Testing | Turbine | 1.2+ |
| Assertions | Truth / AssertJ | - |
| UI Testing | Compose UI Test | - |
| Integration | Robolectric | 4.15+ |
| Coverage | Kover / Jacoco | - |

## 3. Test Structure

### Directory Organization

```
module/
├── src/main/java/          # Production code
├── src/test/java/          # Unit tests (JVM)
│   ├── viewmodels/         # ViewModel tests
│   ├── casousos/           # UseCase tests
│   ├── repositorios/       # Repository tests
│   └── utils/              # Utility tests
├── src/androidTest/java/   # Instrumented tests
│   ├── pantallas/          # UI tests
│   └── basedatos/          # Room tests
└── src/testFixtures/       # Shared test doubles
    ├── fakes/              # Fake implementations
    ├── stubs/              # Stub data
    └── builders/           # Test data builders
```

### Test File Naming

```
{ClaseObjetivo}Test.kt
{ClaseObjetivo}IntegrationTest.kt
{ClaseObjetivo}UiTest.kt
```

## 4. AAA Pattern (Mandatory)

All tests MUST follow Arrange-Act-Assert pattern:

```kotlin
@Test
fun obtenerNotas_conDatosDisponibles_retornaListaCorrecta() = runTest {
    // Arrange - Setup test data and mocks
    val notasEsperadas = listOf(crearNotaTest(id = 1), crearNotaTest(id = 2))
    coEvery { repositorio.obtenerNotas() } returns flowOf(Resultado.Correcto(notasEsperadas))

    // Act - Execute the code under test
    val resultado = casoUso()

    // Assert - Verify the results
    resultado.test {
        val item = awaitItem()
        assertThat(item).isInstanceOf(Resultado.Correcto::class.java)
        assertThat(item.datos).hasSize(2)
        awaitComplete()
    }
}
```

## 5. Test Naming Convention

Pattern: `method_scenario_expectedResult`

```kotlin
// Good examples
fun obtenerUsuario_conIdValido_retornaUsuario()
fun guardarNota_conTituloVacio_lanzaExcepcion()
fun actualizarPerfil_sinConexion_retornaError()

// Bad examples (avoid)
fun testObtenerUsuario()  // No scenario
fun test1()               // No meaning
fun should_return_user()  // English, no scenario
```

## 6. ViewModel Testing

### Setup Pattern

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class NotasViewModelTest {

    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    private lateinit var viewModel: NotasViewModel
    private val obtenerNotasCasoUso: ObtenerNotasCasoUso = mockk()
    private val guardarNotaCasoUso: GuardarNotaCasoUso = mockk()

    @Before
    fun setup() {
        viewModel = NotasViewModel(
            obtenerNotasCasoUso = obtenerNotasCasoUso,
            guardarNotaCasoUso = guardarNotaCasoUso
        )
    }
}
```

### StateFlow Testing

```kotlin
@Test
fun cargarNotas_exitoso_actualizaEstadoConDatos() = runTest {
    // Arrange
    val notas = listOf(crearNotaTest())
    coEvery { obtenerNotasCasoUso() } returns flowOf(Resultado.Correcto(notas))

    // Act
    viewModel.cargarNotas()

    // Assert
    viewModel.estadoUi.test {
        assertThat(awaitItem()).isEqualTo(NotasEstadoUi.Cargando)
        val estado = awaitItem()
        assertThat(estado).isInstanceOf(NotasEstadoUi.Correcto::class.java)
        assertThat((estado as NotasEstadoUi.Correcto).notas).isEqualTo(notas)
    }
}
```

## 7. UseCase Testing

```kotlin
class ObtenerNotasCasoUsoTest {

    private val repositorio: INotasRepositorio = mockk()
    private lateinit var casoUso: ObtenerNotasCasoUso

    @Before
    fun setup() {
        casoUso = ObtenerNotasCasoUso(repositorio)
    }

    @Test
    fun invoke_conRepositorioExitoso_retornaFlowDeNotas() = runTest {
        // Arrange
        val notasEsperadas = listOf(crearNotaTest())
        coEvery { repositorio.obtenerNotas() } returns flowOf(Resultado.Correcto(notasEsperadas))

        // Act & Assert
        casoUso().test {
            val resultado = awaitItem()
            assertThat(resultado.datos).isEqualTo(notasEsperadas)
            awaitComplete()
        }
    }
}
```

## 8. Repository Testing

```kotlin
class NotasRepositorioImplTest {

    private val fuenteRemota: IFuenteNotasRemota = mockk()
    private val fuenteLocal: IFuenteNotasLocal = mockk()
    private lateinit var repositorio: NotasRepositorioImpl

    @Before
    fun setup() {
        repositorio = NotasRepositorioImpl(
            fuenteRemota = fuenteRemota,
            fuenteLocal = fuenteLocal,
            despachadorIo = StandardTestDispatcher()
        )
    }

    @Test
    fun obtenerNotas_conCache_retornaDatosLocales() = runTest {
        // Arrange
        val notasLocales = listOf(crearNotaTest())
        coEvery { fuenteLocal.obtenerNotas() } returns notasLocales

        // Act & Assert
        repositorio.obtenerNotas().test {
            val resultado = awaitItem()
            assertThat(resultado.datos).isEqualTo(notasLocales)
            coVerify(exactly = 0) { fuenteRemota.obtenerNotas() }
            awaitComplete()
        }
    }
}
```

## 9. Flow Testing with Turbine

### Required Pattern

```kotlin
@Test
fun observarCambios_multipleEmisiones_recibeTodasLasActualizaciones() = runTest {
    // Arrange
    val flujo = MutableSharedFlow<Nota>()

    // Act & Assert
    flujo.test {
        flujo.emit(crearNotaTest(id = 1))
        assertThat(awaitItem().id).isEqualTo(1)

        flujo.emit(crearNotaTest(id = 2))
        assertThat(awaitItem().id).isEqualTo(2)

        cancelAndIgnoreRemainingEvents()
    }
}
```

### Timeout Handling

```kotlin
@Test
fun operacionLenta_conTimeout_completaCorrectamente() = runTest {
    val flujo = flow {
        delay(100)
        emit("resultado")
    }

    flujo.test(timeout = 1.seconds) {
        assertThat(awaitItem()).isEqualTo("resultado")
        awaitComplete()
    }
}
```

## 10. MockK Best Practices

### Coroutine Mocking

```kotlin
// Use coEvery for suspend functions
coEvery { repositorio.obtenerDatos() } returns Resultado.Correcto(datos)

// Use coVerify for verification
coVerify(exactly = 1) { repositorio.guardarDatos(any()) }

// Capture arguments
val slotNota = slot<Nota>()
coEvery { repositorio.guardar(capture(slotNota)) } returns Unit
// Then access slotNota.captured
```

### Relaxed Mocks

```kotlin
// For ViewModels with many dependencies
private val viewModel = mockk<NotasViewModel>(relaxed = true)

// For specific returns
every { viewModel.estadoUi } returns MutableStateFlow(NotasEstadoUi.Cargando)
```

## 11. Test Doubles Hierarchy

| Type | Purpose | When to Use |
|------|---------|-------------|
| Dummy | Fill parameter lists | Dependencies not used in test |
| Stub | Provide canned answers | Simple return values needed |
| Mock | Verify interactions | Need to verify method calls |
| Fake | Working implementation | Complex behavior needed |
| Spy | Partial mock | Real behavior with some mocking |

## 12. Coverage Requirements

| Layer | Minimum Coverage |
|-------|-----------------|
| Domain (UseCases) | 90% |
| ViewModels | 80% |
| Repositories | 80% |
| Utils | 70% |
| UI (Composables) | 60% |
| Overall | 75% |

### Kover Configuration

```kotlin
// build.gradle.kts
kover {
    filters {
        classes {
            excludes += listOf(
                "*.di.*",
                "*_Factory*",
                "*_HiltModules*",
                "*.BuildConfig",
                "*Composable*"
            )
        }
    }
}
```

## 13. MainDispatcherRule

Required for ViewModel tests:

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class MainDispatcherRule(
    private val dispatcher: TestDispatcher = UnconfinedTestDispatcher()
) : TestWatcher() {
    override fun starting(description: Description) {
        Dispatchers.setMain(dispatcher)
    }

    override fun finished(description: Description) {
        Dispatchers.resetMain()
    }
}
```

## 14. UI Testing (Compose)

```kotlin
@HiltAndroidTest
class NotasPantallaTest {

    @get:Rule(order = 0)
    val hiltRule = HiltAndroidRule(this)

    @get:Rule(order = 1)
    val composeRule = createAndroidComposeRule<ComponentActivity>()

    @Test
    fun pantalla_conNotas_muestraLista() {
        // Arrange
        val notas = listOf(crearNotaTest(titulo = "Test Nota"))

        // Act
        composeRule.setContent {
            NotasPantalla(notas = notas)
        }

        // Assert
        composeRule.onNodeWithText("Test Nota").assertIsDisplayed()
    }
}
```

## 15. CI/CD Test Order

```
1. Architecture Tests   → Validate module dependencies
2. Unit Tests          → Fast, isolated tests
3. Integration Tests   → Repository + DataSource
4. UI Tests            → Compose instrumented tests
```

## 16. Prohibited Practices

- Tests without assertions (NEVER)
- `@Ignore` without JIRA ticket
- Flaky tests in main branch
- Tests depending on execution order
- Tests with side effects on other tests
- Hardcoded delays (`Thread.sleep`, `delay` without reason)
- Tests that require network/external services
- Mocking the class under test
