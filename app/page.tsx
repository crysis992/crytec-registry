import Link from "next/link";
import { Button } from "@/registry/new-york/ui/button";
import { Input } from "@/registry/new-york/ui/input";
import { Label } from "@/registry/new-york/ui/label";
import { Textarea } from "@/registry/new-york/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card";
import ExampleForm from "@/registry/new-york/blocks/example-form/page";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20">
      <main className="max-w-4xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Crytec Registry</h1>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            A custom shadcn/ui component registry. Install components directly
            into your project using the shadcn CLI.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <code className="px-4 py-2 bg-[var(--muted)] rounded-lg text-sm font-mono">
              npx shadcn@latest add https://crytec-registry.vercel.app/r/button.json
            </code>
          </div>
          <div className="flex gap-4 justify-center pt-2">
            <Link href="/docs">
              <Button>View Documentation</Button>
            </Link>
          </div>
        </div>

        {/* Button Variants */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Button</h2>
            <p className="text-[var(--muted-foreground)]">
              A versatile button component with multiple variants and sizes.
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap gap-4 mt-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Input & Label */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Input & Label</h2>
            <p className="text-[var(--muted-foreground)]">
              Form input and label components for building accessible forms.
            </p>
          </div>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-4 max-w-sm">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disabled">Disabled</Label>
                  <Input id="disabled" disabled placeholder="Disabled input" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Textarea */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Textarea</h2>
            <p className="text-[var(--muted-foreground)]">
              A multi-line text input for longer form content.
            </p>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="max-w-sm space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Card */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Card</h2>
            <p className="text-[var(--muted-foreground)]">
              A container component with header, content, and footer slots.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>
                  Card description goes here with additional context.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  This is the card content area. You can put any content here
                  including text, images, or other components.
                </p>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  You have 3 unread messages.
                </CardDescription>
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
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                    <span className="text-sm">New follower</span>
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
          </div>
        </section>

        {/* Example Form Block */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Example Form Block</h2>
            <p className="text-[var(--muted-foreground)]">
              A complete contact form with Zod validation and React Hook Form.
            </p>
          </div>
          <ExampleForm />
        </section>

        {/* Registry Info */}
        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Components</CardTitle>
              <CardDescription>
                All items available in this registry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "button", type: "UI" },
                  { name: "input", type: "UI" },
                  { name: "card", type: "UI" },
                  { name: "label", type: "UI" },
                  { name: "textarea", type: "UI" },
                  { name: "utils", type: "Lib" },
                  { name: "use-mounted", type: "Hook" },
                  { name: "example-form", type: "Block" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="p-3 border rounded-lg text-center"
                  >
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {item.type}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-[var(--muted-foreground)] pt-8 border-t">
          <p>
            Built with shadcn/ui registry system. Deploy your own registry and
            share components with your team.
          </p>
        </footer>
      </main>
    </div>
  );
}
