# ADR-006: Firebase Services Integration

## Status
Accepted

## Date
2024-04-18 (Factoria-Kot v1.0.0)

## Context
Mobile applications require analytics, crash reporting, remote configuration, and push notifications. Firebase provides a unified platform for these services.

## Decision
Integrate Firebase services for analytics, crash reporting, and remote configuration:

### Services

| Service | Purpose | Priority |
|---------|---------|----------|
| Firebase Analytics | User behavior tracking | Required |
| Firebase Crashlytics | Crash reporting | Required |
| Firebase Remote Config | Feature flags, dynamic config | Required |
| Firebase Cloud Messaging | Push notifications | Optional |

### Setup

```kotlin
// Application class
@HiltAndroidApp
class SisteApp : Application() {
    override fun onCreate() {
        super.onCreate()
        FirebaseApp.initializeApp(this)
    }
}
```

### Crashlytics Wrapper

```kotlin
interface ICrashlyticsEnvoltura {
    fun reportarExcepcion(excepcion: Exception, mensaje: String)
    fun establecerPropiedad(clave: String, valor: String)
    fun establecerUsuarioId(id: String?)
    fun registrarEvento(evento: String)
}

class FirebaseCrashlyticsEnvolturaImpl : ICrashlyticsEnvoltura {
    private val crashlytics = Firebase.crashlytics
    
    override fun reportarExcepcion(excepcion: Exception, mensaje: String) {
        crashlytics.log(mensaje)
        crashlytics.recordException(excepcion)
    }
    
    override fun establecerPropiedad(clave: String, valor: String) {
        crashlytics.setCustomKey(clave, valor)
    }
    
    override fun establecerUsuarioId(id: String?) {
        crashlytics.setUserId(id ?: "")
    }
    
    override fun registrarEvento(evento: String) {
        crashlytics.log(evento)
    }
}
```

### Remote Config

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object FirebaseModulo {
    
    @Provides
    @Singleton
    fun proveerFirebaseRemoteConfig(): FirebaseRemoteConfig {
        return Firebase.remoteConfig.apply {
            setConfigSettingsAsync(
                remoteConfigSettings {
                    minimumFetchIntervalInSeconds = if (BuildConfig.DEBUG) 0 else 3600
                }
            )
            setDefaultsAsync(R.xml.remote_config_defaults)
        }
    }
}

// Usage
class ConfiguracionRemotaImpl @Inject constructor(
    private val remoteConfig: FirebaseRemoteConfig
) : IConfiguracionRemota {
    
    override suspend fun obtenerValor(clave: String): String {
        return remoteConfig.getString(clave)
    }
    
    override suspend fun obtenerBoolean(clave: String): Boolean {
        return remoteConfig.getBoolean(clave)
    }
    
    override suspend fun sincronizar(): Boolean {
        return try {
            remoteConfig.fetchAndActivate().await()
        } catch (e: Exception) {
            false
        }
    }
}
```

### Analytics Events

```kotlin
interface IAnalyticsEnvoltura {
    fun registrarPantalla(nombre: String, clase: String)
    fun registrarEvento(nombre: String, parametros: Map<String, String>)
}

class FirebaseAnalyticsEnvolturaImpl(
    private val analytics: FirebaseAnalytics
) : IAnalyticsEnvoltura {
    
    override fun registrarPantalla(nombre: String, clase: String) {
        analytics.logEvent(FirebaseAnalytics.Event.SCREEN_VIEW) {
            param(FirebaseAnalytics.Param.SCREEN_NAME, nombre)
            param(FirebaseAnalytics.Param.SCREEN_CLASS, clase)
        }
    }
    
    override fun registrarEvento(nombre: String, parametros: Map<String, String>) {
        analytics.logEvent(nombre) {
            parametros.forEach { (key, value) ->
                param(key, value)
            }
        }
    }
}
```

## Consequences

- All crashes automatically reported with stack traces
- Custom events tracked for user behavior analysis
- Feature flags can be updated without app release
- A/B testing possible via Remote Config
- Must comply with privacy regulations (consent required)
- Firebase SDK adds ~2MB to APK size
- Network calls made on app start for config fetch
- Interface wrappers allow testing without Firebase dependency
