"use client"

import { PreviewTabs, ComponentPreview } from "@/docs/components/component-preview";
import { SimpleCodeblock } from "@/docs/components/simple-codeblock";
import { PropsTable } from "@/docs/components/props-table";
import type { PropDefinition } from "@/docs/types";

const cnParams: PropDefinition[] = [
  {
    name: "inputs",
    type: "ClassValue[]",
    description: "Class values to merge (strings, objects, arrays, or conditionals).",
    required: true,
  },
];

const formatDateParams: PropDefinition[] = [
  {
    name: "date",
    type: "Date",
    description: "The date to format.",
    required: true,
  },
  {
    name: "style",
    type: '"long" | "short"',
    defaultValue: '"long"',
    description: "The date format style.",
  },
];

const sleepParams: PropDefinition[] = [
  {
    name: "ms",
    type: "number",
    description: "Milliseconds to delay.",
    required: true,
  },
];

const cnCode = `import { cn } from "@/lib/utils"

// Merge classes
cn("px-2 py-1", "px-4")
// Result: "py-1 px-4" (px-4 wins over px-2)

// Conditional classes
cn("base-class", isActive && "active-class")

// Object syntax
cn({ "bg-red-500": hasError, "bg-green-500": !hasError })`;

const formatDateCode = `import { formatDate } from "@/lib/utils"

// Long format (default)
formatDate(new Date())
// Result: "December 26, 2024"

// Short format
formatDate(new Date(), "short")
// Result: "12/26/24"`;

const sleepCode = `import { sleep } from "@/lib/utils"

async function fetchWithDelay() {
  await sleep(1000) // Wait 1 second
  const data = await fetch('/api/data')
  return data
}`;

interface UtilsDocProps {
  sourceCode: string;
}

export function UtilsDoc({ sourceCode }: UtilsDocProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2 id="usage" className="text-2xl font-semibold mb-4">
          Usage
        </h2>
        <p className="text-[var(--muted-foreground)] mb-4">
          The utils library provides essential utility functions for your components.
          These functions are used throughout the registry components.
        </p>
      </section>

      <section>
        <h2 id="examples" className="text-2xl font-semibold mb-4">
          Examples
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-3">cn() - Class Name Utility</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Combines class names with Tailwind CSS conflict resolution. Uses{" "}
              <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">clsx</code> for
              conditional classes and{" "}
              <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">tailwind-merge</code>{" "}
              to resolve conflicting Tailwind classes.
            </p>
            <SimpleCodeblock code={cnCode} />
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Parameters</h4>
              <PropsTable props={cnParams} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">formatDate() - Date Formatting</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Formats a Date object to a localized string using Intl.DateTimeFormat.
            </p>
            <SimpleCodeblock code={formatDateCode} />
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Parameters</h4>
              <PropsTable props={formatDateParams} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">sleep() - Promise Delay</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Returns a promise that resolves after the specified milliseconds.
              Useful for delays in async functions.
            </p>
            <SimpleCodeblock code={sleepCode} />
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Parameters</h4>
              <PropsTable props={sleepParams} />
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 id="api-reference" className="text-2xl font-semibold mb-4">
          API Reference
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">
              <code className="bg-[var(--muted)] px-2 py-1 rounded">cn(...inputs)</code>
            </h3>
            <p className="text-[var(--muted-foreground)]">
              Returns a string of merged class names with Tailwind conflict resolution.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">
              <code className="bg-[var(--muted)] px-2 py-1 rounded">formatDate(date, style?)</code>
            </h3>
            <p className="text-[var(--muted-foreground)]">
              Returns a formatted date string.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">
              <code className="bg-[var(--muted)] px-2 py-1 rounded">sleep(ms)</code>
            </h3>
            <p className="text-[var(--muted-foreground)]">
              Returns a Promise that resolves after the specified delay.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 id="source" className="text-2xl font-semibold mb-4">
          Source Code
        </h2>
        <SimpleCodeblock code={sourceCode} filename="utils.ts" language="typescript" />
      </section>
    </div>
  );
}
