---
name: swf-migration-discovery
description: "Migration step 1 — extract contracts from legacy iOS code for migration planning"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Discovery

## Purpose

Migration Step 1: Extract and catalog all contracts, patterns, and dependencies from legacy iOS code (UIKit views, manual DI, callback-based async, Storyboard navigation) to produce a comprehensive inventory for migration planning.

## Execution Flow — 7 Strict Steps

### Step 1: Identify Legacy Patterns

Scan the codebase for:

| Legacy Pattern | Detection |
|----------------|-----------|
| UIKit ViewControllers | Files with `UIViewController`, `UITableViewDelegate`, `UICollectionViewDataSource` |
| Storyboard Navigation | `.storyboard` files, `performSegue`, `instantiateViewController` |
| Manual DI | Constructor injection without Factory, `init(dependency:)` chains |
| Callback Async | Completion handlers `(Result<T, Error>) -> Void`, nested callbacks |
| XIB/NIB views | `.xib` files, `@IBOutlet`, `@IBAction` |
| Objective-C bridges | `@objc`, bridging headers, `NSObject` subclasses |
| Singleton patterns | `static let shared`, global state |
| Delegate patterns | `protocol *Delegate`, `weak var delegate` |

### Step 2: Catalog UIKit Views

For each UIKit view/controller found:

1. File path and class name
2. Number of lines
3. Subviews and layout method (autolayout, frames, SnapKit)
4. Data bindings (KVO, delegate, NotificationCenter)
5. Navigation actions (segues, push, present)
6. Dependencies injected or accessed

### Step 3: Catalog Data Layer

1. List all network calls (URLSession, Alamofire, or other)
2. Map API endpoints and response models
3. Identify data persistence (UserDefaults, CoreData, Realm, Keychain)
4. Catalog data transformations and mappers
5. Find error handling patterns

### Step 4: Catalog Navigation

1. Map all Storyboard segues and their source/destination
2. List programmatic navigation (push, present, dismiss)
3. Identify deep link handlers
4. Map tab bar and navigation controller hierarchies
5. Document modal presentation patterns

### Step 5: Catalog Dependencies

1. List all third-party dependencies (CocoaPods, Carthage, SPM)
2. Map dependency usage per module/file
3. Identify deprecated dependencies
4. Check for version conflicts
5. Flag dependencies without SwiftUI equivalents

### Step 6: Catalog Async Patterns

1. Count completion handler closures
2. Identify nested callback chains (callback hell)
3. Find DispatchQueue usage patterns
4. List NotificationCenter observers
5. Identify KVO observers
6. Map delegate-based async flows

### Step 7: Generate Discovery Report

```markdown
# Migration Discovery Report — [Project Name]
## Date: [YYYY-MM-DD]

## Summary
- Total files scanned: X
- UIKit ViewControllers: X
- Storyboard files: X
- Manual DI instances: X
- Callback-based async patterns: X
- XIB/NIB files: X

## UIKit Views Inventory
| File | Class | Lines | Layout | Navigation |
|------|-------|-------|--------|------------|
| ... | ... | ... | ... | ... |

## Data Layer Inventory
| File | API Endpoints | Persistence | Patterns |
|------|--------------|-------------|----------|
| ... | ... | ... | ... |

## Navigation Map
[Storyboard → destination mapping]

## Dependency Inventory
| Dependency | Version | Usage Count | SwiftUI Compatible |
|-----------|---------|-------------|-------------------|
| ... | ... | ... | Yes/No |

## Async Patterns Inventory
| Pattern | Count | Complexity |
|---------|-------|------------|
| Completion handlers | X | Low/Med/High |
| Nested callbacks | X | High |
| NotificationCenter | X | Med |

## Migration Complexity Score: [LOW / MEDIUM / HIGH / CRITICAL]
```

## Auto-Shielding

- **ABORT** if no legacy code is detected — nothing to migrate
- **WARN** if the project has mixed SwiftUI + UIKit — partial migration already in progress
- **WARN** if more than 50 UIKit controllers found — suggest phased approach

## Rules

1. Read-only operation — never modify any code during discovery
2. Catalog EVERY legacy pattern found, no matter how small
3. Include file paths and line numbers for all findings
4. Calculate complexity scores based on coupling and dependency depth
5. Flag circular dependencies between legacy modules
6. Output must be machine-parseable for the migration-plan skill
7. Save the discovery report to `.cloud/migration/discovery-report.md`
