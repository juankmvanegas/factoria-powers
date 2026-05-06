---
name: next-add-feature
description: "Use when the user wants to add a new feature, endpoint, component, or module to the current project"
---

---
name: add-feature
description: "Implementar nueva feature siguiendo orden estricto de capas en Next.js 14 App Router"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Add Feature

## Proposito

Implementar una nueva funcionalidad en un proyecto Next.js 14 con App Router,
siguiendo el orden estricto de capas de Clean Architecture adaptado a Next.js.

## Orden de Ejecucion — 6 Pasos Estrictos

### Paso 1: Application — Abstracciones y DTOs

- Crear Use Cases como clases abstractas en `src/application/use-cases/`
- Crear Adapters abstractos (ports) en `src/application/adapters/`
- Crear DTOs en `src/application/dtos/`
- Crear Events en `src/application/events/` si aplica
- NUNCA implementar logica concreta en este paso

### Paso 2: Application — Servicios

- Crear Services en `src/application/services/` que implementan los Use Cases
- Inyectar adapters abstractos (NUNCA concretos)
- Implementar logica de negocio pura, sin dependencias de framework
- Los servicios NO conocen Next.js, React ni fetch

### Paso 3: Infrastructure — Implementaciones Concretas

- Crear Fetch adapters en `src/infrastructure/adapters/` que implementan los ports abstractos
- Crear React Context providers en `src/infrastructure/providers/` para DI
- Configurar variables de entorno y endpoints en `src/infrastructure/config/`
- Implementar cache strategies si aplica (unstable_cache, revalidate)

### Paso 4: Presentation — UI y Route Handlers

- Crear Pages en `src/presentation/app/` (page.tsx, layout.tsx) — Server Components por defecto
- Crear Components en `src/presentation/components/` — 'use client' SOLO cuando sea necesario
- Crear Hooks en `src/presentation/hooks/` para logica de UI con estado
- Crear Route Handlers en `src/presentation/app/api/` si se necesitan endpoints
- Estilos con Tailwind CSS exclusivamente

### Paso 5: Tests

- Tests unitarios con Jest para services y adapters
- Tests de componentes con React Testing Library
- Tests de Route Handlers con supertest o fetch mock
- Cobertura minima: 80% de la feature

### Paso 6: Documentacion

- Actualizar CHANGELOG.md con la nueva feature
- Actualizar documentacion de arquitectura si hay cambios estructurales
- Registrar en audit-trail si aplica

## Auto-Shielding

- Si `next build` falla despues de cualquier paso: PARAR y corregir antes de continuar
- Si `next lint` reporta errores: corregir inmediatamente
- Si los tests fallan: corregir antes de avanzar al siguiente paso

## Reglas

- NUNCA consumir servicios concretos en Presentation — siempre a traves de providers/hooks
- SIEMPRE usar clases abstractas para inversion de dependencias
- Server Components por defecto, 'use client' SOLO cuando haya interactividad
- Tailwind CSS para todos los estilos, NUNCA CSS modules ni styled-components
- Path aliases obligatorios: @application/*, @infrastructure/*, @presentation/*, @libs/*
- NUNCA importar desde infrastructure/ en application/
- NUNCA importar desde presentation/ en application/ o infrastructure/
