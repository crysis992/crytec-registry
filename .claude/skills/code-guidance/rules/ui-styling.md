---
title: UI & Styling
tags: ui, styling, tailwind, shadcn, theming, responsive
---

## UI & Styling

### Core Principles

- Use Tailwind utilities, not CSS files
- Use `cn()` for conditional classes
- Use CSS variables: `bg-background`, `text-foreground`
- Mobile-first: base styles, then `md:`, `lg:` breakpoints
- **Never modify** `src/components/ui/` directly

### Class Merging with cn()

```typescript
import { cn } from '@/libs/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  className?: string;
}

function CustomButton({ variant = 'primary', className }: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md font-medium',
        // Variant styles
        variant === 'primary' && 'bg-primary text-primary-foreground',
        variant === 'secondary' && 'bg-secondary text-secondary-foreground',
        // Allow overrides
        className
      )}
    >
      {children}
    </button>
  );
}
```

### Shadcn/ui Usage

```typescript
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

function StatsCard({ title, value }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
```

### Form Components (TanStack Form)

```typescript
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  type FormConfig,
} from '@/components/ui/tanstack-form';
import { Input } from '@/components/ui/input';

type FormValues = { name: string };

function MyForm() {
  const formConfig: FormConfig<FormValues> = {
    defaultValues: { name: '' },
    onSubmit: (values) => console.log(values),
  };

  return (
    <Form config={formConfig}>
      <FormField
        name="name"
        renderFieldAction={({ value, onChange, onBlur }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                onBlur={onBlur}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
}
```

### Theming

```typescript
// Always use semantic color classes
<div className="bg-background text-foreground">
  <p className="text-muted-foreground">Secondary text</p>
  <button className="bg-primary text-primary-foreground">
    Primary Action
  </button>
</div>

// ❌ Avoid hardcoded colors
<div className="bg-white text-black">
```

### Responsive Design

```typescript
// Mobile-first: base = mobile, then scale up
<div className="
  flex flex-col gap-4          // Mobile: stack vertically
  md:flex-row md:gap-6         // Tablet: horizontal
  lg:gap-8                     // Desktop: more spacing
">
  <aside className="
    w-full                     // Mobile: full width
    md:w-64                    // Tablet+: fixed sidebar
  ">
    <Sidebar />
  </aside>
  <main className="flex-1">
    <Content />
  </main>
</div>
```

**Breakpoints:**

| Prefix | Min Width |
|--------|-----------|
| (none) | 0px (mobile) |
| `sm:` | 640px |
| `md:` | 768px |
| `lg:` | 1024px |
| `xl:` | 1280px |

### Icons (Lucide)

```typescript
import { Search, Settings, Loader2 } from 'lucide-react';

<Search className="h-4 w-4" />

<Button>
  <Settings className="mr-2 h-4 w-4" />
  Settings
</Button>

<Button disabled>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Loading...
</Button>
```

### Common Patterns

**Loading State:**

```typescript
<Card>
  <CardContent className="p-6">
    <div className="space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </CardContent>
</Card>
```

**Empty State:**

```typescript
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="rounded-full bg-muted p-4">
    <Icon className="h-8 w-8 text-muted-foreground" />
  </div>
  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
  <p className="mt-2 text-sm text-muted-foreground">{description}</p>
</div>
```
