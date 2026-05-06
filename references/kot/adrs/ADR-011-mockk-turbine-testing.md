# ADR-011: MockK and Turbine for Testing

## Status
Accepted

## Date
2024-04-18 (Factoria-Kot v1.0.0)

## Context
Kotlin-first testing requires mocking libraries that work natively with Kotlin features like coroutines, suspend functions, and Flows. We need a standardized testing stack.

## Decision
Use MockK for mocking and Turbine for Flow testing:

### Dependencies

```toml
[versions]
mockk = "1.14.0"
turbine = "1.2.1"
coroutines-test = "1.8.0"
junit = "4.13.2"
truth = "1.4.2"

[libraries]
mockk = { group = "io.mockk", name = "mockk", version.ref = "mockk" }
mockk-android = { group = "io.mockk", name = "mockk-android", version.ref = "mockk" }
turbine = { group = "app.cash.turbine", name = "turbine", version.ref = "turbine" }
coroutines-test = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-test", version.ref = "coroutines-test" }
junit = { group = "junit", name = "junit", version.ref = "junit" }
truth = { group = "com.google.truth", name = "truth", version.ref = "truth" }

[bundles]
testing = ["junit", "mockk", "turbine", "coroutines-test", "truth"]
```

### MockK Basics

```kotlin
class NotasViewModelTest {
    
    // Create mocks
    private val obtenerNotasCasoUso: ObtenerNotasCasoUso = mockk()
    private val guardarNotaCasoUso: GuardarNotaCasoUso = mockk()
    
    private lateinit var viewModel: NotasViewModel
    
    @Before
    fun setup() {
        viewModel = NotasViewModel(obtenerNotasCasoUso, guardarNotaCasoUso)
    }
    
    @Test
    fun `cargarNotas con datos disponibles actualiza estado correctamente`() = runTest {
        // Arrange - Mock suspend function
        val notasEsperadas = listOf(crearNotaTest())
        coEvery { obtenerNotasCasoUso() } returns flowOf(Resultado.Correcto(notasEsperadas))
        
        // Act
        viewModel.cargarNotas()
        
        // Assert
        assertThat(viewModel.estadoUi.value).isInstanceOf(NotasEstadoUi.Correcto::class.java)
        coVerify(exactly = 1) { obtenerNotasCasoUso() }
    }
}
```

### Coroutine Mocking

```kotlin
// coEvery/coVerify for suspend functions
coEvery { repositorio.guardarNota(any()) } returns Resultado.Correcto(1L)
coVerify { repositorio.guardarNota(capturaNota) }

// every/verify for regular functions
every { logger.info(any(), any()) } just Runs
verify { logger.info("TAG", "mensaje") }

// Answers - dynamic responses
coEvery { repositorio.obtenerNota(any()) } coAnswers {
    val id = firstArg<Long>()
    if (id > 0) Resultado.Correcto(crearNotaTest(id = id))
    else Resultado.Error("No encontrado")
}
```

### Turbine for Flow Testing

```kotlin
@Test
fun `obtenerNotas emite cargando y luego correcto`() = runTest {
    // Arrange
    val notas = listOf(crearNotaTest())
    coEvery { fuenteLocal.obtenerNotas() } returns notas
    
    // Act & Assert with Turbine
    repositorio.obtenerNotas().test {
        // First emission - Loading
        val cargando = awaitItem()
        assertThat(cargando).isInstanceOf(Resultado.Cargando::class.java)
        
        // Second emission - Success
        val correcto = awaitItem()
        assertThat(correcto).isInstanceOf(Resultado.Correcto::class.java)
        assertThat(correcto.datos).isEqualTo(notas)
        
        // Complete
        awaitComplete()
    }
}

// With timeout
@Test
fun `operacion lenta completa en tiempo`() = runTest {
    flujoLento.test(timeout = 5.seconds) {
        assertThat(awaitItem()).isEqualTo(resultado)
        awaitComplete()
    }
}

// Cancel and ignore remaining
@Test
fun `flujo infinito se puede cancelar`() = runTest {
    flujoInfinito.test {
        assertThat(awaitItem()).isEqualTo(primero)
        assertThat(awaitItem()).isEqualTo(segundo)
        cancelAndIgnoreRemainingEvents()
    }
}
```

### Argument Capture

```kotlin
@Test
fun `guardarNota pasa datos correctamente al repositorio`() = runTest {
    // Capture slot
    val notaCapturada = slot<Nota>()
    coEvery { repositorio.guardarNota(capture(notaCapturada)) } returns Resultado.Correcto(1L)
    
    // Act
    val notaEntrada = NotaEntrada(titulo = "Test", contenido = "Contenido")
    viewModel.guardarNota(notaEntrada)
    
    // Assert captured value
    assertThat(notaCapturada.captured.titulo).isEqualTo("Test")
    assertThat(notaCapturada.captured.contenido).isEqualTo("Contenido")
}

// Capture list for multiple calls
@Test
fun `multiples llamadas capturadas`() = runTest {
    val llamadas = mutableListOf<Nota>()
    coEvery { repositorio.guardarNota(capture(llamadas)) } returns Resultado.Correcto(1L)
    
    viewModel.guardarNotas(listOf(nota1, nota2))
    
    assertThat(llamadas).hasSize(2)
}
```

### Relaxed Mocks

```kotlin
// All calls return default values
private val viewModel: NotasViewModel = mockk(relaxed = true)

// Relaxed for Unit-returning functions only
private val logger: IAdministradorLogs = mockk(relaxUnitFun = true)
```

### MainDispatcherRule

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

// Usage
class ViewModelTest {
    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()
    
    @Test
    fun test() = runTest {
        // Main dispatcher is replaced
    }
}
```

### Test Builders

```kotlin
// Test data builders
fun crearNotaTest(
    id: Long = 1,
    titulo: String = "Título Test",
    contenido: String = "Contenido Test",
    fechaCreacion: Long = System.currentTimeMillis()
) = Nota(
    id = id,
    titulo = titulo,
    contenido = contenido,
    fechaCreacion = fechaCreacion
)

fun crearListaNotasTest(cantidad: Int = 5) = 
    (1..cantidad).map { crearNotaTest(id = it.toLong()) }
```

## Consequences

- Native Kotlin mocking without reflection issues
- Suspend functions and Flows easily testable
- Explicit verification of coroutine calls
- Turbine provides structured Flow testing
- No PowerMock or Mockito needed
- Tests are concise and readable
- Strict mocking by default (relaxed optional)
