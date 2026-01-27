/**
 * Documentation Generator Script
 *
 * Reads registry.json and generates scaffold documentation files
 * for components that don't have documentation yet.
 *
 * Usage: npx tsx scripts/generate-docs.ts
 */

import fs from 'fs';
import path from 'path';

interface RegistryFile {
  path: string;
  type: string;
}

interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
}

interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

function getUrlTypeFromRegistryType(registryType: string): string {
  const mapping: Record<string, string> = {
    'registry:ui': 'ui',
    'registry:hook': 'hooks',
    'registry:lib': 'lib',
    'registry:block': 'blocks',
  };
  return mapping[registryType] || 'ui';
}

function pascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function generateDocTemplate(item: RegistryItem): string {
  const componentName = pascalCase(item.name);

  const importPath =
    item.type === 'registry:hook'
      ? `@/hooks/${item.name}`
      : item.type === 'registry:lib'
        ? `@/lib/${item.name}`
        : item.type === 'registry:block'
          ? `@/components/blocks/${item.name}`
          : `@/components/ui/${item.name}`;

  return `'use client';

import * as React from 'react';
import { PreviewTabs } from '@/docs/components/component-preview';
import { PropsTable } from '@/docs/components/props-table';
import { SimpleCodeblock } from '@/docs/components/simple-codeblock';
import type { PropDefinition } from '@/docs/types';

// TODO: Import your component
// import { ${componentName} } from '${importPath}';

const ${item.name.replace(/-/g, '')}Props: PropDefinition[] = [
  // TODO: Add prop definitions
  // {
  //   name: 'example',
  //   type: 'string',
  //   description: 'Description of the prop.',
  // },
];

const usageCode = \`import { ${componentName} } from "${importPath}"

export function ${componentName}Example() {
  return (
    <${componentName}>
      {/* TODO: Add example usage */}
    </${componentName}>
  )
}\`;

function BasicDemo() {
  return (
    <div className="flex items-center justify-center p-8">
      {/* TODO: Add component demo */}
      <p className="text-muted-foreground">Demo coming soon</p>
    </div>
  );
}

interface ${componentName}DocProps {
  sourceCode: string;
}

export function ${componentName}Doc({ sourceCode }: ${componentName}DocProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2 id="usage" className="text-2xl font-semibold mb-4">
          Usage
        </h2>
        <div className="space-y-3">
          <p className="text-[var(--muted-foreground)]">
            ${item.description}
          </p>
        </div>

        <PreviewTabs
          preview={<BasicDemo />}
          codeBlock={
            <SimpleCodeblock
              code={usageCode}
              language="tsx"
            />
          }
        />
      </section>

      <section>
        <h2 id="api-reference" className="text-2xl font-semibold mb-4">
          API Reference
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">${componentName} Props</h3>
            <PropsTable props={${item.name.replace(/-/g, '')}Props} />
          </div>
        </div>
      </section>

      <section>
        <h2 id="source" className="text-2xl font-semibold mb-4">
          Source Code
        </h2>
        <SimpleCodeblock
          code={sourceCode}
          filename="${item.name}.tsx"
          language="tsx"
        />
      </section>
    </div>
  );
}
`;
}

function main() {
  const registryPath = path.join(process.cwd(), 'registry.json');
  const docsContentPath = path.join(process.cwd(), 'docs', 'content');

  // Read registry
  const registryContent = fs.readFileSync(registryPath, 'utf-8');
  const registry: Registry = JSON.parse(registryContent);

  console.log(`Found ${registry.items.length} items in registry\n`);

  let created = 0;
  let skipped = 0;

  for (const item of registry.items) {
    const urlType = getUrlTypeFromRegistryType(item.type);
    const docDir = path.join(docsContentPath, urlType);
    const docPath = path.join(docDir, `${item.name}.tsx`);

    // Check if doc already exists
    if (fs.existsSync(docPath)) {
      console.log(`[SKIP] ${urlType}/${item.name}.tsx - already exists`);
      skipped++;
      continue;
    }

    // Ensure directory exists
    if (!fs.existsSync(docDir)) {
      fs.mkdirSync(docDir, { recursive: true });
    }

    // Generate and write template
    const template = generateDocTemplate(item);
    fs.writeFileSync(docPath, template);
    console.log(`[CREATE] ${urlType}/${item.name}.tsx`);
    created++;
  }

  console.log(`\nDone! Created ${created} files, skipped ${skipped} existing files.`);
}

main();
