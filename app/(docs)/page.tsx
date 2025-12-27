import Link from 'next/link';
import { getRegistryItemsWithStatus } from '@/lib/registry';
import { Card, CardDescription, CardHeader, CardTitle } from '@/registry/new-york/ui/shadcn/card';

export default function DocsPage() {
  const allItems = getRegistryItemsWithStatus();
  const itemsByType = allItems.reduce(
    (acc, item) => {
      if (!acc[item.urlType]) {
        acc[item.urlType] = [];
      }
      acc[item.urlType].push(item);
      return acc;
    },
    {} as Record<string, typeof allItems>,
  );

  const typeLabels: Record<string, string> = {
    ui: 'Components',
    hooks: 'Hooks',
    lib: 'Library',
    blocks: 'Blocks',
  };

  const typeOrder = ['ui', 'hooks', 'lib', 'blocks'];

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
        <p className="text-lg text-[var(--muted-foreground)] max-w-2xl">
          Welcome to the Crytec Registry documentation. Browse our collection of components, hooks, and utilities for building your next
          project.
        </p>
        <p className="text-sm text-[var(--muted-foreground)]">
          {allItems.length} total items • {allItems.filter((i) => i.hasDocs).length} with documentation
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <p className="text-[var(--muted-foreground)]">Install components directly into your project using the shadcn CLI:</p>
        <code className="block px-4 py-3 bg-[var(--muted)] rounded-lg text-sm font-mono">
          npx shadcn@latest add https://registry.crytec.net/r/[component].json
        </code>
      </div>

      <div className="space-y-6">
        {typeOrder.map((type) => {
          const items = itemsByType[type] || [];
          if (items.length === 0) return null;

          return (
            <div key={type}>
              <h2 className="text-2xl font-semibold mb-4">{typeLabels[type] || type}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Link
                    key={item.name}
                    href={`/${item.urlType}/${item.name}`}
                    className="block"
                  >
                    <Card className="h-full hover:border-[var(--primary)] transition-colors">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          {!item.hasDocs && (
                            <span className="text-xs px-2 py-1 rounded bg-[var(--muted)] text-[var(--muted-foreground)] whitespace-nowrap">
                              Coming Soon
                            </span>
                          )}
                        </div>
                        <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
