---
name: nest-generate-tests
description: "Use when new code has been written and tests need to be generated or a service/component needs full test coverage"
---

---
name: generate-tests
description: "Generate Jest test suite for NestJS BFF application services"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Generate Tests

## Purpose

Generate comprehensive Jest unit tests for NestJS BFF application services following AAA pattern and corporate testing standards.

## Execution Flow

### Step 1: Identify Target Services

1. Read `src/application/services/` to find all services
2. If a specific service is requested, target only that one
3. Read the service source code and identify all public methods

### Step 2: Generate Mock Data

1. Create mock files in `test/datasets/mocks/[feature].mock.ts`
2. Mock all infrastructure dependencies using `@golevelup/ts-jest` `createMock()`
3. Mock all application abstractions

### Step 3: Generate Test File

1. Create test at `test/unit-testing/services/[feature].test.ts`
2. Use `Test.createTestingModule()` from `@nestjs/testing`
3. Follow AAA pattern: Arrange-Act-Assert
4. Cover: happy path, error cases, edge cases, exception paths
5. Use `jest.spyOn()` for behavior verification

### Step 4: Run and Verify

1. Run `npm test -- --coverage`
2. Verify 90% minimum coverage
3. Fix failing tests

## Test Template

```typescript
describe('[ServiceName]', () => {
  let service: ServiceName;
  let mockDep: jest.Mocked<IDependency>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServiceName,
        { provide: 'IDependency', useValue: createMock<IDependency>() },
      ],
    }).compile();

    service = module.get(ServiceName);
    mockDep = module.get('IDependency');
  });

  describe('methodName', () => {
    it('should return expected result when valid input', async () => {
      // Arrange
      mockDep.method.mockResolvedValue(mockData);
      // Act
      const result = await service.methodName(input);
      // Assert
      expect(result).toEqual(expected);
    });
  });
});
```

## Rules

- ALWAYS follow AAA pattern
- ALWAYS mock infrastructure dependencies
- NEVER test infrastructure implementations directly
- Target 90% minimum coverage
- One behavior per test
