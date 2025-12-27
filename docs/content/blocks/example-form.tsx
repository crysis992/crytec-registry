'use client';

import { PreviewTabs } from '@/docs/components/component-preview';
import { PropsTable } from '@/docs/components/props-table';
import { SimpleCodeblock } from '@/docs/components/simple-codeblock';
import type { PropDefinition } from '@/docs/types';
import ExampleForm from '@/registry/new-york/blocks/example-form/page';

const blockProps: PropDefinition[] = [];

const usageCode = `import ExampleForm from "@/components/blocks/example-form"

export default function Page() {
  return <ExampleForm />
}`;

interface ExampleFormDocProps {
  sourceCode: string;
}

export function ExampleFormDoc({ sourceCode }: ExampleFormDocProps) {
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
          Example Form is a full block: a complete, styled contact form built with React Hook Form + Zod and composed from the underlying UI
          components.
        </p>

        <PreviewTabs
          preview={<ExampleForm />}
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
          id="api-reference"
          className="text-2xl font-semibold mb-4"
        >
          API Reference
        </h2>
        <p className="text-[var(--muted-foreground)] mb-4">This block does not accept props.</p>
        <PropsTable props={blockProps} />
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
          filename="example-form/page.tsx"
          language="tsx"
        />
      </section>
    </div>
  );
}
