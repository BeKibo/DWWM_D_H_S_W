import React, {useEffect, useState } from "react";
import Background from '../assets/img/background.webp';
import ObShot from '../assets/img/obshot-1.png';
import Arrow from '../assets/img/arrow.png';
import '../assets/js/loading.js'; // Importer le fichier CSS pour les animations

const Header = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement de la page a l'aide d'un setTimeout
    const timer = setTimeout(() => setLoading(false), 4000); // 4 secondes
    return () => clearTimeout(timer); // Retuner la fonction de nettoyage pour éviter les fuites de mémoire
  }, []);
  
  return (
    <header className="w-screen h-screen overflow-x-hidden relative">
      {/* Background principal */}
      <div
        className="w-auto h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${Background})` }}
      ></div>

      {/* Image ObShot par-dessus */}
      <div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col gap-2"
      >
        <div
          className="w-1/2 h-1/2 bg-no-repeat bg-contain bg-center animate-pulse"
          style={{ backgroundImage: `url(${ObShot})` }}
              ></div>
              <span className="w-170 text-3xl text-[#c4c4c4] animate">Obshot lets you capture any object in real-time with unmatched speed and precision — just point and shoot.</span>
        {loading ? (
        <div class="col-3">
        <div class="snippet" data-title="dot-spin" data-clipboard-target>
          <div class="stage">
            <div class="dot-spin"></div>
          </div>
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
            className="bg-contain bg-center bg-no-repeat block w-16 h-16 animate-bounce cursor-pointer"
            style={{ backgroundImage: `url(${Arrow})` }}
          ></span>
        )}
      </div>
    </header>
  );
};

export default Header;