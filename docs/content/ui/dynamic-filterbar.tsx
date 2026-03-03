'use client';

import { AlertCircle, Database, Package, Users } from 'lucide-react';
import { useCallback, useState } from 'react';
import { z } from 'zod';
import { PreviewTabs } from '@/docs/components/component-preview';
import { PropsTable } from '@/docs/components/props-table';
import { SimpleCodeblock } from '@/docs/components/simple-codeblock';
import type { PropDefinition } from '@/docs/types';
import type { BadgeRenderProps, OptionRenderProps } from '@/registry/new-york/ui/dynamic-filterbar';
import { DynamicFilterBar, type FilterBarState, type FilterDefinition } from '@/registry/new-york/ui/dynamic-filterbar';

// ============================================================================
// Live Example Components
// ============================================================================

const MOCK_USERS = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com' },
  { id: '3', name: 'Charlie Davis', email: 'charlie@example.com' },
  { id: '4', name: 'Diana Wilson', email: 'diana@example.com' },
  { id: '5', name: 'Eve Martinez', email: 'eve@example.com' },
];

function AsyncOptionFetchingExample() {
  const fetchUsers = useCallback(async (query: string): Promise<Array<{ value: string; label: string }>> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (!query) {
      return MOCK_USERS.map((u) => ({ value: u.id, label: u.name }));
    }

    return MOCK_USERS.filter(
      (u) => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()),
    ).map((u) => ({ value: u.id, label: `${u.name} (${u.email})` }));
  }, []);

  const filters: FilterDefinition[] = [
    {
      key: 'user',
      label: 'User',
      icon: Users,
      operators: [
        { id: 'is', symbol: '=', label: 'is' },
        { id: 'one_of', symbol: '||', label: 'one of' },
      ],
      fetchOptions: fetchUsers,
    },
    {
      key: 'status',
      label: 'Status',
      icon: Database,
      operators: [{ id: 'is', symbol: '=', label: 'is' }],
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
  ];

  const [results, setResults] = useState('');

  return (
    <div className="space-y-4">
      <DynamicFilterBar
        filters={filters}
        debounceMs={300}
        onApply={(state) => {
          const userFilters = state.filters.find((f) => f.key === 'user');
          const selectedUsers = userFilters?.values.map((id) => MOCK_USERS.find((u) => u.id === id)?.name).join(', ') || 'None';
          setResults(`Selected users: ${selectedUsers}`);
        }}
        syncToUrl={false}
      />
      {results && <p className="text-sm text-muted-foreground mt-4">{results}</p>}
    </div>
  );
}

function SortingExample() {
  const PRODUCTS = [
    { id: 1, name: 'Laptop', price: 1299, rating: 4.5 },
    { id: 2, name: 'Mouse', price: 49, rating: 4.2 },
    { id: 3, name: 'Keyboard', price: 199, rating: 4.8 },
  ];

  const [filterState, setFilterState] = useState<FilterBarState>({
    filters: [],
    search: '',
    sort: null,
  });

  const filters: FilterDefinition[] = [
    {
      key: 'name',
      label: 'Name',
      icon: Package,
      operators: [{ id: 'is', symbol: '=', label: 'contains' }],
      options: PRODUCTS.map((p) => ({ value: p.name, label: p.name })),
    },
  ];

  // Apply filtering and sorting
  let results = PRODUCTS;

  if (filterState.search) {
    results = results.filter((p) => p.name.toLowerCase().includes(filterState.search.toLowerCase()));
  }

  if (filterState.sort) {
    const { key, direction } = filterState.sort;
    results = [...results].sort((a, b) => {
      let aVal: number | string | undefined;
      let bVal: number | string | undefined;

      if (key === 'name') {
        aVal = a.name;
        bVal = b.name;
      } else if (key === 'price') {
        aVal = a.price;
        bVal = b.price;
      } else if (key === 'rating') {
        aVal = a.rating;
        bVal = b.rating;
      }

      if (aVal === undefined || bVal === undefined) return 0;

      const comparison = typeof aVal === 'string' ? aVal.localeCompare(String(bVal)) : aVal - (bVal as number);
      return direction === 'asc' ? comparison : -comparison;
    });
  }

  return (
    <div className="space-y-4">
      <DynamicFilterBar
        filters={filters}
        sorters={[
          { key: 'name', label: 'Name' },
          { key: 'price', label: 'Price' },
          { key: 'rating', label: 'Rating' },
        ]}
        value={filterState}
        onChange={setFilterState}
        syncToUrl={false}
      />
      {filterState.sort && (
        <p className="text-xs text-muted-foreground">
          Sorted by {filterState.sort.key} ({filterState.sort.direction})
        </p>
      )}
      <div className="space-y-2">
        {results.map((p) => (
          <div
            key={p.id}
            className="p-2 border rounded text-sm"
          >
            {p.name} - ${p.price} - ⭐ {p.rating}
          </div>
        ))}
      </div>
    </div>
  );
}

function ZodValidationExample() {
  const [results, setResults] = useState<string>('');
  const [errors, setErrors] = useState<string>('');

  // Zod schema to validate price is one of the allowed values
  const priceSchema = z.enum(['50', '100', '500', '1000'], {
    message: 'Please select a valid price range',
  });

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
        { value: '1000', label: 'Under $1000' },
      ],
      schema: priceSchema,
    },
  ];

  const handleApply = (state: FilterBarState) => {
    const priceFilter = state.filters.find((f) => f.key === 'maxPrice');
    if (priceFilter) {
      try {
        const validated = priceSchema.parse(priceFilter.values[0]);
        setResults(`✓ Valid price: $${validated}`);
        setErrors('');
      } catch (error) {
        if (error instanceof z.ZodError) {
          setErrors(`✗ Invalid: ${error.errors[0]?.message}`);
          setResults('');
        }
      }
    } else {
      setResults('');
      setErrors('');
    }
  };

  return (
    <div className="space-y-4">
      <DynamicFilterBar
        filters={filters}
        onApply={handleApply}
        syncToUrl={false}
      />
      {results && <p className="text-sm text-green-600">{results}</p>}
      {errors && <p className="text-sm text-red-600">{errors}</p>}
    </div>
  );
}

function CustomRendererExample() {
  const filters: FilterDefinition[] = [
    {
      key: 'priority',
      label: 'Priority',
      icon: AlertCircle,
      operators: [{ id: 'is', symbol: '=', label: 'is' }],
      options: [
        { value: 'critical', label: 'Critical' },
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ],
    },
  ];

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-green-100 text-green-700 border-green-300',
    };
    return colors[priority] || '';
  };

  return (
    <div className="space-y-4">
      <DynamicFilterBar
        filters={filters}
        syncToUrl={false}
        renderOption={({ option, stage }: OptionRenderProps) => {
          if (stage !== 'value') return <span>{option.label}</span>;

          return (
            <div className="flex items-center gap-2">
              <div className={`size-3 rounded-full ${getPriorityColor(option.value).split(' ')[0]}`} />
              <span>{option.label}</span>
            </div>
          );
        }}
        renderBadge={({ filter, definition, onRemove }: BadgeRenderProps) => {
          const priority = filter.values[0];
          return (
            <div className={`flex items-center gap-2 rounded px-2 py-1 border ${getPriorityColor(priority)}`}>
              <span className="text-xs font-medium">
                {definition.label}: {filter.values[0]}
              </span>
              <button
                onClick={onRemove}
                className="text-xs hover:opacity-70"
              >
                ✕
              </button>
            </div>
          );
        }}
        onApply={(state) => console.log('Applied:', state)}
      />
    </div>
  );
}

function URLSyncExample() {
  const [filterState, setFilterState] = useState<FilterBarState>({
    filters: [],
    search: '',
    sort: null,
  });

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
        { value: 'software', label: 'Software' },
      ],
    },
  ];

  const generateUrl = () => {
    const params = new URLSearchParams();
    if (filterState.search) params.set('search', filterState.search);
    for (const filter of filterState.filters) {
      if (filter.values.length === 1) {
        params.set(filter.key, filter.values[0]);
      } else {
        for (const v of filter.values) {
          params.append(`${filter.key}[]`, v);
        }
      }
      if (filter.operator.id !== 'is') {
        params.set(`${filter.key}_op`, filter.operator.id);
      }
    }
    if (filterState.sort) {
      params.set('sort', filterState.sort.key);
      params.set('sort_dir', filterState.sort.direction);
    }
    return params.toString();
  };

  const url = generateUrl();

  return (
    <div className="space-y-4">
      <DynamicFilterBar
        filters={filters}
        sorters={[{ key: 'name', label: 'Name' }]}
        onApply={setFilterState}
        syncToUrl={false}
      />

      {url && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-xs font-medium text-blue-900 mb-2">Generated URL:</p>
          <code className="text-xs text-blue-700 break-all font-mono">?{url}</code>
        </div>
      )}

      {!url && <p className="text-xs text-muted-foreground">Add filters to see URL parameters</p>}
    </div>
  );
}

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

// Example: Static filters
const basicFilters: FilterDefinition[] = [
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
      { value: 'software', label: 'Software' },
    ],
  },
  {
    key: 'status',
    label: 'Status',
    icon: Database,
    operators: [
      { id: 'is', symbol: '=', label: 'is' },
      { id: 'is_not', symbol: '!=', label: 'is not' },
    ],
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
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
              <DynamicFilterBar
                filters={basicFilters}
                onApply={(state) => console.log('Applied:', state)}
                syncToUrl={false}
                placeholder="Filter products..."
              />
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
                <div className="p-6 border rounded-lg bg-card">
                  <SortingExample />
                </div>
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
                <div className="p-6 border rounded-lg bg-card">
                  <ZodValidationExample />
                </div>
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
                <div className="p-6 border rounded-lg bg-card">
                  <CustomRendererExample />
                </div>
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
                <div className="p-6 border rounded-lg bg-card">
                  <AsyncOptionFetchingExample />
                </div>
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
                <div className="p-6 border rounded-lg bg-card">
                  <URLSyncExample />
                </div>
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
