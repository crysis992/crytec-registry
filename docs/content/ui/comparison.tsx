'use client';

import Image from 'next/image';
import * as React from 'react';
import { PreviewTabs } from '@/docs/components/component-preview';
import { PropsTable } from '@/docs/components/props-table';
import { SimpleCodeblock } from '@/docs/components/simple-codeblock';
import type { PropDefinition } from '@/docs/types';
import { Comparison, ComparisonHandle, ComparisonItem } from '@/registry/new-york/ui/custom/comparison';

const comparisonProps: PropDefinition[] = [
  {
    name: 'mode',
    type: '"hover" | "drag"',
    defaultValue: '"drag"',
    description: "Interaction mode. 'hover' follows mouse position, 'drag' requires click and drag.",
  },
  {
    name: 'onDragStart',
    type: '() => void',
    description: 'Callback fired when dragging starts (drag mode only).',
  },
  {
    name: 'onDragEnd',
    type: '() => void',
    description: 'Callback fired when dragging ends (drag mode only).',
  },
];

const comparisonItemProps: PropDefinition[] = [
  {
    name: 'position',
    type: '"left" | "right"',
    required: true,
    description: "Position of the item. 'left' is revealed from left, 'right' from right.",
  },
];

const comparisonHandleProps: PropDefinition[] = [
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Custom handle content. Defaults to a vertical line with grip icon (drag mode only).',
  },
];

const usageCode = `import {
  Comparison,
  ComparisonItem,
  ComparisonHandle,
} from "@/components/ui/comparison"
import Image from "next/image"

export function ImageComparison() {
  return (
    <Comparison className="aspect-video" mode="drag">
      <ComparisonItem position="left">
        <Image
          alt="Before"
          src="/before.jpg"
          fill
          className="object-cover"
        />
      </ComparisonItem>
      <ComparisonItem position="right">
        <Image
          alt="After"
          src="/after.jpg"
          fill
          className="object-cover"
        />
      </ComparisonItem>
      <ComparisonHandle />
    </Comparison>
  )
}`;

const hoverModeCode = `<Comparison className="aspect-video" mode="hover">
  <ComparisonItem position="left">
    <Image
      alt="Placeholder 1"
      className="opacity-50"
      height={1080}
      src="https://placehold.co/1920x1080?random=1"
      unoptimized
      width={1920}
    />
  </ComparisonItem>
  <ComparisonItem position="right">
    <Image
      alt="Placeholder 2"
      className="opacity-50"
      height={1440}
      src="https://placehold.co/2560x1440?random=2"
      unoptimized
      width={2560}
    />
  </ComparisonItem>
  <ComparisonHandle />
</Comparison>`;

const dragWithHandlersCode = `function ComparisonWithHandlers() {
  const [isDragging, setIsDragging] = React.useState(false);

  return (
    <Comparison
      className="aspect-video"
      mode="drag"
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      <ComparisonItem position="left">
        <Image
          alt="Before"
          src="/before.jpg"
          fill
          className="object-cover"
        />
      </ComparisonItem>
      <ComparisonItem position="right">
        <Image
          alt="After"
          src="/after.jpg"
          fill
          className="object-cover"
        />
      </ComparisonItem>
      <ComparisonHandle />
      {isDragging && (
        <div className="absolute top-4 left-4 bg-background/80 px-3 py-1 rounded text-sm">
          Dragging...
        </div>
      )}
    </Comparison>
  );
}`;

function HoverModeDemo() {
  return (
    <Comparison
      className="aspect-video"
      mode="hover"
    >
      <ComparisonItem
        className="bg-red-500"
        position="left"
      >
        <Image
          alt="Placeholder 1"
          className="opacity-50"
          height={1080}
          src="https://placehold.co/1920x1080?random=1"
          unoptimized
          width={1920}
        />
      </ComparisonItem>
      <ComparisonItem
        className="bg-blue-500"
        position="right"
      >
        <Image
          alt="Placeholder 2"
          className="opacity-50"
          height={1440}
          src="https://placehold.co/2560x1440?random=2"
          unoptimized
          width={2560}
        />
      </ComparisonItem>
      <ComparisonHandle />
    </Comparison>
  );
}

function DragWithHandlersDemo() {
  const [isDragging, setIsDragging] = React.useState(false);

  return (
    <Comparison
      className="aspect-video"
      mode="drag"
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      <ComparisonItem
        className="bg-red-500"
        position="left"
      >
        <Image
          alt="Placeholder 1"
          className="opacity-50"
          height={1080}
          src="https://placehold.co/1920x1080?random=1"
          unoptimized
          width={1920}
        />
      </ComparisonItem>
      <ComparisonItem
        className="bg-blue-500"
        position="right"
      >
        <Image
          alt="Placeholder 2"
          className="opacity-50"
          height={1440}
          src="https://placehold.co/2560x1440?random=2"
          unoptimized
          width={2560}
        />
      </ComparisonItem>
      <ComparisonHandle />
      {isDragging && (
        <div className="absolute top-4 left-4 bg-[var(--background)]/80 px-3 py-1 rounded text-sm border border-[var(--border)]">
          Dragging...
        </div>
      )}
    </Comparison>
  );
}

interface ComparisonDocProps {
  sourceCode: string;
}

export function ComparisonDoc({ sourceCode }: ComparisonDocProps) {
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
            Comparison is an interactive component for showcasing side-by-side comparisons, perfect for before/after images, design
            iterations, or any visual comparisons.
          </p>
          <p className="text-[var(--muted-foreground)]">
            It supports two interaction modes: <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">hover</code> for quick
            exploration and <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">drag</code> for precise control. The component
            uses Framer Motion for smooth animations and is fully accessible.
          </p>
        </div>

        <PreviewTabs
          preview={
            <Comparison
              className="aspect-video"
              mode="drag"
            >
              <ComparisonItem
                className="bg-red-500"
                position="left"
              >
                <Image
                  alt="Before"
                  className="opacity-50"
                  height={1080}
                  src="https://placehold.co/1920x1080?random=1"
                  unoptimized
                  width={1920}
                />
              </ComparisonItem>
              <ComparisonItem
                className="bg-blue-500"
                position="right"
              >
                <Image
                  alt="After"
                  className="opacity-50"
                  height={1440}
                  src="https://placehold.co/2560x1440?random=2"
                  unoptimized
                  width={2560}
                />
              </ComparisonItem>
              <ComparisonHandle />
            </Comparison>
          }
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
            <h3 className="text-lg font-medium mb-3">Hover Mode</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              In hover mode, the slider follows your mouse cursor automatically. Perfect for quick comparisons without requiring click and
              drag.
            </p>
            <PreviewTabs
              preview={<HoverModeDemo />}
              codeBlock={
                <SimpleCodeblock
                  code={hoverModeCode}
                  language="tsx"
                />
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Drag Mode with Handlers</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Use <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">onDragStart</code> and
              <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm ml-1">onDragEnd</code> callbacks to track drag state and
              provide visual feedback or perform actions.
            </p>
            <PreviewTabs
              preview={<DragWithHandlersDemo />}
              codeBlock={
                <SimpleCodeblock
                  code={dragWithHandlersCode}
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
            <h3 className="text-lg font-medium mb-3">Comparison Props</h3>
            <PropsTable props={comparisonProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">ComparisonItem Props</h3>
            <PropsTable props={comparisonItemProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">ComparisonHandle Props</h3>
            <PropsTable props={comparisonHandleProps} />
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
          filename="comparison.tsx"
          language="tsx"
        />
      </section>
    </div>
  );
}
