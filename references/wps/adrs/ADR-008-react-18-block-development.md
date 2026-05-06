# ADR-008: React 18 for Block Development

## Status
Accepted

## Date
2024-04-18 (Factoria-Wps v1.0.0)

## Context
WordPress Gutenberg blocks are React components. The project needs to use React 18 features for block development, including hooks, concurrent rendering support, and the latest API patterns.

## Decision
Use React 18.2+ for all block edit and save functions:

### State Management
- `useState` for local block state in edit functions
- `useEffect` for syncing state to block attributes via `setAttributes`
- `useSelect` hooks for data store queries (posts, CPTs, taxonomies)
- No Redux or Context API — keep state management simple

### Component Patterns
```javascript
// Edit function pattern
export default function Edit({ attributes, setAttributes }) {
  const [localState, setLocalState] = useState(attributes.title);

  useEffect(() => {
    setAttributes({ title: localState });
  }, [localState]);

  return (
    <div {...useBlockProps()}>
      <InspectorControls>
        {/* Settings */}
      </InspectorControls>
      {/* Content */}
    </div>
  );
}
```

### WordPress React Integration
- `@wordpress/element` wraps React (provides wp.element.createElement)
- `@wordpress/block-editor` provides block-specific hooks (useBlockProps, InspectorControls, RichText)
- `@wordpress/components` provides UI components (PanelBody, TextControl, ToggleControl)

### Third-Party React Libraries
- `react-modal` — Modal dialogs
- `react-tabs` — Tabbed interfaces
- `sweetalert2` — Alert/confirmation dialogs

## Consequences
- Modern React hooks throughout all block code
- No class components — functional components only
- @wordpress/scripts handles React dependency externalization
- React 18 concurrent features available for performance
- All third-party React libraries must be compatible with React 18
