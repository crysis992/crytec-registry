import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageHeader } from "@/components/docs/page-header";
import { InstallationSection } from "@/components/docs/installation-section";
import { TableOfContents, defaultTocItems } from "@/components/docs/toc";
import { getRegistryItem, getAllDocParams, getComponentSource } from "@/lib/registry";
import { siteConfig } from "@/config/site";

// Content imports
import { ButtonDoc } from "@/content/docs/ui/button";
import { CardDoc } from "@/content/docs/ui/card";
import { InputDoc } from "@/content/docs/ui/input";
import { LabelDoc } from "@/content/docs/ui/label";
import { TextareaDoc } from "@/content/docs/ui/textarea";
import { UseMountedDoc } from "@/content/docs/hooks/use-mounted";
import { UtilsDoc } from "@/content/docs/lib/utils";
import { ExampleFormDoc } from "@/content/docs/blocks/example-form";

// Map of content components
const contentMap: Record<string, React.ComponentType<{ sourceCode: string }>> = {
  button: ButtonDoc,
  card: CardDoc,
  input: InputDoc,
  label: LabelDoc,
  textarea: TextareaDoc,
  "use-mounted": UseMountedDoc,
  utils: UtilsDoc,
  "example-form": ExampleFormDoc,
};

interface PageProps {
  params: Promise<{
    type: string;
    name: string;
  }>;
}

export async function generateStaticParams() {
  return getAllDocParams();
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

export default async function DocPage({ params }: PageProps) {
  const { name } = await params;
  const item = getRegistryItem(name);

  if (!item) {
    notFound();
  }

  const ContentComponent = contentMap[name];

  if (!ContentComponent) {
    notFound();
  }

  // Get source code for the component
  const sourceCode = item.files[0]
    ? getComponentSource(item.files[0].path)
    : "";

  return (
    <div className="flex gap-6">
      <article className="flex-1 min-w-0">
        <div className="space-y-10">
          <PageHeader title={item.title} description={item.description} />

          <ContentComponent sourceCode={sourceCode} />

          <InstallationSection
            name={item.name}
            dependencies={item.dependencies}
            registryDependencies={item.registryDependencies}
          />
        </div>
      </article>

      <TableOfContents items={defaultTocItems} />
    </div>
  );
}
