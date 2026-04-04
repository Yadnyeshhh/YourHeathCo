import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <section id="contact" className="py-16 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
      <div>
        <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
        <p>📍 123 Health Ave, Wellness City, 56789</p>
        <p>📞 (123) 456-7890</p>
        <p>📧 info@yourhealthco.com</p>
        <div className="flex space-x-4 mt-4">
          <a href="#" className="text-blue-600 hover:text-blue-500 text-2xl">
            🌐
          </a>
          <a href="#" className="text-blue-400 hover:text-blue-300 text-2xl">
            🐦
          </a>
          <a href="#" className="text-blue-700 hover:text-blue-600 text-2xl">
            💼
          </a>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>
        <form className="space-y-4">
          <input type="text" placeholder="Your Name" className="w-full border p-3 rounded-lg" required />
          <input type="email" placeholder="Your Email" className="w-full border p-3 rounded-lg" required />
          <input type="tel" placeholder="Your Phone (Optional)" className="w-full border p-3 rounded-lg" />
          <textarea placeholder="Your Message" rows="5" className="w-full border p-3 rounded-lg" required></textarea>
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-500 transition">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
