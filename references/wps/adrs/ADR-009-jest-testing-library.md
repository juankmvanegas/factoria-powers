# ADR-009: Jest and Testing Library for Testing

## Status
Accepted

## Date
2024-04-18 (Factoria-Wps v1.0.0)

## Context
Custom blocks and components require automated testing to prevent regressions; especially critical given the 56+ blocks and shared component library.

## Decision
Use Jest 30.2+ with @testing-library/react as the testing framework:

### Testing Stack
| Tool | Purpose |
|------|---------|
| Jest 30.2+ | Test runner and assertion library |
| @testing-library/react | React component rendering |
| @testing-library/user-event | User interaction simulation |
| @testing-library/jest-dom | Extended DOM matchers |
| ts-jest | TypeScript test compilation |
| identity-obj-proxy | CSS/SCSS module mocking |

### Test Scripts
```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "test:ci": "jest --ci --coverage --watchAll=false",
  "test:blocks": "jest --testPathPattern=blocks/",
  "test:blocks:coverage": "jest --coverage --testPathPattern=blocks/"
}
```

### WordPress API Mocking Strategy
All @wordpress/* packages must be mocked in tests:
- `@wordpress/block-editor` — useBlockProps, InspectorControls, RichText
- `@wordpress/components` — PanelBody, TextControl, ToggleControl
- `@wordpress/data` — useSelect, useDispatch
- `@wordpress/i18n` — __(), _e()

### Coverage Requirements
| Target | Minimum |
|--------|---------|
| Atoms | 80% |
| Molecules | 75% |
| Block edit.js | 70% |
| Block save.js | 90% |
| Block view.js | 60% |

## Consequences
- Every block and component has testable units
- WordPress APIs are mocked, enabling fast unit tests
- Snapshot testing ensures save.js output stability
- CI pipeline runs `npm run test:ci` with coverage gates
- TypeScript components tested via ts-jest
