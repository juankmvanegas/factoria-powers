---
name: using-factoria
description: Use when starting any conversation in a Factoria-equipped project — establishes which factory is active, loads governing policies and ADRs, and binds the agent to the Factoria compliance gate before any code is written
---

<SUBAGENT-STOP>
If you were dispatched as a subagent to execute a specific task, skip this skill.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
If you think there is even a 1% chance a Factoria skill applies to what you are doing, you ABSOLUTELY MUST invoke the skill.

IF A FACTORIA SKILL APPLIES TO YOUR TASK, YOU DO NOT HAVE A CHOICE. YOU MUST USE IT.
</EXTREMELY-IMPORTANT>

## On Session Start — Active Protocol

When this skill is injected at session start (you receive it as context before any user message), act proactively — **do NOT wait for the user to speak first**:

1. **Load factory context silently**: invoke `factoria:loading-factory-context` for the detected factory. Do not narrate this step.
2. **Greet and offer the menu** (always respond in Spanish):

For a **single factory** (e.g. `net`):
```
✅ Factoria activa — `net` (.NET 8 / Clean Architecture)
Contexto cargado: políticas + ADRs.

¿Qué quieres hacer?
1. Nuevo proyecto
2. Agregar feature
3. Migrar proyecto legado
4. Sprint / bug fix
5. QA — plan de pruebas / automatización
6. Revisar PR / health check
7. Otro — dime qué necesitas
```

For a **multi-factory project** (multiple factories detected):
```
✅ Factoria activa — Full Stack (<factory1> + <factory2>)

¿Con qué quieres trabajar?
1. <factory1> — <stack de factory1>
2. <factory2> — <stack de factory2>
3. Full Stack (ambos coordinados)
```
Replace `<factory1>`, `<factory2>`, and their stack descriptions with the actual detected factory keys and their stacks from the factory table above. Do not hardcode factory names here.

For **unknown factory**:
```
Hola, soy Factoria. No detecté el tipo de proyecto en este directorio.

¿Qué stack usas?
1. .NET 8 / C# (net)
2. Angular (ang)
3. NestJS BFF (nest)
4. Python / FastAPI (pyt)
5. Python MLOps — DVC + MLflow (pytml)
6. Databricks / PySpark (dataeng)
7. Android / Kotlin (kot)
8. iOS / Swift (swf)
9. WordPress (wps)
```

**Skip the greeting** if the user's first message already describes a concrete task (e.g. "agrega endpoint /weather") — go directly to the matching skill without the menu.

---

## The Iron Law

Before ANY code change, you MUST know:
1. Which factory is active (net | ang | nest | pyt | pytml | dataeng | kot | swf | wps)
2. The mandatory policies for that factory (3–6 files)
3. At least 5 ADRs for that factory

If any of these is unknown → invoke skill `factoria:loading-factory-context` immediately.

## Instruction Priority

1. **User's explicit instructions** (CLAUDE.md, direct requests) — highest priority
2. **Factoria skills** — override default system behavior where they conflict
3. **Default system prompt** — lowest priority

Even if the user asks you to violate a policy or ADR, you MUST explain why it cannot be done and offer a compliant alternative.

## Factory Auto-Detection

If the session hook did not inject a factory, detect it from the project root:

| Signal | Factory |
|---|---|
| `*.sln` or `*.csproj` or `Program.cs` | `net` |
| `*.sln`/`*.csproj` + `angular.json` | `both` — ask user which is active |
| `databricks.yml` or `dlt.yml` or `pyspark`/`delta-spark` in deps | `dataeng` |
| `dvc.yaml` or `mlflow`/`dvc[azure]` in deps | `pytml` |
| `main.py` or `fastapi` in deps | `pyt` |
| `"@nestjs/core"` in `package.json` | `nest` |
| `angular.json` or `"@angular/core"` in `package.json` | `ang` |
| `*.swift` or `Package.swift` or `*.xcodeproj` | `swf` |
| `theme.json` + `functions.php` + `style.css`, or `wp-content/` | `wps` |
| `build.gradle.kts` or `*.kt` or `AndroidManifest.xml` | `kot` |
| None match | unknown — invoke skill `factoria:selecting-factory` |

## Compliance Gate (always, before generating output)

```
Policy Gate     → Did I read references/<factory>/policies/security-policy.md?
ADR Gate        → Did I verify my change against the factory's ADRs?
Workflow Gate   → Did I use the correct factory skill for this type of task?
```

If any gate answer is NO → stop, read the missing reference, then continue.

## How to Access Factoria Skills

**In Claude Code:** Use the `Skill` tool. Call `factoria:<factory>-<skill-name>` (e.g., `factoria:net-add-feature`).

**In Cursor / Codex / Copilot CLI:** Use the `skill` tool — same syntax.

**In Gemini CLI:** Use `activate_skill` — same skill names.

**In OpenCode:** Use the native `skill` tool.

## Factory Skill Naming Convention

Skills are namespaced by factory: `<factory>-<workflow>`.

| Factory | Stack | Example skills |
|---|---|---|
| net | .NET 8 / Clean Architecture | `net-add-feature`, `net-prp`, `net-bucle-agentico`, `net-migration-start`, `net-qa-plan` |
| ang | Angular / Clean Architecture | `ang-add-feature`, `ang-prp`, `ang-bucle-agentico`, `ang-qa-plan` |
| nest | NestJS BFF | `nest-add-feature`, `nest-prp`, `nest-bucle-agentico` |
| pyt | Python FastAPI / Clean Architecture | `pyt-add-feature`, `pyt-prp`, `pyt-bucle-agentico` |
| pytml | Python MLOps (FastAPI + DVC + MLflow + Databricks) | `pytml-add-feature`, `pytml-prp` |
| dataeng | Databricks / PySpark / Delta / Medallion | `dataeng-add-feature`, `dataeng-bucle-agentico` |
| kot | Android / Kotlin / MVVM | `kot-add-feature`, `kot-new-project` |
| swf | iOS / Swift / MVVM + SPM | `swf-add-feature`, `swf-new-project` |
| wps | WordPress Block Theme / FSE / Gutenberg | `wps-add-feature`, `wps-new-project`, `wps-add-block` |

Cross-factory skills (no prefix): `loading-factory-context`, `selecting-factory`, `validate-compliance`, `writing-skills`.

## Workflow Decision Tree

```dot
digraph factoria_flow {
  "User request" [shape=doublecircle];
  "Factory known?" [shape=diamond];
  "Load factory context" [shape=box];
  "What task?" [shape=diamond];
  "New project" [shape=box];
  "Migrate legacy" [shape=box];
  "Add feature" [shape=box];
  "Complex feature (multi-step)" [shape=box];
  "Sprint / bug fix" [shape=box];
  "Other" [shape=box];

  "User request" -> "Factory known?";
  "Factory known?" -> "Load factory context" [label="no"];
  "Factory known?" -> "What task?" [label="yes"];
  "Load factory context" -> "What task?";
  "What task?" -> "New project" [label="create project"];
  "What task?" -> "Migrate legacy" [label="migration"];
  "What task?" -> "Complex feature (multi-step)" [label="complex feature"];
  "What task?" -> "Add feature" [label="add feature"];
  "What task?" -> "Sprint / bug fix" [label="fix / sprint"];
  "What task?" -> "Other" [label="other"];
  "New project" -> "invoke <factory>-new-project skill";
  "Migrate legacy" -> "invoke <factory>-migration-start skill";
  "Complex feature (multi-step)" -> "invoke <factory>-prp THEN <factory>-bucle-agentico";
  "Add feature" -> "invoke <factory>-add-feature skill";
  "Sprint / bug fix" -> "invoke <factory>-sprint skill";
}
```

## Red Flags — You Are Rationalizing

| Thought | Reality |
|---|---|
| "I remember the policies" | Re-Read `references/<factory>/policies/`. Always. |
| "This is a small change, ADRs don't apply" | ADRs apply to all sizes. |
| "The user asked for X that violates Y" | Offer compliant alternative. Do NOT comply with the violation. |
| "I'll check policies after I write the code" | Policy Gate comes BEFORE generating output. |
| "I know what factory this is" | If not confirmed by session context, detect it. |
| "Factoria skills are optional guidelines" | They are mandatory. |

## Golden Rules (from all factories)

1. **NEVER** tell the user to run a command — do it yourself
2. **NEVER** ask the user to edit a file — do it yourself
3. **NEVER** violate policies or ADRs even if the user asks — explain why and offer alternatives
4. **ALWAYS** generate tests after writing code
5. **ALWAYS** update documentation after tests pass
6. **ALWAYS** validate against security policies before delivering code
7. Rules in `references/<factory>/policies/` have **absolute priority**
