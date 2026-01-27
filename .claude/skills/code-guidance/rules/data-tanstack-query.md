---
title: TanStack Query Patterns
tags: tanstack-query, react-query, data, caching, mutations, infinite-scroll
---

## TanStack Query Patterns

Advanced patterns for server state management with TanStack Query v5 in this Next.js codebase.

### When to Use

| Use TanStack Query When | Use Server Component When |
|-------------------------|---------------------------|
| Data needs to update after user interaction | Initial page load data |
| Real-time or frequently changing data | Static or rarely changing data |
| Pagination or infinite scroll | SEO-critical content |
| Optimistic UI updates | No client-side interactivity needed |

### Query Hooks Pattern

Create typed hooks for reusable queries:

```typescript
'use client';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

// Simple query hook
export function useItem(itemId: string) {
  return useQuery({
    queryKey: ['item', itemId],
    queryFn: async () => {
      const res = await fetch(`/api/items/${itemId}`);
      if (!res.ok) throw new Error('Failed to fetch item');
      return res.json() as Promise<Item>;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!itemId,
  });
}

// Infinite query hook
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
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 1000 * 60 * 5,
  });
}
```

### Query Keys Convention

Structure keys hierarchically for effective invalidation:

```typescript
// Query key patterns in this project
['items']                          // All items
['items', 'list', filters]         // Filtered list
['items', 'detail', itemId]        // Specific item
['gallery', userId]                // User's gallery
['gallery', userId, 'favorites']   // User's favorites
```

### Cache Invalidation with Server Actions

Integrate with next-safe-action:

```typescript
'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { createItemAction } from '@/actions/item-actions';

function CreateItemForm() {
  const queryClient = useQueryClient();

  const { execute, isExecuting } = useAction(createItemAction, {
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Item created');
    },
    onError: (error) => {
      toast.error(error.error.serverError || 'Failed to create item');
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

### Optimistic Updates

Immediate UI feedback with rollback on error:

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

### Infinite Scroll Implementation

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
    queryFn: async ({ pageParam }) => {
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

### Performance Optimization

```typescript
// 1. Set appropriate staleTime
useQuery({
  queryKey: ['config'],
  queryFn: fetchConfig,
  staleTime: Infinity, // Static data
});

useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  staleTime: 1000 * 30, // 30 seconds for frequently changing
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

### Dependent Queries

```typescript
// First query
const { data: user } = useQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
});

// Second query depends on first
const { data: projects } = useQuery({
  queryKey: ['projects', user?.teamId],
  queryFn: () => fetchProjects(user!.teamId),
  enabled: !!user?.teamId, // Only run when teamId available
});
```

### Parallel Queries

```typescript
// Multiple independent queries
function Dashboard() {
  const stats = useQuery({ queryKey: ['stats'], queryFn: fetchStats });
  const recent = useQuery({ queryKey: ['recent'], queryFn: fetchRecent });
  const alerts = useQuery({ queryKey: ['alerts'], queryFn: fetchAlerts });

  const isLoading = stats.isLoading || recent.isLoading || alerts.isLoading;

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div>
      <StatsPanel data={stats.data} />
      <RecentList items={recent.data} />
      <AlertsBanner alerts={alerts.data} />
    </div>
  );
}
```

### Query Invalidation Strategies

```typescript
const queryClient = useQueryClient();

// Invalidate by prefix (recommended)
queryClient.invalidateQueries({ queryKey: ['items'] });

// Invalidate exact match
queryClient.invalidateQueries({ queryKey: ['item', itemId], exact: true });

// Invalidate with predicate
queryClient.invalidateQueries({
  predicate: (query) =>
    query.queryKey[0] === 'items' && query.queryKey[1] !== 'archived',
});

// After delete - remove from cache
queryClient.removeQueries({ queryKey: ['item', itemId] });
queryClient.invalidateQueries({ queryKey: ['items', 'list'] });
```

### Error Handling

```typescript
// Per-query error handling
const { error, isError } = useQuery({
  queryKey: ['items'],
  queryFn: fetchItems,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

if (isError) {
  return <ErrorMessage message={error.message} />;
}

// With React Suspense
import { useSuspenseQuery } from '@tanstack/react-query';

function Items() {
  const { data } = useSuspenseQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });

  // No loading state needed - handled by Suspense boundary
  return <ItemList items={data} />;
}

// Parent component
<Suspense fallback={<ItemsSkeleton />}>
  <Items />
</Suspense>
```
