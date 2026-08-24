"use client";

import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";
import { useTranslation } from "@/i18n";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#18191d] text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-8">
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
            <NextImage
              src="/images/brand/logo-horizontal.webp"
              alt="RIVAL ITS Logo"
              width={250}
              height={78}
              className="mb-4"
            />
            <Typography variant="p" className="text-sm text-gray-400 mb-2">
              official.krtmiits@gmail.com
            </Typography>
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Phone Icon</title>
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              </svg>
              <a
                href="tel:+62882003127741"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                +62-882003127741 (Gibran)
              </a>
            </div>
            <Typography variant="p" className="text-sm text-gray-400">
              {t("footer.address")}
            </Typography>
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
            <Typography variant="h6" className="mb-10 text-center w-full">
              {t("footer.partners")}
            </Typography>

            {/* Top row - 2 large sponsors */}
            <div className="flex gap-8 mb-6 w-full justify-center">
              <div className="w-[7.5rem] h-[5.25rem] flex items-center justify-center">
                <NextImage
                  src="/images/partners/platinum/andi-sobolangit.png"
                  alt="AndiSobolangit"
                  width={320}
                  height={320}
                  className="object-contain"
                />
              </div>
              <div className="w-[7.5rem] h-[5.25rem] flex items-center justify-center">
                <NextImage
                  src="/images/partners/platinum/ancuk.png"
                  alt="Triguna"
                  width={320}
                  height={320}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Middle row - 1 medium sponsor */}
            <div className="mb-6 w-full flex justify-center">
              <div className="w-24 h-[3.75rem] flex items-center justify-center">
                <NextImage
                  src="/images/partners/silver/wika.png"
                  alt="wika"
                  width={320}
                  height={320}
                  className="object-contain"
                />
              </div>
            </div>

            {/* Bottom grid - 3x2 smaller sponsors */}
            <div className="grid grid-cols-3 gap-4 w-full justify-items-center">
              <div className="w-[5.25rem] h-12 flex items-center justify-center">
                <NextImage
                  src="/images/partners/winner/apd.png"
                  alt="APD"
                  width={240}
                  height={300}
                  className="object-contain"
                />
              </div>
              <div className="w-[5.25rem] h-12 flex items-center justify-center">
                <NextImage
                  src="/images/partners/winner/arl.png"
                  alt="ARL"
                  width={320}
                  height={320}
                  className="object-contain"
                />
              </div>
              <div className="w-[5.25rem] h-12 flex items-center justify-center">
                <NextImage
                  src="/images/partners/winner/gajelas.png"
                  alt="Akhishop"
                  width={800}
                  height={302}
                  className="object-contain"
                />
              </div>
              <div className="w-[5.25rem] h-12 flex items-center justify-center">
                <NextImage
                  src="/images/partners/bronze/fure.png"
                  alt="Fure"
                  width={320}
                  height={320}
                  className="object-contain"
                />
              </div>
              <div className="w-[5.25rem] h-12 flex items-center justify-center">
                <NextImage
                  src="/images/partners/bronze/graha-pintar.png"
                  alt="GrahaPintar"
                  width={320}
                  height={320}
                  className="object-contain"
                />
              </div>
              <div className="w-[5.25rem] h-12 flex items-center justify-center">
                <NextImage
                  src="/images/partners/bronze/ipbth.png"
                  alt="IPBTH"
                  width={800}
                  height={357}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
