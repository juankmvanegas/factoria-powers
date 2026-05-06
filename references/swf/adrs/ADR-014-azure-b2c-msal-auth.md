# ADR-014: MSAL for Azure B2C Authentication

## Status
Accepted

## Date
2025-01-15

## Context
The application requires enterprise-grade authentication with Azure Active Directory B2C as the identity provider. Users must be able to sign in with corporate credentials, Google accounts, and biometric authentication (Face ID / Touch ID). Token management (access tokens, refresh tokens, ID tokens) must be handled securely with automatic renewal. The authentication layer must support multiple B2C policies (sign-in, sign-up, password reset) configured per environment (development, staging, production).

## Decision
We adopt **MSAL (Microsoft Authentication Library) for iOS** as the primary authentication framework, integrated with Azure B2C, with biometric authentication via the LocalAuthentication framework and Google Sign-In as an alternative provider.

### Core Rules

1. **MSAL handles token lifecycle automatically.** The application calls `acquireTokenSilently()` first; MSAL handles refresh token exchange transparently. Interactive login is triggered only when silent acquisition fails:
   ```swift
   final class ServicioAutenticacion: ServicioAutenticacionProtocol {
       private let aplicacionMSAL: MSALPublicClientApplication
       
       func obtenerToken() -> AnyPublisher<String, ErrorAutenticacion> {
           Future { [weak self] promise in
               guard let self, let cuenta = try? self.obtenerCuentaActual() else {
                   promise(.failure(.sinSesion))
                   return
               }
               let parametros = MSALSilentTokenParameters(scopes: self.scopes, account: cuenta)
               self.aplicacionMSAL.acquireTokenSilent(with: parametros) { resultado, error in
                   if let resultado {
                       promise(.success(resultado.accessToken))
                   } else {
                       promise(.failure(.tokenExpirado))
                   }
               }
           }.eraseToAnyPublisher()
       }
   }
   ```

2. **Tokens are stored in Keychain via MSAL's secure storage.** No custom Keychain logic is implemented for MSAL tokens. MSAL uses its own Keychain access group for token persistence:
   ```swift
   let config = MSALPublicClientApplicationConfig(
       clientId: configuracion.clientId,
       redirectUri: configuracion.redirectUri,
       authority: authority
   )
   config.cacheConfig.keychainSharingGroup = "com.company.app.msal"
   ```

3. **Biometric authentication** is handled via the `LocalAuthentication` framework through `ValidadorBiometrico`. Biometric unlock grants access to an encrypted session token stored in SimpleKeychain, not MSAL tokens directly:
   ```swift
   final class ValidadorBiometrico: ValidadorBiometricoProtocol {
       private let context = LAContext()
       
       func autenticar() -> AnyPublisher<Bool, ErrorAutenticacion> {
           Future { [weak self] promise in
               guard let self else { return }
               self.context.evaluatePolicy(
                   .deviceOwnerAuthenticationWithBiometrics,
                   localizedReason: "Authenticate to access the application"
               ) { success, error in
                   if success {
                       promise(.success(true))
                   } else {
                       promise(.failure(.biometricoFallido))
                   }
               }
           }.eraseToAnyPublisher()
       }
       
       var tipoBiometrico: LABiometryType {
           context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: nil)
           return context.biometryType
       }
   }
   ```

4. **Google Sign-In** is configured as an alternative authentication provider through Azure B2C's identity provider federation. The B2C policy handles the Google OAuth flow; the app does not integrate the Google SDK directly:
   ```swift
   // B2C policy handles Google — no separate Google SDK needed
   let authorityGoogle = try MSALAADAuthority(
       url: URL(string: "\(b2cBase)/\(configuracion.policyGoogle)")!
   )
   ```

5. **B2C policies are configured per environment** via the app's configuration layer:
   ```swift
   struct ConfiguracionB2C {
       let clientId: String
       let tenantName: String
       let policySignIn: String        // e.g., "B2C_1_SignIn"
       let policySignUp: String        // e.g., "B2C_1_SignUp"
       let policyPasswordReset: String // e.g., "B2C_1_PasswordReset"
       let policyGoogle: String        // e.g., "B2C_1_GoogleSignIn"
       let scopes: [String]
       let redirectUri: String
   }
   
   // Per-environment configuration
   extension ConfiguracionB2C {
       static let desarrollo = ConfiguracionB2C(
           clientId: "dev-client-id",
           tenantName: "devtenant",
           // ...
       )
       static let produccion = ConfiguracionB2C(
           clientId: "prod-client-id",
           tenantName: "prodtenant",
           // ...
       )
   }
   ```

6. **Session token for app-level auth** is stored encrypted in SimpleKeychain for persistence across app launches. MSAL tokens handle Azure B2C; the session token is the app's own auth state:
   ```swift
   final class AlmacenSesion: AlmacenSesionProtocol {
       private let keychain = SimpleKeychain(service: "com.company.app")
       
       func guardarToken(_ token: String) throws {
           try keychain.set(token, forKey: "session_token")
       }
       
       func obtenerToken() throws -> String {
           try keychain.string(forKey: "session_token")
       }
       
       func eliminarToken() throws {
           try keychain.deleteItem(forKey: "session_token")
       }
   }
   ```

7. **Token refresh interceptor** in the network layer (Alamofire) automatically retries requests when a 401 is received by calling MSAL's silent token acquisition.

## Consequences

### Positive
- MSAL handles the full OAuth 2.0 / OpenID Connect flow including PKCE, token refresh, and secure storage
- Biometric authentication provides a seamless UX without compromising security
- Azure B2C policy-based configuration allows flexible authentication flows per environment
- Google Sign-In is handled server-side via B2C federation — no additional SDK in the app
- SimpleKeychain encrypts app-level session tokens with hardware-backed encryption on iOS

### Negative
- MSAL is a large dependency with its own Keychain management that can conflict with other Keychain usages
- Azure B2C policy configuration is managed outside the app; changes require coordination with the identity team
- Biometric authentication requires handling multiple fallback scenarios (biometric not enrolled, biometric locked out, device passcode fallback)

### Risks
- **Token storage conflicts:** MSAL and SimpleKeychain use different Keychain access groups. Misconfigured groups could expose tokens. **Mitigation:** MSAL uses its dedicated `keychainSharingGroup`; SimpleKeychain uses a separate service identifier. Both are configured in the app's entitlements.
- **B2C policy misconfiguration:** Wrong policy names cause silent failures during authentication. **Mitigation:** The app validates B2C configuration at launch and logs detailed errors for missing or malformed policies.
- **Biometric bypass:** Jailbroken devices can potentially bypass LAContext. **Mitigation:** Biometric unlock is layered — it unlocks the encrypted session token, which still requires server-side validation. Jailbreak detection is implemented as an additional defense layer.
