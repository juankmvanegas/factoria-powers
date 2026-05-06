---
name: next-prp
description: "Use when starting any non-trivial feature — before writing any code, to produce a Product Requirements Proposal with measurable success criteria"
---

---
name: prp
description: "Planificar feature con PRP (Product Requirements Proposal) + DRP antes de implementar"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: true
---

# Skill: PRP — Product Requirements Proposal

## Proposito

Crear un documento de planificacion completo antes de implementar una feature.
El PRP sirve como contrato entre el usuario y el agente: nada se implementa
sin aprobacion explicita del PRP.

## Flujo

### 1. Recopilar Requisitos

- Escuchar descripcion del usuario
- Hacer preguntas clarificadoras si hay ambiguedad
- Identificar dependencias con features existentes
- Determinar impacto en la arquitectura actual

### 2. Generar PRP

Crear archivo en `.cloud/planning/PRP-<NNN>-<slug>.md` con estas secciones:

```markdown
# PRP-NNN: Titulo de la Feature

## Objetivo
Que se quiere lograr (1-2 oraciones).

## Por Que
Justificacion de negocio o tecnica.

## Que (Criterios de Exito)
- [ ] Criterio medible 1
- [ ] Criterio medible 2

## Blueprint (Fases de Implementacion)
### Fase 1: <nombre>
- Archivos a crear/modificar
- Capa: Application | Infrastructure | Presentation
### Fase 2: <nombre>
...

## Impacto en Arquitectura
- Nuevos use cases: ...
- Nuevos adapters: ...
- Nuevas rutas: ...
- Cambios en providers: ...

## Cambios en API
- Nuevos Route Handlers: ...
- Modificaciones a endpoints existentes: ...
- Contratos de request/response: ...

## Plan de Testing
- Tests unitarios: ...
- Tests de componentes: ...
- Tests de integracion: ...
- Cobertura esperada: XX%

## Checklist de Seguridad
- [ ] Input validation en Route Handlers
- [ ] Sanitizacion de datos del usuario
- [ ] Autenticacion requerida en rutas protegidas
- [ ] CSRF protection si hay formularios
- [ ] Rate limiting si es endpoint publico

## Plan de Rollout
- Feature flags necesarios: si/no
- Rollback plan: ...
- Dependencias de deploy: ...
```

### 3. Generar DRP (Disaster Recovery Plan)

Si la feature tiene impacto critico, generar DRP adjunto con:
- Escenarios de fallo
- Procedimientos de rollback
- Puntos de verificacion

### 4. Aprobacion

- Presentar PRP al usuario
- ESPERAR aprobacion explicita antes de proceder
- Si hay cambios: actualizar PRP y re-presentar
- Solo despues de "aprobado" invocar /add-feature o /bucle-agentico

## Reglas

- NUNCA implementar sin PRP aprobado (excepto /sprint para tareas menores)
- El PRP es un documento vivo — actualizar si cambian requisitos
- Numerar PRPs secuencialmente (PRP-001, PRP-002, ...)
- Cada PRP debe ser trazable a commits y cambios
- Si la feature requiere nuevo ADR: incluirlo en el Blueprint
