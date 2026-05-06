---
name: next-migration-plan
description: "Use when legacy discovery is complete and the migration execution plan needs to be drafted"
---

---
name: migration-plan
description: "Migracion paso 2 — generar plan de migracion modulo por modulo a Next.js 14"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Plan

## Proposito

Paso 2 de migracion: a partir del discovery, generar un plan detallado de migracion
modulo por modulo con orden de dependencias, esfuerzo estimado y criterios de aceptacion.

## Prerequisitos

- /migration-start completado y aprobado
- /migration-discovery completado y revisado
- `.cloud/planning/legacy-discovery/` con todos los archivos

## Flujo

### 1. Definir Modulos

Agrupar componentes, rutas y logica en modulos migrables:
- Cada modulo debe ser deployable independientemente
- Preferir modulos pequenos (1-3 dias de trabajo)
- Respetar limites de dominio de negocio

### 2. Ordenar por Dependencias

- Crear grafo de dependencias entre modulos
- Ordenar topologicamente: primero modulos sin dependencias
- Identificar ciclos y proponer como romperlos
- Los modulos de infraestructura (auth, config, layouts) van primero

### 3. Estimar Esfuerzo

Para cada modulo definir:
- Complejidad: baja / media / alta
- Esfuerzo estimado en horas
- Riesgos especificos del modulo
- Criterios de aceptacion medibles

### 4. Definir Estrategia de Coexistencia

- Como conviven legacy y Next.js 14 durante la migracion
- Reverse proxy para routing gradual (si aplica)
- Shared state entre legacy y migrado (si necesario)
- Feature flags para activar/desactivar modulos migrados

### 5. Generar Plan

Crear `.cloud/planning/migration-plan.md`:

```markdown
# Plan de Migracion a Next.js 14

## Resumen
- Total modulos: N
- Esfuerzo estimado: X horas
- Timeline: Y semanas

## Orden de Migracion

### Modulo 1: <nombre> (Esfuerzo: bajo)
- Componentes: ...
- Rutas: ...
- Dependencias: ninguna
- Criterios de aceptacion:
  - [ ] Ruta /x funciona identica al legacy
  - [ ] Tests pasan con >80% coverage
  - [ ] Performance igual o mejor (LCP, FID)

### Modulo 2: <nombre> (Esfuerzo: medio)
- Dependencias: Modulo 1
...

## Estrategia de Coexistencia
...

## Rollback Plan por Modulo
...

## Metricas de Exito
- Performance: Core Web Vitals iguales o mejores
- Funcionalidad: 100% feature parity
- Tests: >80% coverage en codigo migrado
```

### 6. Aprobacion del Equipo

- Presentar plan completo al equipo
- Revisar estimaciones y orden de modulos
- ESPERAR aprobacion explicita antes de ejecutar
- Documentar quien aprobo y ajustes solicitados

## Reglas

- NUNCA ejecutar migracion sin plan aprobado
- Cada modulo debe tener rollback plan individual
- El plan es un documento vivo — actualizar si cambian prioridades
- Incluir buffer de 20% en estimaciones para imprevistos
- Preferir migracion incremental sobre big-bang
