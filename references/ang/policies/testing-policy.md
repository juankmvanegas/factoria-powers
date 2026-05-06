# Testing Policy — Angular

## Principle

All production code must have tests. No code is delivered without tests.

## Framework Stack

| Tool | Purpose | Version |
|------|---------|---------|
| Karma | Test runner | 4.4.x |
| Jasmine | Assertion framework | 4.6.x |
| ng-mocks | Mocking of Angular components/services | 14.9.x |
| Chrome / ChromeHeadless | Execution browser | Latest |

## Test Structure

```
src/
├── application/
│   └── services/
│       ├── {entity}.ts              ← Service
│       └── {entity}.spec.ts         ← Service test
├── infrastructure/
│   └── services/
│       └── api-bff/
│           ├── api-bff-{entity}.service.ts      ← Adapter
│           └── api-bff-{entity}.service.spec.ts  ← Adapter test
└── presentation/
    └── views/
        └── {entity}-view/
            └── components/
                ├── {component}.ts        ← Component
                └── {component}.spec.ts   ← Test (only if it has significant logic)
```

## Mandatory Rules

### AAA Pattern
```typescript
it('should return all notes when cache has data', () => {
  // Arrange
  const mockNotes = [{ id: 1, title: 'Test' }];
  spyOn(localStorageAdapter, 'getNotes').and.returnValue(mockNotes);

  // Act
  const result = service.getAllNotesInLocalCache();

  // Assert
  expect(result).toEqual(mockNotes);
});
```

### Naming Convention
```typescript
describe('NotesService', () => {
  describe('getAllNotes', () => {
    it('should return notes from local cache', () => { ... });
    it('should refresh notes when event is dispatched', () => { ... });
    it('should return empty array when no notes exist', () => { ... });
  });
});
```

Format: `should [expected behavior] when [scenario]`

### Coverage by Type

| Type | Mandatory | What to test |
|------|-----------|--------------|
| Use Case Services | YES | All business logic |
| Infrastructure Adapters | YES | HTTP calls, response mapping |
| Guards | YES | Authorization logic |
| Interceptors | YES | HTTP error handling |
| Components with logic | CONDITIONAL | Only if they have significant logic (not pure templates) |
| Pages | NO | Only integration if necessary |
| Pipes | YES | Transformations |

### Mocking

```typescript
// With ng-mocks
const mockNotesAdapter = MockProvider(NotesAdapter, {
  getAllNotes: () => of([mockNote])
});

// With Jasmine Spy
const spyAdapter = jasmine.createSpyObj('NotesAdapter', ['getAllNotes']);
spyAdapter.getAllNotes.and.returnValue(of([mockNote]));

// In TestBed
TestBed.configureTestingModule({
  providers: [
    NotesService,
    { provide: NotesAdapter, useValue: spyAdapter }
  ]
});
```

### One Behavior Per Test

```typescript
// CORRECT — One behavior
it('should call adapter when getting notes', () => {
  service.getAllNotes();
  expect(adapter.getAllNotes).toHaveBeenCalled();
});

it('should return mapped notes', () => {
  const result = service.getAllNotes();
  expect(result).toEqual(expectedNotes);
});

// INCORRECT — Multiple behaviors
it('should get and map notes', () => {
  const result = service.getAllNotes();
  expect(adapter.getAllNotes).toHaveBeenCalled(); // behavior 1
  expect(result).toEqual(expectedNotes);           // behavior 2
});
```

## CI/CD Execution Order

1. **Lint**: `ng lint` — no warnings or errors
2. **Build**: `ng build --configuration production` — compiles without errors
3. **Tests**: `ng test --watch=false --browsers=ChromeHeadless` — all pass

## Mandatory Edge Cases

For each service, verify:
- Empty response (`[]`, `null`, `undefined`)
- HTTP error (400, 401, 404, 500)
- Observable that does not emit
- Observable that emits an error
- Invalid parameters
- Authentication state (logged in / out)

## Metrics

| Metric | Minimum |
|--------|---------|
| Tests pass | 100% |
| Build without errors | Mandatory |
| Lint without errors | Mandatory |
| Services with tests | 100% |
| Guards/Interceptors with tests | 100% |
