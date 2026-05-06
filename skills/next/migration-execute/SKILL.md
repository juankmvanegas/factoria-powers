---
name: next-migration-execute
description: "Use when the migration plan is approved and actual code migration should begin phase by phase"
---

---
name: migration-execute
description: "Migracion paso 3 — ejecutar UN modulo a la vez migrando a Next.js 14"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Migration Execute

## Proposito

Paso 3 de migracion: ejecutar la migracion de UN modulo a la vez, siguiendo
el plan aprobado. Cada modulo pasa por un ciclo completo de validacion.

## Prerequisitos

- /migration-plan completado y aprobado
- `.cloud/planning/migration-plan.md` existe con modulos definidos
- Modulo anterior (si hay) completado y verificado

## Flujo por Modulo

### 1. Rollback Plan

Antes de tocar codigo:
- Documentar estado actual del proyecto (commit hash)
- Definir criterios de rollback (que falla activa el rollback)
- Verificar que `next build` pasa antes de iniciar
- Crear branch de migracion: `migration/<modulo-nombre>`

### 2. Migrar el Modulo

Siguiendo el orden de capas de /add-feature:

1. **Application**: Migrar DTOs, interfaces, services del modulo
2. **Infrastructure**: Migrar adapters, reemplazar Axios por fetch nativo si aplica
3. **Presentation**: Migrar componentes a Server/Client Components
   - Convertir pages a App Router (page.tsx, layout.tsx)
   - Migrar data fetching a Server Components o Route Handlers
   - Reemplazar CSS legacy por Tailwind
   - Convertir React Router links a Next.js Link
4. **State**: Migrar state management del modulo
   - Redux slices → React Context + Server Components donde sea posible
   - Client-side state solo donde sea necesario

### 3. Verify Logic

- Comparar comportamiento migrado vs legacy
- Verificar edge cases documentados en discovery
- Validar que los contratos de API se mantienen

### 4. Validate Contracts

- Verificar que las rutas migradas responden igual
- Comparar responses de Route Handlers vs endpoints legacy
- Validar tipos TypeScript contra contratos documentados

### 5. Generate Tests

- Invocar /generate-tests para todo el modulo migrado
- Tests unitarios para services y adapters
- Tests de componentes con RTL
- Tests de Route Handlers
- Cobertura minima: 80%

### 6. Smoke Tests

```bash
next build            # Compilacion exitosa
next lint             # Cero errores
npx jest              # Todos los tests pasan
```

Verificar manualmente (o con Playwright si esta configurado):
- Navegacion entre paginas migradas
- Formularios funcionan correctamente
- Auth flow no se rompe
- Responsive design correcto

### 7. Documentacion

- Invocar /documentacion para actualizar CHANGELOG
- Registrar en audit-trail: modulo migrado, fecha, autor

### 8. Audit Trail

Agregar entrada en `.cloud/planning/migration-audit.md`:
```markdown
## Modulo: <nombre>
- Fecha: YYYY-MM-DD
- Archivos migrados: N
- Tests: N (XX% coverage)
- Issues encontrados: ...
- Resolucion: ...
- Aprobado por: ...
```

### 9. Aprobacion

- Presentar modulo migrado al equipo
- Demo de funcionalidad
- ESPERAR aprobacion antes de migrar siguiente modulo

## Reglas

- UN modulo a la vez — NUNCA migrar multiples modulos en paralelo
- Si el build falla: PARAR y corregir antes de continuar
- Si hay regresion funcional: activar rollback plan
- El equipo aprueba CADA modulo antes de continuar al siguiente
- Mantener el legacy funcional hasta que el modulo migrado este aprobado
