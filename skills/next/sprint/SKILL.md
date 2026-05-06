---
name: next-sprint
description: "Use when planning or executing a sprint — multiple features or tasks to be implemented in sequence"
---

---
name: sprint
description: "Tareas rapidas sin overhead de planificacion — bug fixes, ajustes menores en Next.js 14"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Sprint

## Proposito

Ejecutar tareas rapidas que no requieren un PRP completo: bug fixes,
ajustes de estilos, correcciones menores, actualizaciones de dependencias.
Ejecucion directa manteniendo los estandares de calidad.

## Cuando Usar Sprint

- Bug fixes con causa conocida
- Ajustes de estilos Tailwind
- Renombrar componentes o rutas
- Actualizar textos o traducciones
- Corregir tipos TypeScript
- Ajustar configuracion (next.config.js, tailwind.config.ts)
- Actualizar dependencias menores

## Cuando NO Usar Sprint

- Features nuevas → usar /prp + /add-feature
- Cambios que afectan multiples modulos → usar /bucle-agentico
- Migraciones → usar /migration-*
- Cambios arquitectonicos → crear ADR primero

## Flujo de Ejecucion

### 1. Leer Contexto Minimo

- Leer archivos directamente afectados
- Leer tests existentes del modulo afectado
- Verificar si hay policies relevantes

### 2. Implementar Correccion

- Aplicar el fix respetando el orden de capas si aplica
- Si es un bug en presentation: verificar si el origen esta en application o infrastructure
- Corregir la causa raiz, no el sintoma

### 3. Ejecutar Validacion

```bash
next build          # Debe compilar
next lint           # Cero errores
npx jest <archivo>  # Tests del modulo afectado
```

### 4. Actualizar CHANGELOG

Agregar entrada bajo la seccion correspondiente:
- `### Fixed` para bug fixes
- `### Changed` para ajustes
- `### Updated` para dependencias

## Auto-Shielding

- Si el fix rompe el build: revertir y analizar
- Si el fix introduce nuevos warnings de lint: corregirlos
- Si los tests fallan: el fix es incorrecto, re-analizar

## Reglas

- NO crear PRP para sprints
- SI respetar el orden de capas en la correccion
- SI ejecutar security-scan si el cambio toca input/output
- SI ejecutar tests del modulo afectado
- Tiempo maximo esperado: 15 minutos
- Si el sprint se complica: escalar a /prp
