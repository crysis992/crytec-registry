import type { NavSection } from "@/docs/types";

export const docsConfig: NavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/" },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Button", href: "/ui/button" },
      { title: "Card", href: "/ui/card" },
      { title: "Codeblock", href: "/ui/codeblock" },
      { title: "Input", href: "/ui/input" },
      { title: "Label", href: "/ui/label" },
      { title: "Textarea", href: "/ui/textarea" },
    ],
  },
  {
    title: "Hooks",
    items: [
      { title: "useMounted", href: "/hooks/use-mounted" },
    ],
  },
  {
    title: "Library",
    items: [
      { title: "Utils", href: "/lib/utils" },
    ],
  },
  {
    title: "Blocks",
    items: [
      { title: "Example Form", href: "/blocks/example-form" },
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
