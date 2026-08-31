import { create } from "zustand";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/i18n/config";
import { getCookie, setCookie } from "@/lib/cookies";

interface LocaleState {
  locale: Locale;
  /** False until the cookie has been read on the client (see hydrateLocale). */
  hydrated: boolean;
  setLocale: (locale: Locale) => void;
  hydrateLocale: () => void;
}

const persist = (locale: Locale) => {
  setCookie(LOCALE_COOKIE, locale, {
    expires: 365,
    path: "/",
    sameSite: "lax",
  });
  document.documentElement.lang = locale;
};

export const useLocaleStore = create<LocaleState>((set) => ({
  // The server has no cookie to read, so it always renders the default locale
  // (Indonesian) and the client corrects on mount from the cookie. Keeps the
  // markup identical across hydration.
  locale: DEFAULT_LOCALE,
  hydrated: false,

  setLocale: (locale: Locale) => {
    persist(locale);
    set({ locale, hydrated: true });
  },

  hydrateLocale: () => {
    const stored = getCookie(LOCALE_COOKIE);
    const locale = isLocale(stored) ? stored : DEFAULT_LOCALE;
    document.documentElement.lang = locale;
    set({ locale, hydrated: true });
  },
}));
