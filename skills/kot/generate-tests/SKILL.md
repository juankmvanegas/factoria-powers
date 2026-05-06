---
name: kot-generate-tests
description: "Generate unit tests for ViewModels, UseCases, and Repositories using MockK and Turbine"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Skill: Generate Tests

## Purpose

Generate comprehensive unit tests following AAA pattern, using MockK for mocking and Turbine for Flow testing.

## When to Use

- After implementing new ViewModels
- After implementing new UseCases
- After implementing Repositories
- When increasing test coverage

## Inputs Expected

- Class to test (ViewModel, UseCase, Repository)
- Dependencies to mock
- Test scenarios to cover

## Execution Flow — 6 Steps

### Step 1: Analyze Class Under Test

Identify:
- Constructor dependencies (to mock)
- Public methods (to test)
- State exposure (StateFlow, SharedFlow)
- Return types (Flow, suspend, regular)

### Step 2: Generate Test Class Structure

```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class [ClassName]Test {

    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    // Mocks
    private val dependencia1: TipoDependencia1 = mockk()
    private val dependencia2: TipoDependencia2 = mockk()

    // System under test
    private lateinit var sut: [ClassName]

    @Before
    fun setup() {
        sut = [ClassName](dependencia1, dependencia2)
    }
}
```

### Step 3: Generate Test Methods

#### For UseCase

```kotlin
@Test
fun `invoke exitoso retorna datos correctamente`() = runTest {
    // Arrange
    val datosEsperados = crearDatosTest()
    coEvery { repositorio.obtenerDatos() } returns flowOf(
        Resultado.Correcto(datos = datosEsperados)
    )

    // Act & Assert
    sut().test {
        val resultado = awaitItem()
        assertThat(resultado).isInstanceOf(Resultado.Correcto::class.java)
        assertThat(resultado.datos).isEqualTo(datosEsperados)
        awaitComplete()
    }
}

@Test
fun `invoke con error retorna error`() = runTest {
    // Arrange
    coEvery { repositorio.obtenerDatos() } returns flowOf(
        Resultado.Error(mensaje = "Error de red")
    )

    // Act & Assert
    sut().test {
        val resultado = awaitItem()
        assertThat(resultado).isInstanceOf(Resultado.Error::class.java)
        assertThat(resultado.mensaje).contains("Error")
        awaitComplete()
    }
}
```

#### For ViewModel

```kotlin
@Test
fun `cargarDatos actualiza estado a correcto`() = runTest {
    // Arrange
    val datos = crearDatosTest()
    coEvery { casoUso() } returns flowOf(Resultado.Correcto(datos = datos))

    // Act
    sut.cargarDatos()

    // Assert
    sut.estadoUi.test {
        val estadoInicial = awaitItem() // Puede ser Cargando
        val estadoFinal = awaitItem()
        assertThat(estadoFinal).isInstanceOf(EstadoUi.Correcto::class.java)
        assertThat((estadoFinal as EstadoUi.Correcto).datos).isEqualTo(datos)
    }
}

@Test
fun `eventos emiten navegacion correctamente`() = runTest {
    // Arrange
    coEvery { guardarCasoUso(any()) } returns Resultado.Correcto(datos = 1L)

    // Act
    sut.guardar()

    // Assert
    sut.eventos.test {
        val evento = awaitItem()
        assertThat(evento).isInstanceOf(EventoUi.Navegar::class.java)
    }
}
```

#### For Repository

```kotlin
@Test
fun `obtenerDatos emite cargando y luego correcto`() = runTest {
    // Arrange
    val entidades = listOf(crearEntidadTest())
    coEvery { fuenteLocal.obtenerTodos() } returns entidades

    // Act & Assert
    sut.obtenerDatos().test {
        assertThat(awaitItem()).isInstanceOf(Resultado.Cargando::class.java)
        
        val correcto = awaitItem()
        assertThat(correcto).isInstanceOf(Resultado.Correcto::class.java)
        assertThat(correcto.datos).hasSize(entidades.size)
        
        awaitComplete()
    }
}
```

### Step 4: Generate Test Data Builders

```kotlin
// En archivo TestBuilders.kt compartido
object TestBuilders {
    
    fun crearNotaTest(
        id: Long = 1L,
        titulo: String = "Título Test",
        contenido: String = "Contenido Test",
        fechaCreacion: Long = System.currentTimeMillis()
    ) = Nota(
        id = id,
        titulo = titulo,
        contenido = contenido,
        fechaCreacion = fechaCreacion
    )
    
    fun crearNotaEntidadTest(
        id: Long = 1L,
        titulo: String = "Título Test"
    ) = NotaEntidad(id = id, titulo = titulo, contenido = "", fechaCreacion = 0L)
}
```

### Step 5: Generate MainDispatcherRule

If not exists, create:

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

### Step 6: Verify Coverage

After generation:
- Run tests to verify they pass
- Check coverage meets policy minimums
- Identify missing scenarios

## Output Format

```markdown
## Tests Generated

### Files Created
- `src/test/java/.../[ClassName]Test.kt`

### Test Methods
- `metodo_escenarioExitoso_retornaCorrecto`
- `metodo_escenarioError_retornaError`
- `metodo_conParametroNulo_lanzaExcepcion`

### Coverage
- Methods covered: 5/5 (100%)
- Branches covered: 8/10 (80%)

### Missing Scenarios
- [ ] Edge case: empty list
- [ ] Edge case: network timeout
```

## Naming Convention

Two accepted formats (follow existing project convention):

### Backtick format (preferred)
```kotlin
@Test
fun `cuando se invoca el caso de uso con datos validos, entonces se llama el repositorio`()

@Test
fun `cuando el servidor retorna error 500, entonces el estado es Error`()
```

### Underscore format (alternative)
```kotlin
fun obtenerNotas_conDatosDisponibles_retornaListaCorrecta()
fun guardarNota_conTituloVacio_lanzaExcepcion()
```

**Always detect existing tests in the project first and follow their convention.**

## Convention Detection

Before writing any test, search the project for existing test files:

1. Find `*Test.kt` or `*Tests.kt` files
2. Identify framework: JUnit4 vs JUnit5
3. Identify mocking library: MockK vs Mockito
4. Identify assertion library: Truth vs AssertJ vs JUnit assertions
5. Identify naming pattern: backticks vs underscore vs camelCase
6. Identify structure: Given/When/Then vs Arrange/Act/Assert
7. **Adapt output to match conventions found**

If no existing tests found, use defaults: JUnit4 + MockK + Truth + backtick Spanish names + Given/When/Then.

## MockK Patterns

```kotlin
// Basic mock
val mock: Tipo = mockk()

// Configure return
every { mock.metodo() } returns valor
coEvery { mock.suspendMetodo() } returns valor

// Configure exception
every { mock.metodo() } throws Exception("Error")

// Verify invocation
verify(exactly = 1) { mock.metodo() }
coVerify(exactly = 1) { mock.suspendMetodo() }

// Capture parameters
val slot = slot<TipoParametro>()
coVerify { mock.metodo(capture(slot)) }
assertThat(slot.captured).isEqualTo(valorEsperado)

// Relaxed mock
val mock: Tipo = mockk(relaxed = true)
```

## Turbine for Flow Testing

```kotlin
@Test
fun `test de flow con turbine`() = runTest {
    sut.obtenerDatos().test {
        assertThat(awaitItem()).isInstanceOf(Resultado.Cargando::class.java)
        assertThat(awaitItem()).isInstanceOf(Resultado.Correcto::class.java)
        awaitComplete()
    }
}
```

## Truth Assertions

```kotlin
assertThat(actual).isEqualTo(esperado)
assertThat(actual).isInstanceOf(Tipo::class.java)
assertThat(actual).isNull()
assertThat(actual).isNotNull()
assertThat(lista).isEmpty()
assertThat(lista).hasSize(3)
assertThat(lista).contains(elemento)
assertThat(valor).isTrue()
assertThat(texto).contains("subcadena")
```

## Test File Location

```
modulo/
  src/
    main/java/com/paquete/clase/MiClase.kt
    test/java/com/paquete/clase/MiClaseTest.kt
```

## Rules

- **Given/When/Then mandatory** — structured test blocks
- **Spanish naming** — for test methods (backtick preferred)
- **Use MockK** — coEvery, coVerify for suspends
- **Use Turbine** — .test { } for Flows
- **Use Truth** — for assertions (assertThat)
- **One behavior per test** — focused assertions
- **Test builders shared** — reusable test data in `TestBuilders` object
- **Verify interactions** — when behavior matters
- **ALWAYS include imports** — complete import block
- **ALWAYS read class under test first** — never assume structure
- **NEVER invent methods** — only test what exists in source
- **Do NOT run tests** — user handles compilation and execution
