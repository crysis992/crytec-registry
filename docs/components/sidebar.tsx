"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsConfig } from "@/docs/nav";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto py-6 pr-4">
        <SidebarContent pathname={pathname} />
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
      >
        <Menu className="h-5 w-5" />
        Menu
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-[var(--background)] p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold">Navigation</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 hover:bg-[var(--muted)]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent pathname={pathname} />
          </div>
        </>
      )}
    </div>
  );
}

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-6">
      {docsConfig.map((section) => (
        <div key={section.title}>
          <h4 className="mb-2 text-sm font-semibold text-[var(--foreground)]">
            {section.title}
          </h4>
          <ul className="space-y-1">
            {section.items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm transition-colors",
                    pathname === item.href
                      ? "bg-[var(--muted)] font-medium text-[var(--foreground)]"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
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
