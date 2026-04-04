import React from "react";
import "./Services.css";

const Services = () => {
  return (
    <section id="services" className="py-16 text-center bg-white">
      <h2 className="text-3xl font-bold mb-10">Our Specialized Services</h2>
      <div className="grid gap-8 px-6 md:grid-cols-3 max-w-6xl mx-auto justify-center">
        {[
          {
            title: "General Checkups",
            desc: "Routine examinations and preventative care to keep you healthy.",
          },
          {
            title: "Pediatrics",
            desc: "Dedicated care for the health and well-being of your children.",
          },
          {
            title: "Cardiology",
            desc: "Expert heart care, diagnostics, and treatment plans.",
          },
          {
            title: "Dermatology",
            desc: "Specialized care for skin conditions and cosmetic concerns.",
          },
          {
            title: "Emergency Care",
            desc: "24/7 urgent medical attention when you need it most.",
          },
        ].map((service, i) => (
          <div
            key={i}
            className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="text-blue-600 text-4xl mb-4">💙</div>
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600">{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
