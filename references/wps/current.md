# Architecture State — WordPress Block Theme

## Current Architecture

Block Theme with Full-Site Editing (FSE) and 56+ custom Gutenberg blocks ("Bloques Pro Max").

## Stack

- WordPress 6.0–6.4.1, PHP 5.7+
- React 18.2+ with @wordpress/scripts 30.22+ build toolchain
- TypeScript for components, JavaScript/JSX for blocks
- SCSS with BEM naming (sc-{block}__{element}--modifier)
- Atomic Design: atoms (Button, Input, Select, Tag, Title) + molecules (CardBlog, CardJob, CardOffer)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    WordPress Core                     │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ theme.json│  │templates/│  │     parts/        │  │
│  │  (FSE)   │  │  index   │  │  header / footer  │  │
│  └──────────┘  │  single  │  └───────────────────┘  │
│                │  404     │                          │
│                │  search  │                          │
│                └──────────┘                          │
├─────────────────────────────────────────────────────┤
│                 Custom Blocks (56+)                  │
│  ┌──────────────────────────────────────────────┐   │
│  │  blocks/src/sc-{name}/                       │   │
│  │  block.json → index.js → edit.js → save.js  │   │
│  │                            ↓         ↓       │   │
│  │                     editor.scss  style.scss   │   │
│  │                            ↓                  │   │
│  │                         view.js (frontend)    │   │
│  └──────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│              Component Library (Atomic)              │
│  ┌────────────────┐  ┌──────────────────────────┐   │
│  │   Atoms         │  │   Molecules              │   │
│  │  Button         │  │  CardBlog                │   │
│  │  Input          │  │  CardJob                 │   │
│  │  Select         │  │  CardOffer               │   │
│  │  Tag            │  │  ImageSelector           │   │
│  │  Title          │  │  ButtonControls          │   │
│  │  Pagination     │  │  SearchLink              │   │
│  │  Swiper         │  │  TextControlsPanel       │   │
│  └────────────────┘  └──────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│              Custom Post Types + REST               │
│  ┌──────────┐  ┌──────────┐  ┌─────────────────┐   │
│  │  Jobs CPT │  │ Offer CPT│  │  REST API       │   │
│  │ +taxonom. │  │ +taxonom.│  │  show_in_rest   │   │
│  └──────────┘  └──────────┘  └─────────────────┘   │
├─────────────────────────────────────────────────────┤
│                  External Services                   │
│  ┌─────────┐  ┌──────────┐  ┌──────┐  ┌─────────┐ │
│  │  GTM    │  │ Qualtrics │  │Swiper│  │anime.js │ │
│  │(analyze)│  │ (surveys) │  │(CDN) │  │ (anim)  │ │
│  └─────────┘  └──────────┘  └──────┘  └─────────┘ │
└─────────────────────────────────────────────────────┘
```

## Block Categories

| Category | Count | Key Blocks |
|----------|-------|-----------|
| Hero/Landing | 3 | sc-text, sc-hero-template, sc-cover-right |
| Blog | 5 | sc-blog-list, sc-blog-recomended, sc-card-blog |
| Jobs | 5 | sc-jobs, sc-job-filter, sc-job-form, sc-job-detail |
| Offers | 2 | sc-offers, sc-offer |
| Carousel | 2 | sc-carousel, sc-disfrutamos |
| Forms | 3 | sc-contact-form, sc-pqrsf, sc-acuerdo-de-pago |
| Layout | 5 | sc-two-columns, sc-footer, sc-menu, sc-pre-footer |
| Content | 6 | sc-faq, sc-faqs, sc-video, sc-iframe, sc-content-legals |
| Showcase | 6 | sc-facilities, sc-beneficios, sc-productos, sc-equipo |
| Cards | 5 | sc-color-cards, sc-cards-button, sc-info-grid |
| Utility | 5 | sc-popup-block, sc-block-custom, sc-error, sc-search-result |
| Commerce | 4 | sc-compras, sc-donde-pagar, sc-pay-options |
| Branding | 5 | sc-nuestro-compromiso, sc-diferencias, sc-nuestra-app |

## ADRs in Effect

- ADR-001: Block Theme with Full-Site Editing
- ADR-002: Custom Gutenberg Blocks (Pro Max)
- ADR-003: WordPress Scripts Build Toolchain
- ADR-004: Atomic Design Component Library
- ADR-005: BEM CSS Naming with sc- Prefix
- ADR-006: theme.json for Global Settings
- ADR-007: Custom Post Types with REST API
- ADR-008: React 18 for Block Development
- ADR-009: Jest and Testing Library for Testing
- ADR-010: Swiper for Carousel Components
- ADR-011: Google Tag Manager Analytics Integration
- ADR-012: Environment-Based Script Loading
- ADR-013: Block Attribute Schema Conventions
- ADR-014: TypeScript for Component Library
- ADR-015: SCSS with CSS Custom Properties
