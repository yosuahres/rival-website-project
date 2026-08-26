"use client";

import { useTranslation } from "@/i18n";

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <section className="flex-1 flex items-center justify-center px-8 py-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-white font-black text-3xl md:text-5xl lg:text-6xl mb-8">
            {t("about.title")}
          </h1>
          <p className="text-white text-lg leading-relaxed">
            {t("about.body")}
          </p>
        </div>
      </section>
    </div>
  );
}
