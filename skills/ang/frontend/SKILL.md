---
name: ang-frontend
description: "Use when working with frontend in a ang project"
---

---
name: frontend
description: "Auto-skill for Angular components, views, routing, styles"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Frontend (Auto-Activated)

## Activates when

- Components, pages, or views are created or modified
- Working with routing
- ITCSS styles are modified
- Pipes or directives are created
- Working with templates

## What it does

Automatically applies Factoria-Ang rules for the frontend:

### Components
- Inline templates (template literal, no templateUrl)
- Selector in kebab-case
- Injection of abstract Use Cases (never concrete)

### Views
- Container/Module/Router pattern
- Mandatory lazy loading
- Guards where applicable

### CSS
- ITCSS: use the correct layer
- Prefixes: `.o-` objects, `.c-` components, `.u-` utilities
- BEM for modifiers

### Routing
- Lazy loading via `loadChildren`
- Module Federation via `loadRemoteModule` for remotes
- Guards for protected routes

## Rules

- NEVER create components outside `presentation/`
- NEVER consume concrete infrastructure services
- ALWAYS use path aliases (@presentation/*, @application/*)

## Source of Truth

This skill implements the rules defined in:
- **`.cloud/policies/coding-standards.md`** — Code standards (naming, architecture, templates, ITCSS)
- **`.cloud/policies/security-policy.md`** — Security (XSS, MSAL, secrets, CSP)

In case of any doubt or conflict between this skill and the policies, **policies win**.
