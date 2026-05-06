---
name: next-migration-start
description: "Use when starting a migration of a legacy system — first step before any code analysis"
---

---
name: migration-start
description: "Migracion paso 0 — capturar restricciones antes del discovery en Next.js 14"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Start

## Proposito

Paso 0 de migracion: capturar todas las restricciones, requisitos y contexto
del proyecto legacy antes de iniciar el proceso de discovery.
Este paso es OBLIGATORIO antes de /migration-discovery.

## Flujo

### 1. Entrevista de Restricciones

Preguntar al equipo:

- **Stack legacy**: React CRA? Next.js Pages Router? Gatsby? Vue? Vanilla?
- **Version de React**: 16? 17? 18?
- **State management**: Redux? MobX? Zustand? Context API?
- **CSS approach**: CSS Modules? Styled Components? Sass? Tailwind?
- **Routing**: React Router? Next.js Pages? Custom?
- **Data fetching**: Axios? SWR? React Query? fetch directo?
- **Auth actual**: JWT manual? Auth0? Firebase Auth? NextAuth?
- **Problemas conocidos**: performance, SEO, accesibilidad, deuda tecnica
- **Requisitos no negociables**: URLs que no pueden cambiar, APIs que deben mantenerse
- **Timeline**: fecha limite, fases intermedias

### 2. Analisis de Riesgos

- Identificar incompatibilidades conocidas con Next.js 14 App Router
- Evaluar complejidad de migracion de state management
- Evaluar impacto de Server Components en componentes con mucho estado
- Identificar dependencias npm que no soporten React 18/Next.js 14

### 3. Generar Documento de Restricciones

Crear `.cloud/planning/migration-constraints.md`:

```markdown
# Restricciones de Migracion

## Stack Legacy
- Framework: ...
- React: ...
- State: ...

## Restricciones Inamovibles
- ...

## Riesgos Identificados
| Riesgo | Impacto | Mitigacion |
|--------|---------|------------|
| ...    | ...     | ...        |

## Requisitos de Compatibilidad
- URLs a preservar: ...
- APIs a mantener: ...
- Integraciones externas: ...

## Timeline
- Fase 1: ...
- Fecha limite: ...
```

### 4. Generar ADRs si Aplica

Si la migracion requiere decisiones arquitectonicas:
- Invocar /generate-adr para cada decision relevante
- Ej: "Migrar de Redux a React Context + Server Components"
- Ej: "Adoptar App Router reemplazando Pages Router"

### 5. Confirmacion del Equipo

- Presentar constraints y riesgos al equipo
- ESPERAR confirmacion explicita antes de proceder a /migration-discovery
- Documentar quien aprobo y cuando

## Reglas

- NUNCA saltar este paso — sin constraints documentadas no hay discovery
- NUNCA modificar codigo legacy en este paso — es solo lectura y entrevista
- Todos los riesgos deben tener una mitigacion propuesta
- El documento de constraints es vivo — actualizar si aparecen nuevas restricciones
