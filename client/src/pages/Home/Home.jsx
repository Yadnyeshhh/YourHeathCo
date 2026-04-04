import "./Home.css";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Hero from "../../components/homeComponents/Hero/Hero";
import Services from "../../components/homeComponents/Services/Services";
import About from "../../components/homeComponents/About/About";
import CTA from "../../components/homeComponents/CTA/CTA";
import Doctors from "../../components/homeComponents/Doctors/Doctors";
import Testimonials from "../../components/homeComponents/Testimonials/Testimonials";
import Contact from "../../components/homeComponents/Contact/Contact";
import Footer from "../../components/homeComponents/Footer/Footer";

const LandingPage = () => {
  const navigate = useNavigate();
  
  const toLogin = () => {
    navigate("/login");
  };

  const checkAuthAndRedirect = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.email && user.token) {
          navigate("/pdashboard");
        }
      } catch (err) {
        console.error("Invalid user data in localStorage", err);
      }
    }
  };

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      <Hero toLogin={toLogin} />
      <Services />
      <About />
      <CTA toLogin={toLogin} />
      <Doctors />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;