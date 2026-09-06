import "./AdminSignup.css";
import React, { useState } from "react";
import { FaEye, FaEyeSlash, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { InteractiveGridPattern } from "../../assets/gridBgPattern";
import { signupAdmin } from "../../services/authService";

const AdminSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    instituteName: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
      await signupAdmin({
        name: formData.instituteName,
        instituteName: formData.instituteName,
        address: formData.address,
        email: formData.email,
        password: formData.password
      });
      setMessage("✅ Hospital registered successfully!");
      setFormData({
        instituteName: "",
        address: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      setMessage(error.message || "Registration failed!");
    }
  };

  return (
    <div className="adm-up-root">
      <InteractiveGridPattern 
        width={40}
        height={40} 
        squares={[30, 30]}
        className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        squaresClassName="hover:fill-teal-500/30"
      />
      <div className="adm-up-card">
        <div className="adm-up-header">
          <h1 className="adm-up-title">Hospital Admin Signup</h1>
          <p className="adm-up-subtitle">Establish your clinical sanctuary and manage your institution with professional precision.</p>
        </div>

        <form onSubmit={handleSubmit} className="adm-up-form">
          <div className="adm-up-input-group">
            <label className="adm-up-label">Institute Name</label>
            <input
              type="text"
              name="instituteName"
              placeholder="e.g. St. Mary's General Hospital"
              value={formData.instituteName}
              onChange={handleChange}
              className="adm-up-input"
              required
            />
          </div>

          <div className="adm-up-input-group">
            <label className="adm-up-label">Address</label>
            <div className="adm-up-input-wrapper">
              <input
                type="text"
                name="address"
                placeholder="Full Clinical Address"
                value={formData.address}
                onChange={handleChange}
                className="adm-up-input"
                required
              />
              <FaMapMarkerAlt className="adm-up-icon" />
            </div>
          </div>

          <div className="adm-up-input-group">
            <label className="adm-up-label">Work Email</label>
            <input
              type="email"
              name="email"
              placeholder="admin@hospital-plus.com"
              value={formData.email}
              onChange={handleChange}
              className="adm-up-input"
              required
            />
          </div>

          <div className="adm-up-grid-row">
            <div className="adm-up-input-group">
              <label className="adm-up-label">Password</label>
              <div className="adm-up-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="adm-up-input"
                  required
                />
                <div onClick={() => setShowPassword(!showPassword)} className="adm-up-eye">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <div className="adm-up-input-group">
              <label className="adm-up-label">Confirm Password</label>
              <div className="adm-up-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="adm-up-input"
                  required
                />
                <div onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="adm-up-eye">
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="adm-up-button">
            Register Institution
          </button>

          {message && <p className="adm-up-message">{message}</p>}

          <div className="adm-up-footer">
            <p className="adm-up-footer-text">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")} className="adm-up-link">
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
