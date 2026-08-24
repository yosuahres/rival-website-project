"use client";

import { useCallback } from "react";
import { useLocaleStore } from "@/store/locale";
import { type Locale, type TranslationKey, translate } from "./config";

export {
  DEFAULT_LOCALE,
  LOCALES,
  type Locale,
  type TranslationKey,
} from "./config";

/**
 * The only thing a component needs: `t("nav.news")`, plus the active locale
 * and a setter for the flag switcher.
 */
export const useTranslation = () => {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale],
  );

  return { t, locale, setLocale } as {
    t: typeof t;
    locale: Locale;
    setLocale: (locale: Locale) => void;
  };
};
