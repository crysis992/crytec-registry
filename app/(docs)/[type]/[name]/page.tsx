import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ComingSoonDoc } from '@/docs/components/coming-soon';
import { InstallationSection } from '@/docs/components/installation-section';
import { PageHeader } from '@/docs/components/page-header';
import { defaultTocItems, TableOfContents } from '@/docs/components/toc';
import type { DocComponent } from '@/docs/types';
import { getComponentSource, getRegistryItem, getUrlTypeFromRegistryType, hasDocumentation } from '@/lib/registry';
import { siteConfig } from '@/site';

interface PageProps {
  params: Promise<{
    type: string;
    name: string;
  }>;
}

export async function generateStaticParams() {
  // Generate params for all registry items (not just those with docs)
  // This allows components without docs to show the "Coming Soon" page
  const { getRegistryItems, getUrlTypeFromRegistryType } = await import('@/lib/registry');
  const items = getRegistryItems();
  return items.map((item) => ({
    type: getUrlTypeFromRegistryType(item.type),
    name: item.name,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  const item = getRegistryItem(name);

  if (!item) {
    return {};
  }

  return {
    title: `${item.title} - ${siteConfig.name}`,
    description: item.description,
  };
}

/**
 * Convert kebab-case to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Dynamically import a documentation component
 */
async function getDocComponent(name: string, type: string): Promise<DocComponent | null> {
  // Check if documentation exists
  if (!hasDocumentation(name, type)) {
    return null;
  }

  try {
    const urlType = getUrlTypeFromRegistryType(type);
    const module = await import(`@/docs/content/${urlType}/${name}`);

    // Try common export name patterns:
    // 1. PascalCase + "Doc" (e.g., CodeblockDoc, UseMountedDoc)
    // 2. default export
    const pascalName = toPascalCase(name);
    const Component = module[`${pascalName}Doc`] || module.default;

    if (!Component) {
      console.warn(`No valid export found in docs/content/${urlType}/${name}.tsx`);
      return null;
    }

    return Component as DocComponent;
  } catch (error) {
    console.error(`Failed to load doc component for ${name}:`, error);
    return null;
  }
}

export default async function DocPage({ params }: PageProps) {
  const { name } = await params;
  const item = getRegistryItem(name);

  if (!item) {
    notFound();
  }

  // Try to load the documentation component dynamically
  let ContentComponent: DocComponent | null = null;

  if (hasDocumentation(name, item.type)) {
    ContentComponent = await getDocComponent(name, item.type);
  }

  // Fallback to Coming Soon if no documentation component found
  if (!ContentComponent) {
    ContentComponent = ComingSoonDoc;
  }

  // Get source code for the component
  const sourceCode = item.files[0] ? getComponentSource(item.files[0].path) : '';

  return (
    <div className="flex gap-6">
      <article className="flex-1 min-w-0">
        <div className="space-y-10">
          <PageHeader
            title={item.title}
            description={item.description}
          />

          <InstallationSection
            name={item.name}
            dependencies={item.dependencies}
            registryDependencies={item.registryDependencies}
          />

          <ContentComponent sourceCode={sourceCode} />
        </div>
      </article>

      <TableOfContents items={defaultTocItems} />
    </div>
  );
}
