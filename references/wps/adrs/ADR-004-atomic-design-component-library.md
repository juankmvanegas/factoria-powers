# ADR-004: Atomic Design Component Library

## Status
Accepted

## Date
2024-04-18 (Factoria-Wps v1.0.0)

## Context
Multiple blocks share UI elements (buttons, inputs, cards, image selectors). Duplicating these components leads to inconsistency and maintenance burden.

## Decision
Adopt Atomic Design methodology for reusable React components:

### Atoms (UI Primitives)
| Component | File | Purpose |
|-----------|------|---------|
| Button | `atoms/button/button.tsx` | CTA with variants (primary, secondary, ghost, red, animated) |
| Input | `atoms/input/` | Form text input |
| Select | `atoms/select/` | Dropdown selector |
| Tag | `atoms/tags/tag-front.tsx` | Tag/badge UI |
| Title | `atoms/title/` | Typography heading |
| PhoneInput | `atoms/phone-input/` | Formatted phone input with mask |
| Swiper | `atoms/swiper/swiper-editor.tsx` | Carousel wrapper |
| Pagination | `atoms/pagination/` | Page numbering |
| OffsetContainer | `atoms/offsetContainer/` | Layout spacing wrapper |
| SelectColor | `atoms/SelectColor/selectColor.jsx` | Color picker for editor |

### Molecules (Composite Components)
| Component | File | Purpose |
|-----------|------|---------|
| CardBlog | `molecules/cardBlog/card-blog-front.tsx` | Blog post card |
| CardJob | `molecules/cardJob/` | Job listing card |
| CardOffer | `molecules/cardsOffer/` | Promotional offer card |
| ImageSelector | `molecules/ImageSelector/` | Media library picker |
| SearchLink | `molecules/search-link/searchLink` | Search + link selector |
| ButtonControls | `molecules/ButtonControls/` | Button editor controls |
| CardData | `molecules/cardData/` | Data display card |
| CardInfo | `molecules/cardInfo/` | Information card |
| SelectImage | `molecules/select-Image/selectImage` | Image selection UI |
| SelectVariant | `molecules/select-variant/` | Variant selector |

### Component Location
```
blocks/components/
├── atoms/           # UI primitives
│   └── {component}/ # Each atom in its own directory
└── molecules/       # Composite components
    └── {component}/ # Each molecule in its own directory
```

### Component Styles
Component styles are globally enqueued in `functions.php` via `sc_enqueue_theme_assets()`.

## Consequences
- Shared components ensure visual consistency across blocks
- TypeScript interfaces enforce prop contracts
- Component styles are loaded globally (not per-block)
- New atoms/molecules follow the established directory pattern
- Components are imported by blocks relative to `blocks/components/`
