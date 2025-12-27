'use client';

import * as React from 'react';
import { PreviewTabs } from '@/docs/components/component-preview';
import { PropsTable } from '@/docs/components/props-table';
import { SimpleCodeblock } from '@/docs/components/simple-codeblock';
import type { PropDefinition } from '@/docs/types';
import { IconPicker, IconPickerContent, IconPickerPreview, IconPickerTrigger } from '@/registry/new-york/ui/custom/iconpicker';
import { Button } from '@/registry/new-york/ui/shadcn/button';

const iconPickerProps: PropDefinition[] = [
  {
    name: 'value',
    type: 'string',
    description: 'The controlled value of the selected icon name (kebab-case).',
  },
  {
    name: 'defaultValue',
    type: 'string',
    defaultValue: '"folder-kanban"',
    description: 'The default value of the selected icon name.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    description: 'Callback fired when the icon selection changes.',
  },
  {
    name: 'open',
    type: 'boolean',
    description: 'The controlled open state of the dialog.',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    defaultValue: 'false',
    description: 'The default open state of the dialog.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Callback fired when the dialog open state changes.',
  },
  {
    name: 'color',
    type: 'string',
    description: 'Background color for the icon preview (CSS color value).',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Whether the icon picker is disabled.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'The trigger element and dialog content.',
  },
];

const iconPickerTriggerProps: PropDefinition[] = [
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'The trigger element (usually a Button).',
  },
  {
    name: '...props',
    type: 'DialogTriggerProps',
    description: 'All DialogTrigger props are supported. Note: asChild is always set to true internally.',
  },
];

const iconPickerContentProps: PropDefinition[] = [
  {
    name: 'title',
    type: 'string',
    defaultValue: '"Select Icon"',
    description: 'The title of the dialog.',
  },
  {
    name: 'description',
    type: 'string',
    defaultValue: '"Choose any icon from Lucide."',
    description: 'The description text shown in the dialog header.',
  },
];

const iconPickerPreviewProps: PropDefinition[] = [
  {
    name: 'size',
    type: 'number',
    defaultValue: '24',
    description: 'The size of the preview icon in pixels.',
  },
];

const usageCode = `import {
  IconPicker,
  IconPickerTrigger,
  IconPickerContent,
  IconPickerPreview,
} from "@/components/ui/iconpicker"
import { Button } from "@/components/ui/button"

export function IconPickerExample() {
  const [icon, setIcon] = React.useState("folder-kanban")

  return (
    <IconPicker value={icon} onValueChange={setIcon}>
      <IconPickerTrigger>
        <Button variant="outline">
          <IconPickerPreview />
          Select Icon
        </Button>
      </IconPickerTrigger>
      <IconPickerContent />
    </IconPicker>
  )
}`;

const controlledCode = `function ControlledIconPicker() {
  const [icon, setIcon] = React.useState("heart")
  const [open, setOpen] = React.useState(false)

  return (
    <IconPicker
      value={icon}
      onValueChange={setIcon}
      open={open}
      onOpenChange={setOpen}
    >
      <IconPickerTrigger>
        <Button variant="outline">
          <IconPickerPreview />
          {icon}
        </Button>
      </IconPickerTrigger>
      <IconPickerContent title="Choose an Icon" />
    </IconPicker>
  )
}`;

const withColorCode = `function ColoredIconPicker() {
  const [icon, setIcon] = React.useState("star")

  return (
    <IconPicker value={icon} onValueChange={setIcon} color="#3b82f6">
      <IconPickerTrigger>
        <Button variant="outline">
          <IconPickerPreview />
          Select Icon
        </Button>
      </IconPickerTrigger>
      <IconPickerContent />
    </IconPicker>
  )
}`;

const customTriggerCode = `function CustomTriggerIconPicker() {
  const [icon, setIcon] = React.useState("settings")

  return (
    <IconPicker value={icon} onValueChange={setIcon}>
      <IconPickerTrigger>
        <div className="flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-accent cursor-pointer">
          <IconPickerPreview size={20} />
          <span>Custom Trigger</span>
        </div>
      </IconPickerTrigger>
      <IconPickerContent
        title="Custom Icon Picker"
        description="Select an icon from the list below."
      />
    </IconPicker>
  )
}`;

function BasicDemo() {
  const [icon, setIcon] = React.useState('folder-kanban');

  return (
    <IconPicker
      value={icon}
      onValueChange={setIcon}
    >
      <IconPickerTrigger>
        <Button variant="outline">
          <IconPickerPreview />
          Select Icon
        </Button>
      </IconPickerTrigger>
      <IconPickerContent />
    </IconPicker>
  );
}

function ControlledDemo() {
  const [icon, setIcon] = React.useState('heart');
  const [open, setOpen] = React.useState(false);

  return (
    <IconPicker
      value={icon}
      onValueChange={setIcon}
      open={open}
      onOpenChange={setOpen}
    >
      <IconPickerTrigger>
        <Button variant="outline">
          <IconPickerPreview />
          {icon}
        </Button>
      </IconPickerTrigger>
      <IconPickerContent title="Choose an Icon" />
    </IconPicker>
  );
}

function ColoredDemo() {
  const [icon, setIcon] = React.useState('star');

  return (
    <IconPicker
      value={icon}
      onValueChange={setIcon}
      color="#3b82f6"
    >
      <IconPickerTrigger>
        <Button variant="outline">
          <IconPickerPreview />
          Select Icon
        </Button>
      </IconPickerTrigger>
      <IconPickerContent />
    </IconPicker>
  );
}

function CustomTriggerDemo() {
  const [icon, setIcon] = React.useState('settings');

  return (
    <IconPicker
      value={icon}
      onValueChange={setIcon}
    >
      <IconPickerTrigger>
        <div className="flex items-center gap-2 rounded-md border border-[var(--border)] px-4 py-2 hover:bg-[var(--accent)] cursor-pointer transition-colors">
          <IconPickerPreview size={20} />
          <span>Custom Trigger</span>
        </div>
      </IconPickerTrigger>
      <IconPickerContent
        title="Custom Icon Picker"
        description="Select an icon from the list below."
      />
    </IconPicker>
  );
}

interface IconPickerDocProps {
  sourceCode: string;
}

export function IconpickerDoc({ sourceCode }: IconPickerDocProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2
          id="usage"
          className="text-2xl font-semibold mb-4"
        >
          Usage
        </h2>
        <div className="space-y-3">
          <p className="text-[var(--muted-foreground)]">
            IconPicker is a compound component for selecting icons from the Lucide React icon library. It provides a searchable dialog
            interface with real-time preview and optimized rendering for large icon lists.
          </p>
          <p className="text-[var(--muted-foreground)]">
            The component uses a compound component pattern, allowing you to customize the trigger, content, and preview independently. It
            supports both controlled and uncontrolled usage patterns.
          </p>
        </div>

        <PreviewTabs
          preview={<BasicDemo />}
          codeBlock={
            <SimpleCodeblock
              code={usageCode}
              language="tsx"
            />
          }
        />
      </section>

      <section>
        <h2
          id="examples"
          className="text-2xl font-semibold mb-4"
        >
          Examples
        </h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-medium mb-3">Controlled State</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Control both the icon value and dialog open state for more advanced use cases.
            </p>
            <PreviewTabs
              preview={<ControlledDemo />}
              codeBlock={
                <SimpleCodeblock
                  code={controlledCode}
                  language="tsx"
                />
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">With Custom Color</h3>
            <p className="text-[var(--muted-foreground)] mb-4">Set a custom background color for the icon preview in the dialog.</p>
            <PreviewTabs
              preview={<ColoredDemo />}
              codeBlock={
                <SimpleCodeblock
                  code={withColorCode}
                  language="tsx"
                />
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Custom Trigger</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Use any element as a trigger by wrapping it with{' '}
              <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">IconPickerTrigger</code>.
            </p>
            <PreviewTabs
              preview={<CustomTriggerDemo />}
              codeBlock={
                <SimpleCodeblock
                  code={customTriggerCode}
                  language="tsx"
                />
              }
            />
          </div>
        </div>
      </section>

      <section>
        <h2
          id="api-reference"
          className="text-2xl font-semibold mb-4"
        >
          API Reference
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">IconPicker Props</h3>
            <PropsTable props={iconPickerProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">IconPickerTrigger Props</h3>
            <PropsTable props={iconPickerTriggerProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">IconPickerContent Props</h3>
            <PropsTable props={iconPickerContentProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">IconPickerPreview Props</h3>
            <PropsTable props={iconPickerPreviewProps} />
          </div>
        </div>
      </section>

      <section>
        <h2
          id="source"
          className="text-2xl font-semibold mb-4"
        >
          Source Code
        </h2>
        <SimpleCodeblock
          code={sourceCode}
          filename="iconpicker.tsx"
          language="tsx"
        />
      </section>
    </div>
  );
}
