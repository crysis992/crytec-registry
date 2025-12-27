'use client';

import { Button } from '@components/button';
import { Input } from '@components/input';
import { Popover, PopoverContent, PopoverTrigger } from '@components/popover';
import { Droplet } from 'lucide-react';
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

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100,
  };
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

function parseColor(color: string): { rgb: RGB; hsl: HSL; hex: string } | null {
  // Try hex first
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      // Normalize hex to lowercase and ensure 6 digits
      const normalizedHex = rgbToHex(rgb.r, rgb.g, rgb.b).toLowerCase();
      return { rgb, hsl, hex: normalizedHex };
    }
  }

  // Try rgb/rgba
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (rgbMatch) {
    const r = Number.parseInt(rgbMatch[1], 10);
    const g = Number.parseInt(rgbMatch[2], 10);
    const b = Number.parseInt(rgbMatch[3], 10);
    const hex = rgbToHex(r, g, b).toLowerCase();
    const hsl = rgbToHsl(r, g, b);
    return { rgb: { r, g, b }, hsl, hex };
  }

  // Try hsl/hsla
  const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*[\d.]+)?\)/);
  if (hslMatch) {
    const h = Number.parseInt(hslMatch[1], 10);
    const s = Number.parseInt(hslMatch[2], 10);
    const l = Number.parseInt(hslMatch[3], 10);
    const rgb = hslToRgb(h, s, l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b).toLowerCase();
    return { rgb, hsl: { h, s, l }, hex };
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
 * Types
 * -------------------------------------------------------------------------- */

interface ColorPickerContextValue {
  value: string;
  setValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  format: ColorFormat;
  setFormat: (format: ColorFormat) => void;
  color: { rgb: RGB; hsl: HSL; hex: string };
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

  const parsedColor = React.useMemo(() => {
    const parsed = parseColor(value);
    return parsed || { rgb: { r: 0, g: 0, b: 0 }, hsl: { h: 0, s: 0, l: 0 }, hex: '#000000' };
  }, [value]);

  const setValue = React.useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [controlledValue, onValueChange],
  );

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [controlledOpen, onOpenChange],
  );

  const contextValue = React.useMemo<ColorPickerContextValue>(
    () => ({
      value,
      setValue,
      open,
      setOpen,
      format,
      setFormat,
      color: parsedColor,
      disabled,
    }),
    [value, setValue, open, setOpen, format, parsedColor, disabled],
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
      className={cn('w-auto p-3', className)}
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
  const areaRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(true);
      const rect = areaRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

      const s = x * 100;
      const l = (1 - y) * 100;

      const newRgb = hslToRgb(color.hsl.h, s, l);
      const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b).toLowerCase();
      setValue(newHex);
    },
    [color.hsl.h, setValue],
  );

  const handlePointerMove = React.useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return;
      const rect = areaRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

      const s = x * 100;
      const l = (1 - y) * 100;

      const newRgb = hslToRgb(color.hsl.h, s, l);
      const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b).toLowerCase();
      setValue(newHex);
    },
    [isDragging, color.hsl.h, setValue],
  );

  const handlePointerUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
      return () => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  const hueColor = React.useMemo(() => {
    const rgb = hslToRgb(color.hsl.h, 100, 50);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }, [color.hsl.h]);

  const position = React.useMemo(() => {
    return {
      x: color.hsl.s / 100,
      y: 1 - color.hsl.l / 100,
    };
  }, [color.hsl.s, color.hsl.l]);

  return (
    <div
      ref={areaRef}
      data-slot="colorpicker-area"
      className={cn('relative h-40 w-full rounded-md border border-[var(--border)] cursor-crosshair overflow-hidden', className)}
      onPointerDown={handlePointerDown}
      {...props}
    >
      {/* Base: Saturation gradient from white (left, s=0%) to full hue (right, s=100%) */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, #fff 0%, ${hueColor} 100%)`,
        }}
      />
      {/* Overlay: Lightness gradient from transparent (top, l=100%) to black (bottom, l=0%) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)',
        }}
      />
      <div
        className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-lg pointer-events-none z-10"
        style={{
          left: `${position.x * 100}%`,
          top: `${position.y * 100}%`,
        }}
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
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(true);
      const rect = sliderRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const h = x * 360;

      const newRgb = hslToRgb(h, color.hsl.s, color.hsl.l);
      const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b).toLowerCase();
      setValue(newHex);
    },
    [color.hsl.s, color.hsl.l, setValue],
  );

  const handlePointerMove = React.useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return;
      const rect = sliderRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const h = x * 360;

      const newRgb = hslToRgb(h, color.hsl.s, color.hsl.l);
      const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b).toLowerCase();
      setValue(newHex);
    },
    [isDragging, color.hsl.s, color.hsl.l, setValue],
  );

  const handlePointerUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
      return () => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  const position = color.hsl.h / 360;

  return (
    <div
      ref={sliderRef}
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
        style={{
          left: `${position * 100}%`,
        }}
      />
    </div>
  );
}

/* -----------------------------------------------------------------------------
 * ColorPickerAlphaSlider
 * -------------------------------------------------------------------------- */

export interface ColorPickerAlphaSliderProps extends React.ComponentProps<'div'> {}

export function ColorPickerAlphaSlider({ className, ...props }: ColorPickerAlphaSliderProps) {
  const { color } = useColorPicker();
  // Note: Alpha support would require rgba/hsla parsing and formatting
  // For now, this is a placeholder that shows the color but doesn't modify alpha
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [alpha, setAlpha] = React.useState(1);

  const handlePointerDown = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setAlpha(x);
  }, []);

  const handlePointerMove = React.useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return;
      const rect = sliderRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setAlpha(x);
    },
    [isDragging],
  );

  const handlePointerUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
      return () => {
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerUp]);

  const position = alpha;

  return (
    <div
      ref={sliderRef}
      data-slot="colorpicker-alpha-slider"
      className={cn('relative h-3 w-full rounded-md border border-[var(--border)] cursor-pointer overflow-hidden', className)}
      onPointerDown={handlePointerDown}
      {...props}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'repeating-conic-gradient(#808080 0% 25%, #fff 0% 50%)',
          backgroundSize: '8px 8px',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, transparent 0%, ${color.hex} 100%)`,
        }}
      />
      <div
        className="absolute top-0 bottom-0 w-1 -translate-x-1/2 rounded-full border-2 border-white shadow-lg pointer-events-none"
        style={{
          left: `${position * 100}%`,
        }}
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
      if (parsed) {
        setValue(parsed.hex);
      }
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
      if (result.sRGBHex) {
        setValue(result.sRGBHex.toLowerCase());
      }
    } catch {
      // User cancelled or error occurred
    }
  }, [setValue]);

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleClick}
      className={cn('shrink-0', className)}
      {...props}
    >
      <Droplet className="size-4" />
      <span className="sr-only">Pick color from screen</span>
    </Button>
  );
}
