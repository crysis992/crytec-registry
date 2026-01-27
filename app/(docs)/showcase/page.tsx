import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRegistryItemsWithStatus, type RegistryItemWithStatus } from '@/lib/registry';

function ComponentCard({ item }: { item: RegistryItemWithStatus }) {
  return (
    <Link
      href={`/${item.urlType}/${item.name}`}
      className="block group"
    >
      <Card className="h-full transition-all hover:border-primary hover:shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">{item.title}</CardTitle>
            <div className="flex gap-1">
              <Badge
                variant="secondary"
                className="text-xs"
              >
                {item.urlType}
              </Badge>
              {!item.hasDocs && (
                <Badge
                  variant="outline"
                  className="text-xs text-muted-foreground"
                >
                  No docs
                </Badge>
              )}
            </div>
          </div>
          <CardDescription className="line-clamp-2">{item.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}

export default function ShowcasePage() {
  const allItems = getRegistryItemsWithStatus();

  const itemsByType = allItems.reduce(
    (acc, item) => {
      if (!acc[item.urlType]) {
        acc[item.urlType] = [];
      }
      acc[item.urlType].push(item);
      return acc;
    },
    {} as Record<string, RegistryItemWithStatus[]>,
  );

  const typeLabels: Record<string, { title: string; description: string }> = {
    ui: {
      title: 'UI Components',
      description: 'Ready-to-use React components with beautiful design and accessible interfaces.',
    },
    hooks: {
      title: 'Hooks',
      description: 'Custom React hooks for common functionality and state management.',
    },
    lib: {
      title: 'Library Utilities',
      description: 'Helper functions and utilities for common development tasks.',
    },
    blocks: {
      title: 'Blocks',
      description: 'Pre-built page sections and layouts for faster development.',
    },
  };

  const typeOrder = ['ui', 'hooks', 'lib', 'blocks'];

  const stats = {
    total: allItems.length,
    withDocs: allItems.filter((i) => i.hasDocs).length,
    ui: itemsByType.ui?.length || 0,
    hooks: itemsByType.hooks?.length || 0,
    blocks: itemsByType.blocks?.length || 0,
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Component Showcase</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Browse our complete collection of components, hooks, and utilities. Each component is designed to be accessible, customizable, and
          easy to integrate into your projects.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Items</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>UI Components</CardDescription>
            <CardTitle className="text-3xl">{stats.ui}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Hooks</CardDescription>
            <CardTitle className="text-3xl">{stats.hooks}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Documented</CardDescription>
            <CardTitle className="text-3xl">
              {stats.withDocs}/{stats.total}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Quick Install */}
      <div className="space-y-4 p-6 rounded-lg border bg-muted/50">
        <h2 className="text-xl font-semibold">Quick Install</h2>
        <p className="text-muted-foreground">Install any component directly into your project using the shadcn CLI:</p>
        <code className="block px-4 py-3 bg-background rounded-lg text-sm font-mono border">
          npx shadcn@latest add https://registry.crytec.net/r/[component].json
        </code>
      </div>

      {/* Components by Type */}
      {typeOrder.map((type) => {
        const items = itemsByType[type] || [];
        if (items.length === 0) return null;

        const typeInfo = typeLabels[type] || { title: type, description: '' };

        return (
          <section
            key={type}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-semibold">{typeInfo.title}</h2>
              <p className="text-muted-foreground mt-1">{typeInfo.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ComponentCard
                  key={item.name}
                  item={item}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
