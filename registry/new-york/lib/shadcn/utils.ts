import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind CSS conflict resolution.
 *
 * @example
 * ```tsx
 * cn("px-2 py-1", "px-4") // returns "py-1 px-4"
 * cn("bg-red-500", condition && "bg-blue-500") // conditional classes
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date to a localized string.
 *
 * @example
 * ```tsx
 * formatDate(new Date()) // "December 26, 2024"
 * formatDate(new Date(), "short") // "12/26/24"
 * ```
 */
export function formatDate(
  date: Date,
  style: "long" | "short" = "long"
): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: style,
  }).format(date);
}

/**
 * Delays execution for a specified number of milliseconds.
 *
 * @example
 * ```tsx
 * await sleep(1000); // wait 1 second
 * ```
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function normalizeProjectIconName(name: string | null | undefined): string | null {
  if (!name) return null;

  // lucide-react dynamic icon names are kebab-case
  if (name.includes('-')) {
    return name.toLowerCase();
  }

  // Support legacy stored PascalCase icon names (e.g. FolderKanban)
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

export function formatProjectIconLabel(name: string): string {
  const normalized = normalizeProjectIconName(name) ?? '';
  if (!normalized) return '';

  return normalized
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
} 