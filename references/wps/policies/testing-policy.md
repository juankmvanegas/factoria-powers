# Testing Policy

> **Mandatory**: Every block, component, and PHP function must have associated tests before delivery. Tests validate correctness, prevent regressions, and ensure accessibility.

Extracted from corporate testing standards adapted for WordPress block theme development.

## 1. Testing Pyramid

```
          ╱ E2E (Cypress)            ╲
         ╱  5% — critical user flows   ╲
        ╱───────────────────────────────╲
       ╱ Integration Tests               ╲
      ╱  20% — block + WP API interaction  ╲
     ╱─────────────────────────────────────╲
    ╱ Unit Tests (Jest + RTL)               ╲
   ╱  75% — blocks, components, functions    ╲
  ╱───────────────────────────────────────────╲
```

## 2. Testing Frameworks

| Framework | Purpose | Scope |
|-----------|---------|-------|
| Jest | Unit test runner | JS/TS |
| @testing-library/react | React component testing | Blocks + Components |
| @testing-library/user-event | User interaction simulation | Editor interactions |
| @testing-library/jest-dom | Extended DOM matchers | Assertions |
| ts-jest | TypeScript testing | TSX components |
| identity-obj-proxy | CSS module mocking | SCSS imports |

## 3. Test Directory Structure

```
blocks/src/sc-{block-name}/
├── __tests__/
│   ├── edit.test.js         # Editor component tests
│   ├── save.test.js         # Save output snapshot tests
│   └── view.test.js         # Frontend script tests (JSDOM)
blocks/components/
├── atoms/{component}/
│   └── __tests__/
│       └── {component}.test.tsx
└── molecules/{component}/
    └── __tests__/
        └── {component}.test.tsx
```

## 4. Test Structure — AAA Pattern (Mandatory)

All tests MUST follow the Arrange-Act-Assert pattern:

```javascript
describe('sc-text Edit', () => {
  it('renders block title with default attributes', () => {
    // Arrange
    const attributes = { title: 'Hello', buttonLabel: 'Click' };
    const setAttributes = jest.fn();

    // Act
    render(<Edit attributes={attributes} setAttributes={setAttributes} />);

    // Assert
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## 5. Test Naming Convention

Format: `{action}_when_{condition}_should_{expected}`

```javascript
// ✅ Correct
it('renders_title_when_attribute_provided_should_display_text', () => {});
it('calls_setAttributes_when_user_types_should_update_title', () => {});
it('renders_empty_when_no_cards_should_show_placeholder', () => {});

// ❌ Incorrect
it('works', () => {});
it('test 1', () => {});
it('should work correctly', () => {});
```

## 6. Block Edit Component Testing

### Required Tests
- Renders with default attributes
- Renders with custom attributes
- Calls setAttributes on user interaction
- Renders InspectorControls
- Handles empty/null attributes gracefully

### Pattern

```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Edit from '../edit';

const mockBlockProps = {
  className: 'wp-block-create-block-sc-text'
};

jest.mock('@wordpress/block-editor', () => ({
  useBlockProps: () => mockBlockProps,
  InspectorControls: ({ children }) => <div data-testid="inspector">{children}</div>,
  RichText: ({ value, onChange, tagName: Tag = 'div' }) => (
    <Tag contentEditable onInput={(e) => onChange(e.target.textContent)}>
      {value}
    </Tag>
  )
}));

describe('sc-text Edit', () => {
  const defaultAttributes = {
    title: 'Default text',
    buttonLabel: 'Ver más',
    buttonLink: '#',
    buttonVariant: 'primary'
  };

  it('renders with default attributes', () => {
    render(<Edit attributes={defaultAttributes} setAttributes={jest.fn()} />);
    expect(screen.getByText('Default text')).toBeInTheDocument();
  });
});
```

## 7. Block Save Component Testing

### Required Tests
- Snapshot test for static HTML output
- Renders correct HTML structure
- Includes proper CSS classes (BEM)
- Escapes attribute values in output

### Pattern

```javascript
import { render } from '@testing-library/react';
import save from '../save';

jest.mock('@wordpress/block-editor', () => ({
  useBlockProps: {
    save: () => ({ className: 'wp-block-create-block-sc-text' })
  },
  RichText: {
    Content: ({ value, tagName: Tag = 'div' }) => <Tag>{value}</Tag>
  }
}));

describe('sc-text save', () => {
  it('renders correct HTML structure', () => {
    const attributes = { title: 'Hello', buttonLabel: 'Click', buttonLink: '/page' };
    const { container } = render(save({ attributes }));
    expect(container.querySelector('.wp-block-create-block-sc-text')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const attributes = { title: 'Snapshot', buttonLabel: 'Go' };
    const { container } = render(save({ attributes }));
    expect(container).toMatchSnapshot();
  });
});
```

## 8. Atom/Molecule Component Testing

### Required Tests
- Renders with required props
- Renders with all prop variants
- Handles onClick/onChange events
- Applies correct CSS classes
- Accessibility: has proper ARIA attributes

### Pattern

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button atom', () => {
  it('renders primary variant', () => {
    render(<Button variant="primary" label="Click me" />);
    const button = screen.getByText('Click me');
    expect(button).toHaveClass('sc-button--primary');
  });

  it('renders as anchor when href provided', () => {
    render(<Button variant="secondary" label="Link" href="/page" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/page');
  });

  it('calls onClick handler', async () => {
    const onClick = jest.fn();
    render(<Button variant="ghost" label="Click" onClick={onClick} />);
    await userEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

## 9. View Script Testing (JSDOM)

### Required Tests
- DOM manipulation works correctly
- Event listeners are attached
- dataLayer events are pushed correctly
- Intersection Observer callbacks fire

### Pattern

```javascript
describe('sc-text view', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="wp-block-create-block-sc-text">
        <button class="sc-text__button">Click</button>
      </div>
    `;
    window.dataLayer = [];
  });

  it('pushes analytics event on button click', () => {
    require('../view');
    const button = document.querySelector('.sc-text__button');
    button.click();
    expect(window.dataLayer).toContainEqual(
      expect.objectContaining({ event: 'block_interaction' })
    );
  });
});
```

## 10. Mocking WordPress APIs

### Common Mocks

```javascript
// Mock @wordpress/block-editor
jest.mock('@wordpress/block-editor', () => ({
  useBlockProps: () => ({ className: 'mock-block-props' }),
  InspectorControls: ({ children }) => <div>{children}</div>,
  RichText: ({ value }) => <span>{value}</span>,
  MediaUpload: ({ render }) => render({ open: jest.fn() }),
  ColorPalette: () => <div data-testid="color-palette" />
}));

// Mock @wordpress/components
jest.mock('@wordpress/components', () => ({
  PanelBody: ({ children, title }) => <div data-title={title}>{children}</div>,
  TextControl: ({ value, onChange }) => (
    <input value={value} onChange={(e) => onChange(e.target.value)} />
  ),
  ToggleControl: ({ checked, onChange }) => (
    <input type="checkbox" checked={checked} onChange={() => onChange(!checked)} />
  ),
  SelectControl: ({ value, onChange, options }) => (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}));

// Mock @wordpress/data
jest.mock('@wordpress/data', () => ({
  useSelect: jest.fn(),
  useDispatch: jest.fn(() => ({}))
}));
```

## 11. Test Doubles

| Type | When to Use | Example |
|------|------------|---------|
| Mock | WordPress API modules | `jest.mock('@wordpress/block-editor')` |
| Spy | Track function calls | `jest.spyOn(window, 'fetch')` |
| Stub | Replace API responses | `jest.fn().mockResolvedValue(data)` |
| Fixture | Block attributes | `const attrs = { title: 'Test' }` |
| Snapshot | Save output stability | `expect(container).toMatchSnapshot()` |

## 12. Coverage Requirements

| Target | Minimum | Recommended |
|--------|---------|-------------|
| Atoms (components) | 80% | 90% |
| Molecules (components) | 75% | 85% |
| Block edit.js | 70% | 80% |
| Block save.js | 90% | 95% |
| Block view.js | 60% | 75% |
| Overall block coverage | 70% | 80% |

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# Block tests only
npm run test:blocks

# CI mode (no interaction)
npm run test:ci
```
