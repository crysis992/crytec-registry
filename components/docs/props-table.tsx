import type { PropDefinition } from "@/types/docs";
import { cn } from "@/lib/utils";

interface PropsTableProps {
  props: PropDefinition[];
  className?: string;
}

export function PropsTable({ props, className }: PropsTableProps) {
  if (props.length === 0) {
    return null;
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-3 pr-4 text-left font-medium">Prop</th>
            <th className="py-3 pr-4 text-left font-medium">Type</th>
            <th className="py-3 pr-4 text-left font-medium">Default</th>
            <th className="py-3 text-left font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-b">
              <td className="py-3 pr-4">
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm font-medium">
                  {prop.name}
                  {prop.required && <span className="text-red-500">*</span>}
                </code>
              </td>
              <td className="py-3 pr-4">
                <code className="text-[var(--muted-foreground)]">{prop.type}</code>
              </td>
              <td className="py-3 pr-4 text-[var(--muted-foreground)]">
                {prop.defaultValue ? (
                  <code className="text-sm">{prop.defaultValue}</code>
                ) : (
                  "-"
                )}
              </td>
              <td className="py-3 text-[var(--muted-foreground)]">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
