import Link from 'next/link';
import { Sidebar } from '@/docs/components/sidebar';
import { getDocsConfig } from '@/docs/nav';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const docsConfig = getDocsConfig();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-[var(--background)]">
        <div className="container mx-auto flex h-16 items-center px-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-semibold"
            >
              Crytec Registry
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link
                href="/"
                className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                Documentation
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="flex gap-6">
          <Sidebar docsConfig={docsConfig} />
          <main className="flex-1 py-6 lg:py-8 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
