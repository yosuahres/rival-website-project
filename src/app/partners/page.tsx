"use client";
import NextImage from "@/components/NextImage";

export default function Sponsors() {
  return (
    <>
      <section className="relative mx-3 md:mx-4 min-h-[700px] flex items-center justify-center overflow-hidden rounded-4xl">
        <div className="absolute inset-0 z-0">
          <NextImage
            src="/images/partners/hero-background.jpg"
            alt="Rover robot"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0"></div>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8">
            Sponsors & Partners
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-transparent">
        <div className="max-w-6xl mx-auto px-6 text-justify">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
            Become A Sponsor
          </h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8">
            We offer four different sponsorship packages: SILVER, BRONZE,
            WINNER, PLATINUM, and GOLD. Each one has been carefully designed to
            provide unique benefits tailored to the needs of our partners.
            Depending on the chosen package, sponsors can expect a variety of
            promotional opportunities, including the addition of promotional
            materials to the club's social media, logo exposure on promotional.
            Email us for more details!
          </p>
          <div className="flex justify-center">
            <a
              href="/contact"
              className="inline-block bg-[#398561] text-white font-bold py-6 px-16 rounded-lg hover:bg-[#021507] transition duration-300 text-xl"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <div className="border-t-2 border-white mb-6"></div>
            <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-6">
              PLATINUM SPONSORS
            </h2>
            <div className="border-b-2 border-white"></div>
          </div>
          <div className="grid grid-cols-2 items-center justify-items-center gap-8 [&>*:last-child:nth-child(odd)]:col-span-2 md:flex md:flex-wrap md:justify-center md:gap-12">
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/images/partners/platinum/andi-sobolangit.png"
                  alt="Platinum sponsor 1"
                  width={250}
                  height={200}
                  className="h-auto w-auto max-w-full"
                />
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/images/partners/platinum/ancuk.png"
                  alt="Platinum sponsor 2"
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
            src="/images/partners/divider-1.jpg"
            alt="Sponsor section divider"
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
              SILVER SPONSORS
            </h2>
            <div className="border-b-2 border-white"></div>
          </div>
          <div className="grid grid-cols-2 items-center justify-items-center gap-8 [&>*:last-child:nth-child(odd)]:col-span-2 md:flex md:flex-wrap md:justify-center md:gap-12">
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/images/partners/silver/wika.png"
                  alt="Platinum sponsor 1"
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
            src="/images/partners/divider-2.jpeg"
            alt="Sponsor section divider"
            width={1000}
            height={100}
            className="w-full object-cover max-h-140"
          />
        </div>
      </section>

      <section className="py-16 md:py-24 bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <div className="border-t-2 border-white mb-6"></div>
            <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-6">
              BRONZE SPONSORS
            </h2>
            <div className="border-b-2 border-white"></div>
          </div>
          <div className="grid grid-cols-2 items-center justify-items-center gap-8 [&>*:last-child:nth-child(odd)]:col-span-2 md:flex md:flex-wrap md:justify-center md:gap-12">
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/images/partners/bronze/ipbth.png"
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
                  src="/images/partners/bronze/fure.png"
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
                  src="/images/partners/bronze/graha-pintar.png"
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
              WINNER SPONSORS
            </h2>
            <div className="border-b-2 border-white"></div>
          </div>
          <div className="grid grid-cols-2 items-center justify-items-center gap-8 [&>*:last-child:nth-child(odd)]:col-span-2 md:flex md:flex-wrap md:justify-center md:gap-12">
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/images/partners/winner/gajelas.png"
                  alt="Winner sponsor 1"
                  width={250}
                  height={200}
                  className="h-auto w-auto max-w-full"
                />
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/images/partners/winner/arl.png"
                  alt="Winner sponsor 1"
                  width={250}
                  height={200}
                  className="h-auto w-auto max-w-full"
                />
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/images/partners/winner/apd.png"
                  alt="Winner sponsor 1"
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
            src="/images/partners/divider-3.jpg"
            alt="Sponsor section divider"
            width={1000}
            height={100}
            className="w-full object-cover max-h-140"
          />
        </div>
      </section>

      <section className="py-16 md:py-24 bg-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <div className="border-t-2 border-white mb-6"></div>
            <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-6">
              AEROVAL SUPPORTERS
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
