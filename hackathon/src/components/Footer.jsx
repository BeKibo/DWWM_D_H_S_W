import React from 'react';
import logo from '../assets/img/obshot.png';
import qrc from '../assets/img/qrc.png';

const Footer = () => {
    return (
        <div>
            <footer className="bg-[#30044E] w-full ">
                <div className="p-10 text-white flex justify-between items-center">
                    <div>
                        <h2 className="font-bold text-2xl">TEAM</h2>
                        <p className="flex gap-4 text-2xl">
                            <span>HAMZA</span>
                            <span>WEDAD</span>
                        </p>
                        <p className="flex gap-5 text-2xl">
                            <span>DAVID</span>
                            <span>SOUMIA</span>
                        </p>
                    </div>
                    <figure className="w-132">
                        <img src={logo} alt="Logo" className="w-full" />
                    </figure>
                    <div className="w-32">
                        <h2 className="text-2xl">MY CODE</h2>
                        <img src={qrc} alt="QR Code" className="w-full" />
                    </div>
                </div>
                <p className="text-center text-white pb-9 text-2xl"> &copy; Hackathon DWWM</p>
            </footer>
        </div>
    );
};

export default Footer;
