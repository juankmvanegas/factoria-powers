# ADR-008: Inline Templates

## Status
Accepted

## Context
Decision on using inline template literals vs separate HTML files.

## Decision
Use inline templates (template literal) in all components.

```typescript
@Component({
  selector: 'entity-table',
  template: `
    <table>
      <tr *ngFor="let item of items">
        <td>{{ item.name }}</td>
      </tr>
    </table>
  `
})
```

### Reasons
- Single file per component
- Safer refactoring (TypeScript detects errors)
- Less context switching
- Consistent with the existing enterprise template

## Consequences
- Positive: Colocation, fewer files, IDE support
- Negative: Large components can be difficult to read
