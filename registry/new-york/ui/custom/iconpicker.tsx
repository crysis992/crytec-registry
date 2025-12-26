"use client";

import * as React from "react";
import { FolderKanban, Search } from "lucide-react";
import { Button } from "../shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn/dialog";
import { cn } from "@/lib/utils";
import { Input } from "../shadcn/input";
import {
  formatProjectIconLabel,
  normalizeProjectIconName,
} from "../../lib/shadcn/utils";
import { useMounted } from "../../hooks/use-mounted";

interface IconPickerContextValue {
  value: string;
  setValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  previewName: string;
  setPreviewName: (name: string) => void;
  query: string;
  setQuery: (query: string) => void;
  deferredQuery: string;
  iconList: string[];
  columns: number;
  color?: string;
  disabled?: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  scrollTop: number;
  setScrollTop: (top: number) => void;
  visibleIcons: string[];
  paddingTop: number;
  paddingBottom: number;
  onHoverIcon: (name: string) => void;
  onUnhoverIcon: () => void;
  isLoadingIcons: boolean;
  mounted: boolean;
  allIconNames: string[];
}

const IconPickerContext = React.createContext<IconPickerContextValue | null>(
  null
);

function useIconPicker() {
  const context = React.useContext(IconPickerContext);
  if (!context) {
    throw new Error("useIconPicker must be used within an IconPicker");
  }
  return context;
}

function pascalToKebab(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function kebabToPascal(str: string): string {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

const iconCache = new Map<string, React.ComponentType<React.SVGProps<SVGSVGElement>> | null>();

const DynamicIcon = React.memo(function DynamicIcon({
  name,
  fallback: Fallback,
  className,
  ...props
}: {
  name: string;
  fallback: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
} & React.SVGProps<SVGSVGElement>) {
  const [IconComponent, setIconComponent] = React.useState<
    React.ComponentType<React.SVGProps<SVGSVGElement>> | null
  >(() => iconCache.get(name) || null);

  React.useEffect(() => {
    const cached = iconCache.get(name);
    if (cached !== undefined) {
      setIconComponent(cached);
      return;
    }

    let cancelled = false;

    const loadIcon = async () => {
      try {
        const pascalName = kebabToPascal(name);
        const iconModule = await import("lucide-react");
        
        let Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | undefined;
        
        const directIcon = iconModule[pascalName as keyof typeof iconModule];
        if (directIcon) {
          Icon = directIcon as React.ComponentType<React.SVGProps<SVGSVGElement>>;
        }
        
        if (!Icon) {
          const iconNameWithSuffix = `${pascalName}Icon`;
          const directIconWithSuffix = iconModule[iconNameWithSuffix as keyof typeof iconModule];
          if (directIconWithSuffix) {
            Icon = directIconWithSuffix as React.ComponentType<React.SVGProps<SVGSVGElement>>;
          }
        }

        if (!cancelled) {
          iconCache.set(name, Icon || null);
          setIconComponent(Icon || null);
        }
      } catch {
        if (!cancelled) {
          iconCache.set(name, null);
          setIconComponent(null);
        }
      }
    };

    loadIcon();

    return () => {
      cancelled = true;
    };
  }, [name]);

  if (IconComponent) {
    const Component = IconComponent;
    return <Component className={className} {...props} />;
  }

  return <Fallback className={className} {...props} />;
});

export interface IconPickerProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  color?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export function IconPicker({
  value: controlledValue,
  defaultValue,
  onValueChange,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  color,
  disabled,
  children,
}: IconPickerProps) {
  const [internalValue, setInternalValue] = React.useState<string>(
    () => normalizeProjectIconName(defaultValue) ?? "folder-kanban"
  );
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [previewName, setPreviewName] = React.useState<string>(
    () => normalizeProjectIconName(defaultValue) ?? "folder-kanban"
  );
  const [query, setQuery] = React.useState("");
  const [scrollTop, setScrollTop] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(0);
  const [columns, setColumns] = React.useState(4);
  const [allIconNames, setAllIconNames] = React.useState<string[]>([]);
  const [isLoadingIcons, setIsLoadingIcons] = React.useState(false);

  const value = controlledValue ?? internalValue;
  const open = controlledOpen ?? internalOpen;
  const mounted = useMounted();
  const deferredQuery = React.useDeferredValue(query.trim().toLowerCase());

  const setValue = React.useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [controlledValue, onValueChange]
  );

  const setOpen = React.useCallback(
    (newOpen: boolean) => {
      if (controlledOpen === undefined) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [controlledOpen, onOpenChange]
  );

  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const hoverTimerRef = React.useRef<number | null>(null);
  const isHoveringRef = React.useRef(false);
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const scrollPositionRef = React.useRef<number>(0);
  const iconsLoadedRef = React.useRef(false);
  const prevOpenRef = React.useRef(open);

  React.useEffect(() => {
    if (!mounted || iconsLoadedRef.current) return;

    iconsLoadedRef.current = true;
    setIsLoadingIcons(true);
    
    const loadIconNames = async () => {
      try {
        const iconModule = await import("lucide-react");
        const names: string[] = [];
        const moduleKeys = Object.keys(iconModule);
        
        const skipKeys = new Set([
          "createLucideIcon",
          "default",
          "icons",
          "Icon",
          "LucideIcon",
          "IconNode",
          "LucideProps",
          "lucideReact",
          "lucide-react"
        ]);
        
        const seenNames = new Set<string>();
        
        for (const key of moduleKeys) {
          if (skipKeys.has(key) || key.startsWith("_")) {
            continue;
          }

          const exportValue = (iconModule as Record<string, unknown>)[key];
          
          if (typeof exportValue === "function" && key[0] && /[A-Z]/.test(key[0])) {
            const kebabName = pascalToKebab(key);
            if (!seenNames.has(kebabName)) {
              seenNames.add(kebabName);
              names.push(kebabName);
            }
          }
        }
        
        if (iconModule.icons && typeof iconModule.icons === "object") {
          const iconsExport = iconModule.icons;
          
          if (typeof iconsExport === "object" && iconsExport !== null) {
            const iconsObj = iconsExport as Record<string, unknown>;
            const iconObjKeys = Object.keys(iconsObj);
            
            for (const key of iconObjKeys) {
              if (key.endsWith("Icon")) {
                continue;
              }
              
              if (key[0] && /[A-Z]/.test(key[0])) {
                const kebabName = pascalToKebab(key);
                if (!seenNames.has(kebabName)) {
                  seenNames.add(kebabName);
                  names.push(kebabName);
                }
              }
            }
          }
        }
        
        names.sort();
        setAllIconNames(names);
      } catch {
        setAllIconNames([]);
      } finally {
        setIsLoadingIcons(false);
      }
    };

    loadIconNames();
  }, [mounted]);

  const iconList = React.useMemo(() => {
    if (!open) return [];
    if (!deferredQuery) {
      return allIconNames;
    }

    return allIconNames.filter((name) => {
      if (name.includes(deferredQuery)) return true;
      return formatProjectIconLabel(name).toLowerCase().includes(deferredQuery);
    });
  }, [allIconNames, deferredQuery, open]);

  React.useEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = open;
    
    if (!open) return;
    
    if (!wasOpen) {
      const normalized = normalizeProjectIconName(value) ?? "folder-kanban";
      setPreviewName(normalized);
      isHoveringRef.current = false;
      setQuery("");
      setScrollTop(0);

      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
        }
      });

      setViewportHeight(Math.max(320, Math.floor(window.innerHeight * 0.55)));
    }
  }, [open, value]);

  React.useEffect(() => {
    if (!open || isHoveringRef.current) return;
    const normalized = normalizeProjectIconName(value) ?? "folder-kanban";
    setPreviewName(normalized);
  }, [value, open]);

  React.useEffect(() => {
    if (!open || !scrollRef.current) return;
    
    if (scrollPositionRef.current > 0) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollPositionRef.current;
        }
      });
    }
  }, [value, open]);

  React.useEffect(() => {
    if (!open) return;

    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 768) {
        setColumns(4);
      } else if (width >= 640) {
        setColumns(3);
      } else {
        setColumns(2);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;

    const el = scrollRef.current;
    if (!el) return;

    const measure = () => {
      const next = el.clientHeight;
      if (next > 0) {
        setViewportHeight(next);
      }
    };

    requestAnimationFrame(() => {
      measure();
      requestAnimationFrame(measure);
    });

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [open]);

  const onHoverIcon = React.useCallback((name: string) => {
    isHoveringRef.current = true;
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = window.setTimeout(() => {
      setPreviewName(name);
    }, 75);
  }, []);

  const onUnhoverIcon = React.useCallback(() => {
    isHoveringRef.current = false;
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
    }
    const normalized = normalizeProjectIconName(value) ?? "folder-kanban";
    hoverTimerRef.current = window.setTimeout(() => {
      setPreviewName(normalized);
    }, 75);
  }, [value]);

  React.useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        window.clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const rowHeight = 48;
  const totalRows = Math.ceil(iconList.length / columns);
  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - 4);
  const endRow = Math.min(
    totalRows,
    Math.ceil((scrollTop + viewportHeight) / rowHeight) + 4
  );
  const startIndex = startRow * columns;
  const endIndex = Math.min(iconList.length, endRow * columns);
  const visibleIcons = iconList.slice(startIndex, endIndex);
  const paddingTop = startRow * rowHeight;
  const paddingBottom = Math.max(0, (totalRows - endRow) * rowHeight);

  const contextValue = React.useMemo<IconPickerContextValue>(
    () => ({
      value,
      setValue,
      open,
      setOpen,
      previewName,
      setPreviewName,
      query,
      setQuery,
      deferredQuery,
      iconList,
      columns,
      color,
      disabled,
      scrollRef,
      searchInputRef,
      scrollTop,
      setScrollTop,
      visibleIcons,
      paddingTop,
      paddingBottom,
      onHoverIcon,
      onUnhoverIcon,
      isLoadingIcons,
      mounted,
      allIconNames,
    }),
    [
      value,
      setValue,
      open,
      setOpen,
      previewName,
      setPreviewName,
      query,
      setQuery,
      deferredQuery,
      iconList,
      columns,
      color,
      disabled,
      scrollTop,
      visibleIcons,
      paddingTop,
      paddingBottom,
      onHoverIcon,
      onUnhoverIcon,
      isLoadingIcons,
      mounted,
      allIconNames,
    ]
  );

  return (
    <IconPickerContext.Provider value={contextValue}>
      <Dialog open={open} onOpenChange={setOpen}>
        {children}
      </Dialog>
    </IconPickerContext.Provider>
  );
}

export interface IconPickerTriggerProps
  extends React.ComponentProps<typeof DialogTrigger> {}

export function IconPickerTrigger({
  className,
  children,
  ...props
}: IconPickerTriggerProps) {
  const { disabled } = useIconPicker();

  return (
    <DialogTrigger
      asChild
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </DialogTrigger>
  );
}

export interface IconPickerContentProps
  extends React.ComponentProps<typeof DialogContent> {
  title?: string;
  description?: string;
}

export function IconPickerContent({
  className,
  title = "Select Icon",
  description = "Choose any icon from Lucide.",
  ...props
}: IconPickerContentProps) {
  const {
    value,
    setValue,
    setOpen,
    previewName,
    query,
    setQuery,
    deferredQuery,
    iconList,
    columns,
    color,
    scrollRef,
    searchInputRef,
    scrollTop,
    setScrollTop,
    visibleIcons,
    paddingTop,
    paddingBottom,
    onHoverIcon,
    onUnhoverIcon,
    isLoadingIcons,
    mounted,
    allIconNames,
  } = useIconPicker();

  const scrollPositionRef = React.useRef<number>(0);
  
  React.useEffect(() => {
    if (!scrollRef.current) return;
    
    if (scrollPositionRef.current > 0) {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollPositionRef.current;
        }
      });
    }
  }, [value, scrollRef]);

  const draft = React.useMemo(
    () => normalizeProjectIconName(value) ?? "folder-kanban",
    [value]
  );

  return (
    <DialogContent className={cn("sm:max-w-3xl", className)} {...props}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <div className="flex items-start gap-4">
        <div className="shrink-0 w-48">
          <div
            className="h-16 w-16 rounded-lg flex items-center justify-center border border-[var(--border)]"
            style={{ backgroundColor: color || "var(--muted)" }}
          >
            <DynamicIcon
              key={previewName}
              name={previewName}
              fallback={FolderKanban}
              className={cn(
                "h-8 w-8",
                color ? "text-white" : "text-[var(--foreground)]"
              )}
            />
          </div>
          <div className="mt-2 h-5 text-sm font-medium truncate">
            {formatProjectIconLabel(previewName)}
          </div>
          <div className="h-4 text-xs text-[var(--muted-foreground)] truncate">
            {previewName}
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              <Input
                ref={searchInputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setScrollTop(0);
                  if (scrollRef.current) {
                    scrollRef.current.scrollTop = 0;
                  }
                }}
                placeholder="Search icons..."
                className="pl-9"
              />
            </div>
          </div>
          <div
            ref={scrollRef}
            className="h-[55vh] overflow-auto pr-2"
            onScroll={(e) => {
              const newScrollTop = (e.currentTarget as HTMLDivElement).scrollTop;
              setScrollTop(newScrollTop);
              scrollPositionRef.current = newScrollTop;
            }}
          >
            {!mounted || isLoadingIcons ? (
              <div className="flex items-center justify-center h-full text-[var(--muted-foreground)]">
                <div className="text-center">
                  <div className="animate-pulse mb-2">Loading icons...</div>
                  <div className="text-sm">Please wait while we load all available icons</div>
                </div>
              </div>
            ) : allIconNames.length === 0 && !isLoadingIcons ? (
              <div className="flex items-center justify-center h-full text-[var(--muted-foreground)]">
                <div className="text-center">
                  <div className="mb-2">No icons available</div>
                  <div className="text-sm">Failed to load icons from lucide-react. Check console for errors.</div>
                </div>
              </div>
            ) : iconList.length === 0 && deferredQuery ? (
              <div className="flex items-center justify-center h-full text-[var(--muted-foreground)]">
                <div className="text-center">
                  <div className="mb-2">No icons found</div>
                  <div className="text-sm">Try adjusting your search</div>
                </div>
              </div>
            ) : (
              <div style={{ paddingTop, paddingBottom }}>
                <div
                  className={cn(
                    "grid gap-2",
                    columns === 2 && "grid-cols-2",
                    columns === 3 && "grid-cols-3",
                    columns === 4 && "grid-cols-4"
                  )}
                >
                  {visibleIcons.map((name) => {
                    const isSelected = name === draft;

                    return (
                      <button
                        key={name}
                        type="button"
                      onMouseEnter={() => onHoverIcon(name)}
                      onMouseLeave={onUnhoverIcon}
                      onClick={() => {
                        if (scrollRef.current) {
                          scrollPositionRef.current = scrollRef.current.scrollTop;
                        }
                        setValue(name);
                      }}
                        className={cn(
                          "h-10 rounded-md border border-[var(--border)] px-2 text-left text-sm flex items-center gap-2 transition-colors",
                          "hover:bg-[var(--accent)]",
                          isSelected &&
                            "ring-2 ring-[var(--ring)] ring-offset-2 ring-offset-[var(--background)]"
                        )}
                      >
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-[var(--muted)] shrink-0">
                          <DynamicIcon
                            key={name}
                            name={name}
                            fallback={FolderKanban}
                            className="h-4 w-4 text-[var(--foreground)]"
                          />
                        </span>
                        <span className="truncate flex-1">
                          {formatProjectIconLabel(name)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => {
            setValue(draft);
            setOpen(false);
          }}
        >
          Select
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

export interface IconPickerPreviewProps
  extends React.ComponentProps<"div"> {
  size?: number;
}

export function IconPickerPreview({
  className,
  size = 24,
  ...props
}: IconPickerPreviewProps) {
  const { value, color } = useIconPicker();
  const iconName = React.useMemo(
    () => normalizeProjectIconName(value) ?? "folder-kanban",
    [value]
  );

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center",
        className
      )}
      {...props}
    >
      <DynamicIcon
        name={iconName}
        fallback={FolderKanban}
        width={size}
        height={size}
        className={cn(
          color ? "text-white" : "text-[var(--foreground)]"
        )}
      />
    </div>
  );
}
