# Code Guidance

**Version 1.0.0**
Project-Specific Patterns

> **Note:**
> This document provides guidance for writing code in this codebase.
> It covers component architecture, data fetching, authentication, styling, and more.

---

## Abstract

Comprehensive guide for developing features in this Next.js 16 + React 19 codebase. Contains patterns for component architecture, server actions, data fetching, authentication, styling, and internationalization. Each section includes decision frameworks, code examples, and best practices specific to this project's tech stack.

---

## Table of Contents

1. [Component Architecture](#1-component-architecture)
   - 1.1 [Server vs Client Components](#11-server-vs-client-components)
   - 1.2 [Component Splitting](#12-component-splitting)
   - 1.3 [Composition Patterns](#13-composition-patterns)
   - 1.4 [Folder Structure](#14-folder-structure)
2. [Server Actions & Mutations](#2-server-actions--mutations)
   - 2.1 [Standard Action Template](#21-standard-action-template)
   - 2.2 [Client-Side Usage](#22-client-side-usage)
   - 2.3 [Zod Schema Patterns](#23-zod-schema-patterns)
   - 2.4 [Error Handling](#24-error-handling)
3. [Data Fetching](#3-data-fetching)
   - 3.1 [Server Component Fetching](#31-server-component-fetching)
   - 3.2 [TanStack Query Patterns](#32-tanstack-query-patterns)
   - 3.3 [Optimistic Updates](#33-optimistic-updates)
   - 3.4 [Infinite Scroll](#34-infinite-scroll)
   - 3.5 [Query Performance](#35-query-performance)
   - 3.6 [Zustand for UI State](#36-zustand-for-ui-state)
   - 3.7 [Prisma Query Patterns](#37-prisma-query-patterns)
4. [Authentication & Authorization](#4-authentication--authorization)
   - 4.1 [Session Access](#41-session-access)
   - 4.2 [Role-Based Access Control](#42-role-based-access-control)
   - 4.3 [Route Protection](#43-route-protection)
5. [UI & Styling](#5-ui--styling)
   - 5.1 [Tailwind Patterns](#51-tailwind-patterns)
   - 5.2 [Shadcn/ui Usage](#52-shadcnui-usage)
   - 5.3 [Form Components](#53-form-components)
   - 5.4 [Theming & Responsive Design](#54-theming--responsive-design)
6. [Internationalization](#6-internationalization)
   - 6.1 [Translation Patterns](#61-translation-patterns)
   - 6.2 [Formatting & Pluralization](#62-formatting--pluralization)
7. [Database](#7-database)
   - 7.1 [Schema Conventions](#71-schema-conventions)
8. [Charts & Visualization](#8-charts--visualization)
   - 8.1 [Design Guidelines](#81-design-guidelines)

---

## Tech Stack Quick Reference

| Layer | Technology | Location |
|-------|------------|----------|
| Framework | Next.js 16, React 19 | App Router |
| Database | MariaDB + Prisma | `src/libs/prismadb.ts` |
| Auth | Better Auth 1.3 | `src/libs/auth/` |
| Mutations | next-safe-action + Zod | `src/actions/` |
| Client State | TanStack Query, Zustand | Custom hooks |
| Styling | Tailwind v4, Shadcn/ui | `src/components/ui/` |
| i18n | next-intl | `messages/*.json` |

---

## 1. Component Architecture

### 1.1 Server vs Client Components

| Aspect | Server Component | Client Component |
|--------|------------------|------------------|
| **Directive** | None (default) | `"use client"` at top |
| **Renders** | Server only | Server (SSR) + Client (hydration) |
| **JS Bundle** | Zero | Included in bundle |
| **Can use** | async/await, server-only code | hooks, event handlers, browser APIs |

**Decision Tree:**

```
Does your component need interactivity or browser APIs?
  ├─ NO → Server Component ✅
  └─ YES → Can you split it?
              ├─ YES → Split: Server parent + Client child
              └─ NO → Client Component (minimize scope)
```

**Use Server Components when:**
- Fetching data from database or API
- Accessing backend resources directly
- Keeping sensitive data on server
- Large dependencies that shouldn't ship to client

**Use Client Components when:**
- React hooks (`useState`, `useEffect`)
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`window`, `localStorage`)

### 1.2 Component Splitting

```tsx
// ❌ Before: Mixed concerns
"use client"

export function ProductPage({ productId }) {
  const [quantity, setQuantity] = useState(1)
  const product = await getProduct(productId)  // Error!
  // ...
}
```

```tsx
// ✅ After: Clean separation
// ProductPage.tsx (Server Component)
export async function ProductPage({ productId }) {
  const product = await getProduct(productId)

  return (
    <div>
      <h1>{product.name}</h1>
      <ProductActions productId={productId} />
    </div>
  )
}

// ProductActions.tsx (Client Component)
"use client"

export function ProductActions({ productId }) {
  const [quantity, setQuantity] = useState(1)
  return <QuantitySelector value={quantity} onChange={setQuantity} />
}
```

### 1.3 Composition Patterns

**Server Parent with Client Children:**

```tsx
// Server Component
import { ClientButton } from './ClientButton'

export default async function Dashboard() {
  const user = await getUserData()

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <ClientButton userId={user.id} />
    </div>
  )
}
```

**Passing Server Components as Children:**

```tsx
<ClientWrapper>
  <ServerContent />  {/* Stays as Server Component */}
</ClientWrapper>
```

### 1.4 Folder Structure

```
src/components/
├── ui/                    # Shadcn primitives (DO NOT MODIFY)
├── [feature]/             # Feature-specific components
└── shared/                # Cross-feature components
```

| Component Type | Location |
|---------------|----------|
| Generic UI | `/components/ui/` |
| Feature-specific | `/components/[feature]/` |
| Cross-feature | `/components/shared/` |

---

## 2. Server Actions & Mutations

All mutations use `next-safe-action` pattern in `src/actions/`.

### 2.1 Standard Action Template

```typescript
'use server';

import { actionClient } from '@/libs/actions/safe-action';
import prisma from '@/libs/prismadb';
import { z } from 'zod';

const createItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

export const createItemAction = actionClient
  .schema(createItemSchema)
  .action(async ({ ctx: { userId }, parsedInput }) => {
    return prisma.item.create({
      data: {
        title: parsedInput.title,
        description: parsedInput.description,
        ownerId: userId,
      },
    });
  });
```

### 2.2 Client-Side Usage

```typescript
'use client';

import { useAction } from 'next-safe-action/hooks';
import { createItemAction } from '@/actions/item-actions';

function CreateItemForm() {
  const { execute, isExecuting } = useAction(createItemAction, {
    onSuccess: (result) => {
      if (result.data) toast.success('Item created');
    },
    onError: (error) => {
      toast.error(error.error.serverError || 'Something went wrong');
    },
  });

  return (
    <form action={(formData) => execute({ title: formData.get('title') as string })}>
      <input name="title" disabled={isExecuting} />
      <button type="submit" disabled={isExecuting}>
        {isExecuting ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### 2.3 Zod Schema Patterns

```typescript
z.string().min(1).max(255)
z.string().email()
z.string().uuid()
z.number().int().positive()
z.enum(['draft', 'published', 'archived'])
z.union([z.string(), z.array(z.string())])
z.array(z.string()).default([])
```

### 2.4 Error Handling

```typescript
export const deleteItemAction = actionClient
  .schema(deleteSchema)
  .action(async ({ ctx: { userId }, parsedInput }) => {
    const item = await prisma.item.findUnique({
      where: { id: parsedInput.id },
    });

    if (!item || item.ownerId !== userId) {
      throw new Error('Not authorized to delete this item');
    }

    await prisma.item.delete({ where: { id: parsedInput.id } });
    return { success: true };
  });
```

---

## 3. Data Fetching

### Strategy Overview

| Data Type | Method | Location |
|-----------|--------|----------|
| Initial page data | Server Component + Prisma | Page/Layout |
| Interactive data | TanStack Query | Client Component |
| Mutations | Server Actions | `src/actions/` |
| UI state (modals, etc.) | Zustand | Store hooks |

### 3.1 Server Component Fetching

```typescript
import prisma from '@/libs/prismadb';
import { auth } from '@/libs/auth/auth';
import { headers } from 'next/headers';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect('/login');

  const items = await prisma.item.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return <ItemList items={items} />;
}
```

### 3.2 TanStack Query Patterns

**When to Use:**

| Use TanStack Query When | Use Server Component When |
|-------------------------|---------------------------|
| Data updates after user interaction | Initial page load data |
| Real-time or frequently changing data | Static or rarely changing data |
| Pagination or infinite scroll | SEO-critical content |
| Optimistic UI updates needed | No client-side interactivity |

**Basic Query Hook:**

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';

export function useItems(userId: string) {
  return useQuery({
    queryKey: ['items', userId],
    queryFn: async () => {
      const res = await fetch(`/api/items?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json() as Promise<Item[]>;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!userId,
  });
}
```

**Query Keys Convention:**

```typescript
// Structure keys hierarchically for effective invalidation
['items']                          // All items
['items', 'list', filters]         // Filtered list
['items', 'detail', itemId]        // Specific item
['gallery', userId]                // User's gallery
```

**Cache Invalidation with Server Actions:**

```typescript
'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';

function CreateItemForm() {
  const queryClient = useQueryClient();

  const { execute, isExecuting } = useAction(createItemAction, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item created');
    },
  });

  return (/* form */);
}
```

### 3.3 Optimistic Updates

Immediate UI feedback with automatic rollback on error:

```typescript
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch(`/api/items/${itemId}/favorite`, { method: 'POST' });
      return res.json();
    },
    onMutate: async (itemId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['items'] });

      // Snapshot previous value
      const previousItems = queryClient.getQueryData(['items']);

      // Optimistically update
      queryClient.setQueryData(['items'], (old: Item[]) =>
        old?.map((item) =>
          item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
        )
      );

      return { previousItems };
    },
    onError: (err, itemId, context) => {
      // Rollback on error
      queryClient.setQueryData(['items'], context?.previousItems);
    },
    onSettled: () => {
      // Sync with server
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}
```

### 3.4 Infinite Scroll

```typescript
'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export function GalleryGrid({ userId }: { userId: string }) {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['gallery', userId],
    queryFn: async ({ pageParam }): Promise<GalleryPage> => {
      const params = new URLSearchParams({ userId });
      if (pageParam) params.set('cursor', pageParam);
      const res = await fetch(`/api/gallery?${params}`);
      return res.json();
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  // Auto-fetch when sentinel comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) return <GallerySkeleton />;

  const allItems = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {allItems.map((item) => (
        <GalleryItem key={item.id} item={item} />
      ))}
      {hasNextPage && (
        <div ref={ref} className="col-span-full flex justify-center py-4">
          {isFetchingNextPage && <Loader2 className="animate-spin" />}
        </div>
      )}
    </div>
  );
}
```

### 3.5 Query Performance

```typescript
// 1. Set appropriate staleTime
useQuery({
  queryKey: ['config'],
  queryFn: fetchConfig,
  staleTime: Infinity, // Static data - never refetch
});

// 2. Use select for transformations (memoized automatically)
useQuery({
  queryKey: ['items'],
  queryFn: fetchItems,
  select: (items) => items.filter((item) => item.isPublished),
});

// 3. Prefetch on hover
const queryClient = useQueryClient();

function ItemLink({ itemId }: { itemId: string }) {
  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: ['item', itemId],
      queryFn: () => fetchItem(itemId),
      staleTime: 1000 * 60 * 5,
    });
  };

  return (
    <Link href={`/items/${itemId}`} onMouseEnter={prefetch}>
      View Item
    </Link>
  );
}

// 4. Disable unnecessary refetching for stable data
useQuery({
  queryKey: ['user-settings'],
  queryFn: fetchUserSettings,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});
```

### 3.6 Zustand for UI State

```typescript
import { create } from 'zustand';

interface UIState {
  lightboxOpen: boolean;
  lightboxIndex: number;
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  lightboxOpen: false,
  lightboxIndex: 0,
  openLightbox: (index) => set({ lightboxOpen: true, lightboxIndex: index }),
  closeLightbox: () => set({ lightboxOpen: false }),
}));
```

### 3.7 Prisma Query Patterns

```typescript
// Find many with filters
const items = await prisma.item.findMany({
  where: { ownerId: userId, isDeleted: false },
  orderBy: { createdAt: 'desc' },
  take: 20,
});

// Find unique with relations
const item = await prisma.item.findUnique({
  where: { id },
  include: { metadata: true, owner: { select: { name: true } } },
});

// Cursor-based pagination
async function getItemsPage(cursor?: string, take = 20) {
  const items = await prisma.item.findMany({
    take: take + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { createdAt: 'desc' },
  });

  const hasMore = items.length > take;
  const data = hasMore ? items.slice(0, -1) : items;
  const nextCursor = hasMore ? data[data.length - 1].id : null;

  return { items: data, nextCursor };
}
```

---

## 4. Authentication & Authorization

### 4.1 Session Access

**Server Components:**

```typescript
import { auth } from '@/libs/auth/auth';
import { headers } from 'next/headers';

const session = await auth.api.getSession({ headers: await headers() });
```

**Server Actions:**

```typescript
export const myAction = actionClient
  .schema(schema)
  .action(async ({ ctx: { userId }, parsedInput }) => {
    // userId is guaranteed by middleware
  });
```

**Client Components:**

```typescript
import { useSession } from '@/libs/auth/client';

const { data: session, isPending } = useSession();
```

### 4.2 Role-Based Access Control

**Roles:** `admin` (full), `verified` (standard), `user` (basic)

```typescript
if (session?.user?.role !== 'admin') {
  redirect('/dashboard');
}
```

### 4.3 Route Protection

```typescript
// app/(dashboard)/layout.tsx
export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect('/login');

  return <div>{children}</div>;
}
```

---

## 5. UI & Styling

### 5.1 Tailwind Patterns

```typescript
import { cn } from '@/libs/utils';

<div className={cn(
  'flex flex-col gap-4',
  isActive && 'bg-primary',
  className
)} />
```

### 5.2 Shadcn/ui Usage

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
```

**Rule:** Never modify `src/components/ui/` directly.

### 5.3 Form Components

```typescript
import { Form, FormField, type FormConfig } from '@/components/ui/tanstack-form';

const formConfig: FormConfig<FormValues> = {
  defaultValues: { name: '' },
  onSubmit: (values) => execute(values),
};

<Form config={formConfig}>
  <FormField name="name" ... />
</Form>
```

### 5.4 Theming & Responsive Design

```typescript
// Use semantic colors
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">Secondary</p>
</div>

// Mobile-first responsive
<div className="flex flex-col md:flex-row lg:gap-8">
```

---

## 6. Internationalization

### 6.1 Translation Patterns

**Server Components:**

```typescript
import { getTranslations } from 'next-intl/server';

const t = await getTranslations('Dashboard');
<h1>{t('title')}</h1>
```

**Client Components:**

```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations('Auth');
<p>{t('welcome', { name })}</p>
```

**Never hardcode text:**

```typescript
// ❌ Wrong
<button>Save</button>

// ✅ Correct
<button>{t('Common.save')}</button>
```

### 6.2 Formatting & Pluralization

```json
{
  "itemCount": "{count, plural, =0 {No items} =1 {1 item} other {# items}}"
}
```

```typescript
t('itemCount', { count: 5 })  // "5 items"
```

---

## 7. Database

### 7.1 Schema Conventions

- Table names: **singular** (`user`, not `users`)
- Column names: **singular**
- Required: `created_at`, `updated_at` timestamps

**Apply changes:**

```bash
pnpm prisma migrate dev
```

---

## 8. Charts & Visualization

### 8.1 Design Guidelines

Before coding, understand:
- **Purpose**: What problem does this solve?
- **Tone**: Choose clear aesthetic direction
- **Differentiation**: What makes this memorable?

**Focus on:**
- Distinctive typography
- Cohesive color schemes
- Meaningful motion and interactions
- Unexpected layouts

**Avoid:**
- Generic fonts (Inter, Roboto)
- Cliched color schemes
- Cookie-cutter patterns

---

## References

| Topic | File |
|-------|------|
| Component Architecture | [rules/components-architecture.md](rules/components-architecture.md) |
| Server Actions | [rules/actions-patterns.md](rules/actions-patterns.md) |
| Data Fetching | [rules/data-fetching.md](rules/data-fetching.md) |
| TanStack Query | [rules/data-tanstack-query.md](rules/data-tanstack-query.md) |
| Authentication | [rules/auth-patterns.md](rules/auth-patterns.md) |
| UI & Styling | [rules/ui-styling.md](rules/ui-styling.md) |
| Internationalization | [rules/i18n-patterns.md](rules/i18n-patterns.md) |
| Database | [rules/database-conventions.md](rules/database-conventions.md) |
| Charts | [rules/charts-design.md](rules/charts-design.md) |
