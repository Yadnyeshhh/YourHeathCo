import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👁️ icons
import "../stylesheets/adminsignup.css";

const Adminsiginup = () => {
    const apiUrl = import.meta.env.VITE_API_URL; 
  const [formData, setFormData] = useState({
    instituteName: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Registering...");

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/admin/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instituteName: formData.instituteName,
          address: formData.address,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setMessage("✅ Hospital registered successfully!");
        setFormData({
          instituteName: "",
          address: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        const data = await response.json();
        setMessage(data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong!");
    }
  };

  return (
    <div className="as-page">
      <div className="as-card">
        <h2 className="as-title">Hospital Admin Signup</h2>

        <form onSubmit={handleSubmit} className="as-form">
          <input
            type="text"
            name="instituteName"
            placeholder="Institute Name"
            value={formData.instituteName}
            onChange={handleChange}
            className="as-input"
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            className="as-input"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="as-input"
            required
          />

          {/* Password */}
          <div className="as-password-container">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="as-input as-password-input"
              required
            />
            
          </div>

          {/* Confirm Password */}
          <div className="as-password-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="as-input as-password-input"
              required
            />
            
              
          </div>

          <button type="submit" className="as-btn">
            Register
          </button>

          {message && <p className="as-message">{message}</p>}

          <p className="as-bottom-text">
            Already have an account?{" "}
            <a href="/login" className="as-link">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Adminsiginup;
