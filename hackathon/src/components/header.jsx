import React, { useEffect, useState } from "react";
import Background from '../assets/img/background.webp';
import ObShot from '../assets/img/obshot-1.png';
import Arrow from '../assets/img/arrow.png';
import '../assets/js/loading.js'; // Ton fichier CSS animations loader

const Header = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 4000); // 4 secondes
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="w-screen h-screen overflow-x-hidden relative">
      /* Background principal */
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${Background})` }}
        aria-hidden="true"
      ></div>

      /* Contenu centré */
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-6 px-4 z-10">
        /* Logo ObShot */
        <div
          className="w-64 h-64 sm:w-48 sm:h-48 md:w-1/2 md:h-1/2 bg-no-repeat bg-contain bg-center animate-pulse"
          style={{ backgroundImage: `url(${ObShot})` }}
          aria-label="ObShot illustration"
        ></div>

        /* Slogan */
        <span className="max-w-xl text-base sm:text-2xl md:text-3xl text-center text-[#c4c4c4] font-semibold">
          Obshot lets you capture any object in real-time with unmatched speed and precision — just point and shoot.
        </span>

        /* Loader ou Flèche */
        {loading ? (
          <div className="flex items-center justify-center h-16">
            <div className="stage">
              <div className="dot-spin"></div>
            </div>
          </div>
        ) : (
          <span
            onClick={() => {
              const element = document.getElementById('bottom');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-contain bg-center bg-no-repeat block w-12 h-12 sm:w-16 sm:h-16 animate-bounce cursor-pointer"
            style={{ backgroundImage: `url(${Arrow})` }}
            title="Descendre"
            tabIndex={0}
            role="button"
            aria-label="Descendre"
            onKeyDown={e => {
              if (e.key === "Enter" || e.key === " ") {
                const element = document.getElementById('bottom');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
          ></span>
        )}
      </div>
    </header>
  );
};

export default Header;
