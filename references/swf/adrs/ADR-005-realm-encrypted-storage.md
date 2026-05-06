# ADR-005: Realm Encrypted Local Storage

## Status
Accepted

## Date
2025-01-15

## Context
The application requires a local database for offline data access, caching, and fast reads. The persistence layer must support encryption at rest to protect sensitive user data, automatic schema migrations as the data model evolves, and thread-safe access patterns compatible with Swift concurrency. The team evaluated CoreData, SQLite (via GRDB), and Realm. CoreData's complexity and SwiftData's iOS 17 requirement eliminated those options. Raw SQLite requires significant boilerplate for encryption and migrations. Realm provides a mature, object-oriented database with built-in encryption, automatic migrations, and a Swift-native API.

## Decision
We adopt **Realm (realm-swift)** as the local database with **AES-256 encryption** enabled via a 64-byte key stored in **SimpleKeychain**.

### Encryption Key Management

```swift
import SimpleKeychain
import CryptoSwift

enum RealmKeyManager {
    private static let keychainKey = "com.app.realm.encryptionKey"
    private static let keychain = SimpleKeychain(service: "com.app.database")
    
    static func getOrCreateKey() throws -> Data {
        if let existingKey = try? keychain.data(forKey: keychainKey) {
            return existingKey
        }
        
        // Generate a cryptographically secure 64-byte key
        var keyBytes = [UInt8](repeating: 0, count: 64)
        let status = SecRandomCopyBytes(kSecRandomDefault, 64, &keyBytes)
        guard status == errSecSuccess else {
            throw RealmKeyError.keyGenerationFailed
        }
        
        let keyData = Data(keyBytes)
        try keychain.set(keyData, forKey: keychainKey)
        return keyData
    }
}
```

### Realm Configuration

```swift
import RealmSwift

enum RealmConfigurator {
    static func makeConfiguration() throws -> Realm.Configuration {
        let encryptionKey = try RealmKeyManager.getOrCreateKey()
        
        return Realm.Configuration(
            encryptionKey: encryptionKey,
            schemaVersion: 3,
            migrationBlock: { migration, oldSchemaVersion in
                if oldSchemaVersion < 2 {
                    // Migration from v1 to v2
                }
                if oldSchemaVersion < 3 {
                    // Migration from v2 to v3
                }
            },
            deleteRealmIfMigrationNeeded: false
        )
    }
}
```

### Thread-Safe Access Pattern

Realm objects are confined to the thread where they were created. For safe cross-thread access:

```swift
// Write on a background queue
func saveUser(_ user: UserDTO) async throws {
    try await Task.detached {
        let realm = try Realm(configuration: RealmConfigurator.makeConfiguration())
        try realm.write {
            realm.add(user.toRealmObject(), update: .modified)
        }
    }.value
}

// Read with frozen objects for cross-thread transfer
func fetchUsers() async throws -> [User] {
    try await Task.detached {
        let realm = try Realm(configuration: RealmConfigurator.makeConfiguration())
        let results = realm.objects(UserObject.self).freeze()
        return results.map { $0.toDomain() }
    }.value
}
```

### Repository Pattern

Each feature module defines a repository protocol in its Data layer. The Realm implementation resides alongside:

```swift
// In FeatureProfile/Sources/Data/Repositories/
protocol ProfileRepository {
    func getProfile() async throws -> Profile
    func saveProfile(_ profile: Profile) async throws
}

final class RealmProfileRepository: ProfileRepository {
    func getProfile() async throws -> Profile { /* Realm read */ }
    func saveProfile(_ profile: Profile) async throws { /* Realm write */ }
}
```

## Consequences

### Positive
- AES-256 encryption at rest protects sensitive data without additional libraries.
- Encryption key in SimpleKeychain is protected by the device's Secure Enclave.
- Automatic migration blocks handle schema evolution without data loss.
- Frozen objects enable safe cross-thread data transfer with Swift concurrency.
- Object-oriented API reduces boilerplate compared to raw SQL.

### Negative
- Realm objects cannot be shared across threads without freezing or `ThreadSafeReference`.
- Realm's binary size adds approximately 5-8 MB to the app bundle.
- Debugging Realm files requires Realm Studio or decryption utilities.
- Migration blocks grow linearly with schema versions and must be maintained indefinitely.

### Risks
- **Risk**: Encryption key is lost (e.g., user restores device without Keychain). **Mitigation**: Detect decryption failure, delete the local database, and re-sync from the server. Inform the user.
- **Risk**: Complex migrations corrupt data. **Mitigation**: Unit test every migration path. Never set `deleteRealmIfMigrationNeeded: true` in production.
- **Risk**: Thread safety violations cause crashes. **Mitigation**: Enforce the `Task.detached` + `freeze()` pattern via code review. Lint rules flag direct Realm access from the main actor.
