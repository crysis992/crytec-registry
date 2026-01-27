'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useMounted } from '@/registry/new-york/hooks/use-mounted';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>('');
  const mounted = useMounted();

  React.useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' },
    );

    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items, mounted]);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 pl-4">
        <p className="mb-4 text-sm font-medium">On this page</p>
        <nav>
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  suppressHydrationWarning
                  className={cn(
                    'block transition-colors',
                    item.level === 3 && 'pl-4',
                    mounted && activeId === item.id
                      ? 'text-[var(--foreground)] font-medium'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
                  )}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export const defaultTocItems: TocItem[] = [
  { id: 'installation', title: 'Installation', level: 2 },
  { id: 'usage', title: 'Usage', level: 2 },
  { id: 'examples', title: 'Examples', level: 2 },
  { id: 'api-reference', title: 'API Reference', level: 2 },
  { id: 'source', title: 'Source Code', level: 2 },
];
