# ADR-006: theme.json for Global Settings

## Status
Accepted

## Date
2024-04-18 (Factoria-Wps v1.0.0)

## Context
WordPress 5.8+ introduced theme.json as the central configuration file for block themes. It replaces add_theme_support() calls and provides a unified settings API.

## Decision
Use theme.json as the single source of truth for global design settings:

### Color Palette
```json
{
  "settings": {
    "color": {
      "palette": [
        { "slug": "primary", "color": "#00369C", "name": "Primary" },
        { "slug": "primary-90", "color": "#001A4A", "name": "Primary 90" },
        { "slug": "secondary", "color": "#3EC92B", "name": "Secondary" },
        { "slug": "secondary-20", "color": "#CEFFC7", "name": "Secondary 20" }
      ]
    }
  }
}
```

### Layout Settings
```json
{
  "settings": {
    "layout": {
      "contentSize": "620px",
      "wideSize": "1000px"
    }
  }
}
```

### Typography and Appearance
```json
{
  "settings": {
    "appearanceTools": true,
    "typography": {
      "fontFamilies": [],
      "fontSizes": []
    }
  }
}
```

### CSS Variable Generation
theme.json automatically generates CSS custom properties:
- `var(--wp--preset--color--primary)` → #00369C
- `var(--wp--preset--color--secondary)` → #3EC92B
- `var(--wp--preset--spacing--20)` → spacing value

## Consequences
- Design tokens centralized in one file
- WordPress auto-generates CSS variables for use in blocks
- Color palette appears in editor UI for all blocks
- Layout widths enforced consistently
- add_theme_support() calls reduced
