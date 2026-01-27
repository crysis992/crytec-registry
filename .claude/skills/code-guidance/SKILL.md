---
name: code-guidance
description: >-
  Project-specific patterns for Next.js 16 + React 19 development.
  Use this skill when: writing components, server actions, data fetching,
  authentication, styling, or internationalization. Also use when:
  choosing Server vs Client components, splitting components, organizing code,
  implementing TanStack Query patterns, infinite scroll, optimistic updates,
  using Prisma, Zustand, Shadcn/ui, or Tailwind.
  Triggers: "component", "server action", "data fetching", "tanstack query",
  "react query", "cache", "mutation", "infinite scroll", "auth", "session",
  "styling", "tailwind", "shadcn", "i18n", "translation", "prisma", "zustand".
---

# Code Guidance

Project-specific patterns for Next.js 16 + React 19 development.

> **Note:** This skill works alongside `next-best-practice` for React performance patterns.
> Use both skills together for comprehensive guidance on writing optimized React code.

## Quick Reference

| Layer | Technology | Location |
|-------|------------|----------|
| Framework | Next.js 16, React 19 | App Router |
| Database | MariaDB + Prisma | `src/libs/prismadb.ts` |
| Auth | Better Auth 1.3 | `src/libs/auth/` |
| Mutations | next-safe-action + Zod | `src/actions/` |
| Client State | TanStack Query v5, Zustand | Custom hooks |
| Styling | Tailwind v4, Shadcn/ui | `src/components/ui/` |
| i18n | next-intl | `messages/*.json` |

## Decision Frameworks

### Where to Fetch Data

| Scenario | Solution |
|----------|----------|
| Initial page load | Server Component + Prisma |
| After user interaction | TanStack Query |
| Real-time or frequently changing | TanStack Query with staleTime |
| Form submission | Server Action via `next-safe-action` |
| Global UI state (modals, etc.) | Zustand |

### Component Type

| Need | Use |
|------|-----|
| Data fetching, no interactivity | Server Component (default) |
| Event handlers, hooks, browser APIs | Client Component (`'use client'`) |
| Mixed: static data + interaction | Split: Server parent + Client child |

### TanStack Query vs Server Actions

| Use TanStack Query | Use Server Actions |
|--------------------|-------------------|
| Reading data after page load | Writing data (create/update/delete) |
| Polling or real-time updates | Form submissions |
| Infinite scroll / pagination | One-time mutations |
| Caching client-side data | Backend-only operations |

## Full Documentation

See [AGENTS.md](AGENTS.md) for complete guidance including:
- Component architecture patterns
- Server action templates
- Data fetching strategies (TanStack Query, Prisma)
- Optimistic updates and cache invalidation
- Infinite scroll implementation
- Authentication patterns
- UI & styling conventions
- Internationalization rules
- Database conventions

## Related Skills

| Skill | Use For |
|-------|---------|
| `next-best-practice` | React 19 performance patterns, useTransition, useOptimistic, memoization |
| `tanstack-query` | Deep dive into TanStack Query v5 advanced patterns |
