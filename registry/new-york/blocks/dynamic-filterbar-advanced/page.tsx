'use client';

import { Briefcase, Globe, TrendingUp, Users } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DynamicFilterBar,
  type FilterBarState,
  type FilterDefinition,
  type SorterDefinition,
} from '@/registry/new-york/ui/dynamic-filterbar';

// Mock companies database
const COMPANIES = [
  { id: 1, name: 'TechCorp', industry: 'Technology', region: 'North America', employees: 5000, revenue: 2500000000 },
  { id: 2, name: 'FinanceHub', industry: 'Finance', region: 'Europe', employees: 1200, revenue: 800000000 },
  { id: 3, name: 'RetailMax', industry: 'Retail', region: 'Asia', employees: 8000, revenue: 1500000000 },
  { id: 4, name: 'HealthPlus', industry: 'Healthcare', region: 'North America', employees: 3000, revenue: 1200000000 },
  { id: 5, name: 'GreenEnergy', industry: 'Energy', region: 'Europe', employees: 2500, revenue: 950000000 },
  { id: 6, name: 'EduTech', industry: 'Education', region: 'North America', employees: 800, revenue: 350000000 },
  { id: 7, name: 'MediaStream', industry: 'Media', region: 'North America', employees: 1500, revenue: 600000000 },
  { id: 8, name: 'LogisticsPro', industry: 'Logistics', region: 'Asia', employees: 6000, revenue: 2000000000 },
];

const INDUSTRIES = ['Technology', 'Finance', 'Retail', 'Healthcare', 'Energy', 'Education', 'Media', 'Logistics'];
const REGIONS = ['North America', 'Europe', 'Asia', 'South America', 'Africa'];

export default function DynamicFilterBarAdvanced() {
  const [filteredCompanies, setFilteredCompanies] = useState(COMPANIES);

  // Simulated async options fetching (for employee count ranges)
  const fetchEmployeeRanges = useCallback(async (query: string): Promise<Array<{ value: string; label: string }>> => {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay

    const ranges = [
      { value: '0-500', label: '0 - 500 employees' },
      { value: '500-2000', label: '500 - 2,000 employees' },
      { value: '2000-5000', label: '2,000 - 5,000 employees' },
      { value: '5000+', label: '5,000+ employees' },
    ];

    if (!query) return ranges;
    return ranges.filter((r) => r.label.toLowerCase().includes(query.toLowerCase()));
  }, []);

  const filters: FilterDefinition[] = [
    {
      key: 'industry',
      label: 'Industry',
      icon: Briefcase,
      operators: [
        { id: 'is', symbol: '=', label: 'is' },
        { id: 'one_of', symbol: '||', label: 'one of' },
        { id: 'none_of', symbol: '!||', label: 'none of' },
      ],
      options: INDUSTRIES.map((ind) => ({ value: ind, label: ind })),
    },
    {
      key: 'region',
      label: 'Region',
      icon: Globe,
      operators: [
        { id: 'is', symbol: '=', label: 'is' },
        { id: 'one_of', symbol: '||', label: 'one of' },
      ],
      options: REGIONS.map((reg) => ({ value: reg, label: reg })),
    },
    {
      key: 'employees',
      label: 'Employees',
      icon: Users,
      operators: [
        { id: 'is', symbol: '=', label: 'is range' },
        { id: 'one_of', symbol: '||', label: 'one of ranges' },
      ],
      // Async options - simulated
      fetchOptions: fetchEmployeeRanges,
    },
    {
      key: 'revenue',
      label: 'Revenue',
      icon: TrendingUp,
      operators: [
        { id: 'is', symbol: '=', label: 'above' },
        { id: 'is_not', symbol: '!=', label: 'below' },
      ],
      options: [
        { value: '500M', label: '> $500M' },
        { value: '1B', label: '> $1B' },
        { value: '2B', label: '> $2B' },
      ],
    },
  ];

  const sorters: SorterDefinition[] = [
    { key: 'name', label: 'Name' },
    { key: 'employees', label: 'Employee Count' },
    { key: 'revenue', label: 'Revenue' },
  ];

  const handleApply = (state: FilterBarState) => {
    let results = COMPANIES;

    // Apply filters
    for (const filter of state.filters) {
      if (filter.key === 'industry') {
        if (filter.operator.id === 'is') {
          results = results.filter((c) => c.industry === filter.values[0]);
        } else if (filter.operator.id === 'one_of') {
          results = results.filter((c) => filter.values.includes(c.industry));
        } else if (filter.operator.id === 'none_of') {
          results = results.filter((c) => !filter.values.includes(c.industry));
        }
      } else if (filter.key === 'region') {
        if (filter.operator.id === 'is') {
          results = results.filter((c) => c.region === filter.values[0]);
        } else if (filter.operator.id === 'one_of') {
          results = results.filter((c) => filter.values.includes(c.region));
        }
      } else if (filter.key === 'employees') {
        const ranges = filter.values;
        results = results.filter((c) => {
          return ranges.some((range: string) => {
            if (range === '0-500') return c.employees <= 500;
            if (range === '500-2000') return c.employees > 500 && c.employees <= 2000;
            if (range === '2000-5000') return c.employees > 2000 && c.employees <= 5000;
            if (range === '5000+') return c.employees > 5000;
            return true;
          });
        });
      } else if (filter.key === 'revenue') {
        if (filter.operator.id === 'is') {
          const value = filter.values[0];
          if (value === '500M') results = results.filter((c) => c.revenue > 500000000);
          if (value === '1B') results = results.filter((c) => c.revenue > 1000000000);
          if (value === '2B') results = results.filter((c) => c.revenue > 2000000000);
        }
      }
    }

    // Apply search
    if (state.search) {
      const search = state.search.toLowerCase();
      results = results.filter((c) => c.name.toLowerCase().includes(search));
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

    setFilteredCompanies(results);
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    return `$${value}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Company Directory</h1>
          <p className="text-muted-foreground mt-2">Advanced filtering with async options and multiple operators</p>
        </div>

        <DynamicFilterBar
          filters={filters}
          sorters={sorters}
          onApply={handleApply}
          syncToUrl={false}
          debounceMs={400}
          placeholder="Search companies..."
          translations={{
            clearAll: 'Reset filters',
            sortBy: 'Sort by:',
            noResults: 'No matching options',
          }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{filteredCompanies.length}</p>
            <p className="text-xs text-muted-foreground">of {COMPANIES.length} companies</p>
          </CardContent>
        </Card>

        {filteredCompanies.length > 0 && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Avg. Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {Math.round(filteredCompanies.reduce((a, c) => a + c.employees, 0) / filteredCompanies.length)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{formatCurrency(filteredCompanies.reduce((a, c) => a + c.revenue, 0))}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Industries</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{new Set(filteredCompanies.map((c) => c.industry)).size}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Results Table */}
      <div className="space-y-4">
        {filteredCompanies.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">No companies match your filters</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Companies</CardTitle>
              <CardDescription>Showing {filteredCompanies.length} results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-semibold py-3 px-4">Name</th>
                      <th className="text-left font-semibold py-3 px-4">Industry</th>
                      <th className="text-left font-semibold py-3 px-4">Region</th>
                      <th className="text-right font-semibold py-3 px-4">Employees</th>
                      <th className="text-right font-semibold py-3 px-4">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map((company) => (
                      <tr
                        key={company.id}
                        className="border-b hover:bg-accent/50"
                      >
                        <td className="py-3 px-4 font-medium">{company.name}</td>
                        <td className="py-3 px-4">{company.industry}</td>
                        <td className="py-3 px-4">{company.region}</td>
                        <td className="py-3 px-4 text-right">{company.employees.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-semibold">{formatCurrency(company.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
