import React from "react";
import { useNavigate } from "react-router-dom"; 
import "../stylesheets/landing.css";


const LandingPage = () => {
  const navigate = useNavigate(); 

  const toLogin = () => {
    navigate("/login"); 
  };

  return (
    <div className="healthcare-landing-page">
      {/* Header Section */}
      <header className="hero-section">
        <nav className="navbar">
          <div className="logo">
            <a href="/">YourHealthCo</a>
          </div>
          <ul className="nav-links">
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#doctors">Our Doctors</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          {/* Corrected onClick handler */}
          <button className="book-appointment-btn" onClick={toLogin}>Register</button>
        </nav>

        <div className="hero-content">
          <h1>Your Health, Our Priority</h1>
          <p>Comprehensive and compassionate healthcare solutions for you and your family.</p>
          <div className="hero-ctas">
            <button className="primary-cta" onClick={toLogin} >Find a Doctor</button>
            <button className="secondary-cta">Learn More</button>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="services-section">
        <h2>Our Specialized Services</h2>
        <div className="service-cards">
          <div className="service-card">
            <i className="icon-general-checkup"></i> {/* Replace with actual icon */}
            <h3>General Checkups</h3>
            <p>Routine examinations and preventative care to keep you healthy.</p>
          </div>
          <div className="service-card">
            <i className="icon-pediatrics"></i> {/* Replace with actual icon */}
            <h3>Pediatrics</h3>
            <p>Dedicated care for the health and well-being of your children.</p>
          </div>
          <div className="service-card">
            <i className="icon-cardiology"></i> {/* Replace with actual icon */}
            <h3>Cardiology</h3>
            <p>Expert heart care, diagnostics, and treatment plans.</p>
          </div>
          <div className="service-card">
            <i className="icon-dermatology"></i> {/* Replace with actual icon */}
            <h3>Dermatology</h3>
            <p>Specialized care for skin conditions and cosmetic concerns.</p>
          </div>
          <div className="service-card">
            <i className="icon-emergency"></i> {/* Replace with actual icon */}
            <h3>Emergency Care</h3>
            <p>24/7 urgent medical attention when you need it most.</p>
          </div>
          {/* Add more service cards as needed */}
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="about-section">
        <div className="about-content">
          <h2>About YourHealthCo</h2>
          <p>YourHealthCo is committed to providing high-quality, patient-centered healthcare. With a team of experienced professionals and state-of-the-art facilities, we strive to offer personalized care that addresses the unique needs of each individual. Our mission is to empower our community to live healthier, happier lives.</p>
          <ul>
            <li><i className="icon-check"></i> Experienced & Certified Doctors</li>
            <li><i className="icon-check"></i> State-of-the-Art Facilities</li>
            <li><i className="icon-check"></i> Patient-Centered Approach</li>
            <li><i className="icon-check"></i> Convenient Online Booking</li>
          </ul>
          <button className="primary-cta">Our Story</button>
        </div>
        <div className="about-image">
          {/* Add an image related to the clinic/hospital */}
          <img src="https://via.placeholder.com/500x350/F8F8F8/333333?text=Clinic+Interior" alt="Clinic Interior" />
        </div>
      </section>

      {/* Call to Action (CTA) Section - Book Appointment */}
      <section className="cta-appointment-section">
        <h2>Ready to Prioritize Your Health?</h2>
        <p>Schedule an appointment with our expert medical team today.</p>
        <button className="book-appointment-lg-btn" onClick={toLogin}>Book Your Appointment Now</button>
      </section>

      {/* Our Doctors Section (Optional but Recommended) */}
      <section id="doctors" className="doctors-section">
        <h2>Meet Our Dedicated Doctors</h2>
        <div className="doctor-cards">
          <div className="doctor-card">
            <img src="https://via.placeholder.com/150x150/F8F8F8/333333?text=Dr.+Smith" alt="Dr. Jane Smith" />
            <h3>Dr. Jane Smith</h3>
            <p>Cardiologist</p>
            <span>Years of Experience: 15+</span>
            <button className="view-profile-btn">View Profile</button>
          </div>
          <div className="doctor-card">
            <img src="https://via.placeholder.com/150x150/F8F8F8/333333?text=Dr.+Davis" alt="Dr. Mark Davis" />
            <h3>Dr. Mark Davis</h3>
            <p>Pediatrician</p>
            <span>Years of Experience: 10+</span>
            <button className="view-profile-btn">View Profile</button>
          </div>
          <div className="doctor-card">
            <img src="https://via.placeholder.com/150x150/F8F8F8/333333?text=Dr.+Lee" alt="Dr. Emily Lee" />
            <h3>Dr. Emily Lee</h3>
            <p>Dermatologist</p>
            <span>Years of Experience: 8+</span>
            <button className="view-profile-btn">View Profile</button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <h2>What Our Patients Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <p>"YourHealthCo provides exceptional care. The doctors are incredibly knowledgeable and compassionate. Highly recommend!"</p>
            <h4>- Sarah L.</h4>
            <span>Patient since 2020</span>
          </div>
          <div className="testimonial-card">
            <p>"Booking an appointment was so easy, and the staff made me feel comfortable from the moment I walked in. A truly professional clinic."</p>
            <h4>- John D.</h4>
            <span>Patient since 2022</span>
          </div>
          <div className="testimonial-card">
            <p>"My family has been coming here for years. They genuinely care about your well-being. Best healthcare experience we've had!"</p>
            <h4>- Emily R.</h4>
            <span>Patient since 2018</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p><i className="icon-location"></i> 123 Health Ave, Wellness City, 56789</p>
          <p><i className="icon-phone"></i> (123) 456-7890</p>
          <p><i className="icon-email"></i> info@yourhealthco.com</p>
          <div className="social-links">
            <a href="#"><i className="icon-facebook"></i></a>
            <a href="#"><i className="icon-twitter"></i></a>
            <a href="#"><i className="icon-linkedin"></i></a>
          </div>
        </div>
        <div className="contact-form-container">
          <h3>Send Us a Message</h3>
          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <input type="tel" placeholder="Your Phone (Optional)" />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit" className="primary-cta">Send Message</button>
          </form>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>YourHealthCo</h3>
            <p>&copy; {new Date().getFullYear()} YourHealthCo. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#services">Services</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#doctors">Our Doctors</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/terms-of-service">Terms of Service</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <p>123 Health Ave, Wellness City</p>
            <p>(123) 456-7890</p>
            <p>info@yourhealthco.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;