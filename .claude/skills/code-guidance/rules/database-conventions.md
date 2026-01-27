---
title: Database Conventions
tags: database, prisma, schema, migrations
---

## Database Conventions

### Naming Rules

- All table names in **singular form**
- All column names in **singular form**
- All tables must have `created_at` timestamp
- All tables must have `updated_at` timestamp

### Applying Schema Changes

```bash
pnpm prisma migrate dev
```

This command:
1. Creates a new migration file
2. Generates new Prisma client for type safety
3. Automatically pushes changes to database

### Example Schema

```prisma
model User {
  id         String   @id @default(cuid())
  name       String
  email      String   @unique
  role       String   @default("user")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  item       Item[]

  @@map("user")
}

model Item {
  id         String   @id @default(cuid())
  title      String
  ownerId    String   @map("owner_id")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  owner      User     @relation(fields: [ownerId], references: [id])

  @@map("item")
}
```

### Query Patterns

See [data-fetching.md](data-fetching.md) for Prisma query patterns.
