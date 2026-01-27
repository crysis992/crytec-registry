---
title: Server Actions & Mutations
tags: actions, mutations, next-safe-action, zod, forms
---

## Server Actions & Mutations

All mutations use `next-safe-action` pattern in `src/actions/`.

### Standard Action Template

```typescript
'use server';

import { actionClient } from '@/libs/actions/safe-action';
import prisma from '@/libs/prismadb';
import { z } from 'zod';
import 'server-only';

// 1. Define schema
const createItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

// 2. Export action
export const createItemAction = actionClient
  .schema(createItemSchema)
  .action(async ({ ctx: { userId }, parsedInput }) => {
    const { title, description, tags } = parsedInput;

    return prisma.item.create({
      data: {
        title,
        description,
        tags: tags.join(','),
        ownerId: userId,
      },
    });
  });
```

### Client-Side Usage

```typescript
'use client';

import { useAction } from 'next-safe-action/hooks';
import { createItemAction } from '@/actions/item-actions';
import { toast } from 'sonner';

function CreateItemForm() {
  const { execute, isExecuting } = useAction(createItemAction, {
    onSuccess: (result) => {
      if (result.data) {
        toast.success('Item created');
      }
    },
    onError: (error) => {
      toast.error(error.error.serverError || 'Something went wrong');
    },
  });

  const handleSubmit = (formData: FormData) => {
    execute({ title: formData.get('title') as string });
  };

  return (
    <form action={handleSubmit}>
      <input name="title" disabled={isExecuting} />
      <button type="submit" disabled={isExecuting}>
        {isExecuting ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### Zod Schema Patterns

```typescript
// Basic types
z.string().min(1).max(255)
z.string().email()
z.string().uuid()
z.number().int().positive()
z.enum(['draft', 'published', 'archived'])

// Single or multiple IDs
z.union([z.string(), z.array(z.string())])

// Optional array with default
z.array(z.string()).default([])

// Nested objects
z.object({
  id: z.string(),
  metadata: z.object({
    artist: z.string().optional(),
  }).optional(),
})
```

### Error Handling

```typescript
export const deleteItemAction = actionClient
  .schema(deleteSchema)
  .action(async ({ ctx: { userId }, parsedInput }) => {
    const item = await prisma.item.findUnique({
      where: { id: parsedInput.id },
    });

    // Authorization check
    if (!item || item.ownerId !== userId) {
      throw new Error('Not authorized to delete this item');
    }

    await prisma.item.delete({
      where: { id: parsedInput.id },
    });

    return { success: true, id: parsedInput.id };
  });
```

### Batch Operations

```typescript
export const deleteMultipleAction = actionClient
  .schema(z.object({
    ids: z.array(z.string()).min(1),
  }))
  .action(async ({ ctx: { userId }, parsedInput }) => {
    const { ids } = parsedInput;

    // Verify ownership for all items
    const items = await prisma.item.findMany({
      where: { id: { in: ids }, ownerId: userId },
    });

    if (items.length !== ids.length) {
      throw new Error('Not authorized for some items');
    }

    await prisma.item.deleteMany({
      where: { id: { in: ids }, ownerId: userId },
    });

    return { deleted: ids };
  });
```

### File Structure

```
src/actions/
├── file-actions.ts      # File CRUD operations
├── user-actions.ts      # User profile mutations
├── project-actions.ts   # Project-related mutations
└── ...
```

Naming convention: `[domain]-actions.ts`
