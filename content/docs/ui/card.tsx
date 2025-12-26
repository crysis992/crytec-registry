"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/registry/new-york/ui/card";
import { Button } from "@/registry/new-york/ui/button";
import { PreviewTabs, ComponentPreview } from "@/components/docs/component-preview";
import { SimpleCodeblock } from "@/components/docs/simple-codeblock";
import { PropsTable } from "@/components/docs/props-table";
import type { PropDefinition } from "@/types/docs";

const cardProps: PropDefinition[] = [
  {
    name: "className",
    type: "string",
    description: "Additional CSS classes to apply to the card.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    description: "The content of the card.",
    required: true,
  },
];

function CardDemo() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content area for your main content.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  );
}

function CardBasic() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            <span className="text-sm">New comment on your post</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
            <span className="text-sm">Someone mentioned you</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm">
          Mark all read
        </Button>
        <Button size="sm">View all</Button>
      </CardFooter>
    </Card>
  );
}

const usageCode = `import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content area for your main content.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  )
}`;

const notificationCode = `<Card>
  <CardHeader>
    <CardTitle>Notifications</CardTitle>
    <CardDescription>You have 3 unread messages.</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <span className="text-sm">New comment on your post</span>
      </div>
    </div>
  </CardContent>
  <CardFooter className="gap-2">
    <Button variant="outline" size="sm">Mark all read</Button>
    <Button size="sm">View all</Button>
  </CardFooter>
</Card>`;

interface CardDocProps {
  sourceCode: string;
}

export function CardDoc({ sourceCode }: CardDocProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2 id="usage" className="text-2xl font-semibold mb-4">
          Usage
        </h2>
        <PreviewTabs
          preview={<CardDemo />}
          codeBlock={<SimpleCodeblock code={usageCode} />}
        />
      </section>

      <section>
        <h2 id="examples" className="text-2xl font-semibold mb-4">
          Examples
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-3">Notification Card</h3>
            <PreviewTabs
              preview={<CardBasic />}
              codeBlock={<SimpleCodeblock code={notificationCode} />}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 id="api-reference" className="text-2xl font-semibold mb-4">
          API Reference
        </h2>
        <p className="text-[var(--muted-foreground)] mb-4">
          The Card component exports the following sub-components:
        </p>
        <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)] mb-4">
          <li>
            <code className="bg-[var(--muted)] px-1 rounded">Card</code> - The main container
          </li>
          <li>
            <code className="bg-[var(--muted)] px-1 rounded">CardHeader</code> - Header section
          </li>
          <li>
            <code className="bg-[var(--muted)] px-1 rounded">CardTitle</code> - Title text
          </li>
          <li>
            <code className="bg-[var(--muted)] px-1 rounded">CardDescription</code> - Description text
          </li>
          <li>
            <code className="bg-[var(--muted)] px-1 rounded">CardContent</code> - Main content area
          </li>
          <li>
            <code className="bg-[var(--muted)] px-1 rounded">CardFooter</code> - Footer section
          </li>
        </ul>
        <PropsTable props={cardProps} />
      </section>

      <section>
        <h2 id="source" className="text-2xl font-semibold mb-4">
          Source Code
        </h2>
        <SimpleCodeblock code={sourceCode} filename="card.tsx" />
      </section>
    </div>
  );
}
