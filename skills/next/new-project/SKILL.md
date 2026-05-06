---
name: next-new-project
description: "Use when initializing a brand-new project from scratch following the factory template"
---

---
name: new-project
description: "Crear proyecto Next.js 14 desde cero o adoptar existente con Clean Architecture"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: New Project

## Proposito

Inicializar un proyecto Next.js 14 con App Router aplicando la arquitectura limpia
de Factoria-Next, ya sea desde cero o adoptando un proyecto existente.

## Entrevista Inicial

Antes de crear nada, preguntar al usuario:

1. **Nombre del proyecto** (kebab-case)
2. **Descripcion breve** (una linea)
3. **Autenticacion necesaria?** (NextAuth.js con providers)
4. **URL base de API externa?** (si consume backend)
5. **Features iniciales** (listado breve)
6. **Monorepo o standalone?**

## Scaffold — Proyecto Nuevo

```bash
npx create-next-app@14 <nombre> \
  --typescript --tailwind --eslint \
  --app --src-dir --import-alias "@/*"
```

## Estructura Clean Architecture

Reorganizar `src/` en capas:

```
src/
  application/
    use-cases/          → Clases abstractas de casos de uso
    adapters/           → Ports abstractos (interfaces)
    services/           → Implementaciones de use cases
    dtos/               → Data Transfer Objects
    events/             → Eventos de dominio
  infrastructure/
    adapters/           → Implementaciones concretas de ports (fetch, storage)
    providers/          → React Context providers para DI
    config/             → Variables de entorno, endpoints, constantes
  presentation/
    app/                → App Router (pages, layouts, route handlers)
    components/         → Componentes React (Server y Client)
    hooks/              → Custom hooks de UI
  libs/
    utils/              → Utilidades compartidas
    types/              → Tipos globales TypeScript
```

## Configuracion

### tsconfig.json
- `strict: true`, `noUncheckedIndexedAccess: true`
- Path aliases: `@application/*`, `@infrastructure/*`, `@presentation/*`, `@libs/*`

### tailwind.config.ts
- Content paths apuntando a `src/presentation/`
- Tema corporativo si aplica

### next.config.js
- Security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- Image optimization config
- Redirects y rewrites si aplica

### jest.config.ts
- Transform con ts-jest o @swc/jest
- Module name mapper con los path aliases
- Coverage threshold: 80%
- Setup files para React Testing Library

### middleware.ts
- Proteccion de rutas si hay auth
- Redirect logic
- Rate limiting headers

## Si Auth es Necesario

- Instalar `next-auth@5` (Auth.js v5 para Next.js 14)
- Crear Route Handler en `src/presentation/app/api/auth/[...nextauth]/route.ts`
- Configurar providers solicitados (Google, GitHub, Credentials)
- Crear middleware de proteccion de rutas
- Crear contexto de sesion en `src/infrastructure/providers/`

## Adopcion de Proyecto Existente

1. Analizar estructura actual con /codebase-analyst
2. Crear carpetas de Clean Architecture
3. Mover archivos progresivamente (NO romper el build)
4. Actualizar imports con path aliases
5. Verificar `next build` despues de cada movimiento

## Reglas

- SIEMPRE usar App Router, NUNCA Pages Router
- TypeScript strict obligatorio
- Tailwind CSS como unica solucion de estilos
- Path aliases desde el inicio
- .env.local para desarrollo, .env.example como template (sin secretos)
- NUNCA commitear .env con valores reales
