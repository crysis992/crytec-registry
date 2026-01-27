# Data Patterns

Choose the right data fetching pattern for each use case.

## Decision Tree

```
Need to fetch data?
├── From a Server Component?
│   └── Use: Fetch directly (no API needed)
│
├── From a Client Component?
│   ├── Is it a mutation (POST/PUT/DELETE)?
│   │   └── Use: TanStack Query with Route Handler
│   └── Is it a read (GET)?
│       └── Use: TanStack Query with Route Handler OR pass from Server Component
│
├── Need external API access (webhooks, third parties)?
│   └── Use: Route Handler
│
└── Need REST API for mobile app / external clients?
    └── Use: Route Handler
```

## Pattern 1: Server Components (Preferred for Reads)

Fetch data directly in Server Components - no API layer needed.

```tsx
// app/users/page.tsx
async function UsersPage() {
  // Direct database access - no API round-trip
  const users = await db.user.findMany();

  // Or fetch from external API
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

**Benefits**:
- No API to maintain
- No client-server waterfall
- Secrets stay on server
- Direct database access

## Pattern 2: TanStack Query with Route Handlers (Preferred for Mutations)

TanStack Query (React Query) with API endpoints is the recommended way to handle mutations from Client Components.

```tsx
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  const { title } = await request.json();

  const post = await db.post.create({ data: { title } });

  revalidatePath('/posts');
  return NextResponse.json(post, { status: 201 });
}
```

```tsx
// app/api/posts/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.post.delete({ where: { id } });

  revalidatePath('/posts');
  return NextResponse.json({ success: true });
}
```

```tsx
// app/posts/new/page.tsx
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function NewPost() {
  const queryClient = useQueryClient();

  const createPost = useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createPost.mutate(formData.get('title') as string);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" required />
      <button type="submit" disabled={createPost.isPending}>
        {createPost.isPending ? 'Creating...' : 'Create'}
      </button>
      {createPost.isError && <p>Error: {createPost.error.message}</p>}
    </form>
  );
}
```

**Benefits**:
- Powerful caching and invalidation strategies
- Optimistic updates support
- Automatic retries and error handling
- Loading and error states built-in
- Request deduplication
- Works with external APIs

**Considerations**:
- Requires client-side JavaScript
- Needs TanStack Query setup
- API endpoint required (cannot directly access database)

## Pattern 3: Route Handlers (APIs)

Use Route Handlers when you need a REST API.

```tsx
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

// GET is cacheable
export async function GET(request: NextRequest) {
  const posts = await db.post.findMany();
  return NextResponse.json(posts);
}

// POST for mutations
export async function POST(request: NextRequest) {
  const body = await request.json();
  const post = await db.post.create({ data: body });
  return NextResponse.json(post, { status: 201 });
}
```

**When to use**:
- Mutations from Client Components (with TanStack Query)
- External API access (mobile apps, third parties)
- Webhooks from external services
- GET endpoints that need HTTP caching
- OpenAPI/Swagger documentation needed

**When NOT to use**:
- Internal data fetching in Server Components (fetch directly, no API needed)

## Avoiding Data Waterfalls

### Problem: Sequential Fetches

```tsx
// Bad: Sequential waterfalls
async function Dashboard() {
  const user = await getUser();        // Wait...
  const posts = await getPosts();      // Then wait...
  const comments = await getComments(); // Then wait...

  return <div>...</div>;
}
```

### Solution 1: Parallel Fetching with Promise.all

```tsx
// Good: Parallel fetching
async function Dashboard() {
  const [user, posts, comments] = await Promise.all([
    getUser(),
    getPosts(),
    getComments(),
  ]);

  return <div>...</div>;
}
```

### Solution 2: Streaming with Suspense

```tsx
// Good: Show content progressively
import { Suspense } from 'react';

async function Dashboard() {
  return (
    <div>
      <Suspense fallback={<UserSkeleton />}>
        <UserSection />
      </Suspense>
      <Suspense fallback={<PostsSkeleton />}>
        <PostsSection />
      </Suspense>
    </div>
  );
}

async function UserSection() {
  const user = await getUser(); // Fetches independently
  return <div>{user.name}</div>;
}

async function PostsSection() {
  const posts = await getPosts(); // Fetches independently
  return <PostList posts={posts} />;
}
```

### Solution 3: Preload Pattern

```tsx
// lib/data.ts
import { cache } from 'react';

export const getUser = cache(async (id: string) => {
  return db.user.findUnique({ where: { id } });
});

export const preloadUser = (id: string) => {
  void getUser(id); // Fire and forget
};
```

```tsx
// app/user/[id]/page.tsx
import { getUser, preloadUser } from '@/lib/data';

export default async function UserPage({ params }) {
  const { id } = await params;

  // Start fetching early
  preloadUser(id);

  // Do other work...

  // Data likely ready by now
  const user = await getUser(id);
  return <div>{user.name}</div>;
}
```

## Client Component Data Fetching

When Client Components need data:

### Option 1: Pass from Server Component (Preferred)

```tsx
// Server Component
async function Page() {
  const data = await fetchData();
  return <ClientComponent initialData={data} />;
}

// Client Component
'use client';
function ClientComponent({ initialData }) {
  const [data, setData] = useState(initialData);
  // ...
}
```

### Option 2: Fetch on Mount (When Necessary)

```tsx
'use client';
import { useEffect, useState } from 'react';

function ClientComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(setData);
  }, []);

  if (!data) return <Loading />;
  return <div>{data.value}</div>;
}
```

### Option 3: TanStack Query (For Dynamic Client Data)

```tsx
'use client';
import { useQuery } from '@tanstack/react-query';

function ClientComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['data'],
    queryFn: async () => {
      const res = await fetch('/api/data');
      return res.json();
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;
  return <div>{data.value}</div>;
}
```

**Benefits**: Automatic caching, refetching, and state management.

## Quick Reference

| Pattern | Use Case | HTTP Method | Caching |
|---------|----------|-------------|---------|
| Server Component fetch | Internal reads | Any | Full Next.js caching |
| TanStack Query + Route Handler | Mutations, client-side data | Any | TanStack Query cache |
| Route Handler | External APIs, webhooks | Any | GET can be cached |
| Client fetch to API | Simple client-side reads | Any | HTTP cache headers |
