---
name: ang-generate-feature-tests
description: "Use when services or components are implemented and need a complete test suite generated following the project testing policy and AAA pattern"
---

---
name: generate-feature-tests
description: "Internal skill â€” Generate Karma/Jasmine tests for Angular feature"
---

# Generate Feature Tests (Agent Skill)

Used by testing-agent to generate a complete test suite.

## Pattern

```typescript
describe('EntityService', () => {
  let service: EntityService;
  let mockAdapter: jasmine.SpyObj<EntityAdapter>;

  beforeEach(() => {
    mockAdapter = jasmine.createSpyObj('EntityAdapter', ['method1', 'method2']);
    TestBed.configureTestingModule({
      providers: [
        EntityService,
        { provide: EntityAdapter, useValue: mockAdapter }
      ]
    });
    service = TestBed.inject(EntityService);
  });

  describe('method1', () => {
    it('should [behavior] when [scenario]', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```
