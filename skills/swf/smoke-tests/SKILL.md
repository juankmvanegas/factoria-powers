---
name: swf-smoke-tests
description: "Generate smoke test suite for critical paths — login, navigation, key features"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Smoke Tests

## Purpose

Generate a smoke test suite covering the critical paths of the iOS application: login flow, main navigation, and key feature flows. These are high-level integration tests that verify the app's core functionality works end-to-end.

## Execution Flow — 5 Strict Steps

### Step 1: Identify Critical Paths

1. Read `CLAUDE.md` and project configuration for feature list
2. Identify authentication flow (MSAL Azure B2C login)
3. Map main navigation structure (tab bar, coordinator flows)
4. List key feature flows that must always work
5. Interview user for additional critical paths if needed

Default critical paths:
- **Login flow** — Launch → Login → Home
- **Main navigation** — Tab switching, deep links
- **Key feature CRUD** — Create, Read, Update, Delete for primary entities
- **Logout flow** — Logout → Login screen
- **Error recovery** — Network error → Retry → Success

### Step 2: Generate Login Flow Tests

```swift
@MainActor
final class LoginSmokeTests: XCTestCase {
    private var mockAuthApi: MockAuthApi!
    private var spyCoordinador: SpyAppCoordinador!
    private var sut: LoginViewModel!
    private var cancellables: Set<AnyCancellable>!

    override func setUp() {
        super.setUp()
        mockAuthApi = MockAuthApi()
        spyCoordinador = SpyAppCoordinador()
        cancellables = []
        Container.shared.authApi.register { self.mockAuthApi }
        Container.shared.appCoordinador.register { self.spyCoordinador }
        sut = LoginViewModel()
    }

    override func tearDown() {
        Container.shared.manager.reset()
        cancellables = nil
        sut = nil
        super.tearDown()
    }

    func test_loginFlow_validCredentials_navigatesToHome() {
        // Arrange
        mockAuthApi.loginResult = .success(AuthToken.mock)
        let expectation = expectation(description: "Navigation to home")

        // Act
        sut.iniciarSesion(usuario: "test@email.com", contrasena: "password")

        // Assert
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            XCTAssertTrue(self.spyCoordinador.navegarAHomeCalled)
            expectation.fulfill()
        }
        wait(for: [expectation], timeout: 2.0)
    }

    func test_loginFlow_invalidCredentials_showsError() {
        // Arrange
        mockAuthApi.loginResult = .failure(AuthError.invalidCredentials)
        let expectation = expectation(description: "Error shown")

        sut.$errorMessage
            .dropFirst()
            .sink { error in
                if error != nil { expectation.fulfill() }
            }
            .store(in: &cancellables)

        // Act
        sut.iniciarSesion(usuario: "wrong@email.com", contrasena: "wrong")

        // Assert
        wait(for: [expectation], timeout: 2.0)
        XCTAssertNotNil(sut.errorMessage)
        XCTAssertFalse(spyCoordinador.navegarAHomeCalled)
    }
}
```

### Step 3: Generate Navigation Smoke Tests

```swift
@MainActor
final class NavigationSmokeTests: XCTestCase {
    func test_mainTabNavigation_allTabsAccessible() { ... }
    func test_deepLink_validRoute_navigatesToCorrectScreen() { ... }
    func test_backNavigation_returnsToCorrectScreen() { ... }
    func test_modalPresentation_dismissReturnsToParent() { ... }
}
```

### Step 4: Generate Feature Flow Tests

For each key feature, generate:

1. **Happy path** — Complete flow with valid data
2. **Error path** — Flow with API error, verify error UI
3. **Empty state** — Flow with no data, verify empty state UI
4. **Retry path** — Error → Retry → Success

### Step 5: Generate Test Runner Configuration

1. Create a test plan or scheme for smoke tests only
2. Configure to run on CI before full test suite
3. Set timeout limits per test
4. Configure failure reporting

## Auto-Shielding

- **ABORT** if no authentication module exists — cannot test login flow
- **ABORT** if no Coordinator exists — cannot test navigation
- **WARN** if fewer than 3 critical paths identified — suggest expanding scope
- **WARN** if smoke tests take more than 30 seconds total — optimize or split

## Rules

1. Smoke tests must be fast — each test under 5 seconds
2. Use mocked dependencies — no real network calls
3. Cover the "golden path" for every critical flow
4. Include at least one error scenario per flow
5. Name with `SmokeTests` suffix for easy filtering
6. Store in a dedicated `SmokeTests/` directory in the test target
7. Smoke tests run BEFORE full test suite in CI
8. All test classes annotated with `@MainActor`
9. Factory DI registered in setUp, reset in tearDown
