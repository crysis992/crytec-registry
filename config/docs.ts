import type { NavSection } from "@/types/docs";

export const docsConfig: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Button", href: "/docs/ui/button" },
      { title: "Card", href: "/docs/ui/card" },
      { title: "Input", href: "/docs/ui/input" },
      { title: "Label", href: "/docs/ui/label" },
      { title: "Textarea", href: "/docs/ui/textarea" },
    ],
  },
  {
    title: "Hooks",
    items: [
      { title: "useMounted", href: "/docs/hooks/use-mounted" },
    ],
  },
  {
    title: "Library",
    items: [
      { title: "Utils", href: "/docs/lib/utils" },
    ],
  },
  {
    title: "Blocks",
    items: [
      { title: "Example Form", href: "/docs/blocks/example-form" },
    ],
  },
];

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
