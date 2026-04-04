import React from "react";
import Navbar from "../Navbar/Navbar";
import "./Hero.css";

const Hero = ({ toLogin }) => {
  const hospitalLogos = [
    "/logo1.svg",
    "/logo2.jpg",
    "/logo3.png",
    "/logo4.png",
    "logo5.jpg",
  ];

  return (
    <header className="relative bg-blue-700 text-white min-h-[600px] flex flex-col justify-center items-center text-center">
      <Navbar toLogin={toLogin} />

      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Your Health, Our Priority
      </h1>
      <p className="text-lg md:text-xl mb-8">
        Comprehensive and compassionate healthcare solutions for you and your
        family.
      </p>
      <button
        className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
        onClick={toLogin}
      >
        Get Started
      </button>

      {/* Hospital Logos Marquee */}
      <div className="overflow-hidden mt-12 w-full">
        <div className="flex animate-scroll space-x-12">
          {hospitalLogos.concat(hospitalLogos).map((logo, idx) => (
            <img
              key={idx}
              src={logo}
              alt={`Hospital ${idx + 1}`}
              className="h-16 object-contain opacity-50"
            />
          ))}
        </div>
      </div>
    </header>
  );
};

export default Hero;
