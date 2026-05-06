# ADR-006: ITCSS for CSS Architecture

## Status
Accepted

## Context
We need a scalable CSS architecture that avoids specificity wars and is maintainable.

## Decision
Adopt ITCSS (Inverted Triangle CSS) with 7 layers:

1. **Settings** — Variables (colors, fonts, spacing)
2. **Tools** — Mixins and SCSS functions
3. **Generic** — Resets and normalization
4. **Elements** — Base HTML styles
5. **Objects** — Layout/structure (prefix `.o-`)
6. **Components** — UI components (prefix `.c-`)
7. **Trumps** — Utilities/overrides (prefix `.u-`)

### Conventions
- Partial files: `_` prefix (e.g., `_colors.scss`)
- BEM modifiers: `--` (e.g., `.c-button--primary`)
- Location: `src/presentation/styles/`

## Consequences
- Positive: Controlled specificity, scalable, predictable
- Negative: Learning curve, more SCSS files
