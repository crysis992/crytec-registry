'use client';

import { Heart, Star, Zap } from 'lucide-react';
import * as React from 'react';
import { PreviewTabs } from '@/docs/components/component-preview';
import { PropsTable } from '@/docs/components/props-table';
import { SimpleCodeblock } from '@/docs/components/simple-codeblock';
import type { PropDefinition } from '@/docs/types';
import { cn } from '@/lib/utils';
import { Rating, RatingItem } from '@/registry/new-york/ui/custom/rating';

const ratingProps: PropDefinition[] = [
  {
    name: 'value',
    type: 'number',
    description: 'Controlled rating value.',
  },
  {
    name: 'defaultValue',
    type: 'number',
    defaultValue: '0',
    description: 'Default rating value (uncontrolled).',
  },
  {
    name: 'onValueChange',
    type: '(value: number) => void',
    description: 'Callback fired when the rating value changes.',
  },
  {
    name: 'onHover',
    type: '(value: number | null) => void',
    description: 'Callback fired when hovering over a rating item.',
  },
  {
    name: 'max',
    type: 'number',
    defaultValue: '5',
    description: 'Maximum rating value.',
  },
  {
    name: 'step',
    type: '0.5 | 1',
    defaultValue: '1',
    description: 'Step increment for ratings. Use 0.5 for half-star ratings.',
  },
  {
    name: 'activationMode',
    type: '"automatic" | "manual"',
    defaultValue: '"automatic"',
    description: 'How items are activated. "automatic" selects on focus, "manual" requires Enter/Space.',
  },
  {
    name: 'dir',
    type: '"ltr" | "rtl"',
    description: 'Text direction for RTL support.',
  },
  {
    name: 'orientation',
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    description: 'Layout orientation of rating items.',
  },
  {
    name: 'size',
    type: '"sm" | "default" | "lg"',
    defaultValue: '"default"',
    description: 'Size variant for rating items.',
  },
  {
    name: 'clearable',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Allow clearing the rating by clicking the current value.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Disable all rating items.',
  },
  {
    name: 'readOnly',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Make the rating read-only.',
  },
  {
    name: 'required',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Mark the rating as required for form validation.',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Name attribute for form submission.',
  },
  {
    name: 'asChild',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Render as child element using Radix Slot.',
  },
];

const ratingItemProps: PropDefinition[] = [
  {
    name: 'index',
    type: 'number',
    description: 'Item index (0-based). Auto-assigned if not provided.',
  },
  {
    name: 'children',
    type: 'ReactNode | ((dataState: DataState) => ReactNode)',
    description: 'Custom content. Receives dataState for conditional rendering. Defaults to Star icon.',
  },
  {
    name: 'asChild',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Render as child element using Radix Slot.',
  },
];

const usageCode = `import { Rating, RatingItem } from "@/components/ui/rating"

export function BasicRating() {
  return (
    <Rating defaultValue={3}>
      {Array.from({ length: 5 }, (_, i) => (
        <RatingItem key={i} />
      ))}
    </Rating>
  )
}`;

const halfStepCode = `<Rating defaultValue={2.5} step={0.5}>
  {Array.from({ length: 5 }, (_, i) => (
    <RatingItem key={i} />
  ))}
</Rating>`;

const controlledCode = `function ControlledRating() {
  const [rating, setRating] = React.useState(3);

  return (
    <div className="flex flex-col gap-4">
      <Rating value={rating} onValueChange={setRating}>
        {Array.from({ length: 5 }, (_, i) => (
          <RatingItem key={i} />
        ))}
      </Rating>
      <p className="text-sm text-muted-foreground">
        Current rating: {rating}
      </p>
    </div>
  )
}`;

const themesCode = `import { Heart, Star, Zap } from "lucide-react"

const themes = [
  { icon: Star, className: "text-primary", value: 4 },
  { icon: Star, className: "text-yellow-500", value: 5 },
  { icon: Heart, className: "text-pink-500", value: 5 },
  { icon: Zap, className: "text-orange-500", value: 4 },
]

export function ThemedRatings() {
  return (
    <div className="flex flex-wrap gap-6">
      {themes.map((theme, idx) => (
        <Rating
          key={idx}
          defaultValue={theme.value}
          className={theme.className}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={i}>
              <theme.icon />
            </RatingItem>
          ))}
        </Rating>
      ))}
    </div>
  )
}`;

const sizesCode = `<div className="flex flex-col gap-4">
  <Rating defaultValue={3} size="sm">
    {Array.from({ length: 5 }, (_, i) => (
      <RatingItem key={i} />
    ))}
  </Rating>
  <Rating defaultValue={3} size="default">
    {Array.from({ length: 5 }, (_, i) => (
      <RatingItem key={i} />
    ))}
  </Rating>
  <Rating defaultValue={3} size="lg">
    {Array.from({ length: 5 }, (_, i) => (
      <RatingItem key={i} />
    ))}
  </Rating>
</div>`;

function BasicDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Basic Rating</span>
        <Rating defaultValue={3}>
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={`basic-${i}`} />
          ))}
        </Rating>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Half Steps (LTR)</span>
        <Rating
          defaultValue={2.5}
          step={0.5}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={`half-ltr-${i}`} />
          ))}
        </Rating>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Half Steps (RTL)</span>
        <Rating
          dir="rtl"
          defaultValue={2.5}
          step={0.5}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={`half-rtl-${i}`} />
          ))}
        </Rating>
      </div>
    </div>
  );
}

function ControlledDemo() {
  const [rating, setRating] = React.useState(3);

  return (
    <div className="flex flex-col gap-4">
      <Rating
        value={rating}
        onValueChange={setRating}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <RatingItem key={`controlled-${i}`} />
        ))}
      </Rating>
      <p className="text-sm text-[var(--muted-foreground)]">Current rating: {rating}</p>
      <div className="flex gap-2">
        <button
          type="button"
          className="rounded bg-[var(--muted)] px-3 py-1 text-sm hover:bg-[var(--muted)]/80"
          onClick={() => setRating(0)}
        >
          Clear
        </button>
        <button
          type="button"
          className="rounded bg-[var(--muted)] px-3 py-1 text-sm hover:bg-[var(--muted)]/80"
          onClick={() => setRating(5)}
        >
          Set to 5
        </button>
        <button
          type="button"
          className="rounded bg-[var(--muted)] px-3 py-1 text-sm hover:bg-[var(--muted)]/80"
          onClick={() => setRating(2.5)}
        >
          Set to 2.5
        </button>
      </div>
    </div>
  );
}

const themes = [
  { label: 'Default', icon: Star, className: 'text-primary', value: 4 },
  { label: 'Gold', icon: Star, className: 'text-yellow-500', value: 5 },
  { label: 'Heart', icon: Heart, className: 'text-pink-500', value: 5 },
  { label: 'Energy', icon: Zap, className: 'text-orange-500', value: 4 },
];

function ThemesDemo() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {themes.map((theme) => (
        <div
          key={theme.label}
          className="flex flex-col items-center gap-3 rounded-lg border border-[var(--border)] p-4"
        >
          <span className="text-sm font-medium">{theme.label}</span>
          <Rating
            defaultValue={theme.value}
            className={cn('gap-1', theme.className)}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <RatingItem key={`theme-${theme.label}-${i}`}>
                <theme.icon />
              </RatingItem>
            ))}
          </Rating>
        </div>
      ))}
    </div>
  );
}

function SizesDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-[var(--muted-foreground)]">Small</span>
        <Rating
          defaultValue={3}
          size="sm"
        >
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={`sm-${i}`} />
          ))}
        </Rating>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-[var(--muted-foreground)]">Default</span>
        <Rating
          defaultValue={3}
          size="default"
        >
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={`default-${i}`} />
          ))}
        </Rating>
      </div>
      <div className="flex items-center gap-4">
        <span className="w-16 text-sm text-[var(--muted-foreground)]">Large</span>
        <Rating
          defaultValue={3}
          size="lg"
        >
          {Array.from({ length: 5 }, (_, i) => (
            <RatingItem key={`lg-${i}`} />
          ))}
        </Rating>
      </div>
    </div>
  );
}

interface RatingDocProps {
  sourceCode: string;
}

export function RatingDoc({ sourceCode }: RatingDocProps) {
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
            Rating is an accessible star rating component that allows users to provide ratings with support for half values, keyboard
            navigation, and form integration.
          </p>
          <p className="text-[var(--muted-foreground)]">
            It supports both controlled and uncontrolled modes, RTL layouts, multiple size variants, and custom icons. The component is
            fully accessible with proper ARIA attributes and keyboard navigation.
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
              Use <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">value</code> and
              <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm ml-1">onValueChange</code> to control the rating value
              programmatically.
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
            <h3 className="text-lg font-medium mb-3">Half Steps</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Set <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">step={'{0.5}'}</code> to enable half-star ratings. Click
              on the left or right half of a star to select half values.
            </p>
            <PreviewTabs
              preview={
                <Rating
                  defaultValue={2.5}
                  step={0.5}
                >
                  {Array.from({ length: 5 }, (_, i) => (
                    <RatingItem key={`half-preview-${i}`} />
                  ))}
                </Rating>
              }
              codeBlock={
                <SimpleCodeblock
                  code={halfStepCode}
                  language="tsx"
                />
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Themes & Custom Icons</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Customize the rating with different colors and icons by passing custom children to{' '}
              <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">RatingItem</code>.
            </p>
            <PreviewTabs
              preview={<ThemesDemo />}
              codeBlock={
                <SimpleCodeblock
                  code={themesCode}
                  language="tsx"
                />
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Sizes</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Use the <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">size</code> prop to change the size of rating items.
            </p>
            <PreviewTabs
              preview={<SizesDemo />}
              codeBlock={
                <SimpleCodeblock
                  code={sizesCode}
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
            <h3 className="text-lg font-medium mb-3">Rating Props</h3>
            <PropsTable props={ratingProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">RatingItem Props</h3>
            <PropsTable props={ratingItemProps} />
          </div>
        </div>
      </section>

      <section>
        <h2
          id="accessibility"
          className="text-2xl font-semibold mb-4"
        >
          Accessibility
        </h2>
        <div className="space-y-4">
          <p className="text-[var(--muted-foreground)]">
            The Rating component follows WAI-ARIA guidelines for radio groups and includes full keyboard navigation support.
          </p>
          <div>
            <h3 className="text-lg font-medium mb-3">Keyboard Interactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 pr-4 font-medium">Key</th>
                    <th className="text-left py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="text-[var(--muted-foreground)]">
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4">
                      <code className="rounded bg-[var(--muted)] px-1.5 py-0.5">ArrowLeft</code> /{' '}
                      <code className="rounded bg-[var(--muted)] px-1.5 py-0.5">ArrowRight</code>
                    </td>
                    <td className="py-2">Navigate between rating items</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4">
                      <code className="rounded bg-[var(--muted)] px-1.5 py-0.5">Home</code>
                    </td>
                    <td className="py-2">Move to first rating item</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4">
                      <code className="rounded bg-[var(--muted)] px-1.5 py-0.5">End</code>
                    </td>
                    <td className="py-2">Move to last rating item</td>
                  </tr>
                  <tr className="border-b border-[var(--border)]">
                    <td className="py-2 pr-4">
                      <code className="rounded bg-[var(--muted)] px-1.5 py-0.5">Enter</code> /{' '}
                      <code className="rounded bg-[var(--muted)] px-1.5 py-0.5">Space</code>
                    </td>
                    <td className="py-2">Activate focused item (manual mode)</td>
                  </tr>
                </tbody>
              </table>
            </div>
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
          filename="rating.tsx"
          language="tsx"
        />
      </section>
    </div>
  );
}
