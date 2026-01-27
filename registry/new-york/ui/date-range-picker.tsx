'use client';

import { addMonths, endOfMonth, endOfYear, format, startOfMonth, startOfYear, subMonths } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import * as React from 'react';
import type { Locale, Matcher } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

/* -----------------------------------------------------------------------------
 * Types
 * -------------------------------------------------------------------------- */

export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

export interface DateRangePreset {
  id: string;
  label: string;
  getRange: () => DateRange;
}

export interface DateFormatOptions {
  dateFormat?: string;
  dateSeparator?: string;
  placeholder?: string;
}

type UrlFormat = 'iso' | 'timestamp';

/* -----------------------------------------------------------------------------
 * URL Utilities (SSR-friendly)
 * -------------------------------------------------------------------------- */

export function serializeDateRange(range: DateRange | undefined, urlFormat: UrlFormat = 'iso'): string {
  if (!range?.from) return '';

  if (urlFormat === 'timestamp') {
    const from = range.from.getTime().toString();
    const to = range.to ? range.to.getTime().toString() : '';
    return `${from}_${to}`;
  }

  const from = range.from.toISOString().split('T')[0];
  const to = range.to ? range.to.toISOString().split('T')[0] : '';
  return `${from}_${to}`;
}

export function parseDateRangeFromSearchParams(param: string | undefined): DateRange | undefined {
  if (!param) return undefined;

  const parts = param.split('_');
  if (parts.length < 1) return undefined;

  const fromStr = parts[0];
  const toStr = parts[1];

  // Try timestamp format first
  const fromTimestamp = Number(fromStr);
  if (!Number.isNaN(fromTimestamp) && fromTimestamp > 1e10) {
    const from = new Date(fromTimestamp);
    const to = toStr ? new Date(Number(toStr)) : undefined;
    if (!Number.isNaN(from.getTime())) {
      return { from, to: to && !Number.isNaN(to.getTime()) ? to : undefined };
    }
  }

  // Try ISO format
  const from = new Date(fromStr);
  const to = toStr ? new Date(toStr) : undefined;

  if (Number.isNaN(from.getTime())) return undefined;

  return {
    from,
    to: to && !Number.isNaN(to.getTime()) ? to : undefined,
  };
}

export function buildDateRangeUrl(baseUrl: string, key: string, range: DateRange | undefined, urlFormat: UrlFormat = 'iso'): string {
  const url = new URL(baseUrl, 'http://placeholder');
  const serialized = serializeDateRange(range, urlFormat);

  if (serialized) {
    url.searchParams.set(key, serialized);
  } else {
    url.searchParams.delete(key);
  }

  return `${url.pathname}${url.search}`;
}

/* -----------------------------------------------------------------------------
 * i18n Preset Translations
 * -------------------------------------------------------------------------- */

const presetTranslations: Record<string, Record<string, string>> = {
  en: {
    'current-month': 'Current Month',
    'last-month': 'Last Month',
    'last-3-months': 'Last 3 Months',
    'last-6-months': 'Last 6 Months',
    'current-year': 'Current Year',
    'last-year': 'Last Year',
  },
  de: {
    'current-month': 'Aktueller Monat',
    'last-month': 'Letzter Monat',
    'last-3-months': 'Letzte 3 Monate',
    'last-6-months': 'Letzte 6 Monate',
    'current-year': 'Aktuelles Jahr',
    'last-year': 'Letztes Jahr',
  },
  fr: {
    'current-month': 'Mois en cours',
    'last-month': 'Mois dernier',
    'last-3-months': '3 derniers mois',
    'last-6-months': '6 derniers mois',
    'current-year': 'Année en cours',
    'last-year': "L'année dernière",
  },
  es: {
    'current-month': 'Mes actual',
    'last-month': 'Mes pasado',
    'last-3-months': 'Últimos 3 meses',
    'last-6-months': 'Últimos 6 meses',
    'current-year': 'Año actual',
    'last-year': 'Año pasado',
  },
};

function getPresetLabel(id: string, localeCode: string): string {
  const translations = presetTranslations[localeCode] || presetTranslations.en;
  return translations[id] || presetTranslations.en[id] || id;
}

/* -----------------------------------------------------------------------------
 * Default Presets
 * -------------------------------------------------------------------------- */

function createDefaultPresets(localeCode = 'en'): DateRangePreset[] {
  // Note: Don't capture `new Date()` here - it must be inside getRange()
  // to avoid hydration mismatches between server and client

  return [
    {
      id: 'current-month',
      label: getPresetLabel('current-month', localeCode),
      getRange: () => {
        const now = new Date();
        return {
          from: startOfMonth(now),
          to: endOfMonth(now),
        };
      },
    },
    {
      id: 'last-month',
      label: getPresetLabel('last-month', localeCode),
      getRange: () => {
        const now = new Date();
        const lastMonth = subMonths(now, 1);
        return {
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth),
        };
      },
    },
    {
      id: 'last-3-months',
      label: getPresetLabel('last-3-months', localeCode),
      getRange: () => {
        const now = new Date();
        return {
          from: startOfMonth(subMonths(now, 2)),
          to: endOfMonth(now),
        };
      },
    },
    {
      id: 'last-6-months',
      label: getPresetLabel('last-6-months', localeCode),
      getRange: () => {
        const now = new Date();
        return {
          from: startOfMonth(subMonths(now, 5)),
          to: endOfMonth(now),
        };
      },
    },
    {
      id: 'current-year',
      label: getPresetLabel('current-year', localeCode),
      getRange: () => {
        const now = new Date();
        return {
          from: startOfYear(now),
          to: endOfYear(now),
        };
      },
    },
    {
      id: 'last-year',
      label: getPresetLabel('last-year', localeCode),
      getRange: () => {
        const now = new Date();
        const lastYear = new Date(now.getFullYear() - 1, 0, 1);
        return {
          from: startOfYear(lastYear),
          to: endOfYear(lastYear),
        };
      },
    },
  ];
}

export const defaultPresets = createDefaultPresets('en');

export function getLocalizedPresets(localeCode = 'en'): DateRangePreset[] {
  return createDefaultPresets(localeCode);
}

/* -----------------------------------------------------------------------------
 * Context
 * -------------------------------------------------------------------------- */

interface DateRangePickerContextValue {
  // Value
  value: DateRange | undefined;
  setValue: (value: DateRange | undefined) => void;

  // Open state
  open: boolean;
  setOpen: (open: boolean) => void;

  // Month navigation (for calendar view)
  month: Date;
  setMonth: (month: Date) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;

  // Month selection (for external navigation - selects full month as date range)
  selectPreviousMonth: () => void;
  selectNextMonth: () => void;

  // Presets
  presets: DateRangePreset[];
  selectedPresetId: string | null;
  selectPreset: (preset: DateRangePreset) => void;

  // Formatting
  dateFormat: string;
  dateSeparator: string;
  placeholder: string;
  locale?: Locale;

  // Calendar config
  numberOfMonths: number;
  minDate?: Date;
  maxDate?: Date;
  disabled?: Matcher | Matcher[];
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showWeekNumber: boolean;
  fixedWeeks: boolean;
  modifiers?: Record<string, Matcher>;
  modifiersClassNames?: Record<string, string>;
  disableNavigation: boolean;

  // Behavior
  closeOnSelect: boolean;
  isDisabled: boolean;

  // Form
  name?: string;
  required?: boolean;

  // Clear
  clear: () => void;
}

const DateRangePickerContext = React.createContext<DateRangePickerContextValue | null>(null);

export function useDateRangePicker(): DateRangePickerContextValue {
  const context = React.useContext(DateRangePickerContext);
  if (!context) {
    throw new Error('useDateRangePicker must be used within a DateRangePicker');
  }
  return context;
}

/* -----------------------------------------------------------------------------
 * DateRangePicker (Root)
 * -------------------------------------------------------------------------- */

export interface DateRangePickerProps {
  // Value control
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange | undefined) => void;

  // Open state
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Month navigation
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;

  // Formatting
  dateFormat?: string;
  dateSeparator?: string;
  placeholder?: string;
  locale?: Locale;

  // Presets
  presets?: DateRangePreset[];
  onPresetSelect?: (preset: DateRangePreset) => void;

  // Calendar config
  numberOfMonths?: number;
  minDate?: Date;
  maxDate?: Date;
  disabled?: Matcher | Matcher[];
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  showWeekNumber?: boolean;
  fixedWeeks?: boolean;
  modifiers?: Record<string, Matcher>;
  modifiersClassNames?: Record<string, string>;
  disableNavigation?: boolean;

  // Behavior
  closeOnSelect?: boolean;

  // URL Search Param Sync
  urlParamKey?: string;
  urlFormat?: UrlFormat;
  onUrlChange?: (url: string) => void;

  // Form integration
  name?: string;
  required?: boolean;
  isDisabled?: boolean;

  children: React.ReactNode;
}

export function DateRangePicker({
  // Value control
  value: controlledValue,
  defaultValue,
  onValueChange,

  // Open state
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,

  // Month navigation
  month: controlledMonth,
  defaultMonth,
  onMonthChange,

  // Formatting
  dateFormat = 'dd.MM.yyyy',
  dateSeparator = ' - ',
  placeholder = 'Select date range',
  locale,

  // Presets
  presets = defaultPresets,
  onPresetSelect,

  // Calendar config
  numberOfMonths = 2,
  minDate,
  maxDate,
  disabled,
  weekStartsOn = 1,
  showWeekNumber = false,
  fixedWeeks = false,
  modifiers,
  modifiersClassNames,
  disableNavigation = false,

  // Behavior
  closeOnSelect = true,

  // URL sync
  urlParamKey,
  urlFormat = 'iso',
  onUrlChange,

  // Form
  name,
  required,
  isDisabled = false,

  children,
}: DateRangePickerProps) {
  // Lazy state initialization for internal value
  const [internalValue, setInternalValue] = React.useState<DateRange | undefined>(() => defaultValue);

  // Lazy state initialization for internal open state
  const [internalOpen, setInternalOpen] = React.useState(() => defaultOpen);

  // Lazy state initialization for month navigation
  // Don't use new Date() here to avoid hydration mismatch - use undefined and set after mount
  const [internalMonth, setInternalMonth] = React.useState<Date | undefined>(() => defaultMonth ?? defaultValue?.from);

  // Track selected preset
  const [selectedPresetId, setSelectedPresetId] = React.useState<string | null>(null);

  // Set default month after mount to avoid hydration mismatch
  React.useEffect(() => {
    if (internalMonth === undefined && controlledMonth === undefined) {
      setInternalMonth(new Date());
    }
  }, [internalMonth, controlledMonth]);

  // Determine controlled vs uncontrolled
  const value = controlledValue ?? internalValue;
  const open = controlledOpen ?? internalOpen;
  // Use a stable fallback during SSR - will be updated after mount
  const month = controlledMonth ?? internalMonth ?? new Date(0);

  // Stable setValue callback using functional setState
  const setValue = React.useCallback(
    (newValue: DateRange | undefined) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);

      // URL sync
      if (urlParamKey && onUrlChange) {
        const newUrl = buildDateRangeUrl(window.location.pathname + window.location.search, urlParamKey, newValue, urlFormat);
        onUrlChange(newUrl);
      }
    },
    [controlledValue, onValueChange, urlParamKey, urlFormat, onUrlChange],
  );

  // Stable setOpen callback
  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [controlledOpen, onOpenChange],
  );

  // Stable setMonth callback
  const setMonth = React.useCallback(
    (newMonth: Date) => {
      if (controlledMonth === undefined) {
        setInternalMonth(newMonth);
      }
      onMonthChange?.(newMonth);
    },
    [controlledMonth, onMonthChange],
  );

  // Stable navigation callbacks using functional setState (for calendar view navigation)
  const goToPreviousMonth = React.useCallback(() => {
    setMonth(subMonths(month, 1));
  }, [month, setMonth]);

  const goToNextMonth = React.useCallback(() => {
    setMonth(addMonths(month, 1));
  }, [month, setMonth]);

  // Month selection callbacks (for external navigation - selects full month as date range)
  const selectPreviousMonth = React.useCallback(() => {
    const currentFrom = value?.from ?? new Date();
    const prevMonth = subMonths(currentFrom, 1);
    const newRange: DateRange = {
      from: startOfMonth(prevMonth),
      to: endOfMonth(prevMonth),
    };
    setValue(newRange);
    setMonth(startOfMonth(prevMonth));
    setSelectedPresetId(null);
  }, [value, setValue, setMonth]);

  const selectNextMonth = React.useCallback(() => {
    const currentFrom = value?.from ?? new Date();
    const nextMonth = addMonths(currentFrom, 1);
    const newRange: DateRange = {
      from: startOfMonth(nextMonth),
      to: endOfMonth(nextMonth),
    };
    setValue(newRange);
    setMonth(startOfMonth(nextMonth));
    setSelectedPresetId(null);
  }, [value, setValue, setMonth]);

  // Select preset callback
  const selectPreset = React.useCallback(
    (preset: DateRangePreset) => {
      const range = preset.getRange();
      setValue(range);
      setSelectedPresetId(preset.id);
      onPresetSelect?.(preset);

      // Move calendar to show the preset range
      if (range.from) {
        setMonth(range.from);
      }

      if (closeOnSelect) {
        setOpen(false);
      }
    },
    [setValue, setMonth, closeOnSelect, setOpen, onPresetSelect],
  );

  // Clear callback
  const clear = React.useCallback(() => {
    setValue(undefined);
    setSelectedPresetId(null);
  }, [setValue]);

  // Auto-close when range is complete (both dates selected)
  const previousValueRef = React.useRef<DateRange | undefined>(value);
  React.useEffect(() => {
    const prevValue = previousValueRef.current;
    previousValueRef.current = value;

    // Only auto-close if:
    // 1. closeOnSelect is enabled
    // 2. Popover is open
    // 3. We now have both from and to dates
    // 4. We previously had incomplete selection (missing to)
    if (closeOnSelect && open && value?.from && value?.to && prevValue?.from && !prevValue?.to) {
      setOpen(false);
    }
  }, [value, closeOnSelect, open, setOpen]);

  // Memoize context value
  const contextValue = React.useMemo<DateRangePickerContextValue>(
    () => ({
      value,
      setValue,
      open,
      setOpen,
      month,
      setMonth,
      goToPreviousMonth,
      goToNextMonth,
      selectPreviousMonth,
      selectNextMonth,
      presets,
      selectedPresetId,
      selectPreset,
      dateFormat,
      dateSeparator,
      placeholder,
      locale,
      numberOfMonths,
      minDate,
      maxDate,
      disabled,
      weekStartsOn,
      showWeekNumber,
      fixedWeeks,
      modifiers,
      modifiersClassNames,
      disableNavigation,
      closeOnSelect,
      isDisabled,
      name,
      required,
      clear,
    }),
    [
      value,
      setValue,
      open,
      setOpen,
      month,
      setMonth,
      goToPreviousMonth,
      goToNextMonth,
      selectPreviousMonth,
      selectNextMonth,
      presets,
      selectedPresetId,
      selectPreset,
      dateFormat,
      dateSeparator,
      placeholder,
      locale,
      numberOfMonths,
      minDate,
      maxDate,
      disabled,
      weekStartsOn,
      showWeekNumber,
      fixedWeeks,
      modifiers,
      modifiersClassNames,
      disableNavigation,
      closeOnSelect,
      isDisabled,
      name,
      required,
      clear,
    ],
  );

  return (
    <DateRangePickerContext.Provider value={contextValue}>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        {children}
        {/* Hidden form input */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={value ? JSON.stringify({ from: value.from?.toISOString(), to: value.to?.toISOString() }) : ''}
            required={required}
          />
        )}
      </Popover>
    </DateRangePickerContext.Provider>
  );
}

/* -----------------------------------------------------------------------------
 * DateRangePickerTrigger
 * -------------------------------------------------------------------------- */

export interface DateRangePickerTriggerProps extends Omit<React.ComponentProps<typeof PopoverTrigger>, 'render'> {
  children: React.ReactElement;
}

export function DateRangePickerTrigger({ className, children, ...props }: DateRangePickerTriggerProps) {
  const { isDisabled } = useDateRangePicker();

  return (
    <PopoverTrigger
      data-slot="date-range-picker-trigger"
      render={children}
      disabled={isDisabled}
      className={className}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------
 * DateRangePickerNavigation
 * -------------------------------------------------------------------------- */

export interface DateRangePickerNavigationProps extends React.ComponentProps<'div'> {
  hidePrevious?: boolean;
  hideNext?: boolean;
}

export function DateRangePickerNavigation({ className, hidePrevious, hideNext, ...props }: DateRangePickerNavigationProps) {
  const { selectPreviousMonth, selectNextMonth, minDate, maxDate, value, disableNavigation, isDisabled } = useDateRangePicker();

  if (disableNavigation) return null;

  // Check if navigation should be disabled due to min/max constraints
  // Don't use new Date() here to avoid hydration mismatch - if no value, don't disable
  const currentFrom = value?.from;
  const isPrevDisabled = currentFrom && minDate ? startOfMonth(subMonths(currentFrom, 1)) < startOfMonth(minDate) : false;
  const isNextDisabled = currentFrom && maxDate ? endOfMonth(addMonths(currentFrom, 1)) > endOfMonth(maxDate) : false;

  return (
    <div
      data-slot="date-range-picker-navigation"
      className={cn('flex items-center gap-0.5', className)}
      {...props}
    >
      {!hidePrevious && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={selectPreviousMonth}
          disabled={isPrevDisabled || isDisabled}
          aria-label="Select previous month"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>
      )}
      {!hideNext && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={selectNextMonth}
          disabled={isNextDisabled || isDisabled}
          aria-label="Select next month"
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      )}
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * DateRangePickerContent
 * -------------------------------------------------------------------------- */

export interface DateRangePickerContentProps extends React.ComponentProps<typeof PopoverContent> {
  showPresets?: boolean;
}

export function DateRangePickerContent({ className, children, showPresets = false, ...props }: DateRangePickerContentProps) {
  return (
    <PopoverContent
      data-slot="date-range-picker-content"
      className={cn('w-auto p-0', className)}
      align="start"
      {...props}
    >
      <div className={cn('flex', showPresets && 'flex-row')}>
        {showPresets && <DateRangePickerPresets className="border-r" />}
        <div className="p-3">{children}</div>
      </div>
    </PopoverContent>
  );
}

/* -----------------------------------------------------------------------------
 * DateRangePickerPresets
 * -------------------------------------------------------------------------- */

export interface DateRangePickerPresetsProps extends React.ComponentProps<'div'> {}

const PresetButton = React.memo(function PresetButton({
  preset,
  isSelected,
  onSelect,
  disabled,
}: {
  preset: DateRangePreset;
  isSelected: boolean;
  onSelect: (preset: DateRangePreset) => void;
  disabled: boolean;
}) {
  return (
    <Button
      type="button"
      variant={isSelected ? 'secondary' : 'ghost'}
      size="sm"
      className="justify-start"
      onClick={() => onSelect(preset)}
      disabled={disabled}
    >
      {preset.label}
    </Button>
  );
});

export function DateRangePickerPresets({ className, ...props }: DateRangePickerPresetsProps) {
  const { presets, selectedPresetId, selectPreset, isDisabled } = useDateRangePicker();

  return (
    <div
      data-slot="date-range-picker-presets"
      className={cn('flex flex-col gap-1 p-3 min-w-[160px]', className)}
      {...props}
    >
      {presets.map((preset) => (
        <PresetButton
          key={preset.id}
          preset={preset}
          isSelected={selectedPresetId === preset.id}
          onSelect={selectPreset}
          disabled={isDisabled}
        />
      ))}
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * DateRangePickerCalendar
 * -------------------------------------------------------------------------- */

export interface DateRangePickerCalendarProps
  extends Omit<React.ComponentProps<typeof Calendar>, 'mode' | 'selected' | 'onSelect' | 'month' | 'onMonthChange'> {}

export function DateRangePickerCalendar({ className, classNames, ...props }: DateRangePickerCalendarProps) {
  const {
    value,
    setValue,
    month,
    setMonth,
    numberOfMonths,
    minDate,
    maxDate,
    disabled,
    locale,
    weekStartsOn,
    showWeekNumber,
    fixedWeeks,
    modifiers,
    modifiersClassNames,
    disableNavigation,
    isDisabled,
  } = useDateRangePicker();

  // Handle range selection
  const handleSelect = React.useCallback(
    (range: DateRange | undefined) => {
      setValue(range);
    },
    [setValue],
  );

  return (
    <Calendar
      data-slot="date-range-picker-calendar"
      mode="range"
      selected={value}
      onSelect={handleSelect}
      month={month}
      onMonthChange={setMonth}
      numberOfMonths={numberOfMonths}
      disabled={disabled || isDisabled}
      locale={locale}
      weekStartsOn={weekStartsOn}
      showWeekNumber={showWeekNumber}
      fixedWeeks={fixedWeeks}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      startMonth={minDate}
      endMonth={maxDate}
      className={className}
      classNames={{
        // Only hide internal navigation if explicitly disabled
        ...(disableNavigation ? { nav: 'hidden' } : {}),
        ...classNames,
      }}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------
 * DateRangePickerDisplay
 * -------------------------------------------------------------------------- */

export interface DateRangePickerDisplayProps extends React.ComponentProps<'span'> {}

export function DateRangePickerDisplay({ className, ...props }: DateRangePickerDisplayProps) {
  const { value, dateFormat, dateSeparator, placeholder, locale } = useDateRangePicker();

  // Memoize formatted display string
  const formattedRange = React.useMemo(() => {
    if (!value?.from) return placeholder;

    const fromFormatted = format(value.from, dateFormat, { locale });

    if (!value.to) {
      return `${fromFormatted}${dateSeparator}...`;
    }

    const toFormatted = format(value.to, dateFormat, { locale });
    return `${fromFormatted}${dateSeparator}${toFormatted}`;
  }, [value, dateFormat, dateSeparator, placeholder, locale]);

  const isPlaceholder = !value?.from;

  return (
    <span
      data-slot="date-range-picker-display"
      className={cn(isPlaceholder && 'text-muted-foreground', className)}
      {...props}
    >
      {formattedRange}
    </span>
  );
}

/* -----------------------------------------------------------------------------
 * DateRangePickerActions
 * -------------------------------------------------------------------------- */

export interface DateRangePickerActionsProps extends React.ComponentProps<'div'> {
  showClear?: boolean;
  showCancel?: boolean;
  showApply?: boolean;
  clearLabel?: string;
  cancelLabel?: string;
  applyLabel?: string;
  onApply?: () => void;
}

export function DateRangePickerActions({
  className,
  showClear = true,
  showCancel = true,
  showApply = true,
  clearLabel = 'Clear',
  cancelLabel = 'Cancel',
  applyLabel = 'Apply',
  onApply,
  ...props
}: DateRangePickerActionsProps) {
  const { clear, setOpen, value, isDisabled } = useDateRangePicker();

  const handleCancel = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleApply = React.useCallback(() => {
    onApply?.();
    setOpen(false);
  }, [onApply, setOpen]);

  return (
    <div
      data-slot="date-range-picker-actions"
      className={cn('flex items-center justify-end gap-2 border-t pt-3', className)}
      {...props}
    >
      {showClear && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clear}
          disabled={!value || isDisabled}
        >
          {clearLabel}
        </Button>
      )}
      <div className="flex-1" />
      {showCancel && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCancel}
          disabled={isDisabled}
        >
          {cancelLabel}
        </Button>
      )}
      {showApply && (
        <Button
          type="button"
          size="sm"
          onClick={handleApply}
          disabled={isDisabled}
        >
          {applyLabel}
        </Button>
      )}
    </div>
  );
}
