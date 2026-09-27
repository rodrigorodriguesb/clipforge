/** Locale configuration: Portuguese (Brazil) is the default; Chinese and English are switchable alternatives */
export const LOCALES = ["pt", "zh", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Default locale: Brazilian Portuguese first */
export const DEFAULT_LOCALE: Locale = "pt";

/** Labels shown in the language switcher */
export const LOCALE_LABELS: Record<Locale, string> = {
  pt: "Português",
  zh: "中文",
  en: "English",
};

/** Trilingual message entries for a single namespace (one page/module) */
export interface NamespaceMessages {
  pt: Record<string, string>;
  zh: Record<string, string>;
  en: Record<string, string>;
}

/**
 * Auto-detects the UI locale from the user's system/browser language.
 * Portuguese systems (pt / pt-BR / pt-PT…) → pt; Chinese (zh…) → zh; everything else → en.
 * Returns the default locale in environments without navigator (SSR).
 */
export function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  const langs = (navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language]) as string[];
  for (const l of langs) {
    if (!l) continue;
    const lower = l.toLowerCase();
    if (lower.startsWith("pt")) return "pt";
    if (lower.startsWith("zh")) return "zh";
    // Any explicit non-Portuguese, non-Chinese language falls back to English
    return "en";
  }
  return DEFAULT_LOCALE;
}
