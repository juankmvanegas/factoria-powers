# Coding Standards

> **Mandatory**: All code must follow these standards. Non-compliance is a blocking issue in code review.

Extracted from corporate coding standards adapted for WordPress block theme development.

## 1. Language and Naming

### PHP

| Element | Convention | Example |
|---------|-----------|---------|
| Functions | snake_case with `sc_` prefix | `sc_enqueue_theme_assets()` |
| WordPress hooks | snake_case | `add_action('init', 'register_jobs_post_type')` |
| Constants | UPPER_SNAKE with `SC_` prefix | `SC_THEME_VERSION` |
| Custom Post Types | lowercase singular | `jobs`, `offer` |
| Taxonomies | snake_case | `categories_job`, `job_modalities` |
| Template functions | snake_case | `wz_multiple_blocks_register_blocks()` |

### JavaScript / TypeScript

| Element | Convention | Example |
|---------|-----------|---------|
| Block names | `sc-{feature}` kebab-case | `sc-text`, `sc-blog-list` |
| Block namespace | `create-block/sc-{name}` | `create-block/sc-text` |
| React components | PascalCase | `CardBlog`, `SelectImage`, `Button` |
| Component files | PascalCase `.tsx` / `.jsx` | `Button.tsx`, `CardBlog.tsx` |
| Props interfaces | PascalCase + `Props` suffix | `ButtonProps`, `CardBlogProps` |
| Functions | camelCase | `handleClick`, `setAttributes`, `formatDate` |
| Variables | camelCase | `titleState`, `buttonLabel`, `cardBorderColor` |
| Block attributes | camelCase | `titleFontSize`, `changeDuration`, `linkInOtherPage` |
| Constants | UPPER_SNAKE or camelCase | `DEFAULT_CARDS`, `MAX_SLIDES` |

### CSS / SCSS

| Element | Convention | Example |
|---------|-----------|---------|
| Block classes | `.sc-{block}` BEM | `.sc-text`, `.sc-carousel` |
| Element classes | `__{element}` | `.sc-text__header` |
| Modifier classes | `--{modifier}` | `.sc-button--primary` |
| CSS variables | `--{prefix}{name}` | `--navyBlue`, `--blue`, `--green` |
| SCSS variables | `${name}` | `$primary-color`, `$spacing-md` |
| File names | kebab-case | `editor.scss`, `style.scss`, `card-blog-styles.scss` |

## 2. Block Architecture Patterns

### Block File Structure (Mandatory)

Every custom block MUST have these files:

```
blocks/src/sc-{name}/
├── block.json        # Block metadata (apiVersion 3)
├── index.js          # Entry point
├── edit.js           # Editor component (React)
├── save.js           # Frontend markup
├── view.js           # Frontend interactivity (optional)
├── editor.scss       # Editor-only styles
└── style.scss        # Frontend + editor styles
```

### block.json Standard

```json
{
  "$schema": "https://schemas.wp.org/trunk/block.json",
  "apiVersion": 3,
  "name": "create-block/sc-{name}",
  "version": "1.0.0",
  "title": "Sc {Name}",
  "category": "widgets",
  "icon": "smiley",
  "description": "Description of the block",
  "supports": {
    "html": false,
    "typography": { "fontSize": true, "lineHeight": true }
  },
  "attributes": {},
  "textdomain": "sc-{name}",
  "editorScript": "file:./index.js",
  "editorStyle": "file:./index.css",
  "style": "file:./style-index.css",
  "viewScript": "file:./view.js"
}
```

### Edit Function Pattern

```javascript
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps();

  return (
    <div {...blockProps}>
      <InspectorControls>
        <PanelBody title="Settings">
          <TextControl
            label="Title"
            value={attributes.title}
            onChange={(value) => setAttributes({ title: value })}
          />
        </PanelBody>
      </InspectorControls>
      {/* Block content */}
    </div>
  );
}
```

### Save Function Pattern

```javascript
import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
  return (
    <div {...useBlockProps.save()}>
      <RichText.Content tagName="h2" value={attributes.title} />
    </div>
  );
}
```

## 3. Component Architecture — Atomic Design

### Atom Pattern (TypeScript)

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'red' | 'hyperlinks' | 'animated';
  size?: 'small' | 'medium';
  label: string;
  href?: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ variant, size = 'medium', label, href, onClick }) => {
  const Tag = href ? 'a' : 'button';
  return (
    <Tag className={`sc-button sc-button--${variant} sc-button--${size}`} href={href} onClick={onClick}>
      {label}
    </Tag>
  );
};
```

### Molecule Pattern

```typescript
interface CardBlogProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  tags: string[];
  link: string;
}

export const CardBlog: React.FC<CardBlogProps> = ({ title, excerpt, imageUrl, date, tags, link }) => {
  return (
    <article className="sc-card-blog">
      <img className="sc-card-blog__image" src={imageUrl} alt={title} />
      <div className="sc-card-blog__content">
        <div className="sc-card-blog__tags">
          {tags.map(tag => <Tag key={tag} label={tag} />)}
        </div>
        <h3 className="sc-card-blog__title">{title}</h3>
        <p className="sc-card-blog__excerpt">{excerpt}</p>
        <span className="sc-card-blog__date">{date}</span>
      </div>
    </article>
  );
};
```

## 4. PHP Patterns

### Block Registration

```php
function wz_multiple_blocks_register_blocks() {
    $blocks = array(
        'sc-text' => '',
        'sc-carousel' => '',
        // Add new blocks here
    );

    foreach ($blocks as $dir => $render_callback) {
        $args = array();
        register_block_type(
            ABSPATH . '/wp-content/themes/sistecredito/blocks/build/' . $dir,
            $args
        );
    }
}
add_action('init', 'wz_multiple_blocks_register_blocks');
```

### Asset Enqueuing

```php
function sc_enqueue_theme_assets() {
    $theme_dir = get_template_directory_uri();
    $version = sc_get_asset_version(__FILE__);
    
    wp_enqueue_style('sc-reset', $theme_dir . '/assets/css/reset.css', array(), $version);
    wp_enqueue_script('sc-menu', $theme_dir . '/assets/js/menu.js', array('jquery'), $version, true);
}
add_action('wp_enqueue_scripts', 'sc_enqueue_theme_assets');
```

### Custom Post Type Registration

```php
function register_jobs_post_type() {
    register_post_type('jobs', array(
        'public'       => true,
        'show_in_rest' => true,
        'supports'     => array('title', 'editor', 'thumbnail', 'excerpt', 'author', 'revisions'),
        'taxonomies'   => array('categories_job', 'job_modalities'),
        'has_archive'  => true,
        'rewrite'      => array('slug' => 'jobs')
    ));
}
add_action('init', 'register_jobs_post_type');
```

## 5. Styling Standards

### BEM Convention

```scss
.sc-hero-template {                    // Block
  &__header {                          // Element
    &__title { font-size: 2rem; }      // Sub-element
    &__subtitle { color: var(--blue); }
  }
  &__slides {                          // Element
    &--active { opacity: 1; }          // Modifier
  }
  &--dark {                            // Block modifier
    background: var(--navyBlue);
  }
}
```

### Theme Color Usage

```scss
// ✅ Correct: Use CSS custom properties
.sc-text__title {
  color: var(--wp--preset--color--primary);
}

// ✅ Also correct: Use root variables
.sc-button--primary {
  background-color: var(--blue);
  color: var(--white);
}

// ❌ Incorrect: Hardcoded colors
.sc-text__title {
  color: #00369c;
}
```

### Responsive Breakpoints

```scss
// Standard breakpoints (match Swiper config)
$bp-tablet: 726px;
$bp-desktop: 1024px;

@media (min-width: $bp-tablet) { /* Tablet */ }
@media (min-width: $bp-desktop) { /* Desktop */ }
```

## 6. Build and Development

### Adding a New Block

1. Create directory: `blocks/src/sc-{name}/`
2. Create all required files (block.json, index.js, edit.js, save.js, editor.scss, style.scss)
3. Add build scripts to `blocks/package.json`:
   ```json
   "start:sc-{name}": "wp-scripts start --webpack-src-dir=src/sc-{name} --output-path=build/sc-{name}",
   "build:sc-{name}": "wp-scripts build --webpack-src-dir=src/sc-{name} --output-path=build/sc-{name}"
   ```
4. Register in `functions.php`: `'sc-{name}' => ''`
5. Build: `cd blocks && yarn build:sc-{name}`

### Version Management

```bash
# Bump block version (updates block.json)
cd blocks && gulp version --block sc-{name} --type patch  # 1.0.0 → 1.0.1
cd blocks && gulp version --block sc-{name} --type minor  # 1.0.0 → 1.1.0
cd blocks && gulp version --block sc-{name} --type major  # 1.0.0 → 2.0.0
```
