---
name: ang-generate-tests
description: "Use when new code has been written and tests need to be generated or a service/component needs full test coverage"
---

---
name: generate-tests
description: "Generate Karma/Jasmine tests for Angular services and components"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Generate Tests

## Purpose

Generate complete unit tests for Angular services, adapters, and components using Karma/Jasmine + ng-mocks.

## Execution Flow

### Phase 1: Identify What to Test

1. Read the target service/component
2. Identify all public methods
3. Identify dependencies to mock
4. Identify edge cases

### Phase 2: Generate Test File

For a SERVICE (Application layer):

```typescript
import { TestBed } from '@angular/core/testing';
import { NotesService } from './notes';
import { NotesAdapter } from '@application/abstractions/infraestructure/bff/adapters/notes';
import { of, throwError } from 'rxjs';

describe('NotesService', () => {
  let service: NotesService;
  let mockAdapter: jasmine.SpyObj<NotesAdapter>;

  beforeEach(() => {
    mockAdapter = jasmine.createSpyObj('NotesAdapter', ['getAllNotes', 'createNote']);

    TestBed.configureTestingModule({
      providers: [
        NotesService,
        { provide: NotesAdapter, useValue: mockAdapter }
      ]
    });

    service = TestBed.inject(NotesService);
  });

  describe('getAllNotes', () => {
    it('should return notes from adapter', () => {
      // Arrange
      const mockNotes = [{ id: 1, title: 'Test' }];
      mockAdapter.getAllNotes.and.returnValue(of(mockNotes));

      // Act & Assert
      service.getAllNotes().subscribe(notes => {
        expect(notes).toEqual(mockNotes);
      });
    });

    it('should return empty array when no notes exist', () => {
      // Arrange
      mockAdapter.getAllNotes.and.returnValue(of([]));

      // Act & Assert
      service.getAllNotes().subscribe(notes => {
        expect(notes).toEqual([]);
      });
    });
  });
});
```

For an ADAPTER (Infrastructure layer):

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ApiBffNotesService', () => {
  let service: ApiBffNotesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiBffNotesService, ...]
    });

    service = TestBed.inject(ApiBffNotesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
```

### Phase 3: Edge Case Coverage

For each method, test:
- Happy path
- Empty data ([], null, undefined)
- Error responses (400, 401, 404, 500)
- Observable that doesn't emit
- Auth state variations

### Phase 4: Execute Tests

```bash
ng test --watch=false --browsers=ChromeHeadless
```

### Phase 5: Verify Results

- All tests must pass
- If any fail, fix and re-execute
- Maximum 3 auto-shielding attempts

### Phase 6: Chaining

Invoke `/documentacion` automatically upon completion.

## Rules

- AAA pattern mandatory
- Naming: `should [behavior] when [scenario]`
- One behavior per test
- ng-mocks or Jasmine spies for mocking
- NEVER test implementation — test behavior

## Source of Truth

This skill implements the rules defined in:
- **`.cloud/policies/testing-policy.md`** — Testing policy (absolute priority)

In case of any doubt or conflict between this skill and the policy, **the policy wins**.
