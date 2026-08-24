import en from "./locales/en.json";
import id from "./locales/id.json";

// English is the source of truth: it is the default a first-time visitor sees
// and the fallback whenever another locale is missing a key.
export const DEFAULT_LOCALE = "en" as const;

// Display order only — English stays the default and the fallback regardless.
export const LOCALES = [
  {
    code: "id",
    label: "Bahasa Indonesia",
    flag: "https://flagcdn.com/w40/id.webp",
  },
  { code: "en", label: "English", flag: "https://flagcdn.com/w40/us.webp" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];

export const LOCALE_COOKIE = "rival-locale";

// Keyed off the English dictionary so a new locale file that drifts out of
// shape is a type error rather than a blank string at runtime.
export type Dictionary = typeof en;

export const dictionaries: Record<Locale, Dictionary> = { en, id };

// Every dot path that resolves to a string — "nav.news", not "nav".
type StringPaths<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : `${K}.${StringPaths<T[K]>}`;
}[keyof T & string];

export type TranslationKey = StringPaths<Dictionary>;

export const isLocale = (value: unknown): value is Locale =>
  LOCALES.some((locale) => locale.code === value);

const lookup = (dictionary: Dictionary, key: string): string | undefined => {
  const value = key
    .split(".")
    .reduce<unknown>(
      (node, part) =>
        node && typeof node === "object"
          ? (node as Record<string, unknown>)[part]
          : undefined,
      dictionary,
    );
  return typeof value === "string" ? value : undefined;
};

/**
 * Resolves a key against a locale, falling back to English and finally to the
 * key itself, so a missing translation degrades to readable text instead of an
 * empty node. `{{name}}` placeholders are filled from `vars`.
 */
export const translate = (
  locale: Locale,
  key: TranslationKey,
  vars?: Record<string, string | number>,
): string => {
  const raw =
    lookup(dictionaries[locale], key) ??
    lookup(dictionaries[DEFAULT_LOCALE], key) ??
    key;

  if (!vars) return raw;
  return raw.replace(/\{\{(\w+)\}\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
};
