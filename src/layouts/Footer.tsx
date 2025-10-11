import React from 'react';
import NextImage from '@/components/NextImage'; // Assuming this component exists for images
import Typography from '@/components/Typography'; // Assuming this component exists for text

const Footer = () => {
  return (
    <footer className="bg-pink-500 text-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
          {/* Partners Section */}
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <Typography variant="h6" className="mb-4">With support from our partners</Typography>
            <div className="grid grid-cols-3 gap-4">
              {/* Placeholder for partner logos */}
              <NextImage src="/sponsors/indahpuri.png" alt="indahpuri" width={200} height={150} />
              {/* <NextImage src="/images/ford.png" alt="Ford" width={100} height={50} />
              <NextImage src="/images/orica.png" alt="Orica" width={100} height={50} />
              <NextImage src="/images/anca.png" alt="Anca" width={100} height={50} />
              <NextImage src="/images/leap.png" alt="Leap" width={100} height={50} />
              <NextImage src="/images/vipac.png" alt="Vipac" width={100} height={50} />
              <NextImage src="/images/scorptec.png" alt="Scorptec" width={100} height={50} />
              <NextImage src="/images/altium.png" alt="Altium" width={100} height={50} />
              <NextImage src="/images/ansys.png" alt="Ansys" width={100} height={50} /> */}
            </div>
          </div>
        </div>

        {/* Monash Nova Rover Logo, Socials, and Address */}
        <div className="mt-10 text-center">
          <NextImage src="/images/horizontal.png" alt="RIVAL ITS Logo" width={200} height={100} className="mx-auto mb-4" />
          <div className="flex justify-center space-x-4 mb-4">
            {/* Placeholder for social icons */}
            <a href="#" aria-label="Instagram"><NextImage src="/images/instagram.svg" alt="Instagram" width={24} height={24} /></a>
            <a href="#" aria-label="Email"><NextImage src="/images/mail.svg" alt="Email" width={24} height={24} /></a>
            <a href="#" aria-label="LinkedIn"><NextImage src="/images/linkedin.svg" alt="LinkedIn" width={24} height={24} /></a>
          </div>
          <Typography variant="p">Institut Teknologi Sepuluh Nopember, Surabaya, Indonesia</Typography>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
