---
name: next-codebase-analyst
description: "Use when deep analysis of the existing codebase is needed — understanding structure, patterns, or impact of changes"
---

---
name: codebase-analyst
description: "Analizar codebase Next.js existente — patrones, arquitectura, dependencias, deuda tecnica"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Codebase Analyst

## Proposito

Analizar un codebase Next.js existente para entender su arquitectura actual,
identificar patrones de diseno, evaluar dependencias y detectar deuda tecnica.
Util antes de adoptar Factoria-Next o al iniciar trabajo en un proyecto desconocido.

## Dimensiones de Analisis

### 1. App Router Structure

- Mapear todas las rutas en `app/` o `src/app/`
- Identificar layouts (root, nested, parallel, intercepting)
- Listar route groups `(group)/`
- Detectar Route Handlers (`route.ts`)
- Identificar loading.tsx, error.tsx, not-found.tsx
- Detectar si usa Pages Router (legacy) o App Router

### 2. Component Types

- Clasificar componentes como Server Component o Client Component
- Contar `'use client'` directives
- Identificar componentes que podrian ser Server pero son Client innecesariamente
- Mapear composicion de Server/Client boundaries
- Detectar uso de Suspense y streaming

### 3. Data Fetching Patterns

- Server Components con fetch directo (revalidate, cache)
- Route Handlers como API layer
- Client-side: SWR, React Query, useEffect+fetch
- Server Actions (si usa Next.js 14+)
- Identificar waterfalls de data fetching
- Evaluar estrategia de caching (unstable_cache, revalidatePath, revalidateTag)

### 4. State Management

- React Context providers
- Redux / Redux Toolkit
- Zustand / Jotai / Recoil
- URL state (searchParams)
- Form state (react-hook-form, formik)
- Evaluar si el state management es apropiado para App Router

### 5. CSS Approach

- Tailwind CSS
- CSS Modules
- Styled Components / Emotion
- Sass/SCSS
- CSS-in-JS runtime (problematico con Server Components)
- Global styles
- Design tokens / theme

### 6. Testing Coverage

- Framework de testing (Jest, Vitest, Playwright, Cypress)
- Cantidad de archivos de test vs archivos de codigo
- Ratio de cobertura estimado
- Patrones de testing usados
- Mocking strategies

### 7. Dependency Health

- Ejecutar `npm audit` para vulnerabilidades
- Identificar dependencias desactualizadas (`npm outdated`)
- Detectar dependencias no usadas (buscar imports)
- Evaluar peso del bundle (dependencias pesadas)
- Verificar compatibilidad con Next.js 14 y React 18

### 8. Code Quality Indicators

- TypeScript strictness (tsconfig.json)
- ESLint configuracion y reglas custom
- Prettier o formato consistente
- Patrones anti-patron detectados:
  - Props drilling excesivo
  - useEffect para data fetching en Server Components posibles
  - Barrel exports masivos
  - Archivos de mas de 300 lineas
  - Componentes con mas de 10 props

### 9. Infrastructure & Config

- next.config.js: security headers, redirects, rewrites, images
- middleware.ts: que rutas intercepta
- .env files: variables definidas
- CI/CD: scripts en package.json, config files
- Docker: si existe Dockerfile

## Output

Generar reporte completo en `.cloud/reports/codebase-analysis-YYYY-MM-DD.md`:

```markdown
# Codebase Analysis Report

## Project Overview
- Framework: Next.js <version>
- React: <version>
- TypeScript: <version> (strict: yes/no)

## Architecture Summary
- Router: App Router / Pages Router / Mixed
- Components: N total (X Server, Y Client)
- Routes: N pages, M API routes
- State: <approach>
- CSS: <approach>

## Strengths
- ...

## Technical Debt
| Area | Severity | Description | Recommendation |
|------|----------|-------------|----------------|
| ...  | HIGH     | ...         | ...            |

## Dependency Report
- Total: N packages
- Vulnerabilities: X critical, Y high, Z moderate
- Outdated: N packages

## Factoria-Next Readiness
- Score: X/10 (que tan cerca esta de los estandares de Factoria-Next)
- Changes needed: ...

## Recommendations (prioritized)
1. ...
2. ...
```

## Reglas

- MODO READ-ONLY — NO modificar ningun archivo del proyecto
- Ser objetivo en el analisis — reportar hechos, no opiniones
- Priorizar hallazgos por impacto: CRITICAL > HIGH > MEDIUM > LOW
- Si el proyecto es muy grande: analizar por modulos/features principales
- Incluir metricas concretas (numeros, porcentajes) donde sea posible
