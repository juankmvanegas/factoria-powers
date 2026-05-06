---
name: next-generate-adr
description: "Use when an architectural decision needs to be formally documented — new technology, framework change, new layer dependency, or new coding convention"
---

---
name: generate-adr
description: "Crear nuevo Architecture Decision Record (ADR) para Factoria-Next"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Generate ADR

## Proposito

Crear un nuevo Architecture Decision Record cuando se toma una decision
arquitectonica significativa en el proyecto Next.js 14. El ADR documenta
el contexto, la decision y sus consecuencias para referencia futura.

## Cuando Crear un ADR

- Cambio en la estructura de capas o directorios
- Adopcion de nueva libreria o framework
- Cambio en la estrategia de data fetching
- Cambio en la estrategia de estado (state management)
- Cambio en la estrategia de autenticacion
- Cambio en la estrategia de deployment
- Decision sobre Server Components vs Client Components
- Cambio en la estrategia de testing
- Cualquier decision que afecte multiples modulos

## Flujo

### 1. Determinar Numero de ADR

- Leer `.cloud/architecture/decisions/` para encontrar el ultimo numero
- Asignar siguiente numero secuencial: ADR-NNN

### 2. Entender el Contexto

- Preguntar al usuario por que se necesita esta decision
- Leer archivos relevantes del proyecto para entender el estado actual
- Identificar restricciones y drivers de la decision
- Revisar ADRs existentes para evitar contradicciones

### 3. Generar ADR

Crear archivo en `.cloud/architecture/decisions/ADR-<NNN>-<slug>.md`:

```markdown
# ADR-NNN: Titulo Descriptivo de la Decision

## Status

Accepted

## Date

YYYY-MM-DD

## Context

Descripcion del problema o situacion que requiere una decision.
Incluir restricciones tecnicas, requisitos de negocio y contexto relevante.
Referenciar otros ADRs si estan relacionados.

## Decision

La decision tomada, expresada de forma clara y directa.
"Usaremos X para Y porque Z."
Incluir detalles de implementacion si son relevantes.

## Alternatives Considered

### Alternativa 1: <nombre>
- Ventajas: ...
- Desventajas: ...
- Razon de rechazo: ...

### Alternativa 2: <nombre>
- Ventajas: ...
- Desventajas: ...
- Razon de rechazo: ...

## Consequences

### Positivas
- ...

### Negativas
- ...

### Riesgos
- ...
```

### 4. Actualizar CLAUDE.md

Si el proyecto tiene tabla de ADRs en CLAUDE.md, agregar la nueva entrada.

### 5. Audit Trail

Registrar la creacion del ADR con fecha y autor.

## Reglas

- Los ADRs son INMUTABLES una vez aceptados — para cambiar una decision, crear nuevo ADR que la reemplaza
- El status puede ser: Proposed, Accepted, Deprecated, Superseded
- Si un ADR reemplaza otro: actualizar status del anterior a "Superseded by ADR-NNN"
- Siempre incluir alternativas consideradas — documenta el razonamiento
- El slug del archivo debe ser descriptivo en kebab-case
- NUNCA eliminar un ADR — solo deprecar o reemplazar
