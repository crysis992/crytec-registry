'use client';

import * as React from 'react';
import { PreviewTabs } from '@/docs/components/component-preview';
import { PropsTable } from '@/docs/components/props-table';
import { SimpleCodeblock } from '@/docs/components/simple-codeblock';
import type { PropDefinition } from '@/docs/types';
import {
  ColorPicker,
  ColorPickerAlphaSlider,
  ColorPickerArea,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerSwatch,
  ColorPickerTrigger,
} from '@/registry/new-york/ui/custom/colorpicker';
import { Button } from '@/registry/new-york/ui/shadcn/button';

const colorPickerProps: PropDefinition[] = [
  {
    name: 'value',
    type: 'string',
    description: 'The controlled value of the selected color (hex, rgb, or hsl format).',
  },
  {
    name: 'defaultValue',
    type: 'string',
    defaultValue: '"#000000"',
    description: 'The default value of the selected color.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    description: 'Callback fired when the color selection changes.',
  },
  {
    name: 'open',
    type: 'boolean',
    description: 'The controlled open state of the popover.',
  },
  {
    name: 'defaultOpen',
    type: 'boolean',
    defaultValue: 'false',
    description: 'The default open state of the popover.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Callback fired when the popover open state changes.',
  },
  {
    name: 'defaultFormat',
    type: '"hex" | "rgb" | "hsl"',
    defaultValue: '"hex"',
    description: 'The default color format for display and input.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    description: 'Whether the color picker is disabled.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'The trigger element and popover content.',
  },
];

const colorPickerTriggerProps: PropDefinition[] = [
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'The trigger element (usually a Button).',
  },
  {
    name: '...props',
    type: 'PopoverTriggerProps',
    description: 'All PopoverTrigger props are supported. Note: asChild is always set to true internally.',
  },
];

const colorPickerContentProps: PropDefinition[] = [
  {
    name: '...props',
    type: 'PopoverContentProps',
    description: 'All PopoverContent props are supported.',
  },
];

const colorPickerSwatchProps: PropDefinition[] = [
  {
    name: '...props',
    type: 'div',
    description: 'All standard div props are supported.',
  },
];

const usageCode = `import {
  ColorPicker,
  ColorPickerTrigger,
  ColorPickerContent,
  ColorPickerArea,
  ColorPickerHueSlider,
  ColorPickerAlphaSlider,
  ColorPickerFormatSelect,
  ColorPickerInput,
  ColorPickerSwatch,
  ColorPickerEyeDropper,
} from "@/components/ui/colorpicker"
import { Button } from "@/components/ui/button"

export function ColorPickerExample() {
  const [color, setColor] = React.useState("#3b82f6")

  return (
    <ColorPicker value={color} onValueChange={setColor}>
      <ColorPickerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ColorPickerSwatch className="size-4" />
          Pick Color
        </Button>
      </ColorPickerTrigger>
      <ColorPickerContent>
        <ColorPickerArea />
        <div className="flex items-center gap-2">
          <ColorPickerEyeDropper />
          <div className="flex flex-1 flex-col gap-2">
            <ColorPickerHueSlider />
            <ColorPickerAlphaSlider />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorPickerFormatSelect />
          <ColorPickerInput />
        </div>
      </ColorPickerContent>
    </ColorPicker>
  )
}`;

const controlledCode = `function ColorPickerControlledDemo() {
  const [color, setColor] = React.useState("#3b82f6")
  const [isOpen, setIsOpen] = React.useState(false)

  const onReset = React.useCallback(() => {
    setColor("#000000")
    setIsOpen(false)
  }, [])

  const onPresetSelect = React.useCallback((presetColor: string) => {
    setColor(presetColor)
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <ColorPicker
          value={color}
          onValueChange={setColor}
          open={isOpen}
          onOpenChange={setIsOpen}
          defaultFormat="hex"
        >
          <ColorPickerTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <ColorPickerSwatch className="size-4" />
              Pick Color
            </Button>
          </ColorPickerTrigger>
          <ColorPickerContent>
            <ColorPickerArea />
            <div className="flex items-center gap-2">
              <ColorPickerEyeDropper />
              <div className="flex flex-1 flex-col gap-2">
                <ColorPickerHueSlider />
                <ColorPickerAlphaSlider />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ColorPickerFormatSelect />
              <ColorPickerInput />
            </div>
          </ColorPickerContent>
        </ColorPicker>

        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="font-medium text-sm">Preset Colors</h4>
        <div className="flex flex-wrap gap-2">
          {presetColors.map((presetColor) => (
            <button
              key={presetColor}
              type="button"
              className="size-8 rounded border-2 border-transparent hover:border-border focus:border-ring focus:outline-none"
              style={{ backgroundColor: presetColor }}
              onClick={() => onPresetSelect(presetColor)}
              aria-label={\`Select color \${presetColor}\`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <div>
          <span className="font-medium">Current color:</span>
          <code className="ml-2 font-mono">{color}</code>
        </div>
        <div>
          <span className="font-medium">Picker state:</span>
          <span className="ml-2">{isOpen ? "Open" : "Closed"}</span>
        </div>
      </div>
    </div>
  )
}`;

const minimalCode = `function MinimalColorPicker() {
  const [color, setColor] = React.useState("#3b82f6")

  return (
    <ColorPicker value={color} onValueChange={setColor}>
      <ColorPickerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ColorPickerSwatch className="size-4" />
          {color}
        </Button>
      </ColorPickerTrigger>
      <ColorPickerContent>
        <ColorPickerArea />
        <ColorPickerHueSlider />
        <ColorPickerInput />
      </ColorPickerContent>
    </ColorPicker>
  )
}`;

const customFormatCode = `function CustomFormatColorPicker() {
  const [color, setColor] = React.useState("#3b82f6")

  return (
    <ColorPicker value={color} onValueChange={setColor} defaultFormat="rgb">
      <ColorPickerTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ColorPickerSwatch className="size-4" />
          Pick Color
        </Button>
      </ColorPickerTrigger>
      <ColorPickerContent>
        <ColorPickerArea />
        <ColorPickerHueSlider />
        <div className="flex items-center gap-2">
          <ColorPickerFormatSelect />
          <ColorPickerInput />
        </div>
      </ColorPickerContent>
    </ColorPicker>
  )
}`;

function BasicDemo() {
  const [color, setColor] = React.useState('#3b82f6');

  return (
    <ColorPicker
      value={color}
      onValueChange={setColor}
    >
      <ColorPickerTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <ColorPickerSwatch className="size-4" />
          Pick Color
        </Button>
      </ColorPickerTrigger>
      <ColorPickerContent>
        <ColorPickerArea />
        <div className="flex items-center gap-2">
          <ColorPickerEyeDropper />
          <div className="flex flex-1 flex-col gap-2">
            <ColorPickerHueSlider />
            <ColorPickerAlphaSlider />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ColorPickerFormatSelect />
          <ColorPickerInput />
        </div>
      </ColorPickerContent>
    </ColorPicker>
  );
}

function ControlledDemo() {
  const [color, setColor] = React.useState('#3b82f6');
  const [isOpen, setIsOpen] = React.useState(false);

  const presetColors = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#64748b', // gray
  ];

  const onReset = React.useCallback(() => {
    setColor('#000000');
    setIsOpen(false);
  }, []);

  const onPresetSelect = React.useCallback((presetColor: string) => {
    setColor(presetColor);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <ColorPicker
          value={color}
          onValueChange={setColor}
          open={isOpen}
          onOpenChange={setIsOpen}
          defaultFormat="hex"
        >
          <ColorPickerTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <ColorPickerSwatch className="size-4" />
              Pick Color
            </Button>
          </ColorPickerTrigger>
          <ColorPickerContent>
            <ColorPickerArea />
            <div className="flex items-center gap-2">
              <ColorPickerEyeDropper />
              <div className="flex flex-1 flex-col gap-2">
                <ColorPickerHueSlider />
                <ColorPickerAlphaSlider />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ColorPickerFormatSelect />
              <ColorPickerInput />
            </div>
          </ColorPickerContent>
        </ColorPicker>

        <Button
          variant="outline"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="font-medium text-sm">Preset Colors</h4>
        <div className="flex flex-wrap gap-2">
          {presetColors.map((presetColor) => (
            <button
              key={presetColor}
              type="button"
              className="size-8 rounded border-2 border-transparent hover:border-[var(--border)] focus:border-[var(--ring)] focus:outline-none transition-colors"
              style={{ backgroundColor: presetColor }}
              onClick={() => onPresetSelect(presetColor)}
              aria-label={`Select color ${presetColor}`}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <div>
          <span className="font-medium">Current color:</span>
          <code className="ml-2 font-mono">{color}</code>
        </div>
        <div>
          <span className="font-medium">Picker state:</span>
          <span className="ml-2">{isOpen ? 'Open' : 'Closed'}</span>
        </div>
      </div>
    </div>
  );
}

function MinimalDemo() {
  const [color, setColor] = React.useState('#3b82f6');

  return (
    <ColorPicker
      value={color}
      onValueChange={setColor}
    >
      <ColorPickerTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <ColorPickerSwatch className="size-4" />
          {color}
        </Button>
      </ColorPickerTrigger>
      <ColorPickerContent>
        <ColorPickerArea />
        <ColorPickerHueSlider />
        <ColorPickerInput />
      </ColorPickerContent>
    </ColorPicker>
  );
}

function CustomFormatDemo() {
  const [color, setColor] = React.useState('#3b82f6');

  return (
    <ColorPicker
      value={color}
      onValueChange={setColor}
      defaultFormat="rgb"
    >
      <ColorPickerTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <ColorPickerSwatch className="size-4" />
          Pick Color
        </Button>
      </ColorPickerTrigger>
      <ColorPickerContent>
        <ColorPickerArea />
        <ColorPickerHueSlider />
        <div className="flex items-center gap-2">
          <ColorPickerFormatSelect />
          <ColorPickerInput />
        </div>
      </ColorPickerContent>
    </ColorPicker>
  );
}

interface ColorPickerDocProps {
  sourceCode: string;
}

export function ColorpickerDoc({ sourceCode }: ColorPickerDocProps) {
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
            ColorPicker is a customizable compound component for selecting colors. It supports hex, rgb, and hsl formats, includes an eye
            dropper tool, and provides a flexible API for building custom color selection interfaces.
          </p>
          <p className="text-[var(--muted-foreground)]">
            The component uses a compound component pattern, allowing you to customize the trigger, content, and individual controls
            independently. It supports both controlled and uncontrolled usage patterns.
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
            <h3 className="text-lg font-medium mb-3">Controlled with Presets</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Control both the color value and popover open state, with preset color options for quick selection.
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
            <h3 className="text-lg font-medium mb-3">Minimal Setup</h3>
            <p className="text-[var(--muted-foreground)] mb-4">Use only the essential components for a simpler color picker interface.</p>
            <PreviewTabs
              preview={<MinimalDemo />}
              codeBlock={
                <SimpleCodeblock
                  code={minimalCode}
                  language="tsx"
                />
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Custom Format</h3>
            <p className="text-[var(--muted-foreground)] mb-4">Set a default color format (hex, rgb, or hsl) for display and input.</p>
            <PreviewTabs
              preview={<CustomFormatDemo />}
              codeBlock={
                <SimpleCodeblock
                  code={customFormatCode}
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
            <h3 className="text-lg font-medium mb-3">ColorPicker Props</h3>
            <PropsTable props={colorPickerProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">ColorPickerTrigger Props</h3>
            <PropsTable props={colorPickerTriggerProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">ColorPickerContent Props</h3>
            <PropsTable props={colorPickerContentProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">ColorPickerSwatch Props</h3>
            <PropsTable props={colorPickerSwatchProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Sub-components</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              The following sub-components are available for customizing the color picker interface:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--muted-foreground)]">
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">ColorPickerArea</code> - 2D color selection area
              </li>
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">ColorPickerHueSlider</code> - Hue slider control
              </li>
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">ColorPickerAlphaSlider</code> - Alpha/opacity slider
              </li>
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">ColorPickerFormatSelect</code> - Format selector
                (hex/rgb/hsl)
              </li>
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">ColorPickerInput</code> - Manual color input field
              </li>
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">ColorPickerEyeDropper</code> - Eye dropper tool (browser
                support required)
              </li>
            </ul>
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
          filename="colorpicker.tsx"
          language="tsx"
        />
      </section>
    </div>
  );
}
