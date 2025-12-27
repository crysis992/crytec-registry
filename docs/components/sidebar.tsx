'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavSection } from '@/docs/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  docsConfig: NavSection[];
}

export function Sidebar({ docsConfig }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 pr-4">
        <SidebarContent
          pathname={pathname}
          docsConfig={docsConfig}
        />
      </div>
    </aside>
  );
}

interface SidebarContentProps {
  pathname: string;
  docsConfig: NavSection[];
}

function SidebarContent({ pathname, docsConfig }: SidebarContentProps) {
  return (
    <nav className="space-y-6">
      {docsConfig.map((section) => (
        <div key={section.title}>
          <h4 className="mb-2 text-sm font-semibold text-[var(--foreground)]">{section.title}</h4>
          <ul className="space-y-1">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'block rounded-md px-3 py-2 text-sm transition-colors',
                    pathname === item.href
                      ? 'bg-[var(--muted)] font-medium text-[var(--foreground)]'
                      : 'text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]',
                  )}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
