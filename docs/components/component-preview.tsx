'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ComponentPreviewProps {
  children: React.ReactNode;
  className?: string;
}

export function ComponentPreview({ children, className }: ComponentPreviewProps) {
  return (
    <div className={cn('flex min-h-[200px] w-full items-center justify-center rounded-lg border bg-[var(--background)] p-10', className)}>
      {children}
    </div>
  );
}

interface PreviewTabsProps {
  preview: React.ReactNode;
  codeBlock: React.ReactNode;
}

export function PreviewTabs({ preview, codeBlock }: PreviewTabsProps) {
  const [activeTab, setActiveTab] = React.useState<'preview' | 'code'>('preview');

  return (
    <div className="space-y-0">
      <div className="flex border-b">
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'preview'
              ? 'border-b-2 border-[var(--primary)] text-[var(--foreground)]'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
          )}
        >
          Preview
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('code')}
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors',
            activeTab === 'code'
              ? 'border-b-2 border-[var(--primary)] text-[var(--foreground)]'
              : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
          )}
        >
          Code
        </button>
      </div>
      <div className="mt-0">
        {activeTab === 'preview' ? (
          <ComponentPreview>{preview}</ComponentPreview>
        ) : (
          <div className="[&>div]:rounded-t-none [&>div]:border-t-0">{codeBlock}</div>
        )}
      </div>
    </div>
  );
}
