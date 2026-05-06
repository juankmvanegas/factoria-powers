# ADR-006: Tailwind CSS as the Styling Solution

## Status

Accepted

## Date

2026-04-05

## Context

Next.js projects need a consistent and maintainable styling strategy. The ecosystem offers multiple options: CSS Modules (included by default), CSS-in-JS (styled-components, Emotion), utility-first (Tailwind), and component frameworks (Chakra, MUI). A solution is needed that works well with Server Components, is performant, and reduces naming decision overhead.

## Decision

Adopt **Tailwind CSS 3.x** as the sole styling solution for all Next.js factory projects.

Rules:

- **Utility-first:** Apply utility classes directly in JSX. Do not create separate CSS files.
- **Design tokens:** Define colors, spacing, typography, and breakpoints in `tailwind.config.ts`.
- **@apply:** Use ONLY for highly reused patterns (buttons, inputs) in a limited `globals.css` file.
- **Responsive design:** Mobile-first with `sm:`, `md:`, `lg:`, `xl:`, `2xl:` prefixes.
- **Dark mode:** `class` strategy (not `media`) for programmatic control via toggle.
- **Prohibitions:** Do not use CSS Modules (`.module.css`), no CSS-in-JS (styled-components, Emotion), no inline styles (`style={{}}`).
- **Components:** Extract repeated combinations into React components, not CSS classes.

Base configuration in `tailwind.config.ts`:
```typescript
export default {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: { extend: { /* design tokens */ } },
  plugins: [],
}
```

## Alternatives Considered

- **CSS Modules:** Included by default in Next.js. Good scoping but requires naming each class, generates separate files, and has no integrated design token system. Discarded.
- **styled-components / Emotion:** CSS-in-JS with good DX but problems with Server Components (requires `'use client'` or special configuration). Runtime cost. Discarded.
- **Chakra UI / MUI:** Complete frameworks with pre-built components. Add weight and design opinions that are difficult to customize. Discarded for the general factory (can be used in specific projects).
- **Vanilla CSS with custom variables:** Maximum control but without utilities or a design system. Slow to develop.

## Consequences

### Positive

- Zero CSS-in-JS runtime: Tailwind generates pure CSS at build time, 100% compatible with Server Components.
- Rapid development: no need to invent class names or create style files.
- Visual consistency: design tokens in `tailwind.config.ts` ensure uniformity.
- Automatic purging: only CSS for actually used classes is included.
- Excellent IDE support with the Tailwind CSS IntelliSense extension.

### Negative

- HTML with many classes can be hard to read in complex components.
- Developers must learn Tailwind utility classes (initial learning curve).
- Customizing beyond Tailwind tokens requires advanced configuration.

### Neutral

- PostCSS is configured automatically with Next.js to process Tailwind.
- Animations are handled with Tailwind's `animate-*` classes or plugins like `tailwindcss-animate`.
- Headless component libraries (Radix UI, Headless UI) are compatible and recommended as a complement.
