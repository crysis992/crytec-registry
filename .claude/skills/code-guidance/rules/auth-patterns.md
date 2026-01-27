---
title: Authentication & Authorization
tags: auth, session, roles, protection, middleware
---

## Authentication & Authorization

### System Overview

| Component | Location |
|-----------|----------|
| Configuration | `src/libs/auth/auth.ts` |
| Client utilities | `src/libs/auth/client.ts` |
| Permissions | `src/libs/auth/permissions.ts` |
| Roles | `admin`, `verified`, `user` |

### Session Access

**Server Components:**

```typescript
import { auth } from '@/libs/auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    redirect('/login');
  }

  const { id, name, email, role } = session.user;
  return <div>Welcome, {name}</div>;
}
```

**Server Actions:**

```typescript
'use server';

import { actionClient } from '@/libs/actions/safe-action';

// userId is automatically injected by safe-action middleware
export const myAction = actionClient
  .schema(schema)
  .action(async ({ ctx: { userId }, parsedInput }) => {
    // userId is guaranteed to exist (authenticated)
    const item = await prisma.item.findFirst({
      where: { id: parsedInput.id, ownerId: userId },
    });
  });
```

**Client Components:**

```typescript
'use client';

import { useSession } from '@/libs/auth/client';

export function UserMenu() {
  const { data: session, isPending } = useSession();

  if (isPending) return <Skeleton />;
  if (!session) return <LoginButton />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar src={session.user.image} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>{session.user.name}</DropdownMenuItem>
        <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Role-Based Access Control

**Role Definitions:**

```typescript
// src/libs/auth/permissions.ts
export const roles = {
  admin: {
    permissions: ['read', 'write', 'delete', 'manage_users'],
  },
  verified: {
    permissions: ['read', 'write', 'delete'],
  },
  user: {
    permissions: ['read', 'write'],
  },
} as const;
```

**Role Checks:**

```typescript
// Server Component
async function AdminPanel() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (session?.user?.role !== 'admin') {
    redirect('/dashboard');
  }

  return <AdminDashboard />;
}

// Server Action
export const adminAction = actionClient
  .schema(schema)
  .action(async ({ ctx: { userId }, parsedInput }) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user?.role !== 'admin') {
      throw new Error('Admin access required');
    }

    // Admin-only logic
  });
```

### Route Protection

**Layout-Level Protection:**

```typescript
// app/(dashboard)/layout.tsx
import { auth } from '@/libs/auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex">
      <Sidebar user={session.user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

### Sign In/Out

```typescript
'use client';

import { signIn, signOut } from '@/libs/auth/client';

// Sign in with Discord
<button onClick={() => signIn('discord')}>
  Sign in with Discord
</button>

// Sign out
<button onClick={() => signOut()}>
  Sign Out
</button>

// Sign in with redirect
<button onClick={() => signIn('discord', {
  callbackUrl: '/dashboard'
})}>
  Sign in
</button>
```
