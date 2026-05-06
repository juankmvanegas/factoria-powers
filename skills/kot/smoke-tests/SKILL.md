---
name: kot-smoke-tests
description: "Quick smoke tests to verify basic functionality"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Smoke Tests — Quick Verification

## Purpose

Run a subset of critical tests to verify the system works after changes.

## Tests to Run

### 1. Compilation
```bash
# Verify it compiles for all variants
./gradlew assembleDebug assembleRelease
```

### 2. Tests Tagged "smoke"
```bash
# Run only tests marked as smoke
./gradlew test -Ptags=smoke
```

### 3. Critical Lint
```bash
# Errors only, not warnings
./gradlew lint --continue
# Verify no fatal errors
```

## How to Mark Tests as Smoke

```kotlin
@Tag("smoke")
class LoginViewModelSmokeTest {
    @Test
    fun `login with valid credentials works`() {
        // Critical happy path test
    }
}
```

## Recommended Smoke Tests

Each module should have at least 1 smoke test that verifies:

| Module | Smoke Test |
|--------|------------|
| feature-login | Login happy path |
| feature-home | Home screen loads |
| data | Repository connects to Room |
| network | API client initializes |

## Output

```markdown
# 🔥 Smoke Test Results — [Date]

## Status: ✅ PASS / ❌ FAIL

## Results

| Test Suite | Status | Time |
|------------|--------|------|
| Debug Build | ✅ | 45s |
| Release Build | ✅ | 52s |
| Smoke Tests | ✅ 5/5 | 3s |
| Critical Lint | ✅ | 12s |

## Total: X seconds

## Next Steps
- ✅ Safe to proceed (if PASS)
- ❌ Fix issues before proceeding (if FAIL)
```

## When to Use

- After pulls from main/develop
- Before creating a PR
- After significant merges
- As a quick gate before the full test suite
