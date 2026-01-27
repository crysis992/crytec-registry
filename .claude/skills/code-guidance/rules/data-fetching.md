---
title: Data Fetching
tags: data, fetching, tanstack-query, prisma, zustand
---

## Data Fetching

### Strategy Overview

| Data Type | Method | Location |
|-----------|--------|----------|
| Initial page data | Server Component + Prisma | Page/Layout |
| Interactive data | TanStack Query | Client Component |
| Mutations | Server Actions | `src/actions/` |
| UI state (modals, etc.) | Zustand | Store hooks |

### Server Component Fetching

```typescript
// app/dashboard/page.tsx
import prisma from '@/libs/prismadb';
import { auth } from '@/libs/auth/auth';
import { headers } from 'next/headers';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect('/login');
  }

  const items = await prisma.item.findMany({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return <ItemList items={items} />;
}
```

### TanStack Query Patterns

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
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
```

**Infinite Query (Pagination):**

```typescript
import { useInfiniteQuery } from '@tanstack/react-query';

export function useGallery(userId: string) {
  return useInfiniteQuery({
    queryKey: ['gallery', userId],
    queryFn: async ({ pageParam }): Promise<GalleryPage> => {
      const params = new URLSearchParams({ userId });
      if (pageParam) params.set('cursor', pageParam);

      const res = await fetch(`/api/gallery?${params}`);
      return res.json();
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60 * 5,
  });
}
```

**Cache Invalidation:**

```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

const { execute } = useAction(createItemAction, {
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['items'] });
  },
});
```

### Zustand for UI State

```typescript
// stores/ui-store.ts
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

### Prisma Query Patterns

**Basic Queries:**

```typescript
// Find many with filters
const items = await prisma.item.findMany({
  where: {
    ownerId: userId,
    isDeleted: false,
  },
  orderBy: { createdAt: 'desc' },
  take: 20,
});

// Find unique with relations
const item = await prisma.item.findUnique({
  where: { id },
  include: {
    metadata: true,
    owner: { select: { name: true, image: true } },
  },
});
```

**Cursor-Based Pagination:**

```typescript
async function getItemsPage(cursor?: string, take = 20) {
  const items = await prisma.item.findMany({
    take: take + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
    orderBy: { createdAt: 'desc' },
  });

  const hasMore = items.length > take;
  const data = hasMore ? items.slice(0, -1) : items;
  const nextCursor = hasMore ? data[data.length - 1].id : null;

  return { items: data, nextCursor };
}
```
