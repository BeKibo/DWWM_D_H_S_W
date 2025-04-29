import React from 'react';
import logo from '../assets/img/obshot.png';
import qrc from '../assets/img/qrc.png';
import noise2 from '../assets/img/noise2.png';

const Footer = () => {
  return (
    <footer
      className="bg-[#30044E] w-full"
      style={{
        backgroundImage: `url(${noise2})`,
      }}
    >
      <div className="px-6 py-8 md:py-12 text-white flex flex-col md:flex-row justify-between items-center gap-8 max-w-7xl mx-auto">
        {/* Bloc équipe */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <h2 className="font-bold text-xl md:text-2xl">TEAM</h2>
          <p className="flex gap-3 md:gap-4 text-lg md:text-2xl">
            <span>HAMZA</span>
            <span>WEDAD</span>
          </p>
          <p className="flex gap-3 md:gap-5 text-lg md:text-2xl">
            <span>DAVID</span>
            <span>SOUMIA</span>
          </p>
        </div>
        
        {/* Logo */}
        <figure className="flex-shrink-0 flex justify-center items-center w-32 md:w-48">
          <img src={logo} alt="Logo" className="w-full max-w-[140px] md:max-w-[200px]" />
        </figure>

        {/* Bloc QR code */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <h2 className="text-xl md:text-2xl">MY CODE</h2>
          <img src={qrc} alt="QR Code" className="w-40 md:w-60 max-w-full" />
        </div>
      </div>

      {/* Copyright */}
      <p className="text-center text-white py-4 md:py-6 text-lg md:text-2xl">
        &copy; Hackathon DWWM
      </p>
    </footer>
  );
};

export default Footer;
