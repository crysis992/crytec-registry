"use client";

import * as React from "react";
import { useMounted } from "@/registry/new-york/hooks/use-mounted";
import { PreviewTabs, ComponentPreview } from "@/docs/components/component-preview";
import { SimpleCodeblock } from "@/docs/components/simple-codeblock";
import { PropsTable } from "@/docs/components/props-table";
import type { PropDefinition } from "@/docs/types";

const hookReturns: PropDefinition[] = [
  {
    name: "mounted",
    type: "boolean",
    description: "Returns true after the component has mounted on the client.",
  },
];

function UseMountedDemo() {
  const mounted = useMounted();

  return (
    <div className="space-y-2">
      <p className="text-sm text-[var(--muted-foreground)]">
        Component mounted: <strong>{mounted ? "Yes" : "No"}</strong>
      </p>
    </div>
  );
}

function UseMountedExample() {
  const mounted = useMounted();

  if (!mounted) {
    return (
      <div className="h-10 w-40 animate-pulse bg-[var(--muted)] rounded" />
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <p className="text-sm">
        Current time: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}

const usageCode = `import { useMounted } from "@/hooks/use-mounted"

export function MyComponent() {
  const mounted = useMounted()

  if (!mounted) {
    return <Skeleton />
  }

  return <ClientOnlyContent />
}`;

const exampleCode = `import { useMounted } from "@/hooks/use-mounted"

export function TimeDisplay() {
  const mounted = useMounted()

  if (!mounted) {
    return <div className="h-10 w-40 animate-pulse bg-muted rounded" />
  }

  return (
    <div className="p-4 border rounded-lg">
      <p className="text-sm">
        Current time: {new Date().toLocaleTimeString()}
      </p>
    </div>
  )
}`;

interface UseMountedDocProps {
  sourceCode: string;
}

export function UseMountedDoc({ sourceCode }: UseMountedDocProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2 id="usage" className="text-2xl font-semibold mb-4">
          Usage
        </h2>
        <p className="text-[var(--muted-foreground)] mb-4">
          The <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">useMounted</code> hook
          returns <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">true</code> after
          the component has mounted on the client. This is useful for avoiding hydration
          mismatches when rendering content that depends on client-side values.
        </p>
        <PreviewTabs
          preview={<UseMountedDemo />}
          codeBlock={<SimpleCodeblock code={usageCode} />}
        />
      </section>

      <section>
        <h2 id="examples" className="text-2xl font-semibold mb-4">
          Examples
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-3">Avoiding Hydration Mismatch</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Use this hook when rendering time-dependent content or any value that
              differs between server and client.
            </p>
            <PreviewTabs
              preview={<UseMountedExample />}
              codeBlock={<SimpleCodeblock code={exampleCode} />}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 id="api-reference" className="text-2xl font-semibold mb-4">
          API Reference
        </h2>
        <h3 className="text-lg font-medium mb-3">Returns</h3>
        <PropsTable props={hookReturns} />
      </section>

      <section>
        <h2 id="source" className="text-2xl font-semibold mb-4">
          Source Code
        </h2>
        <SimpleCodeblock code={sourceCode} filename="use-mounted.ts" language="typescript" />
      </section>
    </div>
  );
}
