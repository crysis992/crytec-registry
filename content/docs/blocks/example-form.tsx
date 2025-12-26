import ExampleForm from "@/registry/new-york/blocks/example-form/page";
import { PreviewTabs, ComponentPreview } from "@/components/docs/component-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { PropsTable } from "@/components/docs/props-table";
import type { PropDefinition } from "@/types/docs";

const formFields: PropDefinition[] = [
  {
    name: "name",
    type: "string",
    description: "User's name. Minimum 2 characters.",
    required: true,
  },
  {
    name: "email",
    type: "string",
    description: "User's email address. Must be a valid email format.",
    required: true,
  },
  {
    name: "message",
    type: "string",
    description: "Message content. Minimum 10 characters.",
    required: true,
  },
];

const usageCode = `import ExampleForm from "@/blocks/example-form/page"

export function MyPage() {
  return <ExampleForm />
}`;

const schemaCode = `import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})`;

const hookFormCode = `import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
} = useForm<FormData>({
  resolver: zodResolver(formSchema),
})

const onSubmit = async (data: FormData) => {
  // Handle form submission
  console.log("Form submitted:", data)
}`;

interface ExampleFormDocProps {
  sourceCode: string;
}

export function ExampleFormDoc({ sourceCode }: ExampleFormDocProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2 id="usage" className="text-2xl font-semibold mb-4">
          Usage
        </h2>
        <p className="text-[var(--muted-foreground)] mb-4">
          A complete contact form block featuring Zod validation, React Hook Form
          integration, error handling, loading states, and success feedback.
        </p>
        <PreviewTabs
          preview={<ExampleForm />}
          codeBlock={<CodeBlock code={usageCode} />}
        />
      </section>

      <section>
        <h2 id="examples" className="text-2xl font-semibold mb-4">
          Examples
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-3">Validation Schema</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              The form uses Zod for runtime validation with clear error messages.
            </p>
            <CodeBlock code={schemaCode} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">React Hook Form Setup</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Integrates React Hook Form with Zod resolver for seamless validation.
            </p>
            <CodeBlock code={hookFormCode} />
          </div>
        </div>
      </section>

      <section>
        <h2 id="api-reference" className="text-2xl font-semibold mb-4">
          API Reference
        </h2>
        <h3 className="text-lg font-medium mb-3">Form Fields</h3>
        <PropsTable props={formFields} />

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Features</h3>
          <ul className="list-disc list-inside space-y-2 text-[var(--muted-foreground)]">
            <li>Zod schema validation with custom error messages</li>
            <li>React Hook Form for efficient form state management</li>
            <li>Loading state during form submission</li>
            <li>Success state with option to send another message</li>
            <li>Accessible form elements with proper labels</li>
            <li>Responsive design using Card components</li>
          </ul>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Dependencies</h3>
          <ul className="list-disc list-inside space-y-2 text-[var(--muted-foreground)]">
            <li>
              <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">zod</code> - Runtime validation
            </li>
            <li>
              <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">react-hook-form</code> - Form state management
            </li>
            <li>
              <code className="bg-[var(--muted)] px-1.5 py-0.5 rounded">@hookform/resolvers</code> - Zod resolver
            </li>
          </ul>
        </div>
      </section>

      <section>
        <h2 id="source" className="text-2xl font-semibold mb-4">
          Source Code
        </h2>
        <CodeBlock code={sourceCode} filename="example-form/page.tsx" />
      </section>
    </div>
  );
}
