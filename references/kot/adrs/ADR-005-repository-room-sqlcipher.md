# ADR-005: Repository Pattern with Room and SQLCipher

## Status
Accepted

## Date
2024-04-18 (Factoria-Kot v1.0.0)

## Context
Local data persistence is required for offline support, caching, and sensitive data storage. We need a pattern that provides abstraction and encryption.

## Decision
Implement Repository pattern with Room database encrypted using SQLCipher:

### Repository Interface (Domain Layer)

```kotlin
// In dominio/repositorio/
interface INotasRepositorio {
    fun obtenerNotas(): Flow<Resultado<List<Nota>>>
    fun obtenerNotaPorId(id: Long): Flow<Resultado<Nota>>
    suspend fun guardarNota(nota: Nota): Resultado<Long>
    suspend fun eliminarNota(id: Long): Resultado<Unit>
}
```

### Repository Implementation (Data Layer)

```kotlin
// In datos/repositorio/
class NotasRepositorioImpl @Inject constructor(
    private val fuenteLocal: IFuenteNotasLocal,
    private val fuenteRemota: IFuenteNotasRemota,
    @IoDispatcher private val despachadorIo: CoroutineDispatcher
) : INotasRepositorio {

    override fun obtenerNotas(): Flow<Resultado<List<Nota>>> = flow {
        emit(Resultado.Cargando())
        try {
            val notasLocales = fuenteLocal.obtenerNotas()
            emit(Resultado.Correcto(Estado.CORRECTO, notasLocales.map { it.toDomain() }))
        } catch (e: Exception) {
            emit(Resultado.Error(Estado.ERROR, e.message ?: "Error desconocido", excepcion = e))
        }
    }.flowOn(despachadorIo)
}
```

### Room Database with SQLCipher

```kotlin
@Database(
    entities = [NotaEntidad::class],
    version = 1,
    exportSchema = true
)
abstract class BaseDatosApp : RoomDatabase() {
    abstract fun notaDao(): NotaDao
}

// DI Module
@Module
@InstallIn(SingletonComponent::class)
object BaseDatosModulo {
    
    @Provides
    @Singleton
    fun proveerBaseDatosApp(app: Application): BaseDatosApp {
        System.loadLibrary("sqlcipher")
        
        val passphrase = BuildConfig.CLAVE_CIFRADO_LOCAL.toByteArray(Charsets.UTF_8)
        val soporteFactory = SupportOpenHelperFactory(passphrase)
        
        return Room.databaseBuilder(
            app,
            BaseDatosApp::class.java,
            "bd_app_cifrada"
        )
        .openHelperFactory(soporteFactory)
        .fallbackToDestructiveMigration(true)
        .build()
    }
    
    @Provides
    fun proveerNotaDao(baseDatos: BaseDatosApp): NotaDao {
        return baseDatos.notaDao()
    }
}
```

### Dependencies

```toml
[versions]
room = "2.6.1"
sqlcipher = "4.5.7"

[libraries]
room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
sqlcipher = { group = "net.zetetic", name = "sqlcipher-android", version.ref = "sqlcipher" }
sqlite = { group = "androidx.sqlite", name = "sqlite-ktx", version = "2.4.0" }
```

## Consequences

- All local data is encrypted at rest
- Repository is the single source of truth
- Domain layer is decoupled from data implementation
- DAOs never expose entities directly - always mapped to domain models
- Passphrase must be stored securely (BuildConfig or Keystore)
- Migration strategy required for schema changes
- Integration tests need test database factory
