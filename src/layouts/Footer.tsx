import NextImage from "@/components/NextImage";
import Typography from "@/components/Typography";

const Footer = () => {
  return (
    <footer className="bg-[#0B1220] text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-8">
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start">
            <NextImage
              src="/images/horizontal.webp"
              alt="RIVAL ITS Logo"
              width={200}
              height={100}
              className="mb-4"
            />
            <Typography variant="h6" className="mb-2">
              Follow RIVAL ITS
            </Typography>
            <div className="flex space-x-4 mb-2">
              <a
                href="https://instagram.com/rival_its"
                aria-label="Instagram"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-labelledby="instagram-footer-title"
                >
                  <title id="instagram-footer-title">Instagram</title>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/rival-its"
                aria-label="LinkedIn"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-labelledby="linkedin-footer-title"
                >
                  <title id="linkedin-footer-title">LinkedIn</title>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@rival_its"
                aria-label="TikTok"
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                  aria-labelledby="tiktok-footer-title"
                >
                  <title id="tiktok-footer-title">TikTok</title>
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.75 2.9 2.9 0 0 1 2.31-4.64 2.88 2.88 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
                </svg>
              </a>
            </div>
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
              <Typography variant="p" className="text-sm text-gray-400">
                +62-882003127741 (Gibran)
              </Typography>
            </div>
            <Typography variant="p" className="text-sm text-gray-400">
              Institut Teknologi Sepuluh Nopember, Surabaya, Indonesia
            </Typography>
          </div>
          <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
            <Typography variant="h6" className="mb-4 text-center w-full">
              With support from our partners
            </Typography>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 w-full justify-items-center">
              <div className="w-32 h-20 flex items-center justify-center">
                <NextImage
                  src="/sponsors/APD.png"
                  alt="APD"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="w-32 h-20 flex items-center justify-center">
                <NextImage
                  src="/sponsors/ARL.png"
                  alt="ARL"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="w-32 h-20 flex items-center justify-center">
                <NextImage
                  src="/sponsors/Akhishop.png"
                  alt="Akhishop"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="w-32 h-20 flex items-center justify-center">
                <NextImage
                  src="/sponsors/AndiSobolangit.png"
                  alt="AndiSobolangit"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="w-32 h-20 flex items-center justify-center">
                <NextImage
                  src="/sponsors/Fure.png"
                  alt="Fure"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="w-32 h-20 flex items-center justify-center">
                <NextImage
                  src="/sponsors/GrahaPintar.png"
                  alt="GrahaPintar"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="w-32 h-20 flex items-center justify-center">
                <NextImage
                  src="/sponsors/IPBTH.png"
                  alt="IPBTH"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="w-32 h-20 flex items-center justify-center">
                <NextImage
                  src="/sponsors/Triguna.png"
                  alt="Triguna"
                  width={120}
                  height={60}
                  className="object-contain"
                />
              </div>
              <div className="w-32 h-20 flex items-center justify-center">
                <NextImage
                  src="/sponsors/wika.png"
                  alt="wika"
                  width={120}
                  height={60}
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
