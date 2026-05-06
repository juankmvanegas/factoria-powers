---
name: swf-database
description: "Realm database operations — schema design, migrations, encryption, thread safety, query optimization"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Database — Realm Operations

This skill covers all Realm database operations for the iOS/Swift project, including schema design, migration handling, encrypted configuration, thread-safe access patterns, and query optimization.

## Realm Configuration (ADR-005)

### Encrypted Realm Setup

```swift
// Standard encrypted Realm configuration
let config = Realm.Configuration(
    encryptionKey: obtenerClaveEncriptacion(),
    schemaVersion: currentSchemaVersion,
    migrationBlock: { migration, oldSchemaVersion in
        // Migration logic per version
    }
)
```

- Encryption key stored in Keychain via SimpleKeychain
- **NEVER** hardcode encryption keys
- **NEVER** log Realm file paths in production
- Key rotation requires full data migration

### Thread-Safe Access

```swift
// CORRECT — access Realm on the correct thread
@MainActor
func guardarDatos(_ modelo: MiModelo) {
    let realm = try! Realm()
    try! realm.write {
        realm.add(modelo, update: .modified)
    }
}

// CORRECT — background thread access
DispatchQueue.global().async {
    autoreleasepool {
        let realm = try! Realm()
        try! realm.write {
            // Background write
        }
    }
}
```

- **NEVER** pass Realm objects between threads — use `ThreadSafeReference`
- **ALWAYS** wrap background Realm access in `autoreleasepool`
- **ALWAYS** create a new Realm instance per thread

## Execution Flow — Schema Design

### Step 1: Define Object Model

1. Create Realm `Object` subclass in `Core/Sources/Core/DataBase/`
2. Use `@Persisted` property wrapper for all stored properties
3. Define primary key with `@Persisted(primaryKey: true)`
4. Use appropriate types: `String`, `Int`, `Double`, `Date`, `Data`, `Bool`
5. Use `List<T>` for to-many relationships
6. Use `EmbeddedObject` for nested objects owned by parent

```swift
final class EntidadRealm: Object {
    @Persisted(primaryKey: true) var id: String
    @Persisted var nombre: String
    @Persisted var fechaCreacion: Date
    @Persisted var items: List<ItemRealm>
}
```

### Step 2: Migration Handling

1. Increment `schemaVersion` in configuration
2. Add migration block for each version transition
3. Handle property additions, removals, and renames
4. Test migration from every previous version

```swift
migrationBlock: { migration, oldSchemaVersion in
    if oldSchemaVersion < 2 {
        migration.enumerateObjects(ofType: EntidadRealm.className()) { oldObject, newObject in
            newObject?["nuevaPropiedad"] = valorDefault
        }
    }
    if oldSchemaVersion < 3 {
        // Next migration step
    }
}
```

### Step 3: Query Optimization

1. Use `@Persisted(indexed: true)` for frequently queried properties
2. Prefer `filter()` with NSPredicate over Swift closures for Realm queries
3. Use `Results` lazy evaluation — don't materialize large result sets
4. Batch writes in a single `realm.write` transaction
5. Use `observe()` for reactive updates instead of polling

## Auto-Shielding

- **ABORT** if migration block is missing for a schema version change
- **ABORT** if encryption key is hardcoded in source code
- **ABORT** if Realm objects are passed between threads without `ThreadSafeReference`
- **WARN** if schema has >20 properties on a single Object — suggest decomposition

## Rules

1. All Realm schema changes require a migration block — no exceptions
2. Encryption key management through Keychain only
3. Thread safety is non-negotiable — each thread gets its own Realm instance
4. All queries on indexed fields when possible
5. Never use `try!` for Realm operations in production — handle errors gracefully
6. Test migrations from every previous schema version
7. Realm file deletion is a last resort — prefer migration
8. Use `autoreleasepool` for batch operations to manage memory
9. Monitor Realm file size — compact when it grows beyond threshold
10. Back up Realm data before destructive migrations
