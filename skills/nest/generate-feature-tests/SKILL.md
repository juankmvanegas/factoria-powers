---
name: nest-generate-feature-tests
description: "Use when services or components are implemented and need a complete test suite generated following the project testing policy and AAA pattern"
---

---
name: generate-feature-tests
description: "Generate test suites for NestJS BFF application and infrastructure services"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Generate Feature Tests

## Purpose
Generate a complete test suite for a new or existing NestJS BFF service,
following the project's testing policy and conventions using Jest,
@nestjs/testing, and @golevelup/ts-jest.

## When to Use
- After creating a new application service in `src/application/services/`
- After creating a new infrastructure service in `src/infrastructure/services/`
- When adding new methods to existing services
- When refactoring services and tests need updating

## Inputs Required
1. **Service name** - The service to test (e.g., `UserProfileService`)
2. **Service layer** - `application` or `infrastructure`
3. **Methods to test** - List of methods with expected behaviors
4. **Dependencies** - Interfaces/services the service depends on (for mocking)

## Output Structure
```
test/
  datasets/
    mocks/
      [feature]/
        [entity].mock.ts          - Mock data for the entity/DTO
  unit-testing/
    services/
      [application|infrastructure]/
        [service-name].service.spec.ts   - Jest test file
```

## Execution Flow

### Step 1 â€” Read Service Source Code
1. Read the service file to identify all public methods
2. Read the service's constructor to identify all injected dependencies
3. Read the DTOs used by the service (request/response types)
4. Read the interfaces the service implements

### Step 2 â€” Identify Test Scenarios
For each public method, identify:
- Happy path (successful execution)
- Error cases (exceptions, not found, validation failures)
- Edge cases (empty arrays, null values, timeouts)
- For infrastructure services: HTTP error scenarios (4xx, 5xx, timeout)

### Step 3 â€” Generate Mock Data
Create mock files in `test/datasets/mocks/[feature]/`:
- One mock file per entity/DTO type
- Export factory functions that return mock instances
- Include variations (valid, invalid, empty, partial)

### Step 4 â€” Generate Test File
Create the spec file in `test/unit-testing/services/[layer]/`:
- Use `Test.createTestingModule()` from `@nestjs/testing`
- Use `createMock()` from `@golevelup/ts-jest` for auto-mocking
- Follow AAA pattern (Arrange-Act-Assert)
- One behavior per test
- Group related tests in `describe` blocks per method

### Step 5 â€” Verify Coverage
- Target: minimum 90% coverage
- Ensure all branches are covered
- Ensure all error paths are tested

## Rules
1. Follow AAA pattern (Arrange-Act-Assert) mandatory
2. Name tests descriptively: `should [expected behavior] when [scenario]`
3. One behavior per test â€” never test multiple things in one `it()` block
4. Use `createMock<T>()` from `@golevelup/ts-jest` for dependency mocking
5. Use `Test.createTestingModule()` for proper NestJS DI testing
6. Create mock data in `test/datasets/mocks/` â€” never inline large objects in tests
7. Mock infrastructure service interfaces, never concrete classes
8. Test both success and failure paths
9. Test exception throwing scenarios (HttpException, custom exceptions)
10. For infrastructure services: mock HttpService/Axios responses
11. Minimum 90% code coverage target
12. Group tests by method using nested `describe()` blocks

## Test File Template
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
// ... imports

describe('[ServiceName]', () => {
  let service: ServiceName;
  let mockDependency: jest.Mocked<IDependency>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceName,
        {
          provide: IDependency,
          useValue: createMock<IDependency>(),
        },
      ],
    }).compile();

    service = module.get<ServiceName>(ServiceName);
    mockDependency = module.get(IDependency);
  });

  describe('methodName', () => {
    it('should [expected] when [scenario]', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## Process
1. Read the service source code
2. Identify all public methods and their dependencies
3. Identify all possible scenarios (happy path, error cases, edge cases)
4. Generate mock data in `test/datasets/mocks/`
5. Generate the test file in `test/unit-testing/services/`
6. Verify test follows naming conventions and coverage targets
