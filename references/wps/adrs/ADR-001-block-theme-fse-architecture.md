# ADR-001: Block Theme with Full-Site Editing

## Status
Accepted

## Date
2024-04-18 (Factoria-Wps v1.0.0)

## Context
The organization needed a modern WordPress theme architecture that provides full design control through the Block Editor, supports theme.json for global settings, and uses HTML-based templates instead of PHP templates.

## Decision
Adopt WordPress Block Theme (Full-Site Editing) architecture:

### Theme Structure
- `theme.json` — Global settings (colors, fonts, layout, spacing)
- `templates/` — HTML templates (index.html, single.html, 404.html, search.html)
- `parts/` — Template parts (header.html, footer.html)
- `style.css` — Theme header and CSS custom properties
- `functions.php` — Block registration, CPTs, asset enqueuing

### Key Capabilities
- Templates use block markup (`<!-- wp:group -->`) instead of PHP template tags
- Site Editor allows visual editing of headers, footers, and page templates
- theme.json controls colors, fonts, and layouts globally
- Custom blocks integrate seamlessly with FSE pattern

### WordPress Version Compatibility
- Requires at least WordPress 6.0
- Tested up to WordPress 6.4.1
- PHP 5.7+

## Consequences
- All page layouts defined in HTML block markup, not PHP
- Theme customization through Site Editor instead of Customizer
- Consistent design tokens via theme.json
- No PHP template hierarchy — block templates handle all layouts
- Classic widgets replaced by block-based widgets
