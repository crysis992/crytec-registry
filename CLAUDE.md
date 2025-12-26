# Crytec Registry - AI Agent Guide

This document provides comprehensive instructions for AI agents working on this project.

## Project Overview

**Crytec Registry** is a custom shadcn/ui component registry built with Next.js 15.1.3 and React 19. It allows developers to install pre-built components directly into their projects using the shadcn CLI.

- **Registry URL:** https://registry.crytec.net
- **Style:** new-york (shadcn/ui style variant)
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript (strict mode)

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 15.1.3 | Framework |
| React | 19.0.0 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| Shiki | 3.x | Code highlighting |
| Radix UI | 2.x | Accessible primitives |
| CVA | 0.7.1 | Variant management |
| React Hook Form | 7.x | Form management |
| Zod | 3.x | Schema validation |

## Project Structure

```
crytec-registry/
├── app/                           # Next.js App Router
│   ├── globals.css               # Global styles & CSS variables
│   ├── layout.tsx                # Root layout with fonts
│   ├── page.tsx                  # Home page
│   └── docs/                     # Documentation pages
│       ├── layout.tsx            # Docs layout (sidebar + content)
│       ├── page.tsx              # Docs index
│       └── [type]/[name]/page.tsx # Dynamic doc pages
├── registry/                      # Registry components (SOURCE OF TRUTH)
│   └── new-york/
│       ├── ui/                   # UI components
│       ├── hooks/                # Custom hooks
│       ├── lib/                  # Utility libraries
│       └── blocks/               # Complex blocks
├── components/docs/              # Documentation UI components
├── content/docs/                 # Documentation content
├── config/                       # Configuration files
├── lib/                          # Core utilities
├── types/                        # TypeScript definitions
├── registry.json                 # Component registry data
└── components.json               # shadcn configuration
```

## Available Scripts

```bash
npm run dev          # Development server (Turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint linting
npm run registry:build  # Build shadcn registry
```

---

## Creating New Components

### Step 1: Create the Component File

Location: `registry/new-york/ui/[component-name].tsx`

**Pattern A: Simple Element Wrapper**
```typescript
import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-[var(--input)] bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
```

**Pattern B: Component with Variants (CVA)**
```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] text-[var(--primary-foreground)] shadow hover:bg-[var(--primary)]/90",
        secondary: "bg-[var(--secondary)] text-[var(--secondary-foreground)] shadow-sm hover:bg-[var(--secondary)]/80",
        destructive: "bg-[var(--destructive)] text-[var(--destructive-foreground)] shadow-sm hover:bg-[var(--destructive)]/90",
        outline: "border border-[var(--input)] bg-[var(--background)] shadow-sm hover:bg-[var(--accent)]",
        ghost: "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]",
        link: "text-[var(--primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

**Pattern C: Radix UI Wrapper**
```typescript
"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
```

### Component Requirements

- Always use `React.forwardRef` for ref forwarding
- Always set `displayName` for debugging
- Always use `cn()` for className merging
- Always accept `className` prop for extensibility
- Use CSS variables for colors: `bg-[var(--primary)]`
- Export component and variants (if using CVA)

---

## Updating the Registry

### Step 2: Add to registry.json

```json
{
  "name": "my-component",
  "type": "registry:ui",
  "title": "My Component",
  "description": "A brief description of the component.",
  "dependencies": ["@radix-ui/react-slot"],
  "registryDependencies": ["utils"],
  "files": [
    {
      "path": "registry/new-york/ui/my-component.tsx",
      "type": "registry:ui"
    }
  ]
}
```

### Registry Types

| Type | URL Path | File Path | File Type |
|------|----------|-----------|-----------|
| `registry:ui` | /docs/ui/ | registry/new-york/ui/ | `registry:ui` |
| `registry:hook` | /docs/hooks/ | registry/new-york/hooks/ | `registry:hook` |
| `registry:lib` | /docs/lib/ | registry/new-york/lib/ | `registry:lib` |
| `registry:block` | /docs/blocks/ | registry/new-york/blocks/[name]/ | `registry:component` |

### Dependencies vs registryDependencies

- **dependencies**: NPM packages (installed via npm)
- **registryDependencies**: Other registry items (installed from this registry first)

---

## Creating Documentation

### Step 3: Create Content File

Location: `content/docs/[type]/[component-name].tsx`

```typescript
import { MyComponent } from "@/registry/new-york/ui/my-component";
import { PreviewTabs } from "@/components/docs/component-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable } from "@/components/docs/props-table";
import type { PropDefinition } from "@/types/docs";

const myComponentProps: PropDefinition[] = [
  {
    name: "variant",
    type: '"default" | "secondary"',
    defaultValue: '"default"',
    description: "The visual style of the component.",
  },
];

function MyComponentDemo() {
  return <MyComponent>Demo</MyComponent>;
}

const usageCode = `import { MyComponent } from "@/components/ui/my-component"

export function App() {
  return <MyComponent>Click me</MyComponent>
}`;

interface MyComponentDocProps {
  sourceCode: string;
}

export function MyComponentDoc({ sourceCode }: MyComponentDocProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2 id="usage" className="text-2xl font-semibold mb-4">Usage</h2>
        <PreviewTabs
          preview={<MyComponentDemo />}
          codeBlock={<CodeBlock code={usageCode} />}
        />
      </section>

      <section>
        <h2 id="examples" className="text-2xl font-semibold mb-4">Examples</h2>
        {/* Add example variations */}
      </section>

      <section>
        <h2 id="api-reference" className="text-2xl font-semibold mb-4">API Reference</h2>
        <PropsTable props={myComponentProps} />
      </section>

      <section>
        <h2 id="source" className="text-2xl font-semibold mb-4">Source Code</h2>
        <CodeBlock code={sourceCode} filename="my-component.tsx" />
      </section>
    </div>
  );
}
```

### Step 4: Register in Dynamic Route

File: `app/docs/[type]/[name]/page.tsx`

1. Add import:
```typescript
import { MyComponentDoc } from "@/content/docs/ui/my-component";
```

2. Add to contentMap:
```typescript
const contentMap = {
  // ... existing entries
  "my-component": MyComponentDoc,
};
```

### Step 5: Add Navigation

File: `config/docs.ts`

```typescript
{
  title: "Components",
  items: [
    // ... existing items
    { title: "My Component", href: "/docs/ui/my-component" },
  ],
}
```

---

## Styling Guidelines

### CSS Variables (Theme System)

All colors use CSS variables defined in `app/globals.css`:

```css
/* Light Mode */
--background: oklch(1 0 0);
--foreground: oklch(0.145 0 0);
--primary: oklch(0.205 0 0);
--secondary: oklch(0.97 0 0);
--muted: oklch(0.97 0 0);
--accent: oklch(0.97 0 0);
--destructive: oklch(0.577 0.245 27.325);
--border: oklch(0.922 0 0);
--input: oklch(0.922 0 0);
--ring: oklch(0.708 0 0);

/* Dark mode automatically applied via .dark class */
```

### Using Colors in Components

```typescript
// CORRECT - Use CSS variables
className="bg-[var(--primary)] text-[var(--primary-foreground)]"
className="border-[var(--border)]"
className="focus-visible:ring-[var(--ring)]"

// WRONG - Don't hardcode colors
className="bg-blue-500 text-white"
```

### The cn() Utility

Always use `cn()` for combining classes:

```typescript
import { cn } from "@/lib/utils";

// Merging classes
cn("px-2 py-1", "px-4") // Result: "py-1 px-4"

// Conditional classes
cn("base-class", isActive && "active-class")

// With component props
<div className={cn("base-styles", className)} />
```

### Standard Class Patterns

```typescript
// Layout
"flex items-center justify-center gap-2"

// Interactive states
"transition-colors"
"hover:bg-[var(--primary)]/90"
"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring)]"
"disabled:pointer-events-none disabled:opacity-50"

// Responsive
"text-base md:text-sm"
"flex-col md:flex-row"
```

---

## Creating Hooks

Location: `registry/new-york/hooks/use-[hook-name].ts`

```typescript
import * as React from "react";

/**
 * Description of what the hook does.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const value = useMyHook();
 *   return <div>{value}</div>;
 * }
 * ```
 */
export function useMyHook() {
  const [state, setState] = React.useState(false);

  React.useEffect(() => {
    // Effect logic
  }, []);

  return state;
}
```

---

## Creating Blocks

Location: `registry/new-york/blocks/[block-name]/page.tsx`

Blocks are complex, self-contained components:

```typescript
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/registry/new-york/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/new-york/ui/card";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
});

type FormData = z.infer<typeof formSchema>;

export default function MyBlock() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Block</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input {...register("email")} />
          {errors.email && <p className="text-sm text-[var(--destructive)]">{errors.email.message}</p>}
          <Button type="submit">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
}
```

---

## Import Aliases

```typescript
@/lib/*                    → lib/
@/registry/new-york/ui/*   → registry/new-york/ui/
@/registry/new-york/hooks/* → registry/new-york/hooks/
@/components/*             → components/
@/config/*                 → config/
@/types/*                  → types/
@/content/*                → content/
```

---

## Quick Reference: Adding a New Component

1. **Create component** → `registry/new-york/ui/[name].tsx`
2. **Add to registry** → `registry.json` (add item with name, type, dependencies, files)
3. **Create docs content** → `content/docs/[type]/[name].tsx`
4. **Register in router** → `app/docs/[type]/[name]/page.tsx` (import + add to contentMap)
5. **Add navigation** → `config/docs.ts`
6. **Verify** → `npm run build`

---

## Common Patterns Reference

### Form Validation Pattern
```typescript
const schema = z.object({ field: z.string().min(1) });
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

### Conditional Rendering with useMounted
```typescript
const mounted = useMounted();
if (!mounted) return <Skeleton />;
return <ClientOnlyContent />;
```

### Responsive Layout
```typescript
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Error Display
```typescript
{error && (
  <p className="text-sm text-[var(--destructive)]">{error.message}</p>
)}
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `registry.json` | Component registry definitions |
| `components.json` | shadcn CLI configuration |
| `config/docs.ts` | Documentation navigation |
| `config/site.ts` | Site metadata |
| `lib/utils.ts` | cn() utility |
| `lib/registry.ts` | Registry data access |
| `lib/highlighter.ts` | Code syntax highlighting |
| `types/docs.ts` | TypeScript definitions |
| `app/globals.css` | Theme CSS variables |
