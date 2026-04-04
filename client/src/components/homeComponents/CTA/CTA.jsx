import React from "react";
import "./CTA.css";

const CTA = ({ toLogin }) => {
  return (
    <section className="py-16 bg-blue-600 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">
        Ready to Prioritize Your Health?
      </h2>
      <p className="mb-6">
        Schedule an appointment with our expert medical team today.
      </p>
      <button
        onClick={toLogin}
        className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
      >
        Book Your Appointment Now
      </button>
    </section>
  );
};

export default CTA;
