import React from "react";
import "./Services.css";

const servicesData = [
  {
    title: "Cardiology",
    desc: "Comprehensive heart care with advanced diagnostic and treatment options for all cardiac conditions.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
        <path d="M3 12h4l2-4 4 8 2-4h6"></path>
      </svg>
    )
  },
  {
    title: "Pediatrics",
    desc: "Expert care for children from infancy through adolescence with compassionate specialists.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4"></circle>
        <path d="M12 11v10"></path>
        <path d="M8 15h8"></path>
        <circle cx="12" cy="21" r="1.5"></circle>
      </svg>
    )
  },
  {
    title: "Orthopedics",
    desc: "Advanced treatment for bone, joint, and muscle conditions using latest surgical techniques.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18.5 6a3.5 3.5 0 0 0-3.14 2H8.64A3.5 3.5 0 1 0 6 12.5v-1A3.5 3.5 0 1 0 8.64 16h6.72A3.5 3.5 0 1 0 18 12.5v-1A3.5 3.5 0 0 0 18.5 6z"></path>
      </svg>
    )
  },
  {
    title: "Women's Health",
    desc: "Complete healthcare services for women at every stage of life with personalized care.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5"></circle>
        <path d="M12 13v8"></path>
        <path d="M9 17h6"></path>
      </svg>
    )
  },
  {
    title: "Diagnostics",
    desc: "State-of-the-art imaging and laboratory services for accurate and timely diagnosis.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
        <path d="M7 8l2 2 3-3 5 5"></path>
      </svg>
    )
  },
  {
    title: "Surgery",
    desc: "Expert surgical care with minimally invasive techniques and comprehensive post-op support.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"></path>
        <path d="M12 8v4l3 3"></path>
      </svg>
    ) 
  }
];

const Services = () => {
  return (
    <section className="services-section" id="services">
      <div className="services-overlay"></div>
      <div className="services-content">
        <h2 className="services-heading">Our Medical Services</h2>
        <div className="services-grid">
          {servicesData.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
