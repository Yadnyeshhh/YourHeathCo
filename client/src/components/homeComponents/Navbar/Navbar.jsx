import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ toLogin }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-black/30 backdrop-blur-lg fixed top-0 left-0 z-50">
      {/* Logo */}
      <div className="text-2xl font-bold text-white">
        <Link to="/" className="hover:text-[#0a6b5e]">
          YourHealthCo
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-8 text-white">
        {[
          { name: "About Us", to: "/about" },
          { name: "Contact", to: "/contact" },
        ].map((link) => (
          <Link
            key={link.name}
            to={link.to}
            className="relative overflow-hidden h-6 group font-medium"
          >
            <span className="block group-hover:-translate-y-full transition-transform duration-300">
              {link.name}
            </span>
            <span className="block absolute top-full left-0 group-hover:translate-y-[-100%] transition-transform duration-300">
              {link.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Register Button (Desktop) */}
      <div className="hidden md:flex">
        <button
          onClick={toLogin}
          className="bg-[#0c8272] c text-white px-5 py-2 rounded-full font-semibold hover:bg-[#0a6b5e] transition"
        >
          Register
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 bg-black/90 w-full flex flex-col items-center gap-4 py-4 text-white">
          {[
            { name: "About Us", to: "/about" },
            { name: "Our Doctors", to: "/doctors" },
            { name: "Contact", to: "/contact" },
          ].map((link) => (
            <Link
              key={link.name}
              to={link.to}
              className="hover:text-yellow-400"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              toLogin();
            }}
            className="bg-[#0c8272] c text-white px-5 py-2 rounded-full font-semibold hover:bg-yellow-300 transition"
          >
            Register
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
