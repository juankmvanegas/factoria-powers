# ADR-003: WordPress Scripts Build Toolchain

## Status
Accepted

## Date
2024-04-18 (Factoria-Wps v1.0.0)

## Context
Custom blocks require a build step to compile JSX, TypeScript, and SCSS into browser-compatible JS and CSS. The project needs a standardized toolchain that integrates well with WordPress.

## Decision
Use `@wordpress/scripts` v30.22+ as the primary build toolchain:

### Build Commands
- **Full build**: `cd blocks && yarn build`
- **Watch mode**: `cd blocks && yarn start`
- **Individual block**: `yarn build:sc-{name}` / `yarn start:sc-{name}`
- **New block scaffold**: `npx @wordpress/create-block sc-{name} --no-plugin`
- **Version bump**: `gulp version --block sc-{name} --type patch|minor|major`

### Build Configuration
- Webpack-based with wp-scripts wrapper
- Entry: `src/sc-{name}/index.js`
- Output: `build/sc-{name}/` (index.js, index.css, style-index.css)
- Babel: Transpiles JSX and TypeScript
- SCSS: Compiled to CSS modules
- Each block has dedicated start/build scripts

### Custom Build Utilities
- `blocks/scripts/build-block.js` — Custom block builder script
- `blocks/gulpfile.js` — Gulp task for version bumping block.json

### Output Structure
```
blocks/build/sc-{name}/
├── index.js           # Editor script (compiled React)
├── index.css          # Editor styles (compiled SCSS)
├── style-index.css    # Frontend styles
├── view.js            # Frontend script (if defined)
└── block.json         # Copied metadata
```

## Consequences
- All blocks follow the same build pipeline
- Hot reload during development with `yarn start`
- WordPress dependencies are automatically externalized
- 56+ individual build scripts in package.json
- Build artifacts in `blocks/build/` are gitignored (rebuildable)
