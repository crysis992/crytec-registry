"use client"

import { Label } from "@/registry/new-york/ui/shadcn/label";
import { Input } from "@/registry/new-york/ui/shadcn/input";
import { PreviewTabs, ComponentPreview } from "@/docs/components/component-preview";
import { SimpleCodeblock } from "@/docs/components/simple-codeblock";
import { PropsTable } from "@/docs/components/props-table";
import type { PropDefinition } from "@/docs/types";

const labelProps: PropDefinition[] = [
  {
    name: "htmlFor",
    type: "string",
    description: "The ID of the form element the label is associated with.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes to apply.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    description: "The label text content.",
    required: true,
  },
];

function LabelDemo() {
  return <Label>Label text</Label>;
}

function LabelWithInput() {
  return (
    <div className="space-y-2 max-w-sm">
      <Label htmlFor="username">Username</Label>
      <Input id="username" placeholder="Enter username" />
    </div>
  );
}

function LabelDisabled() {
  return (
    <div className="space-y-2 max-w-sm">
      <Label htmlFor="disabled-input" className="peer-disabled:opacity-70">
        Disabled Field
      </Label>
      <Input id="disabled-input" placeholder="Disabled" disabled className="peer" />
    </div>
  );
}

const usageCode = `import { Label } from "@/components/ui/label"

export function MyComponent() {
  return <Label>Label text</Label>
}`;

const withInputCode = `import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function MyComponent() {
  return (
    <div className="space-y-2">
      <Label htmlFor="username">Username</Label>
      <Input id="username" placeholder="Enter username" />
    </div>
  )
}`;

interface LabelDocProps {
  sourceCode: string;
}

export function LabelDoc({ sourceCode }: LabelDocProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2 id="usage" className="text-2xl font-semibold mb-4">
          Usage
        </h2>
        <PreviewTabs
          preview={<LabelDemo />}
          codeBlock={<SimpleCodeblock code={usageCode} />}
        />
      </section>

      <section>
        <h2 id="examples" className="text-2xl font-semibold mb-4">
          Examples
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-3">With Input</h3>
            <PreviewTabs
              preview={<LabelWithInput />}
              codeBlock={<SimpleCodeblock code={withInputCode} />}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Disabled State</h3>
            <PreviewTabs
              preview={<LabelDisabled />}
              codeBlock={
                <SimpleCodeblock
                  code={`<Label htmlFor="disabled-input">Disabled Field</Label>
<Input id="disabled-input" placeholder="Disabled" disabled />`}
                />
              }
            />
          </div>
        </div>
      </section>

      <section>
        <h2 id="api-reference" className="text-2xl font-semibold mb-4">
          API Reference
        </h2>
        <PropsTable props={labelProps} />
      </section>

      <section>
        <h2 id="source" className="text-2xl font-semibold mb-4">
          Source Code
        </h2>
        <SimpleCodeblock code={sourceCode} filename="label.tsx" />
      </section>
    </div>
  );
}
