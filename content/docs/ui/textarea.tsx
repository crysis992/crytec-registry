"use client"

import { Textarea } from "@/registry/new-york/ui/textarea";
import { Label } from "@/registry/new-york/ui/label";
import { PreviewTabs, ComponentPreview } from "@/components/docs/component-preview";
import { SimpleCodeblock } from "@/components/docs/simple-codeblock";
import { PropsTable } from "@/components/docs/props-table";
import type { PropDefinition } from "@/types/docs";

const textareaProps: PropDefinition[] = [
  {
    name: "placeholder",
    type: "string",
    description: "Placeholder text for the textarea.",
  },
  {
    name: "rows",
    type: "number",
    description: "Number of visible text lines.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Whether the textarea is disabled.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes to apply.",
  },
];

function TextareaDemo() {
  return <Textarea placeholder="Enter your message..." className="max-w-sm" />;
}

function TextareaWithLabel() {
  return (
    <div className="space-y-2 max-w-sm">
      <Label htmlFor="bio">Bio</Label>
      <Textarea id="bio" placeholder="Tell us about yourself..." rows={4} />
    </div>
  );
}

function TextareaStates() {
  return (
    <div className="space-y-4 max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="default-textarea">Default</Label>
        <Textarea id="default-textarea" placeholder="Default textarea" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="disabled-textarea">Disabled</Label>
        <Textarea id="disabled-textarea" placeholder="Disabled textarea" disabled />
      </div>
    </div>
  );
}

const usageCode = `import { Textarea } from "@/components/ui/textarea"

export function MyComponent() {
  return <Textarea placeholder="Enter your message..." />
}`;

const withLabelCode = `import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function MyComponent() {
  return (
    <div className="space-y-2">
      <Label htmlFor="bio">Bio</Label>
      <Textarea id="bio" placeholder="Tell us about yourself..." rows={4} />
    </div>
  )
}`;

interface TextareaDocProps {
  sourceCode: string;
}

export function TextareaDoc({ sourceCode }: TextareaDocProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2 id="usage" className="text-2xl font-semibold mb-4">
          Usage
        </h2>
        <PreviewTabs
          preview={<TextareaDemo />}
          codeBlock={<SimpleCodeblock code={usageCode} />}
        />
      </section>

      <section>
        <h2 id="examples" className="text-2xl font-semibold mb-4">
          Examples
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-3">With Label</h3>
            <PreviewTabs
              preview={<TextareaWithLabel />}
              codeBlock={<SimpleCodeblock code={withLabelCode} />}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">States</h3>
            <PreviewTabs
              preview={<TextareaStates />}
              codeBlock={
                <SimpleCodeblock
                  code={`<Textarea placeholder="Default textarea" />
<Textarea placeholder="Disabled textarea" disabled />`}
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
        <PropsTable props={textareaProps} />
      </section>

      <section>
        <h2 id="source" className="text-2xl font-semibold mb-4">
          Source Code
        </h2>
        <SimpleCodeblock code={sourceCode} filename="textarea.tsx" />
      </section>
    </div>
  );
}
