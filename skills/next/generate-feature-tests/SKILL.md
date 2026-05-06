---
name: next-generate-feature-tests
description: "Use when services or components are implemented and need a complete test suite generated following the project testing policy and AAA pattern"
---

---
name: generate-feature-tests
description: "Generate complete Jest + React Testing Library test suites for Next.js 14 features"
type: agent-skill
used-by: testing-agent
---

# AI Skill: Generate Feature Tests

## Purpose

Used by the `testing-agent` to generate complete test suites for Next.js 14 services, adapters, components, hooks, and Route Handlers.

## Test Patterns

### Service Test Pattern
```typescript
import { NotesService } from './notes.service';
import { NotesAdapter } from '@application/abstractions/infrastructure/api/adapters/notes.adapter';

describe('NotesService', () => {
  let service: NotesService;
  let mockAdapter: jest.Mocked<NotesAdapter>;

  beforeEach(() => {
    mockAdapter = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
    service = new NotesService(mockAdapter);
  });

  describe('getAll', () => {
    it('should return all notes when adapter returns data', async () => {
      // Arrange
      const expected = [{ id: '1', title: 'Test' }];
      mockAdapter.getAll.mockResolvedValue(expected);

      // Act
      const result = await service.getAll();

      // Assert
      expect(result).toEqual(expected);
      expect(mockAdapter.getAll).toHaveBeenCalledTimes(1);
    });

    it('should throw when adapter fails', async () => {
      // Arrange
      mockAdapter.getAll.mockRejectedValue(new Error('Network error'));

      // Act & Assert
      await expect(service.getAll()).rejects.toThrow('Network error');
    });
  });
});
```

### Adapter Test Pattern
```typescript
import { ApiNotesAdapter } from './api-notes.adapter';

describe('ApiNotesAdapter', () => {
  let adapter: ApiNotesAdapter;

  beforeEach(() => {
    adapter = new ApiNotesAdapter();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAll', () => {
    it('should fetch notes from API and return mapped data', async () => {
      // Arrange
      const mockResponse = { ok: true, json: () => Promise.resolve([{ id: '1' }]) };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Act
      const result = await adapter.getAll();

      // Assert
      expect(global.fetch).toHaveBeenCalledWith('/api/notes', expect.any(Object));
      expect(result).toEqual([{ id: '1' }]);
    });

    it('should throw when response is not ok', async () => {
      // Arrange
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false, status: 500 });

      // Act & Assert
      await expect(adapter.getAll()).rejects.toThrow();
    });
  });
});
```

### Component Test Pattern (Client Component)
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotesTable } from './notes-table';

describe('NotesTable', () => {
  const mockNotes = [
    { id: '1', title: 'Note 1', content: 'Content 1' },
    { id: '2', title: 'Note 2', content: 'Content 2' },
  ];

  it('should render all notes when data is provided', () => {
    render(<NotesTable notes={mockNotes} />);
    expect(screen.getByText('Note 1')).toBeInTheDocument();
    expect(screen.getByText('Note 2')).toBeInTheDocument();
  });

  it('should show empty message when no notes', () => {
    render(<NotesTable notes={[]} />);
    expect(screen.getByText(/no hay notas/i)).toBeInTheDocument();
  });
});
```

### Route Handler Test Pattern
```typescript
import { GET, POST } from './route';
import { NextRequest } from 'next/server';

describe('Notes Route Handler', () => {
  describe('GET /api/notes', () => {
    it('should return notes with 200 status', async () => {
      const request = new NextRequest('http://localhost/api/notes');
      const response = await GET(request);
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
    });
  });
});
```

## Rules

- AAA pattern (Arrange-Act-Assert) mandatory in every test
- One behavior per `it()` block
- Naming: `should [expected behavior] when [scenario]`
- Mock ALL external dependencies â€” never use real HTTP calls
- `jest.mock()` for module mocking
- `global.fetch = jest.fn()` for fetch mocking
- `render()` + `screen` queries for components
- `userEvent` for user interactions (not fireEvent)
- Test edge cases: empty data, errors, loading states
- Minimum: service test + adapter test for every feature
