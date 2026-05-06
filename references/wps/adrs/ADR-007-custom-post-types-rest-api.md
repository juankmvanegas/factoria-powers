# ADR-007: Custom Post Types with REST API

## Status
Accepted

## Date
2024-04-18 (Factoria-Wps v1.0.0)

## Context
The site requires structured content for job listings and promotional offers that goes beyond standard posts and pages. This content needs custom blocks to display it and REST API access for headless/frontend consumption.

## Decision
Register Custom Post Types (CPTs) and taxonomies with full REST API integration:

### Jobs CPT
```php
register_post_type('jobs', array(
    'public'       => true,
    'show_in_rest' => true,
    'supports'     => array('title', 'editor', 'thumbnail', 'excerpt', 'author', 'revisions'),
    'taxonomies'   => array('categories_job', 'job_modalities'),
    'has_archive'  => true,
    'rewrite'      => array('slug' => 'jobs')
));
```

### Jobs Taxonomies
- `categories_job` — Hierarchical (like categories)
- `job_modalities` — Non-hierarchical (like tags)

### Offer CPT
```php
register_post_type('offer', array(
    'public'              => true,
    'show_in_rest'        => true,
    'supports'            => array('title', 'editor', 'thumbnail', 'excerpt'),
    'exclude_from_search' => true,
    'has_archive'         => true
));
```

### Offer Taxonomy
- `offer_category` — Hierarchical

### REST API Enhancements
- Featured images included in REST responses
- Custom fields available for filtering
- All taxonomies exposed via REST
- Used by blocks: sc-jobs, sc-job-filter, sc-blog-list, sc-offers

## Consequences
- CPT data accessible from custom blocks via @wordpress/data (useSelect)
- REST endpoints auto-generated: `/wp-json/wp/v2/jobs`, `/wp-json/wp/v2/offer`
- Block Editor supports CPTs natively
- Data filtering in blocks uses WP REST API parameters
- Future CPTs must follow the same registration pattern with `show_in_rest: true`
