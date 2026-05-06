---
name: next-frontend
description: "Use when working with frontend in a next project"
---

---
name: frontend
description: "Auto-skill for Next.js components, pages, routing, styles"
allowed-tools: Read, Write, Edit, Grep, Glob, Bash
user-invocable: false
---

# Skill: Frontend (Next.js — Auto-Activated)

## Purpose

Automatically enforce Next.js 14 frontend standards when pages, components, layouts, hooks, routing, or styles are created or modified. Ensures Server Components by default, proper App Router conventions, Tailwind utility classes, and Clean Architecture layer separation.

## Activates automatically when

- Pages (`page.tsx`), layouts (`layout.tsx`), or templates (`template.tsx`) are created or modified
- Components in `src/presentation/` are created or modified
- Hooks (`use*.ts`) are created or modified
- Route groups `(public)/` or `(protected)/` are created or modified
- `middleware.ts` is created or modified
- Tailwind classes or `tailwind.config.ts` are modified
- `loading.tsx`, `error.tsx`, or `not-found.tsx` are created

## Does NOT activate when

- Changes only in `src/domain/` entities (pure business logic)
- Changes only in `src/application/` DTOs without UI impact
- Changes only in `src/infrastructure/` adapters
- Changes only in test files
- Changes only in documentation

## Standards Enforced

### Pages and Routing

- **Server Components by default** — only add `'use client'` when strictly necessary (event handlers, useState, useEffect, browser APIs)
- Every route group page MUST have `loading.tsx` for Suspense boundaries
- Every route group MUST have `error.tsx` for error boundaries
- Use route groups for access control: `(public)/` and `(protected)/`
- Dynamic routes use `[param]` syntax, catch-all uses `[...param]`
- Metadata exported from `page.tsx` or `layout.tsx` (never hardcoded `<title>`)
- `generateMetadata()` for dynamic metadata

### Components

- **Server vs Client decision**: if no interactivity needed → Server Component (no directive)
- Client Components: add `'use client'` at the top, only when using hooks or browser APIs
- File naming: `kebab-case.tsx` (e.g., `note-card.tsx`, `sidebar-nav.tsx`)
- Component naming: PascalCase (e.g., `NoteCard`, `SidebarNav`)
- Props: define with `type` (not `interface`) for simple props, `interface` for extensible ones
- Co-locate component-specific types in the same file

### Routing and Middleware

- `middleware.ts` at project root protects all `/(protected)/` routes
- Auth check via `getServerSession()` on the server side
- Redirect unauthenticated users to `/login` or `/auth/signin`
- API routes in `app/api/` use `NextRequest`/`NextResponse`
- Route handlers export named functions: `GET`, `POST`, `PUT`, `DELETE`

### Hooks

- Prefix with `use` (e.g., `useNotes`, `useAuth`)
- Typed return values — never `any`
- Error handling with try/catch or error boundaries
- Location: `src/presentation/hooks/`

### Styles

- **Tailwind CSS only** — no CSS modules, no styled-components, no inline style objects
- Design tokens from `tailwind.config.ts` (colors, spacing, typography)
- Responsive: mobile-first (`sm:`, `md:`, `lg:`, `xl:`)
- Dark mode: use `dark:` variant when applicable
- No magic numbers — use Tailwind spacing scale

## Auto-Corrections

The skill can auto-correct simple issues without asking:
- Add missing `loading.tsx` next to new `page.tsx`
- Add missing `error.tsx` next to new route group
- Convert unnecessary Client Components to Server Components (remove `'use client'` if no hooks/browser APIs used)
- Fix component file naming from PascalCase to kebab-case

For structural decisions (new route groups, layout hierarchy) → always ask the user.

## Rules

- NEVER create components outside `src/presentation/` — this is the only layer for UI
- NEVER consume concrete infrastructure services from components — use abstractions via use cases
- ALWAYS use path aliases (`@/src/...`, `@/app/...`) — never relative paths crossing layers
- NEVER use `dangerouslySetInnerHTML` without DOMPurify sanitization
- ALWAYS export metadata from pages — never hardcode `<head>` content
- NEVER use `any` type in component props or hook returns
- Source of truth: `.cloud/policies/coding-standards.md` and `.cloud/policies/security-policy.md`
