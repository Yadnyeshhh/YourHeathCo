import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/caresync_logo.png";
import "../stylesheets/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const gotoLogin = () => {
    navigate("/login");
  };
  return (
    <nav>
      <div className="logo">
        <img src={Logo}></img>{" "}
      </div>

      <div className="Nav-links">
        <a href="#home" className="hover:text-blue-500">
          Home
        </a>
        <a href="#about" className="hover:text-blue-500">
          About
        </a>
        <a href="#services" className="hover:text-blue-500">
          Doctors
        </a>
        <a href="#contact" className="hover:text-blue-500">
          Contact us
        </a>
      </div>
      <div className="Nav-buttons">
        <button onClick={gotoLogin}>Login</button>
        <button onClick={gotoLogin}>Register</button>
      </div>
    </nav>
  );
};

export default Navbar;
