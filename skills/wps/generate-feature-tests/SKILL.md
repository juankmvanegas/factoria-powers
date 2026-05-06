---
name: wps-generate-feature-tests
description: "Generate Jest tests for WordPress blocks and React components"
allowed-tools: Read, Write, Edit, Grep, Glob
user-invocable: true
---

# Skill: Generate Feature Tests

## Purpose
Generate comprehensive Jest + @testing-library/react tests for blocks and components following the testing policy.

## Execution Flow — 5 Strict Steps

### Step 1: Read Testing Policy
1. Read `.cloud/policies/testing-policy.md`
2. Understand coverage requirements per component type
3. Load WordPress API mock patterns

### Step 2: Analyze Target Code
1. Read the block or component source code
2. Identify all props/attributes
3. Identify user interactions
4. Identify conditional rendering paths
5. Identify analytics events (dataLayer.push)

### Step 3: Generate WordPress Mocks
1. Mock `@wordpress/block-editor` (useBlockProps, InspectorControls, RichText)
2. Mock `@wordpress/components` (PanelBody, TextControl, ToggleControl)
3. Mock `@wordpress/data` if useSelect is used
4. Mock SCSS imports with identity-obj-proxy

### Step 4: Write Tests
1. **edit.test.js**: Render, setAttributes, InspectorControls
2. **save.test.js**: Snapshot, HTML structure, CSS classes
3. **view.test.js**: DOM events, dataLayer pushes
4. **component.test.tsx**: Props, variants, events, accessibility

### Step 5: Verify
1. Run tests: `npm test`
2. Check coverage: `npm run test:coverage`
3. Report coverage vs policy minimums

## Rules
- **ALWAYS** follow AAA pattern (Arrange-Act-Assert)
- **ALWAYS** mock WordPress APIs
- **ALWAYS** include snapshot tests for save.js
- **NEVER** use real WordPress API calls in tests
