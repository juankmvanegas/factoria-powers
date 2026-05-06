# ADR-007: Karma + Jasmine for Testing

## Status
Accepted

## Context
We need a testing framework integrated with Angular and compatible with CI/CD.

## Decision
- **Karma** as test runner (integrated with Angular CLI)
- **Jasmine** as assertions framework
- **ng-mocks** for advanced mocking of components and services
- **ChromeHeadless** for CI/CD

### AAA Pattern
```typescript
it('should ...', () => {
  // Arrange
  // Act
  // Assert
});
```

### Naming: `should [behavior] when [scenario]`

## Consequences
- Positive: Native Angular integration, robust mocking, CI-friendly
- Negative: Karma slower than Jest, browser configuration
