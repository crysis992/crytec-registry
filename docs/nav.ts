import type { NavSection, NavItem } from "@/docs/types";
import {
  getRegistryItems,
  getUrlTypeFromRegistryType,
  hasDocumentation,
} from "@/lib/registry";

/**
 * Generate navigation sections from registry items
 * This function must be called from a server component
 */
export function getDocsConfig(): NavSection[] {
  const items = getRegistryItems();
  
  // Group items by type
  const itemsByType = items.reduce(
    (acc, item) => {
      const urlType = getUrlTypeFromRegistryType(item.type);
      if (!acc[urlType]) {
        acc[urlType] = [];
      }
      acc[urlType].push(item);
      return acc;
    },
    {} as Record<string, typeof items>
  );

  // Create navigation sections
  const sections: NavSection[] = [
    {
      title: "Getting Started",
      items: [{ title: "Introduction", href: "/" }],
    },
  ];

  // Add sections for each type
  const typeLabels: Record<string, string> = {
    ui: "Components",
    hooks: "Hooks",
    lib: "Library",
    blocks: "Blocks",
  };

  // Order: ui, hooks, lib, blocks
  const typeOrder = ["ui", "hooks", "lib", "blocks"];

  for (const type of typeOrder) {
    const typeItems = itemsByType[type] || [];
    if (typeItems.length === 0) continue;

    // Only include items that have documentation
    const navItems: NavItem[] = typeItems
      .filter((item) => hasDocumentation(item.name, item.type))
      .map((item) => ({
        title: item.title,
        href: `/${type}/${item.name}`,
      }))
      .sort((a, b) => a.title.localeCompare(b.title));

    if (navItems.length > 0) {
      sections.push({
        title: typeLabels[type] || type,
        items: navItems,
      });
    }
  }

  return sections;
}

export function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    ui: "Components",
    hooks: "Hooks",
    lib: "Library",
    blocks: "Blocks",
  };
  return labels[type] || type;
}

export function getRegistryTypeFromUrl(urlType: string): string {
  const mapping: Record<string, string> = {
    ui: "registry:ui",
    hooks: "registry:hook",
    lib: "registry:lib",
    blocks: "registry:block",
  };
  return mapping[urlType] || "registry:ui";
}

export function getUrlTypeFromRegistry(registryType: string): string {
  const mapping: Record<string, string> = {
    "registry:ui": "ui",
    "registry:hook": "hooks",
    "registry:lib": "lib",
    "registry:block": "blocks",
  };
  return mapping[registryType] || "ui";
}
