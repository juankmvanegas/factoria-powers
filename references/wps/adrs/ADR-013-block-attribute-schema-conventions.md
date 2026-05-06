# ADR-013: Block Attribute Schema Conventions

## Status
Accepted

## Date
2024-04-18 (Factoria-Wps v1.0.0)

## Context
With 56+ blocks, attribute definitions in block.json files needed standardization to ensure consistency, predictable serialization, and compatibility across blocks.

## Decision
Adopt standardized attribute patterns in block.json:

### Attribute Types
| Type | Use Case | Example |
|------|---------|---------|
| `string` | Text, URLs, enum values | `title`, `buttonLink`, `buttonVariant` |
| `boolean` | Toggles, visibility | `showButton`, `linkInOtherPage` |
| `number` | Counts, sizes | `slidesPerView`, `columnsCount` |
| `array` | Repeatable items | `cards`, `slides`, `items` |
| `object` | Complex nested data | `mediaObject`, `styleConfig` |

### Standard Patterns

#### Simple Text Block
```json
{
  "attributes": {
    "title": { "type": "string", "default": "Default text" },
    "titleFontSize": { "type": "string", "default": "headline-l" }
  }
}
```

#### Button Pattern
```json
{
  "attributes": {
    "buttonLabel": { "type": "string", "default": "Ver más" },
    "buttonLink": { "type": "string", "default": "#" },
    "buttonVariant": { "type": "string", "default": "primary" },
    "showButton": { "type": "boolean", "default": true }
  }
}
```

#### Carousel Pattern
```json
{
  "attributes": {
    "cards": {
      "type": "array",
      "default": [{
        "image": "/path/to/img.png",
        "label": "Category",
        "link": "/category",
        "linkInOtherPage": false
      }]
    },
    "changeDuration": { "type": "string", "default": "3000" }
  }
}
```

#### Color Pattern
```json
{
  "attributes": {
    "cardBorderColor": { "type": "string" },
    "backgroundColor": { "type": "string" },
    "textColor": { "type": "string" }
  }
}
```

### Naming Conventions
- camelCase for all attribute names
- Use descriptive suffixes: `FontSize`, `Color`, `Link`, `Label`, `Count`
- Boolean attributes prefixed with `show`, `is`, `has`, `enable`

## Consequences
- Consistent attribute patterns across all blocks
- Predictable serialization in post_content
- Editor controls follow standard pattern for each attribute type
- Easy to understand attribute schema for new block development
- Default values prevent undefined state in UI
