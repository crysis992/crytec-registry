'use client';

import { Button } from '@components/button';
import { Input } from '@components/input';
import { Popover, PopoverContent, PopoverTrigger } from '@components/popover';
import { Pipette } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

/* -----------------------------------------------------------------------------
 * Color Utilities
 * -------------------------------------------------------------------------- */

type ColorFormat = 'hex' | 'rgb' | 'hsl';

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface HSV {
  h: number;
  s: number;
  v: number;
}

function hexToRgb(hex: string): RGB | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / d + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number): RGB {
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;

  let r: number;
  let g: number;
  let b: number;

  if (sNorm === 0) {
    r = g = b = lNorm;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      let tNorm = t;
      if (tNorm < 0) tNorm += 1;
      if (tNorm > 1) tNorm -= 1;
      if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
      if (tNorm < 1 / 2) return q;
      if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
      return p;
    };

    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
    const p = 2 * lNorm - q;

    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToHsv(r: number, g: number, b: number): HSV {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const d = max - min;

  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / d + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, v: v * 100 };
}

function hsvToRgb(h: number, s: number, v: number): RGB {
  const sNorm = s / 100;
  const vNorm = v / 100;
  const c = vNorm * sNorm;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = vNorm - c;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (h >= 0 && h < 60) {
    rPrime = c;
    gPrime = x;
  } else if (h >= 60 && h < 120) {
    rPrime = x;
    gPrime = c;
  } else if (h >= 120 && h < 180) {
    gPrime = c;
    bPrime = x;
  } else if (h >= 180 && h < 240) {
    gPrime = x;
    bPrime = c;
  } else if (h >= 240 && h < 300) {
    rPrime = x;
    bPrime = c;
  } else {
    rPrime = c;
    bPrime = x;
  }

  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255),
  };
}

function parseColor(color: string): { rgb: RGB; hsl: HSL; hsv: HSV; hex: string } | null {
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    if (rgb) {
      return {
        rgb,
        hsl: rgbToHsl(rgb.r, rgb.g, rgb.b),
        hsv: rgbToHsv(rgb.r, rgb.g, rgb.b),
        hex: rgbToHex(rgb.r, rgb.g, rgb.b).toLowerCase(),
      };
    }
  }

  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (rgbMatch) {
    const r = Number.parseInt(rgbMatch[1], 10);
    const g = Number.parseInt(rgbMatch[2], 10);
    const b = Number.parseInt(rgbMatch[3], 10);
    return {
      rgb: { r, g, b },
      hsl: rgbToHsl(r, g, b),
      hsv: rgbToHsv(r, g, b),
      hex: rgbToHex(r, g, b).toLowerCase(),
    };
  }

  const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*[\d.]+)?\)/);
  if (hslMatch) {
    const h = Number.parseInt(hslMatch[1], 10);
    const s = Number.parseInt(hslMatch[2], 10);
    const l = Number.parseInt(hslMatch[3], 10);
    const rgb = hslToRgb(h, s, l);
    return {
      rgb,
      hsl: { h, s, l },
      hsv: rgbToHsv(rgb.r, rgb.g, rgb.b),
      hex: rgbToHex(rgb.r, rgb.g, rgb.b).toLowerCase(),
    };
  }

  return null;
}

function formatColor(color: { rgb: RGB; hsl: HSL; hex: string }, format: ColorFormat): string {
  switch (format) {
    case 'hex':
      return color.hex;
    case 'rgb':
      return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
    case 'hsl':
      return `hsl(${Math.round(color.hsl.h)}, ${Math.round(color.hsl.s)}%, ${Math.round(color.hsl.l)}%)`;
    default:
      return color.hex;
  }
}

/* -----------------------------------------------------------------------------
 * Drag Hook
 * -------------------------------------------------------------------------- */

function usePointerDrag(onDrag: (x: number, y: number) => void) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const getPosition = React.useCallback((e: { clientX: number; clientY: number }) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
    };
  }, []);

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(true);
      const pos = getPosition(e);
      if (pos) onDrag(pos.x, pos.y);
    },
    [getPosition, onDrag],
  );

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: PointerEvent) => {
      const pos = getPosition(e);
      if (pos) onDrag(pos.x, pos.y);
    };

    const handleUp = () => setIsDragging(false);

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
    return () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
    };
  }, [isDragging, getPosition, onDrag]);

  return { ref, handlePointerDown };
}

/* -----------------------------------------------------------------------------
 * Context
 * -------------------------------------------------------------------------- */

interface ColorPickerContextValue {
  value: string;
  setValue: (value: string) => void;
  format: ColorFormat;
  setFormat: (format: ColorFormat) => void;
  color: { rgb: RGB; hsl: HSL; hsv: HSV; hex: string };
  disabled?: boolean;
}

const ColorPickerContext = React.createContext<ColorPickerContextValue | null>(null);

function useColorPicker() {
  const context = React.useContext(ColorPickerContext);
  if (!context) {
    throw new Error('useColorPicker must be used within a ColorPicker');
  }
  return context;
}

/* -----------------------------------------------------------------------------
 * ColorPicker (Root)
 * -------------------------------------------------------------------------- */

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultFormat?: ColorFormat;
  disabled?: boolean;
  children: React.ReactNode;
}

const DEFAULT_COLOR = { rgb: { r: 0, g: 0, b: 0 }, hsl: { h: 0, s: 0, l: 0 }, hsv: { h: 0, s: 0, v: 0 }, hex: '#000000' };

export function ColorPicker({
  value: controlledValue,
  defaultValue = '#000000',
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  defaultFormat = 'hex',
  disabled,
  children,
}: ColorPickerProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [format, setFormat] = React.useState<ColorFormat>(defaultFormat);

  const value = controlledValue ?? internalValue;
  const open = controlledOpen ?? internalOpen;

  const parsedColor = React.useMemo(() => parseColor(value) || DEFAULT_COLOR, [value]);

  const setValue = React.useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) setInternalValue(newValue);
      onValueChange?.(newValue);
    },
    [controlledValue, onValueChange],
  );

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) setInternalOpen(newOpen);
      onOpenChange?.(newOpen);
    },
    [controlledOpen, onOpenChange],
  );

  const contextValue = React.useMemo<ColorPickerContextValue>(
    () => ({ value, setValue, format, setFormat, color: parsedColor, disabled }),
    [value, setValue, format, parsedColor, disabled],
  );

  return (
    <ColorPickerContext.Provider value={contextValue}>
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        {children}
      </Popover>
    </ColorPickerContext.Provider>
  );
}

/* -----------------------------------------------------------------------------
 * ColorPickerTrigger
 * -------------------------------------------------------------------------- */

export interface ColorPickerTriggerProps extends React.ComponentProps<typeof PopoverTrigger> {}

export function ColorPickerTrigger({ className, children, ...props }: ColorPickerTriggerProps) {
  const { disabled } = useColorPicker();

  return (
    <PopoverTrigger
      asChild
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </PopoverTrigger>
  );
}

/* -----------------------------------------------------------------------------
 * ColorPickerContent
 * -------------------------------------------------------------------------- */

export interface ColorPickerContentProps extends React.ComponentProps<typeof PopoverContent> {}

export function ColorPickerContent({ className, children, ...props }: ColorPickerContentProps) {
  return (
    <PopoverContent
      className={cn('w-auto p-3 bg-[var(--popover)] text-[var(--popover-foreground)]', className)}
      {...props}
    >
      {children}
    </PopoverContent>
  );
}

/* -----------------------------------------------------------------------------
 * ColorPickerSwatch
 * -------------------------------------------------------------------------- */

export interface ColorPickerSwatchProps extends React.ComponentProps<'div'> {}

export function ColorPickerSwatch({ className, ...props }: ColorPickerSwatchProps) {
  const { value } = useColorPicker();

  return (
    <div
      data-slot="colorpicker-swatch"
      className={cn('size-4 rounded border border-[var(--border)]', className)}
      style={{ backgroundColor: value }}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------
 * ColorPickerArea
 * -------------------------------------------------------------------------- */

export interface ColorPickerAreaProps extends React.ComponentProps<'div'> {}

export function ColorPickerArea({ className, ...props }: ColorPickerAreaProps) {
  const { color, setValue } = useColorPicker();

  const handleDrag = React.useCallback(
    (x: number, y: number) => {
      const newRgb = hsvToRgb(color.hsv.h, x * 100, (1 - y) * 100);
      setValue(rgbToHex(newRgb.r, newRgb.g, newRgb.b).toLowerCase());
    },
    [color.hsv.h, setValue],
  );

  const { ref, handlePointerDown } = usePointerDrag(handleDrag);

  const hueColor = React.useMemo(() => {
    const rgb = hsvToRgb(color.hsv.h, 100, 100);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }, [color.hsv.h]);

  return (
    <div
      ref={ref}
      data-slot="colorpicker-area"
      className={cn('relative h-40 w-full rounded-md border border-[var(--border)] cursor-crosshair overflow-hidden', className)}
      onPointerDown={handlePointerDown}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to right, #fff 0%, ${hueColor} 100%)` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)' }}
      />
      <div
        className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg pointer-events-none z-10"
        style={{ left: `${color.hsv.s}%`, top: `${100 - color.hsv.v}%` }}
      />
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * ColorPickerHueSlider
 * -------------------------------------------------------------------------- */

export interface ColorPickerHueSliderProps extends React.ComponentProps<'div'> {}

export function ColorPickerHueSlider({ className, ...props }: ColorPickerHueSliderProps) {
  const { color, setValue } = useColorPicker();

  const handleDrag = React.useCallback(
    (x: number) => {
      const newRgb = hsvToRgb(x * 360, color.hsv.s, color.hsv.v);
      setValue(rgbToHex(newRgb.r, newRgb.g, newRgb.b).toLowerCase());
    },
    [color.hsv.s, color.hsv.v, setValue],
  );

  const { ref, handlePointerDown } = usePointerDrag((x) => handleDrag(x));

  return (
    <div
      ref={ref}
      data-slot="colorpicker-hue-slider"
      className={cn('relative h-3 w-full rounded-md border border-[var(--border)] cursor-pointer overflow-hidden', className)}
      onPointerDown={handlePointerDown}
      {...props}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
        }}
      />
      <div
        className="absolute top-0 bottom-0 w-1 -translate-x-1/2 rounded-full border-2 border-white shadow-lg pointer-events-none"
        style={{ left: `${(color.hsv.h / 360) * 100}%` }}
      />
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * ColorPickerFormatSelect
 * -------------------------------------------------------------------------- */

export interface ColorPickerFormatSelectProps extends React.ComponentProps<'select'> {}

export function ColorPickerFormatSelect({ className, ...props }: ColorPickerFormatSelectProps) {
  const { format, setFormat } = useColorPicker();

  return (
    <select
      data-slot="colorpicker-format-select"
      value={format}
      onChange={(e) => setFormat(e.target.value as ColorFormat)}
      className={cn(
        'h-9 rounded-md border border-[var(--input)] bg-[var(--background)] px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)]',
        className,
      )}
      {...props}
    >
      <option value="hex">HEX</option>
      <option value="rgb">RGB</option>
      <option value="hsl">HSL</option>
    </select>
  );
}

/* -----------------------------------------------------------------------------
 * ColorPickerInput
 * -------------------------------------------------------------------------- */

export interface ColorPickerInputProps extends Omit<React.ComponentProps<typeof Input>, 'value' | 'onChange'> {}

export function ColorPickerInput({ className, ...props }: ColorPickerInputProps) {
  const { color, format, setValue } = useColorPicker();
  const [inputValue, setInputValue] = React.useState(formatColor(color, format));

  React.useEffect(() => {
    setInputValue(formatColor(color, format));
  }, [color, format]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      const parsed = parseColor(newValue);
      if (parsed) setValue(parsed.hex);
    },
    [setValue],
  );

  return (
    <Input
      data-slot="colorpicker-input"
      value={inputValue}
      onChange={handleChange}
      className={className}
      {...props}
    />
  );
}

/* -----------------------------------------------------------------------------
 * ColorPickerEyeDropper
 * -------------------------------------------------------------------------- */

export interface ColorPickerEyeDropperProps extends React.ComponentProps<typeof Button> {}

export function ColorPickerEyeDropper({ className, ...props }: ColorPickerEyeDropperProps) {
  const { setValue } = useColorPicker();
  const [isSupported, setIsSupported] = React.useState(false);

  React.useEffect(() => {
    setIsSupported('EyeDropper' in window);
  }, []);

  const handleClick = React.useCallback(async () => {
    if (!('EyeDropper' in window)) return;

    try {
      // @ts-expect-error - EyeDropper API is not in types
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      if (result.sRGBHex) setValue(result.sRGBHex.toLowerCase());
    } catch {
      // User cancelled or error occurred
    }
  }, [setValue]);

  if (!isSupported) return null;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleClick}
      className={cn('shrink-0', className)}
      {...props}
    >
      <Pipette className="size-4" />
      <span className="sr-only">Pick color from screen</span>
    </Button>
  );
}
