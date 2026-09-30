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
              <a href="#about" className="hover:text-white">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-white">
                Contact
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
          <h4 className="font-semibold text-white mb-3">Contact</h4>
          <p>📧 yadnyesh2202@gmail.com</p>
          <p className="mt-2">
            💻{" "}
            <a
              href="https://github.com/yadnyeeshhh"
              className="hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/yadnyeeshhh
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
