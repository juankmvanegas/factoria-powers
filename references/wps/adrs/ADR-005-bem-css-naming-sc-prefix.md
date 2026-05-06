# ADR-005: BEM CSS Naming with sc- Prefix

## Status
Accepted

## Date
2024-04-18 (Factoria-Wps v1.0.0)

## Context
With 56+ custom blocks and shared components, CSS naming collisions and specificity issues were common. A standardized naming convention was needed.

## Decision
Adopt BEM (Block Element Modifier) methodology with the `sc-` namespace prefix:

### Naming Pattern
```
.sc-{block-name}__{element}--{modifier}
```

### Examples
```scss
// Block
.sc-text { }

// Element
.sc-text__header { }
.sc-text__header__title { }

// Modifier
.sc-button--primary { }
.sc-button--secondary { }
.sc-button--ghost { }

// Complete example
.sc-hero-template {
  &__slides {
    &__item { }
    &__item--active { }
  }
  &__navigation {
    &__prev-button { }
    &__next-button { }
  }
  &--dark { background: var(--navyBlue); }
}
```

### SCSS Organization
- `editor.scss` — Editor-only styles (block outline, placeholders)
- `style.scss` — Frontend + editor styles (visual design)
- Component styles — In component directory (`atoms/button/buttonStyles.css`)

### CSS Custom Properties
```css
:root {
  --navyBlue: #001a4a;
  --blue: #00369c;
  --green: #3ec92b;
  --aqua: #65baaf;
  --white: #fff;
}
```

## Consequences
- No CSS collisions between blocks
- Clear ownership of styles per block
- SCSS nesting maps naturally to BEM structure
- Global CSS variables ensure color consistency
- Theme.json palette integrates with `var(--wp--preset--color--{slug})`
