---
name: kot-database
description: "Data access specialist — Room, SQLCipher, DataStore"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Data Access — Room, SQLCipher, DataStore

This skill activates automatically when working with Room migrations, DataStore operations, or repository patterns.

## Three Data Providers (ADR-005)

The architecture defines three data access providers, each with a specific purpose:

### 1. Room + SQLCipher (Encrypted Local Database)

Primary provider for structured data requiring secure local persistence.

- **AppDatabase** — RoomDatabase configured with SQLCipher for encryption.
- **DAOs** — Data Access Objects with typed queries and Flow for observation.
- **Entities** — Data classes annotated with `@Entity` that map to tables.
- **TypeConverters** — Complex type conversion (Date, Enum, JSON).

```kotlin
@Dao
interface UsuarioDao {
    @Query("SELECT * FROM usuario WHERE id = :id")
    fun obtenerPorId(id: Long): Flow<UsuarioEntity?>
    
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertar(usuario: UsuarioEntity)
}
```

### 2. DataStore (Preferences)

Provider for configuration and simple key-value data.

- **PreferencesDataStore** — For primitive data (strings, ints, booleans).
- **ProtoDataStore** — For complex objects serialized with Protocol Buffers.
- Always prefer DataStore over SharedPreferences (deprecated).

```kotlin
private val Context.dataStore by preferencesDataStore(name = "settings")

suspend fun guardarToken(token: String) {
    context.dataStore.edit { preferences ->
        preferences[TOKEN_KEY] = token
    }
}
```

### 3. Network Cache (Retrofit + OkHttp)

Provider for remote data with caching.

- **OkHttp Cache** — HTTP cache for responses.
- **Repository Pattern** — Combines local + remote sources.
- **Single Source of Truth** — Room is the source of truth, network updates Room.

## Room Migrations

- **ALWAYS** create explicit migrations, never use `fallbackToDestructiveMigration()`.
- Each migration in its own file for traceability.
- Test migrations with `MigrationTestHelper`.

```kotlin
val MIGRATION_1_2 = object : Migration(1, 2) {
    override fun migrate(database: SupportSQLiteDatabase) {
        database.execSQL("ALTER TABLE usuario ADD COLUMN avatar TEXT")
    }
}
```

## Repository Pattern

- Interface in `domain` module.
- Implementation in `data` module.
- Combines multiple data sources (local, remote).
- Returns `Flow<Resultado<T>>` for observable data.

```kotlin
// domain/
interface UsuarioRepository {
    fun obtenerUsuario(id: Long): Flow<Resultado<Usuario>>
    suspend fun actualizar(usuario: Usuario): Resultado<Unit>
}

// data/
class UsuarioRepositoryImpl @Inject constructor(
    private val localDataSource: UsuarioLocalDataSource,
    private val remoteDataSource: UsuarioRemoteDataSource
) : UsuarioRepository {
    override fun obtenerUsuario(id: Long) = flow {
        // Local first
        localDataSource.obtenerPorId(id)?.let { emit(Resultado.Exito(it)) }
        // Then refresh from network
        remoteDataSource.fetch(id).fold(
            onSuccess = { localDataSource.insertar(it) },
            onError = { /* handle */ }
        )
    }
}
```

## SQLCipher Configuration

- Key derivation from Azure Key Vault or BuildConfig in debug.
- NEVER hardcode the passphrase.
- Key rotation documented in security procedure.
