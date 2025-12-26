import * as React from "react";

/**
 * A hook that returns true if the component has mounted.
 * Useful for avoiding hydration mismatches in SSR.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const mounted = useMounted();
 *
 *   if (!mounted) {
 *     return <Skeleton />;
 *   }
 *
 *   return <ClientOnlyContent />;
 * }
 * ```
 */
export function useMounted() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
