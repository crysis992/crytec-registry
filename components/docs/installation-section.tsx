import { CodeBlock } from "./code-block";

interface InstallationSectionProps {
  name: string;
  dependencies?: string[];
  registryDependencies?: string[];
}

export async function InstallationSection({
  name,
  dependencies,
  registryDependencies,
}: InstallationSectionProps) {
  const installCommand = `npx shadcn@latest add https://crytec-registry.vercel.app/r/${name}.json`;

  return (
    <div className="space-y-6">
      <div>
        <h2 id="installation" className="text-2xl font-semibold mb-4">
          Installation
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">CLI</h3>
            <CodeBlock code={installCommand} language="bash" />
          </div>

          {dependencies && dependencies.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Dependencies</h3>
              <p className="text-sm text-[var(--muted-foreground)] mb-2">
                This component requires the following npm packages:
              </p>
              <CodeBlock
                code={`npm install ${dependencies.join(" ")}`}
                language="bash"
              />
            </div>
          )}

          {registryDependencies && registryDependencies.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Registry Dependencies</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                This component also requires:{" "}
                {registryDependencies.map((dep, i) => (
                  <span key={dep}>
                    <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">
                      {dep}
                    </code>
                    {i < registryDependencies.length - 1 && ", "}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
