---
name: swf-azure-b2c
description: "Configure MSAL for Azure B2C authentication — policies, token handling, biometric auth, Google Sign-In"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Azure B2C (MSAL Authentication)

## Purpose

Configure and validate MSAL (Microsoft Authentication Library) for Azure B2C authentication in the iOS app. Covers B2C policy setup, token handling, biometric authentication via `ValidadorBiometrico`, Google Sign-In integration, and secure credential storage.

## Execution Flow — 8 Strict Steps

### Step 1: MSAL Configuration

Verify or create `MSAL` configuration:

```swift
// MSALConfig.swift
struct MSALConfig {
    static let clientId = Configuration.shared.msalClientId        // From .xcconfig
    static let authority = Configuration.shared.msalAuthority      // B2C authority URL
    static let redirectUri = Configuration.shared.msalRedirectUri  // Custom URL scheme
    static let scopes = ["openid", "offline_access", Configuration.shared.msalScope]

    // B2C Policy names
    static let signInPolicy = "B2C_1_SignIn"
    static let signUpPolicy = "B2C_1_SignUp"
    static let passwordResetPolicy = "B2C_1_PasswordReset"
    static let editProfilePolicy = "B2C_1_EditProfile"
}
```

Validation checks:
1. No hardcoded client IDs or secrets in source
2. Authority URL uses HTTPS
3. Redirect URI registered in Azure portal
4. All policy names from configuration, not hardcoded strings

### Step 2: MSAL Application Setup

```swift
final class AuthManager {
    private var msalApplication: MSALPublicClientApplication?

    func configurar() throws {
        let authority = try MSALAADAuthority(url: URL(string: MSALConfig.authority)!)

        let config = MSALPublicClientApplicationConfig(
            clientId: MSALConfig.clientId,
            redirectUri: MSALConfig.redirectUri,
            authority: authority
        )
        config.knownAuthorities = [authority]

        msalApplication = try MSALPublicClientApplication(configuration: config)
    }
}
```

### Step 3: Token Handling

```swift
protocol TokenManagerProtocol {
    var currentToken: String? { get }
    func obtenerToken() -> AnyPublisher<String, AuthError>
    func refrescarToken() -> AnyPublisher<String, AuthError>
    func limpiarTokens()
}

final class TokenManager: TokenManagerProtocol {
    @Injected(\.keychainManager) private var keychain

    var currentToken: String? {
        keychain.get("access_token")
    }

    func obtenerToken() -> AnyPublisher<String, AuthError> {
        // 1. Check Keychain for cached token
        // 2. If expired, attempt silent refresh
        // 3. If refresh fails, require interactive login
    }

    func refrescarToken() -> AnyPublisher<String, AuthError> {
        // Use MSAL silent token acquisition
        // Store new token in Keychain
        // Update token expiration
    }

    func limpiarTokens() {
        keychain.delete("access_token")
        keychain.delete("refresh_token")
        keychain.delete("id_token")
    }
}
```

### Step 4: Interactive Login Flow

```swift
extension AuthManager {
    func iniciarSesion(from viewController: UIViewController) -> AnyPublisher<AuthResult, AuthError> {
        Future { [weak self] promise in
            guard let self, let app = self.msalApplication else {
                promise(.failure(.configuracionInvalida))
                return
            }

            let parameters = MSALInteractiveTokenParameters(
                scopes: MSALConfig.scopes,
                webviewParameters: MSALWebviewParameters(authPresentationViewController: viewController)
            )

            app.acquireToken(with: parameters) { result, error in
                if let error {
                    promise(.failure(.msalError(error)))
                    return
                }
                guard let result else {
                    promise(.failure(.sinResultado))
                    return
                }
                promise(.success(AuthResult(from: result)))
            }
        }.eraseToAnyPublisher()
    }
}
```

### Step 5: Biometric Authentication (ValidadorBiometrico)

```swift
protocol ValidadorBiometricoProtocol {
    func estaDisponible() -> Bool
    func autenticar(razon: String) -> AnyPublisher<Bool, AuthError>
}

final class ValidadorBiometrico: ValidadorBiometricoProtocol {
    private let context = LAContext()

    func estaDisponible() -> Bool {
        var error: NSError?
        return context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error)
    }

    func autenticar(razon: String) -> AnyPublisher<Bool, AuthError> {
        Future { [weak self] promise in
            self?.context.evaluatePolicy(
                .deviceOwnerAuthenticationWithBiometrics,
                localizedReason: razon
            ) { success, error in
                if success {
                    promise(.success(true))
                } else {
                    promise(.failure(.biometricoFallido(error)))
                }
            }
        }.eraseToAnyPublisher()
    }
}
```

Usage flow:
1. User enables biometric login in settings
2. On app launch, check if biometric is available and enabled
3. If enabled, authenticate via FaceID/TouchID
4. On success, use cached MSAL token for silent login
5. On failure, fall back to interactive MSAL login

### Step 6: Google Sign-In Integration

```swift
extension AuthManager {
    func iniciarSesionConGoogle(from viewController: UIViewController) -> AnyPublisher<AuthResult, AuthError> {
        // 1. Initiate Google Sign-In
        // 2. Get Google ID token
        // 3. Exchange Google token with Azure B2C using custom policy
        // 4. Store resulting B2C tokens
    }
}
```

### Step 7: Secure Credential Storage

| Data | Storage | Encryption |
|------|---------|-----------|
| Access token | Keychain | System encryption |
| Refresh token | Keychain | System encryption |
| ID token | Keychain | System encryption |
| User profile | Realm (encrypted) | AES-256 |
| Biometric preference | UserDefaults | None (boolean flag only) |
| MSAL client ID | .xcconfig | Build-time |

### Step 8: URL Scheme Configuration

Verify `Info.plist` contains:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>msauth.$(PRODUCT_BUNDLE_IDENTIFIER)</string>
        </array>
    </dict>
</array>
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>msauthv2</string>
    <string>msauthv3</string>
</array>
```

And `AppDelegate` handles the redirect:

```swift
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    return MSALPublicClientApplication.handleMSALResponse(url, sourceApplication: options[.sourceApplication] as? String)
}
```

## Auto-Shielding

- **ABORT** if MSAL pod/SPM dependency is missing
- **BLOCK** hardcoded client IDs, secrets, or authority URLs in source code
- **BLOCK** tokens stored in UserDefaults or plain files
- **BLOCK** `print()` or `NSLog()` of tokens or credentials
- **WARN** if biometric authentication not configured for sensitive operations
- **WARN** if token refresh logic is missing

## Rules

1. All MSAL configuration values from `.xcconfig` or `Configuration` object — never hardcoded
2. Tokens stored exclusively in Keychain
3. Silent token refresh attempted before interactive login
4. Biometric authentication required for accessing cached credentials
5. Google Sign-In tokens exchanged with B2C — never used directly
6. URL schemes registered in Info.plist
7. AppDelegate handles MSAL redirect
8. Token expiration tracked and pre-emptive refresh scheduled
9. All auth errors mapped to `AuthError` typed enum
10. Logout clears all tokens, Keychain entries, and Realm user data
