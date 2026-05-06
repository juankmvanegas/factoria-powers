---
name: wps-generate-tests
description: "Generate Jest + @testing-library/react tests for blocks and components with WP API mocks"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Generate Tests

## Purpose

Generate comprehensive test suites using Jest and @testing-library/react for Gutenberg blocks and reusable components. Tests cover rendering, user interaction, attribute changes, and WordPress API mocking. Ensures blocks behave correctly in both editor and frontend contexts while maintaining coverage thresholds defined in the testing policy.

## Execution Flow — 6 Strict Steps

### Step 1 — Identify Test Target

- Determine what to test: a block (`blocks/src/{blockName}/`) or a component (`components/{level}/{ComponentName}/`).
- Read the source file to understand props/attributes, event handlers, and rendered output.
- Read `block.json` for blocks to understand attributes schema.

### Step 2 — Set Up Test File

- Path: `blocks/src/{blockName}/__tests__/{blockName}.test.js` for blocks.
- Path: `components/{level}/{ComponentName}/__tests__/{ComponentName}.test.js` for components.
- Import required utilities:
  ```js
  import { render, screen, fireEvent } from '@testing-library/react';
  import userEvent from '@testing-library/user-event';
  ```

### Step 3 — Create WordPress Mocks

- Mock `@wordpress/block-editor`:
  ```js
  jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: jest.fn(() => ({ className: 'wp-block-test' })),
    InspectorControls: ({ children }) => <div>{children}</div>,
    RichText: ({ value, onChange, tagName: Tag = 'div' }) => (
      <Tag contentEditable onInput={(e) => onChange(e.target.innerHTML)}>{value}</Tag>
    ),
    'RichText.Content': ({ value, tagName: Tag = 'div' }) => <Tag>{value}</Tag>,
  }));
  ```
- Mock `@wordpress/i18n`:
  ```js
  jest.mock('@wordpress/i18n', () => ({
    __: (str) => str,
    _x: (str) => str,
  }));
  ```
- Mock `@wordpress/data` if the block uses `useSelect` or `useDispatch`.
- Mock `@wordpress/api-fetch` if the block makes REST API calls.

### Step 4 — Write Render Tests

- Test default render: component mounts without errors.
- Test that required DOM elements are present (using `screen.getByRole`, `screen.getByText`).
- Test BEM class names are applied correctly.
- Test that all block attributes render their default values.

### Step 5 — Write Interaction Tests

- Test user interactions: clicks, typing, selection changes.
- For blocks: verify `setAttributes` is called with correct values on interaction.
- For components: verify `onChange` / `onClick` callbacks fire with correct arguments.
- Test InspectorControls: verify sidebar controls update attributes.
- Use `userEvent` for realistic interaction simulation (typing, selecting).

### Step 6 — Write Edge Case Tests

- Test with empty/null/undefined props/attributes.
- Test with maximum length strings.
- Test with special characters in text fields.
- Test conditional rendering (elements that appear/disappear based on attributes).
- For blocks: test that save output matches expected markup for validation.

## Rules

- NEVER import React directly in tests — use `@testing-library/react` which handles it.
- ALWAYS mock WordPress packages — tests must run without a WordPress environment.
- NEVER test implementation details (internal state, private methods) — test behavior and output.
- ALWAYS use `screen` queries from @testing-library — never use `container.querySelector` as first choice.
- ALWAYS prefer `userEvent` over `fireEvent` for user interactions.
- NEVER skip the WordPress mock setup — unmocked `@wordpress/*` imports will crash the test runner.
- ALWAYS test both the edit component and the save output for blocks.
- NEVER write tests that depend on execution order — each test must be independent.
- ALWAYS verify the test actually runs and passes before finishing.
