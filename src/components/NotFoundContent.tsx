"use client";

import { useTranslation } from "@/i18n";
import { BUTTON_PRIMARY } from "@/lib/button";

/**
 * The body of the 404 page. Split out from `app/not-found.tsx` because that
 * file exports `metadata`, which a client module cannot — and the copy here
 * has to follow the locale the visitor picked.
 */
export default function NotFoundContent() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-white/80 mb-8">{t("notFound.message")}</p>
        <a href="/" className={BUTTON_PRIMARY}>
          {t("notFound.home")}
        </a>
      </div>
    </div>
  );
}
