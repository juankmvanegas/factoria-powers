# ADR-007: Observability with Firebase Analytics and Crashlytics

## Status
Accepted

## Date
2024-04-18 (Factoria-Kot v1.0.0)

## Context
Production applications require comprehensive observability: crash reporting, performance monitoring, user analytics, and custom logging. This enables proactive issue detection and data-driven decisions.

## Decision
Implement observability stack using Firebase services with custom wrappers:

### Logging Architecture

```kotlin
// Core logging interface
interface IAdministradorLogs {
    fun debug(tag: String, mensaje: String)
    fun info(tag: String, mensaje: String)
    fun warning(tag: String, mensaje: String)
    fun error(tag: String, mensaje: String, excepcion: Throwable? = null)
}

// Implementation
class AdministradorLogsImpl @Inject constructor(
    private val crashlytics: ICrashlyticsEnvoltura
) : IAdministradorLogs {
    
    override fun debug(tag: String, mensaje: String) {
        if (BuildConfig.DEBUG) {
            Log.d(tag, mensaje)
        }
        // Never send debug logs to Crashlytics
    }
    
    override fun info(tag: String, mensaje: String) {
        if (BuildConfig.DEBUG) {
            Log.i(tag, mensaje)
        }
        crashlytics.registrarEvento("[$tag] $mensaje")
    }
    
    override fun warning(tag: String, mensaje: String) {
        if (BuildConfig.DEBUG) {
            Log.w(tag, mensaje)
        }
        crashlytics.registrarEvento("WARNING [$tag] $mensaje")
    }
    
    override fun error(tag: String, mensaje: String, excepcion: Throwable?) {
        if (BuildConfig.DEBUG) {
            Log.e(tag, mensaje, excepcion)
        }
        excepcion?.let { 
            crashlytics.reportarExcepcion(Exception(mensaje, it), "[$tag] $mensaje")
        } ?: crashlytics.registrarEvento("ERROR [$tag] $mensaje")
    }
}
```

### Event Tracking Pattern

```kotlin
// Standardized event names
object EventosAnalytics {
    const val PANTALLA_VISTA = "pantalla_vista"
    const val BOTON_CLICK = "boton_click"
    const val ERROR_NEGOCIO = "error_negocio"
    const val SESION_INICIADA = "sesion_iniciada"
    const val SESION_CERRADA = "sesion_cerrada"
    const val OPERACION_COMPLETADA = "operacion_completada"
}

// Standardized parameters
object ParametrosAnalytics {
    const val PANTALLA_NOMBRE = "pantalla_nombre"
    const val BOTON_ID = "boton_id"
    const val ERROR_CODIGO = "error_codigo"
    const val TIEMPO_MS = "tiempo_ms"
}

// Usage in ViewModel
class NotasViewModel @Inject constructor(
    private val analytics: IAnalyticsEnvoltura,
    private val logs: IAdministradorLogs
) : ViewModel() {
    
    fun onPantallaVisible() {
        analytics.registrarPantalla("NotasPantalla", "NotasViewModel")
    }
    
    fun onNotaGuardada(tiempo: Long) {
        analytics.registrarEvento(
            EventosAnalytics.OPERACION_COMPLETADA,
            mapOf(
                "operacion" to "guardar_nota",
                ParametrosAnalytics.TIEMPO_MS to tiempo.toString()
            )
        )
    }
}
```

### Performance Monitoring

```kotlin
// Custom trace for critical operations
suspend fun <T> medirTiempo(
    nombreTraza: String,
    bloque: suspend () -> T
): T {
    val trace = Firebase.performance.newTrace(nombreTraza)
    trace.start()
    return try {
        bloque()
    } finally {
        trace.stop()
    }
}

// Usage
suspend fun sincronizarDatos() {
    medirTiempo("sincronizar_datos") {
        repositorio.sincronizar()
    }
}
```

### Crash Context

```kotlin
// Set user context for crashes
class ControladorSesion @Inject constructor(
    private val crashlytics: ICrashlyticsEnvoltura
) {
    fun onUsuarioAutenticado(usuario: Usuario) {
        crashlytics.establecerUsuarioId(usuario.id)
        crashlytics.establecerPropiedad("tipo_usuario", usuario.tipo)
        crashlytics.establecerPropiedad("version_app", BuildConfig.VERSION_NAME)
    }
    
    fun onCerrarSesion() {
        crashlytics.establecerUsuarioId(null)
    }
}
```

### ProGuard Rules (Preserve Stack Traces)

```proguard
# Crashlytics
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception

# Upload mapping file
-printmapping mapping.txt
```

## Consequences

- All crashes include user context and custom logs
- Screen views and user actions tracked automatically
- Performance bottlenecks identifiable via traces
- Debug logs stripped from release builds
- User privacy protected (no PII in logs)
- Interface wrappers enable testing without Firebase
- CI/CD uploads mapping files for deobfuscation
