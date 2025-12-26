import Link from "next/link";
import { Button } from "@/registry/new-york/ui/button";

export default function DocsNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-[var(--muted-foreground)]">Documentation page not found</p>
      <Link href="/docs">
        <Button>Back to Docs</Button>
      </Link>
    </div>
  );
}
