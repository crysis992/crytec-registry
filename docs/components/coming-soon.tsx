import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york/ui/shadcn/card';

interface ComingSoonDocProps {
  sourceCode: string;
  title?: string;
}

export function ComingSoonDoc({ sourceCode, title = 'Documentation' }: ComingSoonDocProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2
          id="usage"
          className="text-2xl font-semibold mb-4"
        >
          Usage
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>{title} Coming Soon</CardTitle>
            <CardDescription>This component is available in the registry, but documentation is still being written.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-[var(--muted-foreground)]">
              You can still install and use this component using the installation command below. Full documentation with examples and API
              reference will be available soon.
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2
          id="source"
          className="text-2xl font-semibold mb-4"
        >
          Source Code
        </h2>
        <div className="rounded-lg border bg-[var(--muted)] p-4">
          <pre className="text-sm overflow-x-auto">
            <code>{sourceCode || '// Source code not available'}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
