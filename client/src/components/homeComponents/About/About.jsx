import React from "react";
import "./About.css";

const aboutData = [
  {
    id: "01",
    title: "Experienced Medical Team",
    description:
      "Board-certified physicians with decades of combined experience in their specialties.",
  },
  {
    id: "02",
    title: "State-of-the-Art Technology",
    description:
      "Latest medical equipment and innovative treatment methods for optimal patient outcomes.",
  },
  {
    id: "03",
    title: "Patient-Centered Care",
    description:
      "Personalized treatment plans focused on your unique health needs and wellness goals.",
  },
  {
    id: "04",
    title: "Comprehensive Coverage",
    description:
      "Wide range of medical services under one roof for convenient, coordinated care.",
  },
];

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <h2 className="about-heading">Why Patients Choose Us</h2>
        <div className="about-grid">
          {aboutData.map((item, index) => (
            <div className="about-card" key={index}>
              <div className="about-number">{item.id}</div>
              <h3 className="about-title">{item.title}</h3>
              <p className="about-description">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
