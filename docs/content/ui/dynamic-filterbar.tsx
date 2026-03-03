import { Suspense } from 'react';
import { PreviewTabs } from '@/docs/components/component-preview';
import { PropsTable } from '@/docs/components/props-table';
import { SimpleCodeblock } from '@/docs/components/simple-codeblock';
import type { PropDefinition } from '@/docs/types';
import {
  AsyncOptionFetchingExample,
  BasicUsageExample,
  CustomRendererExample,
  SortingExample,
  URLSyncExample,
  ZodValidationExample,
} from './dynamic-filterbar-examples';

// ============================================================================
// Prop Definitions
// ============================================================================

const filterBarProps: PropDefinition[] = [
  {
    name: 'filters',
    type: 'FilterDefinition<TContext>[]',
    description: 'Array of filter definitions with keys, labels, operators, and options.',
    required: true,
  },
  {
    name: 'sorters',
    type: 'SorterDefinition[]',
    description: 'Optional array of sorter definitions for result sorting.',
  },
  {
    name: 'defaultSort',
    type: 'SortState',
    description: 'Initial sort state { key, direction }.',
  },
  {
    name: 'context',
    type: 'TContext',
    description: 'Context object passed to filter methods for dynamic options.',
  },
  {
    name: 'onApply',
    type: '(state: FilterBarState) => void',
    description: 'Callback when filters or search change.',
  },
  {
    name: 'onSortChange',
    type: '(sort: SortState | null) => void',
    description: 'Callback when sort changes.',
  },
  {
    name: 'syncToUrl',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Automatically sync filter state to URL parameters.',
  },
  {
    name: 'placeholder',
    type: 'string',
    defaultValue: '"Filter or search..."',
    description: 'Input placeholder text.',
  },
  {
    name: 'debounceMs',
    type: 'number',
    defaultValue: '300',
    description: 'Debounce delay for async option fetching in milliseconds.',
  },
  {
    name: 'preserveUrlParams',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Preserve non-filter URL parameters when syncing.',
  },
  {
    name: 'renderOption',
    type: '(props: OptionRenderProps) => ReactNode',
    description: 'Custom renderer for dropdown options.',
  },
  {
    name: 'renderBadge',
    type: '(props: BadgeRenderProps) => ReactNode',
    description: 'Custom renderer for filter badges.',
  },
];

const filterDefinitionProps: PropDefinition[] = [
  {
    name: 'key',
    type: 'string',
    description: 'Unique identifier for the filter.',
    required: true,
  },
  {
    name: 'label',
    type: 'string',
    description: 'Display name for the filter.',
    required: true,
  },
  {
    name: 'icon',
    type: 'LucideIcon',
    description: 'Icon component from lucide-react.',
    required: true,
  },
  {
    name: 'operators',
    type: 'FilterOperator[]',
    description: 'Available operators (is, is_not, one_of, none_of).',
    required: true,
  },
  {
    name: 'options',
    type: 'FilterOption[]',
    description: 'Static list of options { value, label }.',
  },
  {
    name: 'getOptions',
    type: '(query: string, ctx: TContext) => FilterOption[]',
    description: 'Function to dynamically compute options based on input.',
  },
  {
    name: 'fetchOptions',
    type: '(query: string, ctx: TContext, signal?: AbortSignal) => Promise<FilterOption[]>',
    description: 'Function to asynchronously fetch options (automatically debounced).',
  },
  {
    name: 'getDisplayValue',
    type: '(value: string | string[], ctx: TContext) => string',
    description: 'Custom function to display filter values in badges.',
  },
  {
    name: 'schema',
    type: 'z.ZodType<string | string[]>',
    description: 'Zod schema for validating selected filter values.',
  },
];

const operatorProps: PropDefinition[] = [
  {
    name: 'id',
    type: 'string',
    description: '"is" | "is_not" | "one_of" | "none_of"',
    required: true,
  },
  {
    name: 'symbol',
    type: 'string',
    description: 'Display symbol (=, !=, ||, !||).',
    required: true,
  },
  {
    name: 'label',
    type: 'string',
    description: 'Display label (is, is not, one of, none of).',
    required: true,
  },
];

const basicUsageCode = `import { DynamicFilterBar, type FilterDefinition } from '@/components/ui/dynamic-filterbar'
import { Package, Database } from 'lucide-react'

const filters: FilterDefinition[] = [
  {
    key: 'category',
    label: 'Category',
    icon: Package,
    operators: [
      { id: 'is', symbol: '=', label: 'is' },
      { id: 'one_of', symbol: '||', label: 'one of' },
    ],
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'accessories', label: 'Accessories' },
    ],
  },
]

export function MyComponent() {
  return (
    <DynamicFilterBar
      filters={filters}
      onApply={(state) => {
        console.log('Filters applied:', state)
        // Update your data based on state.filters, state.search, state.sort
      }}
    />
  )
}`;

const zodValidationCode = `import { z } from 'zod'

// Validate that selected value is one of the allowed prices
const priceSchema = z.enum(['50', '100', '500', '1000'], {
  message: 'Please select a valid price range',
})

const filters: FilterDefinition[] = [
  {
    key: 'maxPrice',
    label: 'Max Price',
    icon: Package,
    operators: [{ id: 'is', symbol: '=', label: 'under' }],
    options: [
      { value: '50', label: 'Under $50' },
      { value: '100', label: 'Under $100' },
      { value: '500', label: 'Under $500' },
    ],
    // Add schema for validation
    schema: priceSchema,
  },
]

<DynamicFilterBar
  filters={filters}
  onApply={(state) => {
    const filter = state.filters[0]
    if (filter) {
      try {
        const validated = priceSchema.parse(filter.values[0])
        console.log('Valid price:', validated)
      } catch (error) {
        console.log('Validation failed:', error)
      }
    }
  }}
/>`;

const customRendererCode = `const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    critical: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700',
  }
  return colors[priority] || ''
}

<DynamicFilterBar
  filters={filters}
  renderOption={({ option, isHighlighted, stage }) => {
    if (stage !== 'value') return <span>{option.label}</span>

    return (
      <div className="flex items-center gap-2">
        <div className={\`size-3 rounded-full \${getPriorityColor(option.value)}\`} />
        <span>{option.label}</span>
      </div>
    )
  }}
  renderBadge={({ filter, definition, onRemove }) => {
    return (
      <div className="flex items-center gap-2 px-2 py-1 rounded border">
        <span>{definition.label}: {filter.values[0]}</span>
        <button onClick={onRemove}>✕</button>
      </div>
    )
  }}
/>`;

const asyncExampleCode = `const filters: FilterDefinition[] = [
  {
    key: 'user',
    label: 'User',
    icon: Users,
    operators: [{ id: 'is', symbol: '=', label: 'is' }],
    // Async option fetching with automatic debouncing
    fetchOptions: async (query, context, signal) => {
      const response = await fetch(
        \`/api/users?q=\${query}\`,
        { signal }
      )
      const data = await response.json()
      return data.map((u: any) => ({
        value: u.id,
        label: u.name
      }))
    },
  },
]`;

const sortingExampleCode = `<DynamicFilterBar
  filters={filters}
  sorters={[
    { key: 'name', label: 'Name' },
    { key: 'date', label: 'Date Created' },
    { key: 'price', label: 'Price' },
  ]}
  defaultSort={{ key: 'date', direction: 'desc' }}
  onSortChange={(sort) => {
    console.log('Sort changed:', sort)
    // sort = { key: 'price', direction: 'asc' }
  }}
/>`;

const urlSyncCode = `<DynamicFilterBar
  filters={filters}
  syncToUrl={true}
  preserveUrlParams={true}
  onApply={(state) => {
    // URL is automatically updated with filter state
    // ?search=laptop&category=electronics&status=active&sort=price&sort_dir=asc
  }}
/>`;

const controlledModeCode = `const [filterState, setFilterState] = useState<FilterBarState>({
  filters: [],
  search: '',
  sort: null,
})

<DynamicFilterBar
  filters={filters}
  value={filterState}
  onChange={setFilterState}
  onApply={(state) => {
    // Both onChange and onApply fire
    console.log('State changed:', state)
  }}
/>`;

interface DynamicFilterbarDocProps {
  sourceCode: string;
}

export function DynamicFilterbarDoc({ sourceCode }: DynamicFilterbarDocProps) {
  return (
    <div className="space-y-10">
      <section>
        <h2
          id="usage"
          className="text-2xl font-semibold mb-4"
        >
          Usage
        </h2>
        <div className="space-y-3 mb-6">
          <p className="text-[var(--muted-foreground)]">
            DynamicFilterBar is a powerful, flexible component for filtering and searching data. It supports static and dynamic filter
            options, multiple operators, sorting, URL synchronization, and optional async option fetching.
          </p>
          <p className="text-[var(--muted-foreground)]">
            Keyboard navigation is fully supported: use <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">Arrow Keys</code>{' '}
            to navigate, <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">Enter</code> to select,{' '}
            <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">Backspace</code> to go back, and{' '}
            <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">Escape</code> to close.
          </p>
        </div>

        <PreviewTabs
          preview={
            <div className="p-6 border rounded-lg bg-card">
              <Suspense fallback={<div>Loading...</div>}>
                <BasicUsageExample />
              </Suspense>
            </div>
          }
          codeBlock={
            <SimpleCodeblock
              code={basicUsageCode}
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
            <h3 className="text-lg font-medium mb-3">With Sorting</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Add sorters to enable result sorting with ascending/descending toggle. Try sorting by price and rating.
            </p>
            <PreviewTabs
              preview={
                <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}>
                  <div className="p-6 border rounded-lg bg-card">
                    <SortingExample />
                  </div>
                </Suspense>
              }
              codeBlock={
                <SimpleCodeblock
                  code={sortingExampleCode}
                  language="tsx"
                />
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Zod Validation</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Use Zod schemas to validate selected filter values. Try selecting prices and see validation feedback.
            </p>
            <PreviewTabs
              preview={
                <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}>
                  <div className="p-6 border rounded-lg bg-card">
                    <ZodValidationExample />
                  </div>
                </Suspense>
              }
              codeBlock={
                <SimpleCodeblock
                  code={zodValidationCode}
                  language="tsx"
                />
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Custom Renderers</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Customize how options and badges render with{' '}
              <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">renderOption</code> and{' '}
              <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">renderBadge</code>. Color-coded priority levels.
            </p>
            <PreviewTabs
              preview={
                <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}>
                  <div className="p-6 border rounded-lg bg-card">
                    <CustomRendererExample />
                  </div>
                </Suspense>
              }
              codeBlock={
                <SimpleCodeblock
                  code={customRendererCode}
                  language="tsx"
                />
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Async Option Fetching</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Use <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">fetchOptions</code> for async data fetching with
              automatic debouncing and request cancellation. Type to search users with 300ms debounce.
            </p>
            <PreviewTabs
              preview={
                <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}>
                  <div className="p-6 border rounded-lg bg-card">
                    <AsyncOptionFetchingExample />
                  </div>
                </Suspense>
              }
              codeBlock={
                <SimpleCodeblock
                  code={asyncExampleCode}
                  language="tsx"
                />
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">URL Synchronization</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Enable <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">syncToUrl</code> to automatically persist filter
              state to URL parameters. See the URL update as you add filters.
            </p>
            <PreviewTabs
              preview={
                <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}>
                  <div className="p-6 border rounded-lg bg-card">
                    <URLSyncExample />
                  </div>
                </Suspense>
              }
              codeBlock={
                <SimpleCodeblock
                  code={urlSyncCode}
                  language="tsx"
                />
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Controlled Mode</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Use controlled mode to manage filter state externally with value and onChange props.
            </p>
            <PreviewTabs
              preview={
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded border border-green-200">
                    <p className="text-sm font-medium text-green-900">Controlled State Management</p>
                    <p className="text-xs text-green-700 mt-2">Both onChange and onApply callbacks fire for maximum flexibility.</p>
                  </div>
                </div>
              }
              codeBlock={
                <SimpleCodeblock
                  code={controlledModeCode}
                  language="tsx"
                />
              }
            />
          </div>
        </div>
      </section>

      <section>
        <h2
          id="operators"
          className="text-2xl font-semibold mb-4"
        >
          Filter Operators
        </h2>
        <div className="space-y-4 text-[var(--muted-foreground)]">
          <p>The following operators are available for filters:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded">
              <div className="font-medium text-foreground mb-2">is (=)</div>
              <p className="text-sm">Exact match. Single value only. Result shows a single filter value.</p>
            </div>
            <div className="p-4 border rounded">
              <div className="font-medium text-foreground mb-2">is not (!=)</div>
              <p className="text-sm">Exclude exact match. Single value only. Returns items NOT matching the value.</p>
            </div>
            <div className="p-4 border rounded">
              <div className="font-medium text-foreground mb-2">one of (||)</div>
              <p className="text-sm">Match any of multiple values. Multi-value. Item must match ANY selected value.</p>
            </div>
            <div className="p-4 border rounded">
              <div className="font-medium text-foreground mb-2">none of (!||)</div>
              <p className="text-sm">Exclude multiple values. Multi-value. Item must NOT match ANY selected value.</p>
            </div>
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
            <h3 className="text-lg font-medium mb-3">DynamicFilterBar Props</h3>
            <PropsTable props={filterBarProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">FilterDefinition Type</h3>
            <PropsTable props={filterDefinitionProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">FilterOperator Type</h3>
            <PropsTable props={operatorProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">FilterBarState Type</h3>
            <div className="space-y-3 text-[var(--muted-foreground)]">
              <SimpleCodeblock
                code={`interface FilterBarState {
  filters: ActiveFilter[]
  search: string
  sort: SortState | null
}

interface ActiveFilter {
  key: string
  operator: FilterOperator
  values: string[]
}

interface SortState {
  key: string
  direction: 'asc' | 'desc'
}`}
                language="typescript"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Keyboard Navigation</h3>
            <div className="space-y-2 text-[var(--muted-foreground)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium py-2 px-3">Key</th>
                    <th className="text-left font-medium py-2 px-3">Behavior</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-3 font-mono">↓ / ↑</td>
                    <td>Navigate options</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3 font-mono">Enter</td>
                    <td>Select highlighted option / Confirm multi-value</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3 font-mono">Tab</td>
                    <td>Select option and advance</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3 font-mono">Backspace</td>
                    <td>Go back a stage / Remove last selection</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-mono">Escape</td>
                    <td>Close dropdown and reset</td>
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
          filename="dynamic-filterbar.tsx"
          language="tsx"
        />
      </section>
    </div>
  );
}
