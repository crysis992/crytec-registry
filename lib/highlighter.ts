import { createHighlighter, type Highlighter, type BundledLanguage } from "shiki";

const globalForShiki = globalThis as unknown as {
  shikiHighlighter: Highlighter | undefined;
};

export async function getHighlighter(): Promise<Highlighter> {
  if (!globalForShiki.shikiHighlighter) {
    globalForShiki.shikiHighlighter = await createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: ["typescript", "tsx", "bash", "json", "javascript"],
    });
  }
  return globalForShiki.shikiHighlighter;
}

export async function highlightCode(
  code: string,
  lang: BundledLanguage = "tsx"
): Promise<string> {
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
  });
}
