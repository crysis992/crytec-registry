import { Button } from "@/registry/new-york/ui/button";
import { PreviewTabs, ComponentPreview } from "@/components/docs/component-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable } from "@/components/docs/props-table";
import type { PropDefinition } from "@/types/docs";

const buttonProps: PropDefinition[] = [
  {
    name: "variant",
    type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"',
    defaultValue: '"default"',
    description: "The visual style of the button.",
  },
  {
    name: "size",
    type: '"default" | "sm" | "lg" | "icon"',
    defaultValue: '"default"',
    description: "The size of the button.",
  },
  {
    name: "asChild",
    type: "boolean",
    defaultValue: "false",
    description: "Render as a child component using Radix Slot.",
  },
];

function ButtonDemo() {
  return <Button>Click me</Button>;
}

function ButtonVariants() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}

function ButtonSizes() {
  return (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}

const usageCode = `import { Button } from "@/components/ui/button"

export function MyComponent() {
  return <Button>Click me</Button>
}`;

const variantsCode = `<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`;

const sizesCode = `<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>`;

interface ButtonDocProps {
  sourceCode: string;
}

export function ButtonDoc({ sourceCode }: ButtonDocProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2 id="usage" className="text-2xl font-semibold mb-4">
          Usage
        </h2>
        <PreviewTabs
          preview={<ButtonDemo />}
          codeBlock={<CodeBlock code={usageCode} />}
        />
      </section>

      <section>
        <h2 id="examples" className="text-2xl font-semibold mb-4">
          Examples
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-3">Variants</h3>
            <PreviewTabs
              preview={<ButtonVariants />}
              codeBlock={<CodeBlock code={variantsCode} />}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Sizes</h3>
            <PreviewTabs
              preview={<ButtonSizes />}
              codeBlock={<CodeBlock code={sizesCode} />}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 id="api-reference" className="text-2xl font-semibold mb-4">
          API Reference
        </h2>
        <PropsTable props={buttonProps} />
      </section>

      <section>
        <h2 id="source" className="text-2xl font-semibold mb-4">
          Source Code
        </h2>
        <CodeBlock code={sourceCode} filename="button.tsx" />
      </section>
    </div>
  );
}
