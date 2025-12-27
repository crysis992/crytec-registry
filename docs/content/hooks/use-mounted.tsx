'use client';

import { PreviewTabs } from '@/docs/components/component-preview';
import { PropsTable } from '@/docs/components/props-table';
import { SimpleCodeblock } from '@/docs/components/simple-codeblock';
import type { PropDefinition } from '@/docs/types';
import { useMounted } from '@/registry/new-york/hooks/use-mounted';

const hookProps: PropDefinition[] = [];

const usageCode = `import { useMounted } from "@/hooks/use-mounted"

export function ClientOnly() {
  const mounted = useMounted()

  if (!mounted) {
    return null
  }

  return <div>Client-only content</div>
}`;

const hydrationMismatchCode = `import { useMounted } from "@/hooks/use-mounted"

export function ThemeToggle() {
  const mounted = useMounted()

  // Avoid reading from localStorage during SSR
  if (!mounted) {
    return <div className="h-9 w-24 rounded-md bg-muted" />
  }

  return <button type="button">Toggle theme</button>
}`;

function UseMountedDemo() {
  const mounted = useMounted();

  return (
    <div className="space-y-2 text-sm">
      <div>
        <span className="font-medium">mounted:</span> {mounted ? 'true' : 'false'}
      </div>
      <div className="text-[var(--muted-foreground)]">
        This flips to <code className="rounded bg-[var(--muted)] px-1.5 py-0.5">true</code> after the component mounts.
      </div>
    </div>
  );
}

interface UseMountedDocProps {
  sourceCode: string;
}

export function UseMountedDoc({ sourceCode }: UseMountedDocProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2
          id="usage"
          className="text-2xl font-semibold mb-4"
        >
          Usage
        </h2>
        <p className="text-[var(--muted-foreground)] mb-4">
          <code className="rounded bg-[var(--muted)] px-1.5 py-0.5">useMounted</code> returns
          <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 mx-1">true</code> after the component has mounted. Its primarily useful
          to avoid SSR hydration mismatches when you need to access browser-only APIs.
        </p>

        <PreviewTabs
          preview={<UseMountedDemo />}
          codeBlock={
            <SimpleCodeblock
              code={usageCode}
              language="tsx"
            />
          }
        />
      </section>

      <section>
        <h2
          id="examples"
          className="text-2xl font-semibold mb-4"
        >
          Examples
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-3">Avoid hydration mismatch</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Guard browser-only reads (like <code className="rounded bg-[var(--muted)] px-1.5 py-0.5">localStorage</code>) until after
              mount.
            </p>
            <PreviewTabs
              preview={<div className="text-sm text-[var(--muted-foreground)]">See code tab</div>}
              codeBlock={
                <SimpleCodeblock
                  code={hydrationMismatchCode}
                  language="tsx"
                />
              }
            />
          </div>
        </div>
      </section>

      <section>
        <h2
          id="api-reference"
          className="text-2xl font-semibold mb-4"
        >
          API Reference
        </h2>
        <p className="text-[var(--muted-foreground)] mb-4">This hook has no props. It returns a boolean.</p>
        <PropsTable props={hookProps} />
      </section>

      <section>
        <h2
          id="source"
          className="text-2xl font-semibold mb-4"
        >
          Source Code
        </h2>
        <SimpleCodeblock
          code={sourceCode}
          filename="use-mounted.ts"
          language="ts"
        />
      </section>
    </div>
  );
}
