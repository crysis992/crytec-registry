'use client';

import { useEffect } from 'react';
import { Button } from '@/registry/new-york/ui/shadcn/button';

// biome-ignore lint/suspicious/noShadowRestrictedNames: Next.js requires Error component name for error boundaries
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Something went wrong</h1>
      <p className="text-[var(--muted-foreground)]">An error occurred</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
