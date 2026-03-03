'use client';

import { Database, Package, Star } from 'lucide-react';
import { useState } from 'react';
import {
  DynamicFilterBar,
  type FilterBarState,
  type FilterDefinition,
  type SorterDefinition,
} from '@/registry/new-york/ui/dynamic-filterbar';

// Mock data for demonstration
const PRODUCTS = [
  { id: 1, name: 'Laptop Pro', category: 'Electronics', status: 'active', price: 1299, rating: 4.5 },
  { id: 2, name: 'Wireless Mouse', category: 'Electronics', status: 'active', price: 49, rating: 4.2 },
  { id: 3, name: 'USB-C Cable', category: 'Accessories', status: 'active', price: 19, rating: 4.8 },
  { id: 4, name: 'Monitor 4K', category: 'Electronics', status: 'inactive', price: 599, rating: 4.7 },
  { id: 5, name: 'Keyboard Mechanical', category: 'Electronics', status: 'active', price: 199, rating: 4.6 },
  { id: 6, name: 'Desk Lamp', category: 'Accessories', status: 'active', price: 79, rating: 4.3 },
  { id: 7, name: 'Monitor Stand', category: 'Accessories', status: 'inactive', price: 89, rating: 4.1 },
  { id: 8, name: 'Phone Stand', category: 'Accessories', status: 'active', price: 29, rating: 4.4 },
];

const CATEGORIES = ['Electronics', 'Accessories', 'Software', 'Services'];
const STATUSES = ['active', 'inactive', 'pending'];

export default function DynamicFilterBarBasic() {
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);

  // Filter definitions
  const filters: FilterDefinition[] = [
    {
      key: 'category',
      label: 'Category',
      icon: Package,
      operators: [
        { id: 'is', symbol: '=', label: 'is' },
        { id: 'is_not', symbol: '!=', label: 'is not' },
        { id: 'one_of', symbol: '||', label: 'one of' },
      ],
      options: CATEGORIES.map((cat) => ({ value: cat, label: cat })),
    },
    {
      key: 'status',
      label: 'Status',
      icon: Database,
      operators: [
        { id: 'is', symbol: '=', label: 'is' },
        { id: 'is_not', symbol: '!=', label: 'is not' },
        { id: 'one_of', symbol: '||', label: 'one of' },
      ],
      options: STATUSES.map((status) => ({ value: status, label: status.charAt(0).toUpperCase() + status.slice(1) })),
    },
    {
      key: 'rating',
      label: 'Rating',
      icon: Star,
      operators: [
        { id: 'is', symbol: '=', label: 'equals' },
        { id: 'is_not', symbol: '!=', label: 'not equals' },
      ],
      options: [
        { value: '4.5+', label: '4.5 stars and up' },
        { value: '4.0+', label: '4.0 stars and up' },
        { value: '3.5+', label: '3.5 stars and up' },
      ],
    },
  ];

  // Sorters
  const sorters: SorterDefinition[] = [
    { key: 'name', label: 'Name' },
    { key: 'price', label: 'Price' },
    { key: 'rating', label: 'Rating' },
  ];

  const handleApply = (state: FilterBarState) => {
    // Filter logic
    let results = PRODUCTS;

    // Apply filters
    for (const filter of state.filters) {
      if (filter.key === 'category') {
        if (filter.operator.id === 'is') {
          results = results.filter((p) => p.category === filter.values[0]);
        } else if (filter.operator.id === 'is_not') {
          results = results.filter((p) => p.category !== filter.values[0]);
        } else if (filter.operator.id === 'one_of') {
          results = results.filter((p) => filter.values.includes(p.category));
        }
      } else if (filter.key === 'status') {
        if (filter.operator.id === 'is') {
          results = results.filter((p) => p.status === filter.values[0]);
        } else if (filter.operator.id === 'is_not') {
          results = results.filter((p) => p.status !== filter.values[0]);
        } else if (filter.operator.id === 'one_of') {
          results = results.filter((p) => filter.values.includes(p.status));
        }
      } else if (filter.key === 'rating') {
        const value = filter.values[0];
        const threshold = Number.parseFloat(value || '0');
        results = results.filter((p) => {
          if (filter.operator.id === 'is') return p.rating === threshold;
          if (filter.operator.id === 'is_not') return p.rating !== threshold;
          return true;
        });
      }
    }

    // Apply search
    if (state.search) {
      const search = state.search.toLowerCase();
      results = results.filter((p) => p.name.toLowerCase().includes(search) || p.category.toLowerCase().includes(search));
    }

    // Apply sort
    if (state.sort) {
      const direction = state.sort.direction === 'asc' ? 1 : -1;
      results.sort((a, b) => {
        const aVal = a[state.sort?.key as keyof typeof a];
        const bVal = b[state.sort?.key as keyof typeof b];
        if (typeof aVal === 'string') return aVal.localeCompare(String(bVal)) * direction;
        return ((aVal as number) - (bVal as number)) * direction;
      });
    }

    setFilteredProducts(results);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Product Catalog</h1>
          <p className="text-muted-foreground mt-2">Filter and search through products with advanced filtering capabilities</p>
        </div>

        <DynamicFilterBar
          filters={filters}
          sorters={sorters}
          onApply={handleApply}
          syncToUrl={false}
          placeholder="Search products or add filters..."
        />
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Results</h2>
          <p className="text-sm text-muted-foreground">{filteredProducts.length} products found</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products match your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {product.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">${product.price}</span>
                  <span className="flex items-center gap-1 text-yellow-500">
                    <Star className="size-3 fill-current" />
                    {product.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
