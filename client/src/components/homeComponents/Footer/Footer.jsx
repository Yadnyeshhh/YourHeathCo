import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white">YourHealthCo</h3>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} YourHealthCo. All rights
            reserved.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <a href="#services" className="hover:text-white">
                Services
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="#doctors" className="hover:text-white">
                Our Doctors
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms-of-service" className="hover:text-white">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Contact Us</h4>
          <p>123 Health Ave, Wellness City</p>
          <p>(123) 456-7890</p>
          <p>info@yourhealthco.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
