import React from "react";
import "./CTA.css";

const CTA = ({ toLogin }) => {
  return (
    <section className="cta-section">
      <h2 className="cta-title">
        Ready to Prioritize Your Health?
      </h2>
      <p className="cta-text">
        Schedule an appointment with our expert medical team today.
      </p>
      <button
        onClick={toLogin}
        className="cta-button"
      >
        Book Your Appointment Now
      </button>
    </section>
  );
};

export default CTA;
