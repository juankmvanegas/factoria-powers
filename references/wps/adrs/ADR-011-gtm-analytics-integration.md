# ADR-011: Google Tag Manager Analytics Integration

## Status
Accepted

## Date
2024-04-18 (Factoria-Wps v1.0.0)

## Context
All user interactions with blocks need to be tracked for analytics. The organization uses Google Tag Manager (GTM) as the analytics platform.

## Decision
Integrate analytics via dataLayer.push() in block view.js files:

### Standard Event Pattern
```javascript
// In view.js of each interactive block
dataLayer.push({
  event: 'block_interaction',
  blockType: 'sc-text',
  action: 'click',
  label: button.textContent,
  page: window.location.pathname
});
```

### GTM Script Loading
```php
// Loaded via functions.php
function sc_enqueue_gtm() {
    wp_enqueue_script('sc-gtm', get_template_directory_uri() . '/assets/js/gtm.js');
}
add_action('wp_enqueue_scripts', 'sc_enqueue_gtm');
```

### Event Categories
| Category | Blocks | Events |
|----------|--------|--------|
| CTA Click | sc-text, sc-pre-footer | button_click |
| Navigation | sc-menu, sc-carousel | nav_click, slide_change |
| Form Submit | sc-contact-form, sc-job-form, sc-pqrsf | form_submit |
| Content View | sc-blog-list, sc-jobs | content_view |
| Filter Apply | sc-job-filter, sc-blog-list | filter_apply |

### Additional Integrations
- **Qualtrics SDK** — Survey integration loaded per environment
- **Visor** — Payment/ecommerce events with environment-specific keys

## Consequences
- All block interactions are measurable
- dataLayer is the standard interface for analytics
- View.js files handle event tracking (not edit.js)
- No PII in analytics events (GDPR compliance)
- GTM script loaded globally, events pushed per block
