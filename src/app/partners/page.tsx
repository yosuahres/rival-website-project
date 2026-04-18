"use client";
import NextImage from "@/components/NextImage";

export default function Sponsors() {
  return (
    <>
      <section className="relative w-full min-h-[750px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <NextImage
            src="/sponsors/additional/hero.jpg"
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

        <div className="absolute bottom-0 left-0 right-0 h-2 bg-white z-20"></div>
      </section>

      <section className="py-16 md:py-24 bg-transparent">
        <div className="max-w-6xl mx-auto px-6 text-justify">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 text-center">
            Become A Sponsor
          </h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8">
              We offer four different sponsorship packages: SILVER, BRONZE,
              WINNER, PLATINUM, and GOLD. Each one has been carefully designed
              to provide unique benefits tailored to the needs of our partners.
              Depending on the chosen package, sponsors can expect a variety of
              promotional opportunities, including the addition of promotional
              materials to the club's social media, logo exposure on
              promotional. Email us for more details!
          </p>
          <div className="flex justify-center">
            <a
              href="/contact"
              className="inline-block bg-white text-black font-bold py-6 px-16 rounded-lg hover:bg-gray-200 transition duration-300 text-xl"
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
            <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-6">PLATINUM SPONSORS</h2>
            <div className="border-b-2 border-white"></div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/sponsors/AndiSobolangit.png"
                  alt="Platinum sponsor 1"
                  width={250}
                  height={200}
                  className="w-auto h-auto"
                />
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/sponsors/ancuk.png"
                  alt="Platinum sponsor 2"
                  width={250}
                  height={200}
                  className="w-auto h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 md:py-6 bg-transparent">
        <div className="flex justify-center">
          <NextImage
            src="/sponsors/additional/section1.jpg"
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
            <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-6">SILVER SPONSORS</h2>
            <div className="border-b-2 border-white"></div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/sponsors/wika.png"
                  alt="Platinum sponsor 1"
                  width={250}
                  height={200}
                  className="w-auto h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 md:py-6 bg-transparent">
        <div className="flex justify-center">
          <NextImage
            src="/sponsors/additional/section2.jpeg"
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
            <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-6">BRONZE SPONSORS</h2>
            <div className="border-b-2 border-white"></div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/sponsors/IPBTH.png"
                  alt="AKHISHOP"
                  width={250}
                  height={200}
                  className="w-auto h-auto"
                />
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/sponsors/Fure.png"
                  alt="ARL"
                  width={250}
                  height={200}
                  className="w-auto h-auto"
                />
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/sponsors/GrahaPintar.png"
                  alt="APD"
                  width={250}
                  height={200}
                  className="w-auto h-auto"
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
            <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-6">WINNER SPONSORS</h2>
            <div className="border-b-2 border-white"></div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/sponsors/gajelas.png"
                  alt="Winner sponsor 1"
                  width={250}
                  height={200}
                  className="w-auto h-auto"
                />
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/sponsors/ARL.png"
                  alt="Winner sponsor 1"
                  width={250}
                  height={200}
                  className="w-auto h-auto"
                />
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="flex justify-center mb-6">
                <NextImage
                  src="/sponsors/APD.png"
                  alt="Winner sponsor 1"
                  width={250}
                  height={200}
                  className="w-auto h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-4 md:py-6 bg-transparent">
        <div className="flex justify-center">
          <NextImage
            src="/sponsors/additional/section3.jpg"
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
            <h2 className="text-5xl md:text-6xl font-bold text-white text-center mb-6">AEROVAL SUPPORTERS</h2>
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
              <p className="text-white text-2xl font-semibold">JONATHAN ELOHIM</p>
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
              <p className="text-white text-2xl font-semibold">DHARMOXXK LAPINDO</p>
            </div>
          </div>

          <div className="flex justify-center gap-8">
            <div className="text-center min-w-[120px]">
              <p className="text-white text-2xl font-semibold">AJAY</p>
            </div>
            <div className="text-center min-w-[120px]">
              <p className="text-white text-2xl font-semibold">BEZAVENT LAVENTIO</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}