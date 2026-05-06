---
name: swf-alamofire-architecture
description: "Validate and setup Alamofire networking layer — EnrutadorApi, AutorizacionInterceptor, ServerTrustManager, error mapping, certificate pinning"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Alamofire Architecture

## Purpose

Validate or set up the Alamofire networking layer following project conventions. Checks `EnrutadorApi` structure, `AutorizacionInterceptor` for token injection, `ServerTrustManager` for SSL pinning, error mapping middleware, and certificate pinning configuration.

## Execution Flow — 7 Strict Steps

### Step 1: Validate EnrutadorApi Structure

Every feature module must have an `EnrutadorApi` conforming to `URLRequestConvertible`:

```swift
enum EnrutadorApiFeature: URLRequestConvertible {
    case obtenerLista
    case obtenerDetalle(id: String)
    case crear(modelo: CreateRequest)
    case actualizar(id: String, modelo: UpdateRequest)
    case eliminar(id: String)

    var baseURL: URL {
        URL(string: Configuration.shared.apiBaseURL)!
    }

    var path: String {
        switch self {
        case .obtenerLista:
            return "/api/feature"
        case .obtenerDetalle(let id):
            return "/api/feature/\(id)"
        case .crear:
            return "/api/feature"
        case .actualizar(let id, _):
            return "/api/feature/\(id)"
        case .eliminar(let id):
            return "/api/feature/\(id)"
        }
    }

    var method: HTTPMethod {
        switch self {
        case .obtenerLista, .obtenerDetalle: return .get
        case .crear: return .post
        case .actualizar: return .put
        case .eliminar: return .delete
        }
    }

    func asURLRequest() throws -> URLRequest {
        var request = URLRequest(url: baseURL.appendingPathComponent(path))
        request.method = method
        // Encode parameters based on method
        return request
    }
}
```

### Step 2: Validate AutorizacionInterceptor

Verify the authorization interceptor is correctly configured:

```swift
final class AutorizacionInterceptor: RequestInterceptor {
    @Injected(\.tokenManager) private var tokenManager

    func adapt(_ urlRequest: URLRequest, for session: Session, completion: @escaping (Result<URLRequest, Error>) -> Void) {
        var request = urlRequest
        if let token = tokenManager.currentToken {
            request.headers.add(.authorization(bearerToken: token))
        }
        completion(.success(request))
    }

    func retry(_ request: Request, for session: Session, dueTo error: Error, completion: @escaping (RetryResult) -> Void) {
        guard let response = request.task?.response as? HTTPURLResponse,
              response.statusCode == 401 else {
            completion(.doNotRetry)
            return
        }

        tokenManager.refreshToken()
            .sink(
                receiveCompletion: { result in
                    if case .failure = result {
                        completion(.doNotRetry)
                    }
                },
                receiveValue: { _ in
                    completion(.retry)
                }
            )
            .store(in: &cancellables)
    }
}
```

### Step 3: Validate ServerTrustManager (SSL Pinning)

```swift
let serverTrustManager = ServerTrustManager(evaluators: [
    "api.example.com": PinnedCertificatesTrustEvaluator(
        certificates: Bundle.main.af.certificates,
        acceptSelfSignedCertificates: false,
        performDefaultValidation: true,
        validateHost: true
    )
])

let session = Session(
    interceptor: AutorizacionInterceptor(),
    serverTrustManager: serverTrustManager
)
```

Checks:
1. `ServerTrustManager` configured with domain-specific evaluators
2. `acceptSelfSignedCertificates` is `false` in production
3. Certificate files exist in bundle
4. `performDefaultValidation` is `true`
5. `validateHost` is `true`

### Step 4: Validate Error Mapping

```swift
enum ErrorRed: Error, LocalizedError {
    case sinConexion
    case timeout
    case servidorNoDisponible
    case noAutorizado
    case prohibido
    case noEncontrado
    case errorServidor(codigo: Int)
    case errorDesconocido(Error)

    var errorDescription: String? {
        switch self {
        case .sinConexion: return "No internet connection"
        case .timeout: return "Request timed out"
        // ...
        }
    }
}

extension AFError {
    func toErrorRed() -> ErrorRed {
        if isSessionTaskError, let urlError = underlyingError as? URLError {
            switch urlError.code {
            case .notConnectedToInternet: return .sinConexion
            case .timedOut: return .timeout
            default: return .errorDesconocido(self)
            }
        }
        return .errorDesconocido(self)
    }
}
```

### Step 5: Validate Api Implementation Pattern

Every `ApiImplementacion` must follow:

```swift
final class FeatureApiImplementacion: FeatureApiProtocol {
    private let session: Session

    init(session: Session = .default) {
        self.session = session
    }

    func obtenerDatos() -> AnyPublisher<FeatureModel, Error> {
        session.request(EnrutadorApiFeature.obtenerLista)
            .publishDecodable(type: ApiResponse<FeatureDTO>.self)
            .value()
            .map { $0.data.toDomain() }
            .mapError { $0.toErrorRed() }
            .eraseToAnyPublisher()
    }
}
```

### Step 6: Validate Request/Response Logging

1. Check that a logging `EventMonitor` is configured for Debug builds
2. Verify sensitive data (tokens, credentials) is NOT logged
3. Verify logging is disabled in Release builds

### Step 7: Generate Report

```markdown
# Network Layer Report — [Date]

## EnrutadorApi
| Module | Routes | Status |
|--------|--------|--------|
| Feature | 5 | ✅/❌ |

## Security
- AutorizacionInterceptor: ✅/❌
- SSL Pinning: ✅/❌
- Certificate files: ✅/❌

## Error Mapping
- ErrorRed coverage: X/Y HTTP codes

## Issues Found
- [List]

## Recommendations
- [List]
```

## Auto-Shielding

- **ABORT** if Alamofire is not a project dependency
- **BLOCK** any `ServerTrustPolicy.disableEvaluation` in production code
- **BLOCK** hardcoded tokens or credentials in network code
- **WARN** if SSL pinning is not configured
- **WARN** if retry logic is missing from interceptor

## Rules

1. Every API module has an `EnrutadorApi` enum conforming to `URLRequestConvertible`
2. `AutorizacionInterceptor` handles token injection and 401 retry
3. SSL pinning configured via `ServerTrustManager` for all production domains
4. All network errors mapped to `ErrorRed` typed enum
5. Api implementations return `AnyPublisher` (never completion handlers)
6. Logging disabled in Release builds
7. No hardcoded URLs — use Configuration
8. Never log sensitive data (tokens, passwords, PII)
