'use client';

import { de } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { PreviewTabs } from '@/docs/components/component-preview';
import { PropsTable } from '@/docs/components/props-table';
import { SimpleCodeblock } from '@/docs/components/simple-codeblock';
import type { PropDefinition } from '@/docs/types';
import {
  type DateRange,
  DateRangePicker,
  DateRangePickerActions,
  DateRangePickerCalendar,
  DateRangePickerContent,
  DateRangePickerDisplay,
  DateRangePickerNavigation,
  DateRangePickerTrigger,
  getLocalizedPresets,
} from '@/registry/new-york/ui/date-range-picker';

const dateRangePickerProps: PropDefinition[] = [
  {
    name: 'value',
    type: 'DateRange',
    description: 'The controlled value of the selected date range ({ from: Date, to?: Date }).',
  },
  {
    name: 'defaultValue',
    type: 'DateRange',
    description: 'The default value of the selected date range.',
  },
  {
    name: 'onValueChange',
    type: '(value: DateRange | undefined) => void',
    description: 'Callback fired when the date range selection changes.',
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
    name: 'month',
    type: 'Date',
    description: 'The controlled month displayed in the calendar.',
  },
  {
    name: 'defaultMonth',
    type: 'Date',
    description: 'The default month to display in the calendar.',
  },
  {
    name: 'onMonthChange',
    type: '(month: Date) => void',
    description: 'Callback fired when the displayed month changes.',
  },
  {
    name: 'dateFormat',
    type: 'string',
    defaultValue: '"dd.MM.yyyy"',
    description: 'The date format string (date-fns format).',
  },
  {
    name: 'dateSeparator',
    type: 'string',
    defaultValue: '" - "',
    description: 'The separator between from and to dates in display.',
  },
  {
    name: 'placeholder',
    type: 'string',
    defaultValue: '"Select date range"',
    description: 'Placeholder text when no date is selected.',
  },
  {
    name: 'locale',
    type: 'Locale',
    description: 'date-fns locale for formatting and calendar display.',
  },
  {
    name: 'presets',
    type: 'DateRangePreset[]',
    description: 'Custom preset options. Defaults to built-in presets (Current Month, Last Month, etc.).',
  },
  {
    name: 'onPresetSelect',
    type: '(preset: DateRangePreset) => void',
    description: 'Callback fired when a preset is selected.',
  },
  {
    name: 'numberOfMonths',
    type: 'number',
    defaultValue: '2',
    description: 'Number of months to display in the calendar.',
  },
  {
    name: 'minDate',
    type: 'Date',
    description: 'Minimum selectable date.',
  },
  {
    name: 'maxDate',
    type: 'Date',
    description: 'Maximum selectable date.',
  },
  {
    name: 'disabled',
    type: 'Matcher | Matcher[]',
    description: 'Days that cannot be selected (react-day-picker Matcher).',
  },
  {
    name: 'weekStartsOn',
    type: '0 | 1 | 2 | 3 | 4 | 5 | 6',
    defaultValue: '1',
    description: 'First day of the week (0=Sunday, 1=Monday).',
  },
  {
    name: 'showWeekNumber',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Show week numbers in the calendar.',
  },
  {
    name: 'fixedWeeks',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Always show 6 weeks in the calendar.',
  },
  {
    name: 'closeOnSelect',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Close popover automatically when a complete range is selected.',
  },
  {
    name: 'urlParamKey',
    type: 'string',
    description: 'URL search param key for syncing date range to URL.',
  },
  {
    name: 'urlFormat',
    type: '"iso" | "timestamp"',
    defaultValue: '"iso"',
    description: 'Format for serializing dates in URL.',
  },
  {
    name: 'onUrlChange',
    type: '(url: string) => void',
    description: 'Callback when URL should be updated (use with router.push).',
  },
  {
    name: 'name',
    type: 'string',
    description: 'Form field name for hidden input.',
  },
  {
    name: 'required',
    type: 'boolean',
    description: 'Whether the field is required for form submission.',
  },
  {
    name: 'isDisabled',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Whether the date range picker is disabled.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'The trigger element and popover content.',
  },
];

const dateRangePickerTriggerProps: PropDefinition[] = [
  {
    name: 'children',
    type: 'ReactElement',
    required: true,
    description: 'The trigger element (usually a Button).',
  },
  {
    name: '...props',
    type: 'PopoverTriggerProps',
    description: 'All PopoverTrigger props are supported.',
  },
];

const dateRangePickerNavigationProps: PropDefinition[] = [
  {
    name: 'hidePrevious',
    type: 'boolean',
    description: 'Hide the previous month selection button.',
  },
  {
    name: 'hideNext',
    type: 'boolean',
    description: 'Hide the next month selection button.',
  },
  {
    name: '...props',
    type: 'div',
    description:
      'All standard div props are supported. Note: Clicking navigation buttons selects the full previous/next month as the date range.',
  },
];

const dateRangePickerContentProps: PropDefinition[] = [
  {
    name: 'showPresets',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Show the presets sidebar automatically.',
  },
  {
    name: '...props',
    type: 'PopoverContentProps',
    description: 'All PopoverContent props are supported.',
  },
];

const dateRangePickerActionsProps: PropDefinition[] = [
  {
    name: 'showClear',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Show the clear button.',
  },
  {
    name: 'showCancel',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Show the cancel button.',
  },
  {
    name: 'showApply',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Show the apply button.',
  },
  {
    name: 'clearLabel',
    type: 'string',
    defaultValue: '"Clear"',
    description: 'Label for the clear button.',
  },
  {
    name: 'cancelLabel',
    type: 'string',
    defaultValue: '"Cancel"',
    description: 'Label for the cancel button.',
  },
  {
    name: 'applyLabel',
    type: 'string',
    defaultValue: '"Apply"',
    description: 'Label for the apply button.',
  },
  {
    name: 'onApply',
    type: '() => void',
    description: 'Callback when apply button is clicked.',
  },
];

const usageCode = `import { CalendarIcon } from "lucide-react"
import {
  DateRangePicker,
  DateRangePickerTrigger,
  DateRangePickerNavigation,
  DateRangePickerContent,
  DateRangePickerCalendar,
  DateRangePickerDisplay,
  type DateRange,
} from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"

export function DateRangePickerExample() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()

  return (
    <DateRangePicker value={dateRange} onValueChange={setDateRange}>
      <div className="flex items-center gap-1">
        <DateRangePickerNavigation hideNext />

        <DateRangePickerTrigger>
          <Button variant="outline" className="min-w-[280px] justify-start gap-2">
            <CalendarIcon className="size-4" />
            <DateRangePickerDisplay />
          </Button>
        </DateRangePickerTrigger>

        <DateRangePickerNavigation hidePrevious />
      </div>

      <DateRangePickerContent>
        <DateRangePickerCalendar />
      </DateRangePickerContent>
    </DateRangePicker>
  )
}`;

const withPresetsCode = `function DateRangePickerWithPresets() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()

  return (
    <DateRangePicker value={dateRange} onValueChange={setDateRange}>
      <DateRangePickerTrigger>
        <Button variant="outline" className="min-w-[280px] justify-start gap-2">
          <CalendarIcon className="size-4" />
          <DateRangePickerDisplay />
        </Button>
      </DateRangePickerTrigger>

      <DateRangePickerContent showPresets>
        <DateRangePickerCalendar />
      </DateRangePickerContent>
    </DateRangePicker>
  )
}`;

const withActionsCode = `function DateRangePickerWithActions() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()

  const handleApply = React.useCallback(() => {
    console.log("Applied date range:", dateRange)
  }, [dateRange])

  return (
    <DateRangePicker
      value={dateRange}
      onValueChange={setDateRange}
      closeOnSelect={false}
    >
      <DateRangePickerTrigger>
        <Button variant="outline" className="min-w-[280px] justify-start gap-2">
          <CalendarIcon className="size-4" />
          <DateRangePickerDisplay />
        </Button>
      </DateRangePickerTrigger>

      <DateRangePickerContent showPresets>
        <div className="space-y-3">
          <DateRangePickerCalendar />
          <DateRangePickerActions onApply={handleApply} />
        </div>
      </DateRangePickerContent>
    </DateRangePicker>
  )
}`;

const singleMonthCode = `function SingleMonthDateRangePicker() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()

  return (
    <DateRangePicker
      value={dateRange}
      onValueChange={setDateRange}
      numberOfMonths={1}
    >
      <div className="flex items-center gap-1">
        <DateRangePickerNavigation hideNext />

        <DateRangePickerTrigger>
          <Button variant="outline" className="min-w-[240px] justify-start gap-2">
            <CalendarIcon className="size-4" />
            <DateRangePickerDisplay />
          </Button>
        </DateRangePickerTrigger>

        <DateRangePickerNavigation hidePrevious />
      </div>

      <DateRangePickerContent>
        <DateRangePickerCalendar />
      </DateRangePickerContent>
    </DateRangePicker>
  )
}`;

const germanLocaleCode = `import { de } from "date-fns/locale"
import { getLocalizedPresets } from "@/components/ui/date-range-picker"

function GermanDateRangePicker() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const germanPresets = React.useMemo(() => getLocalizedPresets("de"), [])

  return (
    <DateRangePicker
      value={dateRange}
      onValueChange={setDateRange}
      locale={de}
      dateFormat="dd.MM.yyyy"
      presets={germanPresets}
      placeholder="Zeitraum wählen"
    >
      <DateRangePickerTrigger>
        <Button variant="outline" className="min-w-[280px] justify-start gap-2">
          <CalendarIcon className="size-4" />
          <DateRangePickerDisplay />
        </Button>
      </DateRangePickerTrigger>

      <DateRangePickerContent showPresets>
        <DateRangePickerCalendar />
      </DateRangePickerContent>
    </DateRangePicker>
  )
}`;

const constrainedDatesCode = `function ConstrainedDateRangePicker() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()

  // Only allow dates in the current year
  const minDate = new Date(new Date().getFullYear(), 0, 1)
  const maxDate = new Date(new Date().getFullYear(), 11, 31)

  return (
    <DateRangePicker
      value={dateRange}
      onValueChange={setDateRange}
      minDate={minDate}
      maxDate={maxDate}
    >
      <div className="flex items-center gap-1">
        <DateRangePickerNavigation hideNext />

        <DateRangePickerTrigger>
          <Button variant="outline" className="min-w-[280px] justify-start gap-2">
            <CalendarIcon className="size-4" />
            <DateRangePickerDisplay />
          </Button>
        </DateRangePickerTrigger>

        <DateRangePickerNavigation hidePrevious />
      </div>

      <DateRangePickerContent>
        <DateRangePickerCalendar />
      </DateRangePickerContent>
    </DateRangePicker>
  )
}`;

const controlledCode = `function ControlledDateRangePicker() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleClear = React.useCallback(() => {
    setDateRange(undefined)
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <DateRangePicker
          value={dateRange}
          onValueChange={setDateRange}
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <DateRangePickerTrigger>
            <Button variant="outline" className="min-w-[280px] justify-start gap-2">
              <CalendarIcon className="size-4" />
              <DateRangePickerDisplay />
            </Button>
          </DateRangePickerTrigger>

          <DateRangePickerContent showPresets>
            <DateRangePickerCalendar />
          </DateRangePickerContent>
        </DateRangePicker>

        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <div>
          <span className="font-medium">From:</span>
          <code className="ml-2 font-mono">
            {dateRange?.from?.toLocaleDateString() ?? "Not selected"}
          </code>
        </div>
        <div>
          <span className="font-medium">To:</span>
          <code className="ml-2 font-mono">
            {dateRange?.to?.toLocaleDateString() ?? "Not selected"}
          </code>
        </div>
        <div>
          <span className="font-medium">Picker state:</span>
          <span className="ml-2">{isOpen ? "Open" : "Closed"}</span>
        </div>
      </div>
    </div>
  )
}`;

function BasicDemo() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  return (
    <DateRangePicker
      value={dateRange}
      onValueChange={setDateRange}
    >
      <div className="flex items-center gap-1">
        <DateRangePickerNavigation hideNext />

        <DateRangePickerTrigger>
          <Button
            variant="outline"
            className="min-w-[280px] justify-start gap-2"
          >
            <CalendarIcon className="size-4" />
            <DateRangePickerDisplay />
          </Button>
        </DateRangePickerTrigger>

        <DateRangePickerNavigation hidePrevious />
      </div>

      <DateRangePickerContent>
        <DateRangePickerCalendar />
      </DateRangePickerContent>
    </DateRangePicker>
  );
}

function WithPresetsDemo() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  return (
    <DateRangePicker
      value={dateRange}
      onValueChange={setDateRange}
    >
      <DateRangePickerTrigger>
        <Button
          variant="outline"
          className="min-w-[280px] justify-start gap-2"
        >
          <CalendarIcon className="size-4" />
          <DateRangePickerDisplay />
        </Button>
      </DateRangePickerTrigger>

      <DateRangePickerContent showPresets>
        <DateRangePickerCalendar />
      </DateRangePickerContent>
    </DateRangePicker>
  );
}

function WithActionsDemo() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  const handleApply = React.useCallback(() => {
    console.log('Applied date range:', dateRange);
  }, [dateRange]);

  return (
    <DateRangePicker
      value={dateRange}
      onValueChange={setDateRange}
      closeOnSelect={false}
    >
      <DateRangePickerTrigger>
        <Button
          variant="outline"
          className="min-w-[280px] justify-start gap-2"
        >
          <CalendarIcon className="size-4" />
          <DateRangePickerDisplay />
        </Button>
      </DateRangePickerTrigger>

      <DateRangePickerContent showPresets>
        <div className="space-y-3">
          <DateRangePickerCalendar />
          <DateRangePickerActions onApply={handleApply} />
        </div>
      </DateRangePickerContent>
    </DateRangePicker>
  );
}

function SingleMonthDemo() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  return (
    <DateRangePicker
      value={dateRange}
      onValueChange={setDateRange}
      numberOfMonths={1}
    >
      <div className="flex items-center gap-1">
        <DateRangePickerNavigation hideNext />

        <DateRangePickerTrigger>
          <Button
            variant="outline"
            className="min-w-[240px] justify-start gap-2"
          >
            <CalendarIcon className="size-4" />
            <DateRangePickerDisplay />
          </Button>
        </DateRangePickerTrigger>

        <DateRangePickerNavigation hidePrevious />
      </div>

      <DateRangePickerContent>
        <DateRangePickerCalendar />
      </DateRangePickerContent>
    </DateRangePicker>
  );
}

function GermanLocaleDemo() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const germanPresets = React.useMemo(() => getLocalizedPresets('de'), []);

  return (
    <DateRangePicker
      value={dateRange}
      onValueChange={setDateRange}
      locale={de}
      dateFormat="dd.MM.yyyy"
      presets={germanPresets}
      placeholder="Zeitraum wählen"
    >
      <DateRangePickerTrigger>
        <Button
          variant="outline"
          className="min-w-[280px] justify-start gap-2"
        >
          <CalendarIcon className="size-4" />
          <DateRangePickerDisplay />
        </Button>
      </DateRangePickerTrigger>

      <DateRangePickerContent showPresets>
        <DateRangePickerCalendar />
      </DateRangePickerContent>
    </DateRangePicker>
  );
}

function ConstrainedDatesDemo() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  // Use state + effect to avoid hydration mismatch with new Date()
  const [minDate, setMinDate] = React.useState<Date | undefined>(undefined);
  const [maxDate, setMaxDate] = React.useState<Date | undefined>(undefined);

  React.useEffect(() => {
    const year = new Date().getFullYear();
    setMinDate(new Date(year, 0, 1));
    setMaxDate(new Date(year, 11, 31));
  }, []);

  return (
    <DateRangePicker
      value={dateRange}
      onValueChange={setDateRange}
      minDate={minDate}
      maxDate={maxDate}
    >
      <div className="flex items-center gap-1">
        <DateRangePickerNavigation hideNext />

        <DateRangePickerTrigger>
          <Button
            variant="outline"
            className="min-w-[280px] justify-start gap-2"
          >
            <CalendarIcon className="size-4" />
            <DateRangePickerDisplay />
          </Button>
        </DateRangePickerTrigger>

        <DateRangePickerNavigation hidePrevious />
      </div>

      <DateRangePickerContent>
        <DateRangePickerCalendar />
      </DateRangePickerContent>
    </DateRangePicker>
  );
}

function ControlledDemo() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClear = React.useCallback(() => {
    setDateRange(undefined);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <DateRangePicker
          value={dateRange}
          onValueChange={setDateRange}
          open={isOpen}
          onOpenChange={setIsOpen}
        >
          <DateRangePickerTrigger>
            <Button
              variant="outline"
              className="min-w-[280px] justify-start gap-2"
            >
              <CalendarIcon className="size-4" />
              <DateRangePickerDisplay />
            </Button>
          </DateRangePickerTrigger>

          <DateRangePickerContent showPresets>
            <DateRangePickerCalendar />
          </DateRangePickerContent>
        </DateRangePicker>

        <Button
          variant="outline"
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <div>
          <span className="font-medium">From:</span>
          <code className="ml-2 font-mono">{dateRange?.from?.toLocaleDateString() ?? 'Not selected'}</code>
        </div>
        <div>
          <span className="font-medium">To:</span>
          <code className="ml-2 font-mono">{dateRange?.to?.toLocaleDateString() ?? 'Not selected'}</code>
        </div>
        <div>
          <span className="font-medium">Picker state:</span>
          <span className="ml-2">{isOpen ? 'Open' : 'Closed'}</span>
        </div>
      </div>
    </div>
  );
}

interface DateRangePickerDocProps {
  sourceCode: string;
}

export function DateRangePickerDoc({ sourceCode }: DateRangePickerDocProps) {
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
            DateRangePicker is a highly configurable compound component for selecting date ranges. It features a dual-month calendar, preset
            options, external navigation controls, built-in i18n support, and SSR-friendly URL sync capabilities.
          </p>
          <p className="text-[var(--muted-foreground)]">
            The component uses a compound component pattern, allowing you to customize the trigger, navigation, calendar, presets, and
            actions independently. It supports both controlled and uncontrolled usage patterns.
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
            <h3 className="text-lg font-medium mb-3">With Presets</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Enable the presets sidebar with commonly used date ranges like "Current Month", "Last 3 Months", etc.
            </p>
            <PreviewTabs
              preview={<WithPresetsDemo />}
              codeBlock={
                <SimpleCodeblock
                  code={withPresetsCode}
                  language="tsx"
                />
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">With Action Buttons</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Add Clear, Cancel, and Apply buttons for explicit user confirmation. Set closeOnSelect to false to keep the popover open until
              the user clicks Apply.
            </p>
            <PreviewTabs
              preview={<WithActionsDemo />}
              codeBlock={
                <SimpleCodeblock
                  code={withActionsCode}
                  language="tsx"
                />
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Single Month</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Use a single month calendar for a more compact layout. The external navigation arrows select the full previous/next month. Use
              the calendar's internal navigation to browse months without changing the selection.
            </p>
            <PreviewTabs
              preview={<SingleMonthDemo />}
              codeBlock={
                <SimpleCodeblock
                  code={singleMonthCode}
                  language="tsx"
                />
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">German Locale (i18n)</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Use date-fns locales for calendar display and the built-in getLocalizedPresets function for translated preset labels. Supports
              English, German, French, and Spanish out of the box.
            </p>
            <PreviewTabs
              preview={<GermanLocaleDemo />}
              codeBlock={
                <SimpleCodeblock
                  code={germanLocaleCode}
                  language="tsx"
                />
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Constrained Date Range</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Limit selectable dates with minDate and maxDate props. Navigation buttons are automatically disabled when at the boundaries.
            </p>
            <PreviewTabs
              preview={<ConstrainedDatesDemo />}
              codeBlock={
                <SimpleCodeblock
                  code={constrainedDatesCode}
                  language="tsx"
                />
              }
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Fully Controlled</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Control both the date range value and popover open state externally for full control over the component behavior.
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
            <h3 className="text-lg font-medium mb-3">DateRangePicker Props</h3>
            <PropsTable props={dateRangePickerProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">DateRangePickerTrigger Props</h3>
            <PropsTable props={dateRangePickerTriggerProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">DateRangePickerNavigation Props</h3>
            <PropsTable props={dateRangePickerNavigationProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">DateRangePickerContent Props</h3>
            <PropsTable props={dateRangePickerContentProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">DateRangePickerActions Props</h3>
            <PropsTable props={dateRangePickerActionsProps} />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Sub-components</h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              The following sub-components are available for customizing the date range picker interface:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--muted-foreground)]">
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">DateRangePickerTrigger</code> - Button that opens the
                popover
              </li>
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">DateRangePickerNavigation</code> - External chevron arrows
                that select full previous/next month
              </li>
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">DateRangePickerContent</code> - Popover content wrapper
              </li>
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">DateRangePickerPresets</code> - Preset buttons sidebar
              </li>
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">DateRangePickerCalendar</code> - Dual-month calendar with
                internal navigation
              </li>
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">DateRangePickerDisplay</code> - Formatted date range text
              </li>
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">DateRangePickerActions</code> - Footer with
                Clear/Cancel/Apply buttons
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Utility Functions</h3>
            <p className="text-[var(--muted-foreground)] mb-4">Helper functions for common operations:</p>
            <ul className="list-disc list-inside space-y-2 text-[var(--muted-foreground)]">
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">getLocalizedPresets(localeCode)</code> - Get preset labels
                in specified language (en, de, fr, es)
              </li>
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">serializeDateRange(range, format)</code> - Serialize date
                range for URL
              </li>
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">parseDateRangeFromSearchParams(param)</code> - Parse date
                range from URL string
              </li>
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">buildDateRangeUrl(baseUrl, key, range)</code> - Build URL
                with date range param
              </li>
              <li>
                <code className="rounded bg-[var(--muted)] px-1.5 py-0.5 text-sm">useDateRangePicker()</code> - Hook to access context
                within sub-components
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
          filename="date-range-picker.tsx"
          language="tsx"
        />
      </section>
    </div>
  );
}
