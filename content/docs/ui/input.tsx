import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { PreviewTabs, ComponentPreview } from "@/components/docs/component-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable } from "@/components/docs/props-table";
import type { PropDefinition } from "@/types/docs";

const inputProps: PropDefinition[] = [
  {
    name: "type",
    type: "string",
    defaultValue: '"text"',
    description: "The type of input (text, email, password, etc.).",
  },
  {
    name: "placeholder",
    type: "string",
    description: "Placeholder text for the input.",
  },
  {
    name: "disabled",
    type: "boolean",
    defaultValue: "false",
    description: "Whether the input is disabled.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes to apply.",
  },
];

function InputDemo() {
  return <Input placeholder="Enter text..." className="max-w-sm" />;
}

function InputWithLabel() {
  return (
    <div className="space-y-2 max-w-sm">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="your@email.com" />
    </div>
  );
}

function InputStates() {
  return (
    <div className="space-y-4 max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="default">Default</Label>
        <Input id="default" placeholder="Default input" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="disabled">Disabled</Label>
        <Input id="disabled" placeholder="Disabled input" disabled />
      </div>
    </div>
  );
}

const usageCode = `import { Input } from "@/components/ui/input"

export function MyComponent() {
  return <Input placeholder="Enter text..." />
}`;

const withLabelCode = `import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function MyComponent() {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="your@email.com" />
    </div>
  )
}`;

const statesCode = `<Input placeholder="Default input" />
<Input placeholder="Disabled input" disabled />`;

interface InputDocProps {
  sourceCode: string;
}

export function InputDoc({ sourceCode }: InputDocProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2 id="usage" className="text-2xl font-semibold mb-4">
          Usage
        </h2>
        <PreviewTabs
          preview={<InputDemo />}
          codeBlock={<CodeBlock code={usageCode} />}
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
              preview={<InputWithLabel />}
              codeBlock={<CodeBlock code={withLabelCode} />}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">States</h3>
            <PreviewTabs
              preview={<InputStates />}
              codeBlock={<CodeBlock code={statesCode} />}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 id="api-reference" className="text-2xl font-semibold mb-4">
          API Reference
        </h2>
        <PropsTable props={inputProps} />
      </section>

      <section>
        <h2 id="source" className="text-2xl font-semibold mb-4">
          Source Code
        </h2>
        <CodeBlock code={sourceCode} filename="input.tsx" />
      </section>
    </div>
  );
}
