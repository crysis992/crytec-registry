import fs from "fs";
import path from "path";
import type { Registry, RegistryItem } from "@/docs/types";
import { siteConfig } from "@/site";

let registryCache: Registry | null = null;

const DOC_ITEM_NAMES = new Set<string>(["codeblock", "use-mounted", "example-form"]);

export function getRegistry(): Registry {
  if (registryCache) {
    return registryCache;
  }

  const registryPath = path.join(process.cwd(), "registry.json");
  const content = fs.readFileSync(registryPath, "utf-8");
  registryCache = JSON.parse(content) as Registry;
  return registryCache;
}

export function getRegistryItems(): RegistryItem[] {
  return getRegistry().items;
}

export function getRegistryItem(name: string): RegistryItem | undefined {
  return getRegistryItems().find((item) => item.name === name);
}

export function getRegistryItemsByType(type: string): RegistryItem[] {
  const registryType = getRegistryTypeFromUrlType(type);
  return getRegistryItems().filter((item) => item.type === registryType);
}

export function getRegistryTypeFromUrlType(urlType: string): string {
  const mapping: Record<string, string> = {
    ui: "registry:ui",
    hooks: "registry:hook",
    lib: "registry:lib",
    blocks: "registry:block",
  };
  return mapping[urlType] || "registry:ui";
}

export function getUrlTypeFromRegistryType(registryType: string): string {
  const mapping: Record<string, string> = {
    "registry:ui": "ui",
    "registry:hook": "hooks",
    "registry:lib": "lib",
    "registry:block": "blocks",
  };
  return mapping[registryType] || "ui";
}

export function getInstallCommand(name: string): string {
  return `npx shadcn@latest add ${siteConfig.url}/r/${name}.json`;
}

export function getComponentSource(filePath: string): string {
  const fullPath = path.join(process.cwd(), filePath);
  try {
    return fs.readFileSync(fullPath, "utf-8");
  } catch {
    return `// Source file not found: ${filePath}`;
  }
}

export function getAllDocParams(): { type: string; name: string }[] {
  const items = getRegistryItems();
  return items
    .filter((item) => DOC_ITEM_NAMES.has(item.name))
    .map((item) => ({
    type: getUrlTypeFromRegistryType(item.type),
    name: item.name,
  }));
}
