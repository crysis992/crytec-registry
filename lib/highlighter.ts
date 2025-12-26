import {
  createHighlighter,
  type Highlighter,
  type BundledLanguage,
  type BundledTheme,
} from "shiki";

// Supported themes for the codeblock component
export const CODEBLOCK_THEMES = [
  "github-dark",
  "github-light",
  "vitesse-dark",
  "vitesse-light",
  "nord",
  "dracula",
  "one-dark-pro",
  "catppuccin-mocha",
  "catppuccin-latte",
] as const;

export type CodeblockTheme = (typeof CODEBLOCK_THEMES)[number];

const globalForShiki = globalThis as unknown as {
  shikiHighlighter: Highlighter | undefined;
};

export async function getHighlighter(): Promise<Highlighter> {
  if (!globalForShiki.shikiHighlighter) {
    globalForShiki.shikiHighlighter = await createHighlighter({
      themes: [...CODEBLOCK_THEMES] as BundledTheme[],
      langs: [], // Start empty, load languages on demand
    });
  }
  return globalForShiki.shikiHighlighter;
}

// Helper to parse line ranges like "5-10" into individual line numbers
function parseLineRanges(ranges: (number | string)[]): Set<number> {
  const lines = new Set<number>();
  for (const range of ranges) {
    if (typeof range === "number") {
      lines.add(range);
    } else if (typeof range === "string" && range.includes("-")) {
      const [start, end] = range.split("-").map(Number);
      for (let i = start; i <= end; i++) {
        lines.add(i);
      }
    }
  }
  return lines;
}

export interface HighlightCodeOptions {
  lang?: string;
  themes?: { light: CodeblockTheme; dark: CodeblockTheme };
  showLineNumbers?: boolean;
  highlightLines?: (number | string)[];
}

export async function highlightCode(
  code: string,
  options: HighlightCodeOptions = {}
): Promise<string> {
  const {
    lang = "tsx",
    themes = { light: "github-light", dark: "github-dark" },
    showLineNumbers = false,
    highlightLines = [],
  } = options;

  const hl = await getHighlighter();

  // Dynamically load the language if not already loaded
  const loadedLangs = hl.getLoadedLanguages();
  if (!loadedLangs.includes(lang as BundledLanguage)) {
    try {
      await hl.loadLanguage(lang as BundledLanguage);
    } catch {
      // Fallback to plaintext if language not supported
      console.warn(`Language "${lang}" not found, falling back to plaintext`);
      if (!loadedLangs.includes("plaintext")) {
        await hl.loadLanguage("plaintext");
      }
    }
  }

  const highlightedLines = parseLineRanges(highlightLines);
  const finalLang = hl.getLoadedLanguages().includes(lang as BundledLanguage)
    ? (lang as BundledLanguage)
    : "plaintext";

  return hl.codeToHtml(code, {
    lang: finalLang,
    themes: {
      light: themes.light,
      dark: themes.dark,
    },
    transformers: [
      {
        line(node, line) {
          // Add data-line attribute for line numbers
          if (showLineNumbers) {
            node.properties["data-line"] = line;
          }
          // Add highlight class for specified lines
          if (highlightedLines.has(line)) {
            this.addClassToHast(node, "highlighted");
          }
        },
      },
    ],
  });
}

// Backward-compatible simple version for existing usage
export async function highlightCodeSimple(
  code: string,
  lang: BundledLanguage = "tsx"
): Promise<string> {
  return highlightCode(code, { lang });
}
