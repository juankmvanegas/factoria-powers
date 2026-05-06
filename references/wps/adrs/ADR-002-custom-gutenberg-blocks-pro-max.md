# ADR-002: Custom Gutenberg Blocks (Pro Max)

## Status
Accepted

## Date
2024-04-18 (Factoria-Wps v1.0.0)

## Context
The site requires 56+ custom blocks covering hero sections, blog content, job listings, offers, carousels, forms, and layout components. Standard WordPress core blocks do not meet the visual and functional requirements.

## Decision
Develop custom Gutenberg blocks under the `create-block/sc-{name}` namespace with the "Pro Max" quality standard:

### Block File Structure
Each block consists of 7 files:
```
blocks/src/sc-{name}/
├── block.json        # apiVersion 3, attributes, supports
├── index.js          # registerBlockType entry
├── edit.js           # Editor React component
├── save.js           # Static frontend HTML
├── view.js           # Frontend JavaScript
├── editor.scss       # Editor-only styles
└── style.scss        # Frontend + editor styles
```

### Block Categories
- **Hero/Landing**: sc-text, sc-hero-template, sc-cover-right
- **Blog**: sc-blog-list, sc-blog-recomended, sc-card-blog, sc-nuestro-blog
- **Jobs**: sc-jobs, sc-job-filter, sc-job-form, sc-job-detail
- **Offers**: sc-offers, sc-offer
- **Carousel**: sc-carousel, sc-disfrutamos (Swiper-based)
- **Forms**: sc-contact-form, sc-pqrsf, sc-acuerdo-de-pago
- **Layout**: sc-two-columns, sc-footer, sc-menu, sc-pre-footer
- **Content**: sc-faq, sc-video, sc-iframe, sc-content-legals
- **Cards**: sc-color-cards, sc-cards-button, sc-info-grid
- **Commerce**: sc-compras, sc-donde-pagar, sc-pay-options

### "Pro Max" Quality Standard
- useBlockProps() in every edit/save
- InspectorControls for all configurable options
- Responsive design with breakpoints (726px, 1024px)
- Analytics integration (dataLayer.push)
- Accessibility (ARIA, semantic HTML, keyboard nav)

## Consequences
- Each block is independently buildable and testable
- Consistent user experience across all 56+ blocks
- Block-specific version management via Gulp
- functions.php must register each block in the blocks array
- Build scripts needed for each block in blocks/package.json
