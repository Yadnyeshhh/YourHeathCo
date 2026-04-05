import React from "react";
import Navbar from "../Navbar/Navbar";
import "./Hero.css";

const Hero = ({ toLogin }) => {
  const hospitalLogos = [
    "/logo1.svg",
    "/logo2.jpg",
    "/logo3.png",
    "/logo4.png",
    "/logo5.jpg",
  ];

  return (
    <header className="hero-section">
      <div className="hero-overlay"></div>
      
      <div className="hero-top-nav">
        <Navbar toLogin={toLogin} />
      </div>

      <div className="hero-main-content">
        <h1 className="hero-heading">Your Health, Our Priority</h1>
        <p className="hero-subtext">
          Compassionate care meets cutting-edge medical excellence
        </p>
        
        <div className="hero-buttons">
          <button className="btn-primary" onClick={toLogin}>
            Book Appointment
          </button>
          <button className="btn-secondary" onClick={toLogin}>
            Find a Doctor
          </button>
        </div>

        <div className="hero-features">
          <div className="feature-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>24/7 Emergency Care</span>
          </div>
          <div className="feature-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>Board-Certified Doctors</span>
          </div>
          <div className="feature-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>150+ Specialists</span>
          </div>
        </div>

        {/* Hospital Logos Marquee */}
        <div className="marquee-container">
          <div className="marquee-content">
            {hospitalLogos.concat(hospitalLogos).map((logo, idx) => (
              <img
                key={idx}
                src={logo}
                alt={`Hospital ${idx + 1}`}
                className="marquee-image"
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
