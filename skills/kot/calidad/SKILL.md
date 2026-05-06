---
name: kot-calidad
description: "Quality gates — testing and automatic validation"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Quality — Testing and Automatic Validation

This skill activates automatically when writing tests, validations, or quality checks.

## Mandatory AAA Pattern

All tests must explicitly follow the **Arrange-Act-Assert** pattern:

1. **Arrange** — Prepare initial state: create objects, configure mocks, prepare input data.
2. **Act** — Execute the action under test: invoke the method or ViewModel being tested.
3. **Assert** — Verify the result: check return values, states, or emissions.

Separate each section with a `// Arrange`, `// Act`, `// Assert` comment for readability.

## Naming Convention

Name each test method with the format:

```
method_scenario_expectedResult
```

Examples:
- `login_credencialesValidas_navegaAHome`
- `cargarUsuario_noExiste_muestraError`
- `guardarDatos_sinConexion_guardaEnLocal`

The name must be self-documenting: reading it should make clear what is being tested, under what condition, and what is expected.

## Test Annotations

- **`@Test`** — For individual test cases without parameters.
- **`@ParameterizedTest`** with **`@ValueSource`** — For parameterized tests with simple values.
- **`@ParameterizedTest`** with **`@MethodSource`** — For parameterized tests with complex data.

Choose `@ParameterizedTest` when the same behavior is verified with multiple inputs.

## One Behavior per Test

- Each test verifies **a single behavior** or scenario.
- Do not combine multiple assertions that test different behaviors in the same test.
- If a test needs multiple asserts, all must verify facets of the **same** result.

## Mocking with MockK

```kotlin
// Create mock
private val mockRepository = mockk<UsuarioRepository>()

// Configure behavior
coEvery { mockRepository.obtenerUsuario(any()) } returns Resultado.Exito(usuario)

// Verify interaction
coVerify { mockRepository.obtenerUsuario(userId) }
```

## Testing StateFlow with Turbine

```kotlin
@Test
fun `cargarUsuario_existe_actualizaEstado`() = runTest {
    viewModel.uiState.test {
        // Initial state
        assertThat(awaitItem().cargando).isFalse()
        
        // Trigger action
        viewModel.cargarUsuario(userId)
        
        // Loading state
        assertThat(awaitItem().cargando).isTrue()
        
        // Success state
        val finalState = awaitItem()
        assertThat(finalState.cargando).isFalse()
        assertThat(finalState.usuario).isNotNull()
    }
}
```

## Minimum Coverage

- ViewModels: 80% lines of code
- UseCases: 90% lines of code
- Repositories: 70% lines of code
- Use Kover or Jacoco to measure coverage
