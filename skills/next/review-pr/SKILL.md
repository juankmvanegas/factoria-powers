---
name: next-review-pr
description: "Use when reviewing a pull request — checks code quality, policy compliance, ADR adherence, and test coverage"
---

---
name: review-pr
description: "Revisar cambios de codigo contra todas las policies de Factoria-Next (coding, security, testing)"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Review PR

## Proposito

Revisar cambios de codigo (staged, unstaged o PR) contra todas las policies
vigentes de Factoria-Next: coding-standards, security-policy y testing-policy.
Generar reporte estructurado de conformidad.

## Flujo

### 1. Identificar Cambios

- Si hay PR: `git diff main...HEAD`
- Si no hay PR: `git diff` (staged + unstaged)
- Listar todos los archivos modificados/creados/eliminados
- Clasificar por capa: application, infrastructure, presentation, libs

### 2. Revisar Coding Standards

- **Arquitectura**: Los imports respetan la direccion de dependencias
  - application NO importa de infrastructure ni presentation
  - infrastructure NO importa de presentation
- **TypeScript**: strict mode, no `any`, no `@ts-ignore` sin justificacion
- **Naming**: PascalCase para componentes/clases, camelCase para funciones/variables
- **Next.js 14**: Server Components por defecto, 'use client' justificado
- **Tailwind**: No CSS inline, no CSS modules, no styled-components
- **Path aliases**: Usa @application/*, @infrastructure/*, @presentation/*, @libs/*
- **Imports**: No importaciones circulares, no barrel exports excesivos

### 3. Revisar Security Policy

- **Input validation**: Route Handlers validan input (zod, class-validator)
- **Sanitizacion**: Datos del usuario sanitizados antes de renderizar
- **Auth**: Rutas protegidas verifican sesion en middleware o route handler
- **Headers**: next.config.js tiene security headers configurados
- **Env vars**: No hay secretos hardcodeados, .env.local en .gitignore
- **CSRF**: Formularios con proteccion CSRF si aplica
- **Dependencies**: No hay dependencias con vulnerabilidades conocidas

### 4. Revisar Testing Policy

- **Cobertura**: Archivos nuevos/modificados tienen tests correspondientes
- **Patrones**: Tests siguen AAA, un comportamiento por test
- **Edge cases**: Tests cubren errores, datos vacios, auth states
- **Mocks**: Dependencias externas mockeadas correctamente
- **No flaky**: Tests no dependen de timers, orden o estado externo

### 5. Revisar ADR Compliance

- Cambios arquitectonicos alineados con ADRs vigentes
- Si hay desviacion de un ADR: reportar como violacion
- Si se necesita nuevo ADR: sugerir creacion

### 6. Generar Reporte

```markdown
# Code Review Report

## Resultado: PASS / FAIL

## Archivos Revisados: N

## Coding Standards
- [PASS] Arquitectura de capas
- [FAIL] TypeScript strict — archivo X usa `any` en linea Y
...

## Security
- [PASS] Input validation
- [WARN] Missing CSRF en formulario de /settings
...

## Testing
- [FAIL] Archivo nuevo sin tests: src/application/services/foo.service.ts
...

## ADR Compliance
- [PASS] Alineado con ADR-001, ADR-003
...

## Violaciones (ordenadas por severidad)
1. [CRITICAL] ...
2. [HIGH] ...
3. [MEDIUM] ...
4. [LOW] ...

## Recomendaciones
- ...
```

## Reglas

- Revisar TODOS los archivos cambiados, no solo una muestra
- Las violaciones CRITICAL y HIGH deben resolverse antes de merge
- MEDIUM y LOW son recomendaciones pero no bloquean
- Si no hay tests para codigo nuevo: siempre es FAIL
- Ser especifico: indicar archivo, linea y regla violada
