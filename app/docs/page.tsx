import Link from "next/link";
import { docsConfig } from "@/config/docs";
import { siteConfig } from "@/config/site";
import { Card, CardHeader, CardTitle, CardDescription } from "@/registry/new-york/ui/card";

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
        <p className="text-lg text-[var(--muted-foreground)] max-w-2xl">
          Welcome to the {siteConfig.name} documentation. Browse our collection of
          components, hooks, and utilities for building your next project.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Installation</h2>
        <p className="text-[var(--muted-foreground)]">
          Install components directly into your project using the shadcn CLI:
        </p>
        <code className="block px-4 py-3 bg-[var(--muted)] rounded-lg text-sm font-mono">
          npx shadcn@latest add {siteConfig.url}/r/[component].json
        </code>
      </div>

      <div className="space-y-6">
        {docsConfig.slice(1).map((section) => (
          <div key={section.title}>
            <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Card className="h-full hover:border-[var(--primary)] transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>
                        View documentation for {item.title.toLowerCase()}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
