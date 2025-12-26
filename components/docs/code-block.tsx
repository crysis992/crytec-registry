import { highlightCode } from "@/lib/highlighter";
import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";
import type { BundledLanguage } from "shiki";

interface CodeBlockProps {
  code: string;
  language?: BundledLanguage;
  filename?: string;
  className?: string;
  showCopy?: boolean;
}

export async function CodeBlock({
  code,
  language = "tsx",
  filename,
  className,
  showCopy = true,
}: CodeBlockProps) {
  const html = await highlightCode(code.trim(), language);

  return (
    <div className={cn("relative rounded-lg border bg-[var(--muted)]", className)}>
      {filename && (
        <div className="border-b px-4 py-2 text-sm text-[var(--muted-foreground)]">
          {filename}
        </div>
      )}
      <div className="relative">
        {showCopy && (
          <div className="absolute right-3 top-3">
            <CopyButton value={code.trim()} />
          </div>
        )}
        <div
          className="overflow-x-auto p-4 text-sm [&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
