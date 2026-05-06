---
name: next-health-check
description: "Use when auditing the overall health of the codebase — technical debt, test coverage gaps, architecture drift"
---

---
name: health-check
description: "Diagnostico completo del proyecto Next.js 14 contra estandares de Factoria-Next (score 0-100)"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Health Check

## Proposito

Ejecutar un diagnostico completo del proyecto contra los estandares de
Factoria-Next, generando un score de 0 a 100 con desglose por categoria.

## Categorias de Evaluacion

### 1. Clean Architecture (20 puntos)

- [5] Estructura de carpetas: application/, infrastructure/, presentation/, libs/
- [5] Direccion de dependencias correcta (no imports invertidos)
- [5] Separacion de abstracciones y concretos (ports/adapters)
- [5] DI via React Context providers (no imports directos de concretos)

### 2. TypeScript Strict (15 puntos)

- [5] `strict: true` en tsconfig.json
- [3] `noUncheckedIndexedAccess: true`
- [3] Cero usos de `any` (buscar con grep)
- [2] Cero `@ts-ignore` sin justificacion
- [2] Path aliases configurados (@application/*, etc.)

### 3. Next.js 14 Config (15 puntos)

- [3] App Router (no pages/ directory)
- [3] Server Components por defecto (buscar 'use client' excesivos)
- [3] next.config.js con security headers
- [3] middleware.ts configurado si hay auth
- [3] Metadata API usada en layouts/pages (no <Head>)

### 4. Tailwind Config (5 puntos)

- [2] tailwind.config.ts existe con content paths correctos
- [2] No hay CSS modules, styled-components ni CSS inline
- [1] Tema personalizado si aplica

### 5. Auth Config (5 puntos — si aplica)

- [2] NextAuth.js configurado con route handler
- [2] Middleware protege rutas sensibles
- [1] Session provider en layout raiz

### 6. Test Coverage (15 puntos)

- [5] Jest + RTL configurados
- [5] Tests existen para services, adapters y componentes
- [5] Cobertura >= 80% (ejecutar `npx jest --coverage`)

### 7. Policies Adherence (10 puntos)

- [4] Coding standards cumplidos (naming, imports, patterns)
- [3] Security policy cumplida (input validation, no secretos)
- [3] Testing policy cumplida (AAA pattern, edge cases)

### 8. ADR Compliance (5 puntos)

- [3] ADRs existentes en .cloud/architecture/decisions/
- [2] Codigo alineado con ADRs vigentes

### 9. Documentation (10 puntos)

- [3] CLAUDE.md actualizado
- [3] CHANGELOG.md con entradas recientes
- [2] package.json con scripts correctos (dev, build, lint, test)
- [2] .env.example documentado

## Flujo de Ejecucion

1. Leer configuraciones (tsconfig, next.config, tailwind.config, jest.config)
2. Escanear estructura de directorios
3. Buscar patrones problematicos (any, ts-ignore, imports invertidos)
4. Ejecutar `next build` y `next lint`
5. Ejecutar `npx jest --coverage` si hay tests
6. Revisar policies y ADRs
7. Calcular score y generar reporte

## Output

```
=== HEALTH CHECK: <nombre-proyecto> ===
Score: XX/100

Clean Architecture:    XX/20  [████░░░░]
TypeScript Strict:     XX/15  [████████]
Next.js 14 Config:     XX/15  [██████░░]
Tailwind Config:       XX/5   [████████]
Auth Config:           XX/5   [████░░░░]
Test Coverage:         XX/15  [██░░░░░░]
Policies:              XX/10  [██████░░]
ADR Compliance:        XX/5   [████████]
Documentation:         XX/10  [████████]

Issues Found: N
  CRITICAL: ...
  HIGH: ...
  MEDIUM: ...
  LOW: ...

Recommendations:
  1. ...
  2. ...
===
```

## Reglas

- Ejecutar TODOS los checks — no omitir categorias
- Si un check no aplica (ej: auth en proyecto sin auth): dar puntos completos
- El score es objetivo — no ajustar manualmente
- Guardar reporte en `.cloud/reports/health-check-YYYY-MM-DD.md`
- Comparar con reportes anteriores si existen
