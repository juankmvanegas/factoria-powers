---
name: swf-component-builder
description: "Build BFF components using FabricaDeComponentes/FabricaDeSubcomponentes pattern with Atomic Design"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Component Builder

## Purpose

Build server-driven UI components following the BFF (Backend for Frontend) pattern using `FabricaDeComponentes` and `FabricaDeSubcomponentes`. Creates component views, registers them in the `TipoSubComponente` enum, and follows Atomic Design principles (Atomos → Moleculas → Organismos → Plantillas).

## Execution Flow — 5 Steps

### Step 1: Analyze Component Requirements

1. Read the component specification (JSON structure from BFF)
2. Identify the component type and sub-components
3. Map to Atomic Design level:
   - **Atomos** — Single UI elements (buttons, labels, icons, text fields)
   - **Moleculas** — Composed elements (nav bars, pickers, input groups)
   - **Organismos** — Complex layouts (cards, lists, BFF component containers)
   - **Plantillas** — Full-screen templates with composition slots
4. Check if similar components already exist in CoreUI

### Step 2: Create Component View

Create in `CoreUI/Sources/[AtomicLevel]/`:

1. SwiftUI View struct with proper naming
2. Accept configuration via initializer parameters or model
3. Use `@Environment` for theme/style propagation
4. Support preview with `#Preview` macro
5. Handle accessibility (VoiceOver labels, dynamic type)

```swift
struct ComponenteEjemplo: View {
    let configuracion: ComponenteEjemploModelo
    
    var body: some View {
        // Component implementation using Atomic Design
    }
}

#Preview {
    ComponenteEjemplo(configuracion: .preview)
}
```

### Step 3: Register in FabricaDeSubcomponentes

1. Add new case to `TipoSubComponente` enum
2. Implement the factory switch case to return the new component
3. Map the BFF JSON type string to the enum case
4. Handle unknown/unsupported sub-component types gracefully

```swift
enum TipoSubComponente: String, Codable {
    case existingType
    case nuevoComponente = "nuevo_componente"  // New case
}
```

### Step 4: Create Component Model

Create in `CoreUI/Sources/EntidadesUI/`:

1. Codable model matching the BFF JSON structure
2. Include `.preview` static property for SwiftUI previews
3. Include `.mock` static property for tests
4. Handle optional fields with defaults

### Step 5: Tests and Previews

1. Create snapshot/UI tests if applicable
2. Verify component renders correctly with mock data
3. Verify component handles empty/nil data gracefully
4. Test accessibility labels are correct
5. Add preview configurations for different states (loading, error, empty, populated)

## Auto-Shielding

- **ABORT** if the BFF JSON structure is ambiguous — clarify with user first
- **ABORT** if the component requires a new third-party dependency — propose ADR first
- **WARN** if the component duplicates functionality of an existing CoreUI component

## Rules

1. All components must follow Atomic Design hierarchy
2. Components must be self-contained — no external state dependencies
3. Use CoreUI theme system for colors, fonts, spacing
4. All text must support localization
5. All interactive elements must support VoiceOver
6. Components must handle Dynamic Type (font scaling)
7. FabricaDeComponentes is the single entry point for BFF rendering
8. Never hardcode strings, colors, or dimensions — use theme/constants
9. Every component must have at least one `#Preview`
10. Register all new sub-component types in the TipoSubComponente enum
