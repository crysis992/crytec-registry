'use client';

import { AlertCircle, Database, Package, Users } from 'lucide-react';
import { useCallback, useState } from 'react';
import { z } from 'zod';
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

export function AsyncOptionFetchingExample() {
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

export function SortingExample() {
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

export function ZodValidationExample() {
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

export function CustomRendererExample() {
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

export function URLSyncExample() {
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

export function BasicUsageExample() {
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

  return (
    <div className="p-6 border rounded-lg bg-card">
      <DynamicFilterBar
        filters={basicFilters}
        onApply={(state) => console.log('Applied:', state)}
        syncToUrl={false}
        placeholder="Filter products..."
      />
    </div>
  );
}
