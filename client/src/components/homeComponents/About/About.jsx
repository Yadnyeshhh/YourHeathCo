import React from "react";
import "./About.css";

const aboutData = [
  {
    id: "01",
    title: "Hospital Management Interface",
    description:
      "A comprehensive dashboard for hospitals to manage patient records, appointments, and doctor schedules seamlessly.",
  },
  {
    id: "02",
    title: "Patient-Centric Portal",
    description:
      "Patients can book appointments, track medications, manage meals, and access their health records from one place.",
  },
  {
    id: "03",
    title: "Seamless Communication",
    description:
      "Bridging the gap between hospitals and patients with real-time updates, notifications, and secure data sharing.",
  },
  {
    id: "04",
    title: "Built for Modern Healthcare",
    description:
      "Designed with cutting-edge technology to simplify healthcare workflows and improve patient outcomes.",
  },
];

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <h2 className="about-heading">About This Project</h2>
        <p className="about-intro">
          YourHealthCo is a healthcare management platform that provides a
          unified interface for both hospitals and patients. Our goal is to
          streamline hospital operations while empowering patients with easy
          access to their health information and services.
        </p>
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
