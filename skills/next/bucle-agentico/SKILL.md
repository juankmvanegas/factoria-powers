---
name: next-bucle-agentico
description: "Use when an approved PRP exists and complex implementation should proceed phase by phase with just-in-time context mapping"
---

---
name: bucle-agentico
description: "Implementar features complejas fase por fase usando metodologia BLUEPRINT en Next.js 14"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: Bucle Agentico

## Proposito

Implementar funcionalidades complejas que abarcan multiples modulos o capas,
descomponiendolas en fases manejables con la metodologia BLUEPRINT.
Cada fase sigue un ciclo estricto de MAP-GENERATE-EXECUTE-VALIDATE.

## Metodologia BLUEPRINT

Antes de ejecutar, descomponer la feature compleja en N fases ordenadas.
Cada fase debe ser autocontenida y verificable independientemente.

## Flujo por Fase

### 1. MAP — Lectura de Contexto Just-in-Time

- Leer SOLO los archivos relevantes para la fase actual
- Identificar dependencias, contratos existentes, tipos compartidos
- Leer policies y ADRs que apliquen a esta fase
- NO leer todo el proyecto — solo lo necesario para esta fase

### 2. GENERATE — Definir Plan de Cambios

- Listar archivos a crear o modificar
- Definir orden de ejecucion respetando capas (application → infrastructure → presentation)
- Identificar riesgos y dependencias entre archivos
- Estimar impacto en otros modulos

### 3. EXECUTE — Implementacion por Capas

- Seguir estrictamente el orden de /add-feature
- Crear/modificar archivos segun el plan
- Respetar contratos existentes — no romper interfaces publicas
- Server Components por defecto en Next.js 14

### 4. VALIDATE — Verificacion Automatica

- Ejecutar `next build` — debe compilar sin errores
- Ejecutar `next lint` — cero warnings tratados como errores
- Ejecutar tests de la fase: `npx jest --testPathPattern=<patron>`
- Si falla: corregir y re-validar (maximo 3 intentos)

## Despues de TODAS las Fases

1. Invocar `/generate-tests` para cobertura completa
2. Invocar `/documentacion` para actualizar CHANGELOG y arquitectura
3. Ejecutar `next build` final completo
4. Reporte de resumen: fases completadas, archivos tocados, cobertura

## Auto-Shielding

- Maximo 3 intentos de correccion por fase antes de escalar al usuario
- Si una fase depende de otra que fallo: PARAR y reportar
- Si el build final falla: identificar fase causante y corregir
- NUNCA continuar a la siguiente fase si la validacion falla

## Reglas

- Una fase = un commit logico (aunque no se haga commit real)
- Cada fase debe dejar el proyecto en estado compilable
- NO acumular deuda tecnica entre fases
- Documentar decisiones tomadas en cada fase
- Si la complejidad crece: re-descomponer en sub-fases
