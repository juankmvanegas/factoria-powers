---
name: next-migration-discovery
description: "Use when the migration constraints are approved and legacy code analysis needs to begin"
---

---
name: migration-discovery
description: "Migracion paso 1 — extraer contratos del codigo legacy React/Next.js/SPA"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Discovery

## Proposito

Paso 1 de migracion: analizar el proyecto legacy en modo READ-ONLY para extraer
todos los contratos, patrones y dependencias. El resultado alimenta el plan de migracion.

## Prerequisito

- /migration-start completado y aprobado
- `.cloud/planning/migration-constraints.md` existe

## Flujo

### 1. Escaneo de Paginas y Rutas

- Identificar todas las rutas/paginas del proyecto legacy
- Mapear parametros de ruta (dinamicos, catch-all, opcionales)
- Documentar redirects y rewrites existentes
- Registrar paginas con SSR/SSG/CSR y sus data fetching methods

### 2. Escaneo de Componentes

- Listar todos los componentes y clasificar por tipo:
  - Layout components (headers, sidebars, footers)
  - Page-level components
  - Feature components (formularios, tablas, modales)
  - UI primitives (botones, inputs, cards)
- Identificar cuales usan estado local vs global
- Marcar candidatos a Server Component vs Client Component

### 3. Escaneo de Hooks y State Management

- Listar custom hooks y sus dependencias
- Mapear stores (Redux slices, Zustand stores, Context providers)
- Identificar side effects (useEffect patterns)
- Documentar data flow entre componentes

### 4. Escaneo de API y Data Fetching

- Listar endpoints consumidos (URLs, methods, payloads)
- Identificar patrones de fetch (Axios interceptors, SWR config, React Query keys)
- Documentar autenticacion en requests (headers, cookies, tokens)
- Mapear error handling patterns

### 5. Escaneo de Estilos

- Identificar approach de CSS (modules, styled-components, sass, tailwind)
- Listar variables/tokens de diseno
- Documentar breakpoints y responsive patterns
- Identificar tema global y variantes

### 6. Generar Output

Crear archivos en `.cloud/planning/legacy-discovery/`:

```
legacy-discovery/
  routes.md           → Todas las rutas con metadata
  components.md       → Inventario de componentes clasificado
  hooks-and-state.md  → Hooks, stores, data flow
  api-contracts.md    → Endpoints, payloads, auth
  styles.md           → Approach CSS, tokens, breakpoints
  dependencies.md     → npm packages con compatibilidad Next.js 14
  summary.md          → Resumen ejecutivo con metricas
```

### 7. Revision del Equipo

- Presentar hallazgos al equipo
- Identificar gaps o areas no cubiertas
- ESPERAR confirmacion antes de proceder a /migration-plan

## Reglas

- MODO READ-ONLY — NO modificar ningun archivo del proyecto legacy
- Documentar TODO lo encontrado, incluso codigo muerto o patterns anti-patron
- Si un area no es accesible: documentar como "no analizado" con razon
- Ser exhaustivo — lo no descubierto aqui sera un riesgo en la migracion
