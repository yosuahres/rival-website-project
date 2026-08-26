"use client";
import NextImage from "@/components/NextImage";
import { useTranslation } from "@/i18n";
import { BUTTON_PRIMARY } from "@/lib/button";
import { WHATSAPP_URL } from "@/lib/site";

export default function Sponsors() {
  const { t } = useTranslation();

  return (
    <>
      <section className="relative mx-3 md:mx-4 aspect-[6/7] md:aspect-auto md:min-h-[700px] flex items-center justify-center overflow-hidden rounded-4xl">
        <div className="absolute inset-0 z-0">
          <NextImage
            src="/images/partners/hero-background.webp"
            alt={t("partners.heroAlt")}
            width={1920}
            height={1080}
            className="w-full h-full object-cover grayscale"
          />
          {/* Keeps the title legible over the brightest part of the photo and
              blends the frame's bottom edge into the black section beneath it. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"
          ></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            {t("partners.title")}
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-transparent">
        <div className="max-w-6xl mx-auto px-6 text-justify">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
            {t("partners.becomeTitle")}
          </h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8">
            {t("partners.becomeBody")}
          </p>
          <div className="flex justify-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={BUTTON_PRIMARY}
            >
              {t("common.contactUs")}
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <div className="border-t-2 border-white mb-6"></div>
            <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-6">
              {t("partners.platinum")}
            </h2>
            <div className="border-b-2 border-white"></div>
          </div>
          <div className="grid grid-cols-2 items-center justify-items-center gap-8 [&>*:last-child:nth-child(odd)]:col-span-2 md:flex md:flex-wrap md:justify-center md:gap-12">
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/images/partners/platinum/andi-sobolangit.webp"
                  alt={t("partners.logoAlt", {
                    tier: t("partners.tier.platinum"),
                  })}
                  width={250}
                  height={200}
                  className="h-auto w-auto max-w-full"
                />
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/images/partners/platinum/ancuk.webp"
                  alt={t("partners.logoAlt", {
                    tier: t("partners.tier.platinum"),
                  })}
                  width={250}
                  height={200}
                  className="h-auto w-auto max-w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 md:py-6 bg-transparent">
        <div className="flex justify-center">
          <NextImage
            src="/images/partners/divider-1.webp"
            alt={t("partners.dividerAlt")}
            width={1000}
            height={100}
            className="w-full object-cover max-h-140"
          />
        </div>
      </section>

      {/* Platinum Section */}
      <section className="py-16 md:py-24 bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <div className="border-t-2 border-white mb-6"></div>
            <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-6">
              {t("partners.silver")}
            </h2>
            <div className="border-b-2 border-white"></div>
          </div>
          <div className="grid grid-cols-2 items-center justify-items-center gap-8 [&>*:last-child:nth-child(odd)]:col-span-2 md:flex md:flex-wrap md:justify-center md:gap-12">
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/images/partners/silver/wika.webp"
                  alt={t("partners.logoAlt", {
                    tier: t("partners.tier.silver"),
                  })}
                  width={250}
                  height={200}
                  className="h-auto w-auto max-w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 md:py-6 bg-transparent">
        <div className="flex justify-center">
          <NextImage
            src="/images/partners/divider-2.webp"
            alt={t("partners.dividerAlt")}
            width={1000}
            height={100}
            className="w-full object-cover max-h-140"
            style={{ objectPosition: "center 25%" }}
          />
        </div>
      </section>

      <section className="py-16 md:py-24 bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <div className="border-t-2 border-white mb-6"></div>
            <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-6">
              {t("partners.bronze")}
            </h2>
            <div className="border-b-2 border-white"></div>
          </div>
          <div className="grid grid-cols-2 items-center justify-items-center gap-8 [&>*:last-child:nth-child(odd)]:col-span-2 md:flex md:flex-wrap md:justify-center md:gap-12">
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/images/partners/bronze/ipbth.webp"
                  alt="AKHISHOP"
                  width={250}
                  height={200}
                  className="h-auto w-auto max-w-full"
                />
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/images/partners/bronze/fure.webp"
                  alt="ARL"
                  width={250}
                  height={200}
                  className="h-auto w-auto max-w-full"
                />
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/images/partners/bronze/graha-pintar.webp"
                  alt="APD"
                  width={250}
                  height={200}
                  className="h-auto w-auto max-w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <div className="border-t-2 border-white mb-6"></div>
            <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-6">
              {t("partners.winner")}
            </h2>
            <div className="border-b-2 border-white"></div>
          </div>
          <div className="grid grid-cols-2 items-center justify-items-center gap-8 [&>*:last-child:nth-child(odd)]:col-span-2 md:flex md:flex-wrap md:justify-center md:gap-12">
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/images/partners/winner/gajelas.webp"
                  alt={t("partners.logoAlt", {
                    tier: t("partners.tier.winner"),
                  })}
                  width={250}
                  height={200}
                  className="h-auto w-auto max-w-full"
                />
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/images/partners/winner/arl.webp"
                  alt={t("partners.logoAlt", {
                    tier: t("partners.tier.winner"),
                  })}
                  width={250}
                  height={200}
                  className="h-auto w-auto max-w-full"
                />
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/images/partners/winner/apd.webp"
                  alt={t("partners.logoAlt", {
                    tier: t("partners.tier.winner"),
                  })}
                  width={250}
                  height={200}
                  className="h-auto w-auto max-w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 md:py-6 bg-transparent">
        <div className="flex justify-center">
          <NextImage
            src="/images/partners/divider-3.webp"
            alt={t("partners.dividerAlt")}
            width={1000}
            height={100}
            className="w-full object-cover max-h-140"
            style={{ objectPosition: "center 20%" }}
          />
        </div>
      </section>

      <section className="py-16 md:py-24 bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <div className="border-t-2 border-white mb-6"></div>
            <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-6">
              {t("partners.supporters")}
            </h2>
            <div className="border-b-2 border-white"></div>
          </div>
          <div className="flex justify-center gap-8 flex-wrap mb-8">
            <div className="text-center min-w-[120px]">
              <p className="text-white text-2xl font-semibold">MR. KING REZI</p>
            </div>
            <div className="text-center min-w-[120px]">
              <p className="text-white text-2xl font-semibold">FARELL</p>
            </div>
            <div className="text-center min-w-[120px]">
              <p className="text-white text-2xl font-semibold">
                JONATHAN ELOHIM
              </p>
            </div>
            <div className="text-center min-w-[120px]">
              <p className="text-white text-2xl font-semibold">JAPALL</p>
            </div>
          </div>

          <div className="flex justify-center gap-8 flex-wrap mb-8">
            <div className="text-center min-w-[120px]">
              <p className="text-white text-2xl font-semibold">PEMUDA ARAB</p>
            </div>
            <div className="text-center min-w-[120px]">
              <p className="text-white text-2xl font-semibold">M NURCHOLIS</p>
            </div>
            <div className="text-center min-w-[120px]">
              <p className="text-white text-2xl font-semibold">
                DHARMOXXK LAPINDO
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-8">
            <div className="text-center min-w-[120px]">
              <p className="text-white text-2xl font-semibold">AJAY</p>
            </div>
            <div className="text-center min-w-[120px]">
              <p className="text-white text-2xl font-semibold">
                BEZAVENT LAVENTIO
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
