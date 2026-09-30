import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        <h2 className="contact-heading">Get in Touch</h2>
        <p className="contact-intro">
          Have questions or want to collaborate? Feel free to reach out!
        </p>

        <div className="contact-cards">
          {/* Email */}
          <a
            href="mailto:yadnyesh2202@gmail.com"
            className="contact-card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="contact-icon">📧</div>
            <h3 className="contact-label">Email</h3>
            <p className="contact-value">yadnyesh2202@gmail.com</p>
          </a>

          {/* GitHub */}
          <a
            href="https://github.com/yadnyeshhh"
            className="contact-card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="contact-icon">💻</div>
            <h3 className="contact-label">GitHub</h3>
            <p className="contact-value">Yadnyeshhh</p>
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/yadnyesh-chaudhari-6b72a62a3"
            className="contact-card"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="contact-icon">💼</div>
            <h3 className="contact-label">LinkedIn</h3>
            <p className="contact-value">Link coming soon</p>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
