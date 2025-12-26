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
