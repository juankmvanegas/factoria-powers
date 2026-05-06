# ADR-014: Azure B2C Authentication with MSAL

## Status
Accepted

## Date
2024-04-18 (Factoria-Kot v1.0.0)

## Context
Enterprise mobile applications require secure authentication with support for SSO, MFA, and integration with corporate identity providers. Azure AD B2C provides these capabilities.

## Decision
Use Microsoft Authentication Library (MSAL) for Azure B2C authentication:

### Dependencies

```toml
[versions]
msal = "5.0.0"

[libraries]
msal = { group = "com.microsoft.identity.client", name = "msal", version.ref = "msal" }
```

### Configuration Files per Build Type

```
app/src/
├── debug/res/raw/auth_config_b2c_debug.json
├── staging/res/raw/auth_config_b2c_staging.json
├── release/res/raw/auth_config_b2c_release.json
└── releaseHuawei/res/raw/auth_config_b2c_huawei.json
```

### Config JSON Structure

```json
{
  "client_id": "your-client-id",
  "redirect_uri": "msauth://com.empresa.app/your-hash",
  "authorities": [
    {
      "type": "B2C",
      "authority_url": "https://your-tenant.b2clogin.com/tfp/your-tenant.onmicrosoft.com/B2C_1_signIn",
      "default": true
    },
    {
      "type": "B2C",
      "authority_url": "https://your-tenant.b2clogin.com/tfp/your-tenant.onmicrosoft.com/B2C_1_signUp"
    },
    {
      "type": "B2C",
      "authority_url": "https://your-tenant.b2clogin.com/tfp/your-tenant.onmicrosoft.com/B2C_1_passwordReset"
    }
  ],
  "account_mode": "SINGLE",
  "broker_redirect_uri_registered": false
}
```

### Session Controller

```kotlin
@Singleton
class ControladorSesion @Inject constructor(
    private val tokenObserver: TokenObserver,
    private val iActualizacionToken: IActualizacionToken,
    @MainDispatcher private val despachadorPrincipal: CoroutineDispatcher,
    private val administradorSesion: AdministradorSesion,
    private val crashlytics: ICrashlyticsEnvoltura
) {
    var msalAplicacion: IMultipleAccountPublicClientApplication? = null
        private set
    
    var tokenAcceso: String = ""
        private set
    
    var mantenerSesionActiva: Boolean = false
    
    private val configPorBuild = mapOf(
        "debug" to R.raw.auth_config_b2c_debug,
        "staging" to R.raw.auth_config_b2c_staging,
        "release" to R.raw.auth_config_b2c_release,
        "releaseHuawei" to R.raw.auth_config_b2c_huawei
    )
    
    suspend fun inicializar(contexto: Context) {
        val configId = configPorBuild[BuildConfig.BUILD_TYPE] ?: R.raw.auth_config_b2c_debug
        
        try {
            msalAplicacion = PublicClientApplication.createMultipleAccountPublicClientApplication(
                contexto,
                configId
            )
        } catch (e: Exception) {
            crashlytics.reportarExcepcion(e, "Error inicializando MSAL")
        }
    }
    
    suspend fun iniciarSesionInteractivo(activity: Activity): Resultado<String> {
        val msal = msalAplicacion ?: return Resultado.Error(mensaje = "MSAL no inicializado")
        
        return try {
            val parametros = AcquireTokenParameters.Builder()
                .startAuthorizationFromActivity(activity)
                .withScopes(listOf("openid", "profile", "offline_access"))
                .withCallback(object : AuthenticationCallback {
                    override fun onSuccess(authenticationResult: IAuthenticationResult) {
                        tokenAcceso = authenticationResult.accessToken
                        tokenObserver.notificarhayTokenObservadores(true)
                        establecerContextoUsuario(authenticationResult)
                    }
                    
                    override fun onError(exception: MsalException) {
                        // Handle error
                    }
                    
                    override fun onCancel() {
                        // Handle cancel
                    }
                })
                .build()
            
            msal.acquireToken(parametros)
            Resultado.Correcto(datos = tokenAcceso)
        } catch (e: Exception) {
            Resultado.Error(mensaje = e.message ?: "Error de autenticación", excepcion = e)
        }
    }
    
    suspend fun adquirirTokenSilencioso(): Resultado<String> {
        val msal = msalAplicacion ?: return Resultado.Error(mensaje = "MSAL no inicializado")
        val cuenta = msal.accounts.firstOrNull() 
            ?: return Resultado.Error(mensaje = "No hay cuenta activa")
        
        return try {
            val parametros = AcquireTokenSilentParameters.Builder()
                .forAccount(cuenta)
                .fromAuthority(cuenta.authority)
                .withScopes(listOf("openid", "profile", "offline_access"))
                .build()
            
            val resultado = msal.acquireTokenSilent(parametros)
            tokenAcceso = resultado.accessToken
            tokenObserver.notificarhayTokenObservadores(true)
            Resultado.Correcto(datos = tokenAcceso)
        } catch (e: MsalUiRequiredException) {
            Resultado.Error(mensaje = "Se requiere login interactivo", excepcion = e)
        } catch (e: Exception) {
            Resultado.Error(mensaje = e.message ?: "Error silencioso", excepcion = e)
        }
    }
    
    suspend fun cerrarSesion() {
        val msal = msalAplicacion ?: return
        val cuenta = msal.accounts.firstOrNull() ?: return
        
        try {
            msal.removeAccount(cuenta)
            tokenAcceso = ""
            tokenObserver.notificarhayTokenObservadores(false)
            administradorSesion.limpiarSesion()
        } catch (e: Exception) {
            crashlytics.reportarExcepcion(e, "Error cerrando sesión")
        }
    }
    
    private fun establecerContextoUsuario(resultado: IAuthenticationResult) {
        val jwtToken = JWT(resultado.accessToken)
        val claims = jwtToken.claims
        
        crashlytics.establecerUsuarioId(claims["sub"]?.asString())
        crashlytics.establecerPropiedad("tipo_usuario", claims["userType"]?.asString() ?: "unknown")
    }
}
```

### Token Observer Pattern

```kotlin
interface TokenActions {
    fun hayToken(hayToken: Boolean)
}

@Singleton
class TokenObserver @Inject constructor() {
    private val observadores = mutableListOf<TokenActions>()
    
    fun agregarObservador(observador: TokenActions) {
        if (!observadores.contains(observador)) {
            observadores.add(observador)
        }
    }
    
    fun removerObservador(observador: TokenActions) {
        observadores.remove(observador)
    }
    
    fun notificarhayTokenObservadores(hayToken: Boolean) {
        observadores.forEach { it.hayToken(hayToken) }
    }
}
```

### Inactivity Timer

```kotlin
@Singleton
class AdministradorSesion @Inject constructor() {
    var estado: EstadoSesion = EstadoSesion.INACTIVO
    var clickCerrarSesion: Boolean = false
    
    private var tiempoInactividad: CountDownTimer? = null
    private val tiempoMaximoInactividadMs = 10 * 60 * 1000L // 10 minutes
    
    fun iniciarTimerInactividad(onTimeout: () -> Unit) {
        cancelarTimer()
        tiempoInactividad = object : CountDownTimer(tiempoMaximoInactividadMs, 1000) {
            override fun onTick(millisUntilFinished: Long) {
                // Optional: emit remaining time
            }
            
            override fun onFinish() {
                onTimeout()
            }
        }.start()
    }
    
    fun reiniciarTimer() {
        tiempoInactividad?.cancel()
        tiempoInactividad?.start()
    }
    
    fun cancelarTimer() {
        tiempoInactividad?.cancel()
        tiempoInactividad = null
    }
    
    fun limpiarSesion() {
        cancelarTimer()
        estado = EstadoSesion.INACTIVO
    }
}

enum class EstadoSesion {
    INACTIVO,
    ACTIVO,
    PRECAUCION_MODAL,
    SESION_EXPIRADA
}
```

### Interceptor for Token Injection

```kotlin
class EncabezadoConfiguracionInterceptor @Inject constructor(
    private val controladorSesion: ControladorSesion
) : Interceptor {
    
    override fun intercept(chain: Interceptor.Chain): Response {
        val solicitudOriginal = chain.request()
        
        val solicitud = solicitudOriginal.newBuilder()
            .addHeader("authorization", "Bearer ${controladorSesion.tokenAcceso}")
            .addHeader("x-api-version", BuildConfig.VERSION_NAME)
            .build()
        
        val respuesta = chain.proceed(solicitud)
        
        if (respuesta.code == 401) {
            // Token expired, trigger refresh or logout
            controladorSesion.administradorSesion.estado = EstadoSesion.SESION_EXPIRADA
        }
        
        return respuesta
    }
}
```

## Consequences

- Enterprise-grade authentication with Azure AD B2C
- SSO support across Microsoft ecosystem
- MFA enforced by B2C policies
- Token refresh handled automatically (silent acquisition)
- Session management with inactivity timeout
- Biometric authentication can be layered on top
- Separate configurations per build type
- User context available for crash reporting
- 401 responses trigger re-authentication flow
