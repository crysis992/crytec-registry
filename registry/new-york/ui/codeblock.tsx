'use client';

import { Check, ChevronDown, Copy } from 'lucide-react';
import * as React from 'react';
import type { BundledLanguage, BundledTheme, ShikiTransformer } from 'shiki';

import { cn } from '@/lib/utils';

/* -----------------------------------------------------------------------------
 * Types
 * -------------------------------------------------------------------------- */

interface CodeBlockData {
  value: string;
  filename?: string;
  code: string;
  language?: string;
}

interface CodeBlockTheme {
  light: BundledTheme;
  dark: BundledTheme;
}

interface CodeBlockContextValue {
  items: CodeBlockData[];
  activeValue: string;
  setActiveValue: (value: string) => void;
  highlightedCode: Map<string, string>;
  isLoading: boolean;
  showLineNumbers: boolean;
  theme: CodeBlockTheme;
  copyCode: () => Promise<void>;
  hasCopied: boolean;
}

/* -----------------------------------------------------------------------------
 * Context
 * -------------------------------------------------------------------------- */

const CodeBlockContext = React.createContext<CodeBlockContextValue | null>(null);

function useCodeBlock() {
  const context = React.useContext(CodeBlockContext);
  if (!context) {
    throw new Error('useCodeBlock must be used within a CodeBlock');
  }
  return context;
}

/* -----------------------------------------------------------------------------
 * CodeBlock (Root)
 * -------------------------------------------------------------------------- */

interface CodeBlockProps {
  data: CodeBlockData[];
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
  showLineNumbers?: boolean;
  theme?: CodeBlockTheme;
}

function CodeBlock({
  data,
  defaultValue,
  children,
  className,
  showLineNumbers = false,
  theme = { light: 'github-light', dark: 'github-dark' },
}: CodeBlockProps) {
  const [activeValue, setActiveValue] = React.useState(defaultValue ?? data[0]?.value ?? '');
  const [highlightedCode, setHighlightedCode] = React.useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasCopied, setHasCopied] = React.useState(false);

  // Keep activeValue valid when data changes
  React.useEffect(() => {
    if (!activeValue) {
      setActiveValue(defaultValue ?? data[0]?.value ?? '');
      return;
    }
    const stillExists = data.some((d) => d.value === activeValue);
    if (!stillExists) {
      setActiveValue(defaultValue ?? data[0]?.value ?? '');
    }
  }, [activeValue, data, defaultValue]);

  const highlightItem = React.useCallback(
    async (item: CodeBlockData): Promise<string> => {
      const { codeToHtml } = await import('shiki');

      const code = item.code.trim();
      const lang = (item.language ?? item.value) as BundledLanguage;

      const transformers: ShikiTransformer[] = [
        {
          line(node, line) {
            if (showLineNumbers) {
              // Shiki's hast nodes expose `properties`
              (node as unknown as { properties: Record<string, unknown> }).properties['data-line'] = line;
            }
          },
        },
      ];

      const baseOptions = {
        themes: { light: theme.light, dark: theme.dark },
        transformers,
      };

      try {
        return await codeToHtml(code, {
          lang,
          ...baseOptions,
        });
      } catch {
        return await codeToHtml(code, {
          lang: 'plaintext' as BundledLanguage,
          ...baseOptions,
        });
      }
    },
    [showLineNumbers, theme.dark, theme.light],
  );

  // Clear cache when data/theme changes, then highlight active item first.
  React.useEffect(() => {
    let cancelled = false;

    setHighlightedCode(new Map());

    const activeItem = data.find((d) => d.value === activeValue) ?? data[0];
    if (!activeItem) return;

    setIsLoading(true);

    (async () => {
      try {
        const html = await highlightItem(activeItem);
        if (cancelled) return;
        setHighlightedCode(new Map([[activeItem.value, html]]));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeValue, data, highlightItem]);

  // Lazy-highlight other items in idle time after the active item is ready.
  React.useEffect(() => {
    if (isLoading) return;
    if (data.length <= 1) return;
    if (!highlightedCode.get(activeValue)) return;

    let cancelled = false;
    const remaining = data.filter((d) => !highlightedCode.has(d.value));
    if (remaining.length === 0) return;

    const run = () => {
      (async () => {
        const next = new Map(highlightedCode);
        for (const item of remaining) {
          if (cancelled) return;
          try {
            const html = await highlightItem(item);
            next.set(item.value, html);
          } catch {
            // ignore individual failures; active item already rendered
          }
        }
        if (!cancelled) setHighlightedCode(next);
      })();
    };

    // Prefer requestIdleCallback, fallback to setTimeout
    const ric = (globalThis as unknown as { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback;
    const cancelRic = (globalThis as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;

    const id = ric ? ric(run) : window.setTimeout(run, 50);

    return () => {
      cancelled = true;
      if (ric && cancelRic) cancelRic(id);
      if (!ric) window.clearTimeout(id);
    };
  }, [activeValue, data, highlightedCode, highlightItem, isLoading]);

  React.useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => setHasCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [hasCopied]);

  const copyCode = React.useCallback(async () => {
    const activeItem = data.find((item) => item.value === activeValue);
    if (activeItem) {
      const text = activeItem.code.trim();
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for environments without Clipboard API
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setHasCopied(true);
    }
  }, [data, activeValue]);

  const contextValue = React.useMemo(
    () => ({
      items: data,
      activeValue,
      setActiveValue,
      highlightedCode,
      isLoading,
      showLineNumbers,
      theme,
      copyCode,
      hasCopied,
    }),
    [data, activeValue, highlightedCode, isLoading, showLineNumbers, theme, copyCode, hasCopied],
  );

  return (
    <CodeBlockContext.Provider value={contextValue}>
      <div
        data-slot="codeblock"
        className={cn('rounded-lg border bg-[var(--muted)] overflow-hidden', className)}
      >
        {children}
      </div>
    </CodeBlockContext.Provider>
  );
}

/* -----------------------------------------------------------------------------
 * CodeBlockHeader
 * -------------------------------------------------------------------------- */

interface CodeBlockHeaderProps extends React.ComponentProps<'div'> {}

function CodeBlockHeader({ className, children, ...props }: CodeBlockHeaderProps) {
  return (
    <div
      data-slot="codeblock-header"
      className={cn('flex items-center justify-between border-b px-4 py-2', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * CodeBlockFiles
 * -------------------------------------------------------------------------- */

interface CodeBlockFilesProps {
  children: (item: CodeBlockData) => React.ReactNode;
  className?: string;
}

function CodeBlockFiles({ children, className }: CodeBlockFilesProps) {
  const { items } = useCodeBlock();

  return (
    <div
      data-slot="codeblock-files"
      className={cn('flex items-center gap-1', className)}
    >
      {items.map((item) => children(item))}
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * CodeBlockFilename
 * -------------------------------------------------------------------------- */

interface CodeBlockFilenameProps extends React.ComponentProps<'button'> {
  value: string;
}

function CodeBlockFilename({ value, children, className, ...props }: CodeBlockFilenameProps) {
  const { activeValue, setActiveValue } = useCodeBlock();
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      data-slot="codeblock-filename"
      data-active={isActive}
      className={cn(
        'px-3 py-1 text-sm font-mono rounded-md transition-colors',
        isActive ? 'bg-[var(--background)] text-[var(--foreground)]' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
        className,
      )}
      onClick={() => setActiveValue(value)}
      {...props}
    >
      {children}
    </button>
  );
}

/* -----------------------------------------------------------------------------
 * CodeBlockSelect
 * -------------------------------------------------------------------------- */

const CodeBlockSelectContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

interface CodeBlockSelectProps {
  children: React.ReactNode;
}

function CodeBlockSelect({ children }: CodeBlockSelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <CodeBlockSelectContext.Provider value={{ open, setOpen }}>
      <div
        data-slot="codeblock-select"
        className="relative"
      >
        {children}
      </div>
    </CodeBlockSelectContext.Provider>
  );
}

/* -----------------------------------------------------------------------------
 * CodeBlockSelectTrigger
 * -------------------------------------------------------------------------- */

interface CodeBlockSelectTriggerProps extends React.ComponentProps<'button'> {}

function CodeBlockSelectTrigger({ className, children, ...props }: CodeBlockSelectTriggerProps) {
  const selectContext = React.useContext(CodeBlockSelectContext);

  return (
    <button
      type="button"
      data-slot="codeblock-select-trigger"
      className={cn(
        'flex items-center gap-2 px-3 py-1 text-sm font-mono rounded-md border bg-[var(--background)] transition-colors hover:bg-[var(--accent)]',
        className,
      )}
      onClick={() => selectContext?.setOpen((prev) => !prev)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4" />
    </button>
  );
}

/* -----------------------------------------------------------------------------
 * CodeBlockSelectValue
 * -------------------------------------------------------------------------- */

interface CodeBlockSelectValueProps {
  placeholder?: string;
}

function CodeBlockSelectValue({ placeholder }: CodeBlockSelectValueProps) {
  const { items, activeValue } = useCodeBlock();
  const activeItem = items.find((item) => item.value === activeValue);

  return <span data-slot="codeblock-select-value">{activeItem?.filename ?? activeItem?.value ?? placeholder ?? 'Select...'}</span>;
}

/* -----------------------------------------------------------------------------
 * CodeBlockSelectContent
 * -------------------------------------------------------------------------- */

interface CodeBlockSelectContentProps {
  children: (item: CodeBlockData) => React.ReactNode;
}

function CodeBlockSelectContent({ children }: CodeBlockSelectContentProps) {
  const selectContext = React.useContext(CodeBlockSelectContext);
  const { items } = useCodeBlock();

  if (!selectContext?.open) return null;

  return (
    <div
      data-slot="codeblock-select-content"
      className="absolute top-full left-0 mt-1 min-w-[150px] rounded-md border bg-[var(--background)] shadow-md z-50"
    >
      {items.map((item) => children(item))}
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * CodeBlockSelectItem
 * -------------------------------------------------------------------------- */

interface CodeBlockSelectItemProps extends React.ComponentProps<'button'> {
  value: string;
}

function CodeBlockSelectItem({ value, children, className, ...props }: CodeBlockSelectItemProps) {
  const { activeValue, setActiveValue } = useCodeBlock();
  const selectContext = React.useContext(CodeBlockSelectContext);
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      data-slot="codeblock-select-item"
      data-active={isActive}
      className={cn(
        'w-full px-3 py-2 text-sm text-left transition-colors hover:bg-[var(--accent)]',
        isActive && 'bg-[var(--accent)]',
        className,
      )}
      onClick={() => {
        setActiveValue(value);
        selectContext?.setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

/* -----------------------------------------------------------------------------
 * CodeBlockCopyButton
 * -------------------------------------------------------------------------- */

interface CodeBlockCopyButtonProps extends React.ComponentProps<'button'> {
  onCopy?: () => void;
  onError?: (error: unknown) => void;
}

function CodeBlockCopyButton({ onCopy, onError, className, ...props }: CodeBlockCopyButtonProps) {
  const { copyCode, hasCopied } = useCodeBlock();

  const handleCopy = async () => {
    try {
      await copyCode();
      onCopy?.();
    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <button
      type="button"
      data-slot="codeblock-copy"
      className={cn(
        'h-8 w-8 inline-flex items-center justify-center rounded-md border bg-[var(--background)] transition-all hover:bg-[var(--accent)] focus:outline-none',
        className,
      )}
      onClick={handleCopy}
      aria-label="Copy code"
      {...props}
    >
      {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
    </button>
  );
}

/* -----------------------------------------------------------------------------
 * CodeBlockBody
 * -------------------------------------------------------------------------- */

interface CodeBlockBodyProps {
  children: (item: CodeBlockData) => React.ReactNode;
  className?: string;
}

function CodeBlockBody({ children, className }: CodeBlockBodyProps) {
  const { items } = useCodeBlock();

  return (
    <div
      data-slot="codeblock-body"
      className={className}
    >
      {items.map((item) => children(item))}
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * CodeBlockItem
 * -------------------------------------------------------------------------- */

interface CodeBlockItemProps extends React.ComponentProps<'div'> {
  value: string;
}

function CodeBlockItem({ value, children, className, ...props }: CodeBlockItemProps) {
  const { activeValue } = useCodeBlock();

  if (activeValue !== value) return null;

  return (
    <div
      data-slot="codeblock-item"
      className={cn('relative', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * CodeBlockContent
 * -------------------------------------------------------------------------- */

interface CodeBlockContentProps extends React.ComponentProps<'div'> {
  showLineNumbers?: boolean;
}

function CodeBlockContent({ showLineNumbers: propShowLineNumbers, className, ...props }: CodeBlockContentProps) {
  const { highlightedCode, isLoading, showLineNumbers: contextShowLineNumbers, activeValue } = useCodeBlock();

  const showLines = propShowLineNumbers ?? contextShowLineNumbers;
  const html = highlightedCode.get(activeValue) ?? '';

  if (isLoading) {
    return (
      <div
        data-slot="codeblock-content"
        className={cn('p-4 text-sm text-[var(--muted-foreground)]', className)}
      >
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div
      data-slot="codeblock-content"
      className={cn(
        'overflow-x-auto text-sm p-4',
        showLines && 'codeblock-line-numbers',
        '[&_pre]:!bg-transparent [&_pre]:!p-0 [&_code]:!bg-transparent',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------
 * CodeBlockFooter
 * -------------------------------------------------------------------------- */

interface CodeBlockFooterProps extends React.ComponentProps<'div'> {}

function CodeBlockFooter({ className, children, ...props }: CodeBlockFooterProps) {
  return (
    <div
      data-slot="codeblock-footer"
      className={cn('border-t px-4 py-2 text-sm text-[var(--muted-foreground)]', className)}
      {...props}
    >
      {children}
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * Exports
 * -------------------------------------------------------------------------- */

export {
  // Compound components
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockItem,
  CodeBlockSelect,
  CodeBlockSelectContent,
  CodeBlockSelectItem,
  CodeBlockSelectTrigger,
  CodeBlockSelectValue,
  // Types
  type CodeBlockData,
  type CodeBlockTheme,
};
