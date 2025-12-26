"use client"

import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockItem,
  CodeBlockSelect,
  CodeBlockSelectContent,
  CodeBlockSelectItem,
  CodeBlockSelectTrigger,
  CodeBlockSelectValue,
  type CodeBlockData,
} from "@/registry/new-york/ui/custom/codeblock"
import { PreviewTabs } from "@/docs/components/component-preview"
import { SimpleCodeblock } from "@/docs/components/simple-codeblock"
import { PropsTable } from "@/docs/components/props-table"
import type { PropDefinition } from "@/docs/types"

const codeblockProps: PropDefinition[] = [
  {
    name: "data",
    type: "CodeBlockData[]",
    description: "Array of code items with value, filename, code, and language.",
    required: true,
  },
  {
    name: "defaultValue",
    type: "string",
    description: "The default active item value.",
  },
  {
    name: "showLineNumbers",
    type: "boolean",
    defaultValue: "false",
    description: "Show line numbers in all code content.",
  },
  {
    name: "theme",
    type: "{ light: string; dark: string }",
    defaultValue: '{ light: "github-light", dark: "github-dark" }',
    description: "Shiki theme for syntax highlighting.",
  },
]

const dataTypeProps: PropDefinition[] = [
  {
    name: "value",
    type: "string",
    description: "Unique identifier for the code item.",
    required: true,
  },
  {
    name: "filename",
    type: "string",
    description: "Display name for the file tab.",
  },
  {
    name: "code",
    type: "string",
    description: "The code string to highlight.",
    required: true,
  },
  {
    name: "language",
    type: "string",
    description: "Language for syntax highlighting. Defaults to value.",
  },
]

const basicCode: CodeBlockData[] = [
  {
    value: "typescript",
    filename: "example.ts",
    code: `const greeting = "Hello, World!";
console.log(greeting);`,
  },
]

const multiFileCode: CodeBlockData[] = [
  {
    value: "app",
    filename: "App.tsx",
    language: "tsx",
    code: `import { Button } from "./Button"

export function App() {
  return (
    <div className="container">
      <h1>Hello World</h1>
      <Button>Click me</Button>
    </div>
  )
}`,
  },
  {
    value: "button",
    filename: "Button.tsx",
    language: "tsx",
    code: `interface ButtonProps {
  children: React.ReactNode
}

export function Button({ children }: ButtonProps) {
  return (
    <button className="btn">
      {children}
    </button>
  )
}`,
  },
  {
    value: "styles",
    filename: "styles.css",
    language: "css",
    code: `.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background: #3b82f6;
  color: white;
}`,
  },
]

const usageCode = `import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockFiles,
  CodeBlockFilename,
  CodeBlockCopyButton,
  CodeBlockBody,
  CodeBlockItem,
  CodeBlockContent,
  type CodeBlockData,
} from "@/components/ui/codeblock"

const code: CodeBlockData[] = [
  {
    value: "typescript",
    filename: "example.ts",
    language: "ts",
    code: "const greeting = \"Hello\"\nconsole.log(greeting)",
  },
]

export function Example() {
  return (
    <CodeBlock data={code} defaultValue="typescript">
      <CodeBlockHeader>
        <CodeBlockFiles>
          {(item) => (
            <CodeBlockFilename key={item.value} value={item.value}>
              {item.filename}
            </CodeBlockFilename>
          )}
        </CodeBlockFiles>
        <CodeBlockCopyButton />
      </CodeBlockHeader>
      <CodeBlockBody>
        {(item) => (
          <CodeBlockItem key={item.value} value={item.value}>
            <CodeBlockContent />
          </CodeBlockItem>
        )}
      </CodeBlockBody>
    </CodeBlock>
  )
}`

const multiFileTabsCode = `const files: CodeBlockData[] = [
  { value: "app", filename: "App.tsx", language: "tsx", code: "..." },
  { value: "button", filename: "Button.tsx", language: "tsx", code: "..." },
]

<CodeBlock data={files} defaultValue="app">
  <CodeBlockHeader>
    <CodeBlockFiles>
      {(item) => (
        <CodeBlockFilename key={item.value} value={item.value}>
          {item.filename}
        </CodeBlockFilename>
      )}
    </CodeBlockFiles>
    <CodeBlockCopyButton />
  </CodeBlockHeader>
  <CodeBlockBody>
    {(item) => (
      <CodeBlockItem key={item.value} value={item.value}>
        <CodeBlockContent />
      </CodeBlockItem>
    )}
  </CodeBlockBody>
</CodeBlock>`

const dropdownSelectCode = `<CodeBlock data={files} defaultValue="app">
  <CodeBlockHeader>
    <CodeBlockSelect>
      <CodeBlockSelectTrigger>
        <CodeBlockSelectValue placeholder="Select file" />
      </CodeBlockSelectTrigger>
      <CodeBlockSelectContent>
        {(item) => (
          <CodeBlockSelectItem key={item.value} value={item.value}>
            {item.filename}
          </CodeBlockSelectItem>
        )}
      </CodeBlockSelectContent>
    </CodeBlockSelect>
    <CodeBlockCopyButton />
  </CodeBlockHeader>
  <CodeBlockBody>
    {(item) => (
      <CodeBlockItem key={item.value} value={item.value}>
        <CodeBlockContent />
      </CodeBlockItem>
    )}
  </CodeBlockBody>
</CodeBlock>`

const lineNumbersCode = `<CodeBlock data={code} defaultValue="typescript" showLineNumbers>
  {/* header + body same as above */}
</CodeBlock>`

const footerCode = `<CodeBlock data={code} defaultValue="typescript">
  {/* header + body same as above */}
  <CodeBlockFooter>
    TypeScript example showing a simple greeting
  </CodeBlockFooter>
</CodeBlock>`

interface CodeblockDocProps {
  sourceCode: string
}

export function CodeblockDoc({ sourceCode }: CodeblockDocProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2 id="usage" className="text-2xl font-semibold mb-4">
          Usage
        </h2>
        <div className="space-y-3">
          <p className="text-[var(--muted-foreground)]">
            CodeBlock is a compound component for rendering syntax-highlighted code
            with optional file navigation and a copy button.
          </p>
          <p className="text-[var(--muted-foreground)]">
            You provide a <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">data</code> array.
            Each item must have a unique <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">value</code>.
            Use <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">filename</code> for display,
            and optionally set <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">language</code> to control Shiki highlighting.
          </p>
        </div>

        <PreviewTabs
          preview={
            <CodeBlock data={basicCode} defaultValue="typescript">
              <CodeBlockHeader>
                <CodeBlockFiles>
                  {(item) => (
                    <CodeBlockFilename key={item.value} value={item.value}>
                      {item.filename}
                    </CodeBlockFilename>
                  )}
                </CodeBlockFiles>
                <CodeBlockCopyButton />
              </CodeBlockHeader>
              <CodeBlockBody>
                {(item) => (
                  <CodeBlockItem key={item.value} value={item.value}>
                    <CodeBlockContent />
                  </CodeBlockItem>
                )}
              </CodeBlockBody>
            </CodeBlock>
          }
          codeBlock={<SimpleCodeblock code={usageCode} language="tsx" />}
        />
      </section>

      <section>
        <h2 id="examples" className="text-2xl font-semibold mb-4">
          Examples
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-3">Multi-file with Tabs</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Display multiple files with tab navigation.
            </p>
            <PreviewTabs
              preview={
                <CodeBlock data={multiFileCode} defaultValue="app">
                  <CodeBlockHeader>
                    <CodeBlockFiles>
                      {(item) => (
                        <CodeBlockFilename key={item.value} value={item.value}>
                          {item.filename}
                        </CodeBlockFilename>
                      )}
                    </CodeBlockFiles>
                    <CodeBlockCopyButton />
                  </CodeBlockHeader>
                  <CodeBlockBody>
                    {(item) => (
                      <CodeBlockItem key={item.value} value={item.value}>
                        <CodeBlockContent />
                      </CodeBlockItem>
                    )}
                  </CodeBlockBody>
                </CodeBlock>
              }
              codeBlock={<SimpleCodeblock code={multiFileTabsCode} language="tsx" />}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">With Line Numbers</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Enable line numbers across all items with the
              <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm ml-1">showLineNumbers</code> prop.
            </p>
            <PreviewTabs
              preview={
                <CodeBlock data={basicCode} defaultValue="typescript" showLineNumbers>
                  <CodeBlockHeader>
                    <CodeBlockFiles>
                      {(item) => (
                        <CodeBlockFilename key={item.value} value={item.value}>
                          {item.filename}
                        </CodeBlockFilename>
                      )}
                    </CodeBlockFiles>
                    <CodeBlockCopyButton />
                  </CodeBlockHeader>
                  <CodeBlockBody>
                    {(item) => (
                      <CodeBlockItem key={item.value} value={item.value}>
                        <CodeBlockContent />
                      </CodeBlockItem>
                    )}
                  </CodeBlockBody>
                </CodeBlock>
              }
              codeBlock={<SimpleCodeblock code={lineNumbersCode} language="tsx" />}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">With Dropdown Select</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Use the select sub-components for a dropdown file picker (useful for
              narrow layouts when tabs would overflow).
            </p>
            <PreviewTabs
              preview={
                <CodeBlock data={multiFileCode} defaultValue="app">
                  <CodeBlockHeader>
                    <CodeBlockSelect>
                      <CodeBlockSelectTrigger>
                        <CodeBlockSelectValue placeholder="Select file" />
                      </CodeBlockSelectTrigger>
                      <CodeBlockSelectContent>
                        {(item) => (
                          <CodeBlockSelectItem key={item.value} value={item.value}>
                            {item.filename}
                          </CodeBlockSelectItem>
                        )}
                      </CodeBlockSelectContent>
                    </CodeBlockSelect>
                    <CodeBlockCopyButton />
                  </CodeBlockHeader>
                  <CodeBlockBody>
                    {(item) => (
                      <CodeBlockItem key={item.value} value={item.value}>
                        <CodeBlockContent />
                      </CodeBlockItem>
                    )}
                  </CodeBlockBody>
                </CodeBlock>
              }
              codeBlock={<SimpleCodeblock code={dropdownSelectCode} language="tsx" />}
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">With Footer</h3>
            <PreviewTabs
              preview={
                <CodeBlock data={basicCode} defaultValue="typescript">
                  <CodeBlockHeader>
                    <CodeBlockFiles>
                      {(item) => (
                        <CodeBlockFilename key={item.value} value={item.value}>
                          {item.filename}
                        </CodeBlockFilename>
                      )}
                    </CodeBlockFiles>
                    <CodeBlockCopyButton />
                  </CodeBlockHeader>
                  <CodeBlockBody>
                    {(item) => (
                      <CodeBlockItem key={item.value} value={item.value}>
                        <CodeBlockContent />
                      </CodeBlockItem>
                    )}
                  </CodeBlockBody>
                  <CodeBlockFooter>
                    TypeScript example showing a simple greeting
                  </CodeBlockFooter>
                </CodeBlock>
              }
              codeBlock={<SimpleCodeblock code={footerCode} language="tsx" />}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 id="api-reference" className="text-2xl font-semibold mb-4">
          API Reference
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">CodeBlock Props</h3>
            <PropsTable props={codeblockProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">CodeBlockData Type</h3>
            <PropsTable props={dataTypeProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Sub-components</h3>
            <div className="space-y-3 text-[var(--muted-foreground)]">
              <p>
                CodeBlock is designed as a compound component so you can choose the
                UI that fits your page (tabs, dropdown, footer, etc.).
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockHeader</code> wraps navigation and actions.
                </li>
                <li>
                  <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockFiles</code> +
                  <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded ml-1">CodeBlockFilename</code> render tab navigation.
                </li>
                <li>
                  <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockSelect</code> + related
                  <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded ml-1">CodeBlockSelect*</code> components render a dropdown picker.
                </li>
                <li>
                  <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockCopyButton</code> copies the active file.
                </li>
                <li>
                  <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockBody</code> maps items →
                  <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded ml-1">CodeBlockItem</code> panels.
                </li>
                <li>
                  <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockContent</code> renders the highlighted HTML.
                </li>
                <li>
                  <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockFooter</code> adds optional descriptive text.
                </li>
              </ul>
              <p>
                Most sub-components accept standard DOM props for their underlying
                element. For exact types and slots, see the source below.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 id="source" className="text-2xl font-semibold mb-4">
          Source Code
        </h2>
        <SimpleCodeblock code={sourceCode} filename="codeblock.tsx" language="tsx" />
      </section>
    </div>
  )
}
