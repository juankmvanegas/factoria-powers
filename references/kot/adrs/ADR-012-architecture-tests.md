# ADR-012: Architecture Tests for Module Dependencies

## Status
Accepted

## Date
2024-04-18 (Factoria-Kot v1.0.0)

## Context
Multi-module Android projects can suffer from incorrect dependencies between layers if not enforced. We need automated tests that validate the architecture rules defined in ADR-001.

## Decision
Implement architecture tests that validate module dependencies at build time:

### Dependency Rules

```
presentacion → dominio → datos → core
         ↓         ↓        ↓
        core     core     core
```

### Package Structure Validation

```kotlin
class ArchitectureTest {
    
    @Test
    fun `dominio no debe depender de datos`() {
        val dominioClasses = classesInPackage("com.empresa.app.*.dominio")
        val datosClasses = classesInPackage("com.empresa.app.*.datos")
        
        dominioClasses.forEach { dominioClass ->
            assertThat(dominioClass.dependencies)
                .doesNotContainAnyElementsOf(datosClasses)
        }
    }
    
    @Test
    fun `dominio no debe depender de presentacion`() {
        val dominioClasses = classesInPackage("com.empresa.app.*.dominio")
        val presentacionClasses = classesInPackage("com.empresa.app.*.presentacion")
        
        dominioClasses.forEach { dominioClass ->
            assertThat(dominioClass.dependencies)
                .doesNotContainAnyElementsOf(presentacionClasses)
        }
    }
    
    @Test
    fun `datos no debe depender de presentacion`() {
        val datosClasses = classesInPackage("com.empresa.app.*.datos")
        val presentacionClasses = classesInPackage("com.empresa.app.*.presentacion")
        
        datosClasses.forEach { datosClass ->
            assertThat(datosClass.dependencies)
                .doesNotContainAnyElementsOf(presentacionClasses)
        }
    }
}
```

### Gradle Module Dependencies

```kotlin
// feature_dominio/build.gradle.kts
dependencies {
    // Only depends on core_dominio
    implementation(project(":core:core_dominio"))
    
    // ❌ These would be violations
    // implementation(project(":feature_datos"))      // Wrong!
    // implementation(project(":feature_presentacion")) // Wrong!
}

// feature_datos/build.gradle.kts
dependencies {
    implementation(project(":core:core_datos"))
    implementation(project(":feature_dominio")) // OK - datos can depend on dominio interface
    
    // ❌ These would be violations
    // implementation(project(":feature_presentacion")) // Wrong!
}

// feature_presentacion/build.gradle.kts
dependencies {
    implementation(project(":core:core_dominio"))
    implementation(project(":feature_dominio")) // OK - for UseCases
    
    // ❌ These would be violations
    // implementation(project(":feature_datos")) // Wrong! Use DI
}
```

### Naming Convention Tests

```kotlin
@Test
fun `UseCases deben terminar en CasoUso`() {
    val useCaseClasses = classesInPackage("com.empresa.app.*.dominio.casouso")
    
    useCaseClasses.forEach { clazz ->
        assertThat(clazz.simpleName).endsWith("CasoUso")
    }
}

@Test
fun `Repositories deben implementar interface I*Repositorio`() {
    val repoImplementations = classesInPackage("com.empresa.app.*.datos.repositorio")
        .filter { it.simpleName.endsWith("RepositorioImpl") }
    
    repoImplementations.forEach { impl ->
        val interfaceName = "I${impl.simpleName.removeSuffix("Impl")}"
        assertThat(impl.interfaces.map { it.simpleName })
            .contains(interfaceName)
    }
}

@Test
fun `ViewModels deben tener anotacion HiltViewModel`() {
    val viewModels = classesInPackage("com.empresa.app.*.presentacion.viewmodels")
        .filter { it.simpleName.endsWith("ViewModel") }
    
    viewModels.forEach { vm ->
        assertThat(vm.annotations.map { it.simpleName })
            .contains("HiltViewModel")
    }
}
```

### Android-Specific Rules

```kotlin
@Test
fun `dominio no debe usar clases de Android`() {
    val dominioClasses = classesInPackage("com.empresa.app.*.dominio")
    val androidPackages = listOf(
        "android.",
        "androidx.",
        "com.google.android."
    )
    
    dominioClasses.forEach { clazz ->
        clazz.dependencies.forEach { dep ->
            assertThat(dep.qualifiedName)
                .doesNotStartWithAny(androidPackages)
        }
    }
}

@Test
fun `UseCases no deben tener dependencias de Room`() {
    val useCases = classesInPackage("com.empresa.app.*.dominio.casouso")
    val roomPackages = listOf("androidx.room.")
    
    useCases.forEach { useCase ->
        useCase.dependencies.forEach { dep ->
            assertThat(dep.qualifiedName)
                .doesNotStartWithAny(roomPackages)
        }
    }
}
```

### CI/CD Integration

```yaml
# Architecture tests run first
jobs:
  test:
    steps:
      - name: Architecture Tests
        run: ./gradlew :app:testDebugUnitTest --tests "*ArchitectureTest*"
        
      - name: Unit Tests
        run: ./gradlew testDebugUnitTest
        # Only runs if architecture tests pass
```

### Architecture Test Module

```kotlin
// tests/architecture-tests/build.gradle.kts
dependencies {
    testImplementation(libs.junit)
    testImplementation(libs.truth)
    testImplementation(project(":app")) // Access all classes
}
```

## Consequences

- Architecture violations caught at build time
- Prevents accidental cross-layer dependencies
- Naming conventions enforced automatically
- CI/CD fails fast on architecture violations
- Documentation of architecture rules as tests
- New developers learn architecture through tests
- Tests are READ-ONLY - fix code, never weaken tests
