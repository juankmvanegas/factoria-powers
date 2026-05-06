---
name: next-primer
description: "Use at the start of a session to load the full factory context when the automatic bootstrap did not run or needs to be refreshed"
---

---
name: primer
description: "Cargar contexto del proyecto Next.js 14 al inicio de sesion"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Primer

## Proposito

Cargar el contexto completo del proyecto al inicio de una sesion de trabajo.
Permite al agente entender el estado actual antes de recibir instrucciones.

## Archivos a Leer

### Configuracion del Proyecto
1. `CLAUDE.md` — Configuracion de Factoria para este proyecto
2. `package.json` — Dependencias, scripts, version de Next.js
3. `next.config.js` o `next.config.mjs` — Configuracion de Next.js
4. `tsconfig.json` — Configuracion TypeScript y path aliases
5. `.env.example` — Variables de entorno esperadas (NUNCA .env.local)
6. `middleware.ts` — Middleware activo

### Estructura del Proyecto
7. Listar `src/application/` — Use cases, services, adapters, DTOs
8. Listar `src/infrastructure/` — Adapters concretos, providers, config
9. Listar `src/presentation/app/` — Paginas, layouts, route handlers
10. Listar `src/presentation/components/` — Componentes disponibles
11. Listar `src/libs/` — Utilidades y tipos compartidos

### Politicas y Arquitectura
12. `.cloud/policies/` — Todas las policies vigentes
13. `.cloud/architecture/decisions/` — Todos los ADRs
14. `.cloud/planning/` — PRPs y planes de migracion si existen

### Estado Reciente
15. `CHANGELOG.md` — Ultimos cambios registrados
16. `git log --oneline -10` — Ultimos 10 commits
17. `git status` — Cambios pendientes

## Reporte de Salida

Generar resumen estructurado:

```
=== PRIMER: Contexto del Proyecto ===

Proyecto: <nombre> (Next.js <version>)
TypeScript: <version> | Tailwind: <version> | Auth: <si/no>

Estructura:
  - Use Cases: N definidos
  - Services: N implementados
  - Adapters: N (M abstractos, K concretos)
  - Pages: N rutas
  - Components: N (Server: X, Client: Y)
  - Route Handlers: N endpoints

Policies: N activas | ADRs: N registrados
Test Coverage: XX% (ultimo reporte)

Cambios recientes:
  - <ultimo commit>
  - <penultimo commit>

Estado: <limpio | cambios pendientes>
===
```

## Reglas

- NUNCA leer .env.local ni archivos con secretos
- Si un archivo no existe: reportar como "no encontrado", no fallar
- Si la estructura no sigue Clean Architecture: reportar como warning
- Ejecutar en menos de 30 segundos
- NO modificar ningun archivo — este skill es de solo lectura
