---
title: Component Architecture
tags: components, server, client, splitting, composition
---

## Component Architecture

### Server vs Client Components

| Aspect | Server Component | Client Component |
|--------|------------------|------------------|
| **Directive** | None (default) | `"use client"` at top |
| **Renders** | Server only | Server (SSR) + Client (hydration) |
| **JS Bundle** | Zero | Included in bundle |
| **Can use** | async/await, server-only code | hooks, event handlers, browser APIs |
| **Data fetching** | Direct DB/API access | useEffect, TanStack Query |

### Decision Tree

```
Does your component need interactivity or browser APIs?
  │
  ├─ NO → Server Component ✅
  │
  └─ YES → Can you split it?
              │
              ├─ YES → Split: Server parent + Client child
              │
              └─ NO → Client Component (minimize scope)
```

### When to Use Each

**Server Components:**
- Fetching data from database or API
- Accessing backend resources directly
- Keeping sensitive data on server
- Large dependencies that shouldn't ship to client

**Client Components:**
- React hooks (`useState`, `useEffect`)
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`window`, `localStorage`)
- Third-party client-only libraries

### Splitting Pattern

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
import { ProductActions } from './ProductActions'

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

### Composition Patterns

**Server Parent with Client Children:**

```tsx
// Server Component (page.tsx)
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
// Server Component
import { ClientWrapper } from './ClientWrapper'
import { ServerContent } from './ServerContent'

export default function Page() {
  return (
    <ClientWrapper>
      <ServerContent />  {/* Stays as Server Component */}
    </ClientWrapper>
  )
}
```

### Folder Structure

```
src/components/
├── ui/                    # Shadcn primitives (DO NOT MODIFY)
├── [feature]/             # Feature-specific components
│   ├── gallery/
│   └── dashboard/
└── shared/                # Cross-feature components
```

| Component Type | Location |
|---------------|----------|
| Generic UI | `/components/ui/` |
| Feature-specific | `/components/[feature]/` |
| Cross-feature | `/components/shared/` |
