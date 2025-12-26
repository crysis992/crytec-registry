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
} from "@/registry/new-york/ui/codeblock"
import { PropsTable } from "@/components/docs/props-table"
import type { PropDefinition } from "@/types/docs"

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
        <p className="text-[var(--muted-foreground)] mb-4">
          CodeBlock is a compound component for displaying syntax-highlighted code.
          It supports multiple files, tab navigation, copy functionality, and custom themes.
        </p>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Usage</h3>
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
        </div>
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
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">With Line Numbers</h3>
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
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">With Dropdown Select</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Use the select components for a dropdown file picker.
            </p>
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
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">With Footer</h3>
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
            <ul className="list-disc list-inside space-y-2 text-[var(--muted-foreground)]">
              <li>
                <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockHeader</code> - Header container
              </li>
              <li>
                <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockFiles</code> - Tab container (render prop)
              </li>
              <li>
                <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockFilename</code> - Individual tab button
              </li>
              <li>
                <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockSelect</code> - Dropdown wrapper
              </li>
              <li>
                <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockSelectTrigger</code> - Dropdown trigger
              </li>
              <li>
                <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockSelectValue</code> - Selected value display
              </li>
              <li>
                <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockSelectContent</code> - Dropdown content (render prop)
              </li>
              <li>
                <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockSelectItem</code> - Dropdown item
              </li>
              <li>
                <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockCopyButton</code> - Copy to clipboard button
              </li>
              <li>
                <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockBody</code> - Body container (render prop)
              </li>
              <li>
                <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockItem</code> - Individual code panel
              </li>
              <li>
                <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockContent</code> - Highlighted code display
              </li>
              <li>
                <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">CodeBlockFooter</code> - Footer container
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 id="source" className="text-2xl font-semibold mb-4">
          Source Code
        </h2>
        <CodeBlock
          data={[{ value: "source", filename: "codeblock.tsx", code: sourceCode, language: "tsx" }]}
          defaultValue="source"
        >
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
      </section>
    </div>
  )
}
