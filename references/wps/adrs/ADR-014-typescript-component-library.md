# ADR-014: TypeScript for Component Library

## Status
Accepted

## Date
2024-04-18 (Factoria-Wps v1.0.0)

## Context
The Atomic Design component library (atoms and molecules) is shared across 56+ blocks. Type safety is critical to prevent prop mismatches and ensure component contracts are enforced.

## Decision
Use TypeScript for all component library files (atoms and molecules):

### Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node"
  }
}
```

### Babel Transpilation
```json
// Via @babel/preset-typescript
{
  "presets": ["@babel/preset-react", "@babel/preset-typescript"]
}
```

### Type Patterns

#### Atom Props Interface
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'red' | 'hyperlinks' | 'animated';
  size?: 'small' | 'medium';
  label: string;
  href?: string;
  onClick?: () => void;
}
```

#### Molecule Props Interface
```typescript
interface CardBlogProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  tags: string[];
  link: string;
  category?: string;
}
```

### File Extensions
| File Type | Extension |
|-----------|-----------|
| Atom components | `.tsx` |
| Molecule components | `.tsx` |
| Block edit/save | `.js` (JavaScript) |
| Block view | `.js` (JavaScript) |
| Tests | `.test.tsx` / `.test.js` |

### Testing TypeScript Components
Uses `ts-jest` for TypeScript test compilation without separate build step.

## Consequences
- Type safety for shared component props
- Compile-time error detection for component misuse
- IDE autocomplete for component props in block files
- Block edit/save files remain JavaScript (WordPress convention)
- Components are the only TypeScript files in the project
