import type { ReactNode } from "react";

export interface PropDefinition {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  required?: boolean;
}

export interface DocSection {
  id: string;
  title: string;
}

export interface ComponentExample {
  title: string;
  description?: string;
  component: ReactNode;
  code: string;
}

export interface ComponentDoc {
  name: string;
  title: string;
  description: string;
  type: "ui" | "hooks" | "lib" | "blocks";
  dependencies?: string[];
  registryDependencies?: string[];
  props?: PropDefinition[];
  examples: ComponentExample[];
}

export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  label?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export type RegistryType = "registry:ui" | "registry:hook" | "registry:lib" | "registry:block";

export interface RegistryItem {
  name: string;
  type: RegistryType;
  title: string;
  description: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: { path: string; type: string }[];
}

export interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

/**
 * Props that all documentation components must accept
 */
export interface DocComponentProps {
  sourceCode: string;
}

/**
 * Type for documentation components
 */
export type DocComponent = React.ComponentType<DocComponentProps>;
