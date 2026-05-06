# Skill: Generate Feature Tests

## Purpose
Generate a complete test suite for a new or existing ViewModel,
following the testing policy and conventions of the Android/Kotlin project.

## When to Use
- After creating a new ViewModel in a feature module
- When adding new methods or states to existing ViewModels
- When refactoring ViewModels and tests need updating
- After creating new UseCases in the application layer

## Inputs Required
1. **ViewModel/UseCase name** — The component to test (e.g., `LoginViewModel`)
2. **Feature module** — Module where it lives (e.g., `feature-login`)
3. **Methods to test** — List of methods with expected behaviors
4. **Dependencies** — Interfaces/UseCases it depends on (for mocking)

## Output Structure
```
feature-{name}/
  src/
    test/
      kotlin/
        com/santander/superapp/feature/{name}/
          viewmodel/
            {ViewModel}Test.kt       - JUnit + MockK test class
          usecase/
            {UseCase}Test.kt         - JUnit + MockK test class
          fakes/
            Fake{Repository}.kt      - Fake implementations
```

## Rules
1. Follow AAA pattern (Arrange-Act-Assert)
2. Use `@Test` for individual cases, `@ParameterizedTest` for parameterized cases
3. Name tests: `method_scenario_expectedResult`
4. One behavior per test
5. Use MockK for interface mocking
6. Use Turbine for StateFlow/SharedFlow testing
7. Create fakes in the `fakes/` directory if they do not exist
8. Mock infrastructure interfaces, never concrete classes
9. Test both paths: success and failure
10. Test emissions of `Resultado.Error` and `Resultado.Exito`
11. Use `runTest` for coroutines and `advanceUntilIdle()` to synchronize

## Process
1. Read the ViewModel/UseCase source code
2. Identify all public methods and their dependencies
3. Identify all possible scenarios (happy path, error cases, edge cases)
4. Generate fake data or repository fakes
5. Generate the test class
6. Verify the test compiles and follows naming conventions

## Test Template
```kotlin
@OptIn(ExperimentalCoroutinesApi::class)
class {ViewModel}Test {

    @get:Rule
    val coroutineRule = MainCoroutineRule()

    private val mockUseCase = mockk<{UseCase}Interface>()
    private lateinit var viewModel: {ViewModel}

    @BeforeEach
    fun setUp() {
        viewModel = {ViewModel}(mockUseCase)
    }

    @Test
    fun `metodo_escenario_resultadoEsperado`() = runTest {
        // Arrange
        coEvery { mockUseCase.ejecutar(any()) } returns Resultado.Exito(expected)

        // Act
        viewModel.state.test {
            viewModel.metodo()
            
            // Assert
            assertThat(awaitItem()).isEqualTo(expectedState)
        }
    }
}
```
