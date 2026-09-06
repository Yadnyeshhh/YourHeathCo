import "./Login.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, loginAdmin } from "../../services/authService";
import api from "../../services/api";

export default function AuthPage() {
  const navigate = useNavigate();
  const [isSignInMode, setIsSignInMode] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);

  // User login/signup states
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");

  // Profile form states
  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState("");
  const [userGender, setUserGender] = useState("");
  const [userContact, setUserContact] = useState("");
  const [userBloodGroup, setUserBloodGroup] = useState("");

  // Admin states
  const [aEmail, setAEmail] = useState("");
  const [apassword, setAPassword] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Alerts
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isSignInMode) {
      if (!userEmail || !userPassword) {
        return showCustomAlert("Please fill in all login fields.");
      }
      setIsLoading(true);
      try {
        await loginUser({ email: userEmail, password: userPassword });
        navigate("/pdashboard");
      } catch (err) {
        setError(err.message);
        showCustomAlert(err.message || "Login failed");
      } finally {
        setIsLoading(false);
      }
    } else {
      if (!userEmail || !userPassword || !userConfirmPassword) {
        return showCustomAlert("Please fill in all signup fields.");
      }
      if (userPassword !== userConfirmPassword) {
        return showCustomAlert("Passwords do not match.");
      }
      setShowProfileForm(true);
    }
  };

  const handleProfileFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const age = Number(userAge);

    if (!userName || !userAge || !userGender || !userContact || !userBloodGroup) {
      setIsLoading(false);
      return showCustomAlert("Please fill in all profile fields.");
    }

    if (!Number.isInteger(age) || age <= 0) {
      setIsLoading(false);
      return showCustomAlert("Please enter a valid age.");
    }

    if (!/^[6-9]\d{9}$/.test(userContact)) {
      setIsLoading(false);
      return showCustomAlert("Please enter a valid 10-digit contact number.");
    }

    try {
      const response = await api.post('/user/signup', {
        name: userName.trim(),
        age: age,
        gender: userGender,
        contact: userContact,
        bloodGroup: userBloodGroup,
        email: userEmail.trim(),
        password: userPassword,
      });

      const token = response?.data?.token || response?.token;
      if (token) {
        localStorage.setItem("token", token);
      }

      setUserName("");
      setUserAge("");
      setUserGender("");
      setUserContact("");
      setUserBloodGroup("");

      showCustomAlert("Signup successful!");
      navigate("/pdashboard");
    } catch (err) {
      setError(err.message);
      showCustomAlert(err.message || "Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();

    if (!aEmail || !apassword) {
      return showCustomAlert("Please enter admin credentials.");
    }

    setIsLoading(true);
    setError(null);

    try {
      const json = await loginAdmin({ email: aEmail, password: apassword });
      const adminData = json?.data?.admin || json?.admin;
      const adminToken = json?.data?.token || json?.token;

      if (adminData && adminToken) {
        navigate("/admin", {
          state: {
            instituteName: adminData.instituteName || adminData.name,
            address: adminData.address,
            id: adminData._id,
          },
        });
      } else {
        showCustomAlert("Invalid server response.");
      }
    } catch (err) {
      setError(err.message);
      showCustomAlert(err.message || "Admin login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-pf-root">
      <div className="login-pf-container">
        <div className="login-pf-hero-section">
          <div className="login-pf-hero-overlay"></div>
          <div className="login-pf-hero-content">
            <div className="login-pf-hero-brand">
              <h2>HealthCare+</h2>
            </div>
            <h1 className="login-pf-hero-title">Welcome Back to Your Health Journey</h1>
            <p className="login-pf-hero-subtitle">
              Access your medical records, appointments, and personalized care plans
            </p>
            <div className="login-pf-hero-features">
              <div className="login-pf-feature-item">
                <div className="login-pf-feature-icon-wrapper">
                  <svg className="login-pf-feature-icon" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
                <span>HIPAA Compliant & Secure</span>
              </div>
              <div className="login-pf-feature-item">
                <div className="login-pf-feature-icon-wrapper">
                  <svg className="login-pf-feature-icon" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                </div>
                <span>24/7 Access to Your Records</span>
              </div>
              <div className="login-pf-feature-item">
                <div className="login-pf-feature-icon-wrapper">
                  <svg className="login-pf-feature-icon" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
                <span>Trusted by 50,000+ Patients</span>
              </div>
            </div>
          </div>
        </div>

        <div className="login-pf-form-section">
          <div className="login-pf-card">
            {showAlert && (
              <div className="login-pf-alert-banner">{alertMessage}</div>
            )}

            {!showProfileForm && !showAdminModal && (
              <form onSubmit={handleUserFormSubmit}>
                <div className="login-pf-card-header">
                  <h2 className="login-pf-card-title">Patient Portal Login</h2>
                  <p className="login-pf-card-subtitle">
                    {isSignInMode ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                      type="button"
                      onClick={() => setIsSignInMode(!isSignInMode)}
                      className="login-pf-link-signup"
                    >
                      {isSignInMode ? "Sign Up" : "Login"}
                    </button>
                  </p>
                </div>

                <div className="login-pf-form-group">
                  <label className="login-pf-form-label">Email or Username</label>
                  <div className="login-pf-input-icon-wrapper">
                    <svg className="login-pf-input-icon" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="login-pf-form-input"
                    />
                  </div>
                </div>

                <div className="login-pf-form-group">
                  <label className="login-pf-form-label">Password</label>
                  <div className="login-pf-input-icon-wrapper">
                    <svg className="login-pf-input-icon" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      className="login-pf-form-input"
                    />
                  </div>
                </div>

                {!isSignInMode && (
                  <div className="login-pf-form-group">
                    <label className="login-pf-form-label">Confirm Password</label>
                    <div className="login-pf-input-icon-wrapper">
                      <svg className="login-pf-input-icon" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                      <input
                        type="password"
                        placeholder="Confirm your password"
                        value={userConfirmPassword}
                        onChange={(e) => setUserConfirmPassword(e.target.value)}
                        className="login-pf-form-input"
                      />
                    </div>
                  </div>
                )}

                {isSignInMode && (
                  <div className="login-pf-options-row">
                    <label className="login-pf-checkbox-label">
                      <input type="checkbox" /> Remember me
                    </label>
                    <button type="button" className="login-pf-forgot-password">Forgot Password?</button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="login-pf-btn-primary"
                >
                  {isLoading ? "Processing..." : isSignInMode ? "Sign In" : "Next"}
                </button>

                <div className="login-pf-divider">OR</div>

                <div className="login-pf-admin-toggle">
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(true)}
                    className="login-pf-link-admin"
                  >
                    Login as Administrator
                  </button>
                  <br /><br />
                  <button 
                    type="button" 
                    onClick={() => navigate("/")} 
                    className="login-pf-link-admin" style={{fontSize: '0.85rem'}}
                  >
                    &larr; Back to Home
                  </button>
                </div>
              </form>
            )}

            {showProfileForm && (
              <form onSubmit={handleProfileFormSubmit}>
                <button
                  type="button"
                  onClick={() => setShowProfileForm(false)}
                  className="login-pf-back-toggle"
                >
                  &larr; Back to Sign Up
                </button>
                <div className="login-pf-card-header">
                  <h2 className="login-pf-card-title">Complete Profile</h2>
                  <p className="login-pf-card-subtitle">Please provide your details below.</p>
                </div>

                <div className="login-pf-form-group">
                  <label className="login-pf-form-label">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="login-pf-form-input login-pf-no-icon"
                    required
                  />
                </div>
                <div className="login-pf-form-group">
                  <label className="login-pf-form-label">Age</label>
                  <input
                    type="number"
                    placeholder="Enter your age"
                    value={userAge}
                    onChange={(e) => setUserAge(e.target.value)}
                    className="login-pf-form-input login-pf-no-icon"
                    required
                  />
                </div>
                <div className="login-pf-form-group">
                  <label className="login-pf-form-label">Gender</label>
                  <select
                    value={userGender}
                    onChange={(e) => setUserGender(e.target.value)}
                    className="login-pf-form-select"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="login-pf-form-group">
                  <label className="login-pf-form-label">Contact</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={userContact}
                    onChange={(e) => setUserContact(e.target.value)}
                    className="login-pf-form-input login-pf-no-icon"
                    required
                  />
                </div>
                <div className="login-pf-form-group" style={{ marginBottom: '2rem' }}>
                  <label className="login-pf-form-label">Blood Group</label>
                  <select
                    value={userBloodGroup}
                    onChange={(e) => setUserBloodGroup(e.target.value)}
                    className="login-pf-form-select"
                    required
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="login-pf-btn-primary"
                >
                  {isLoading ? "Saving..." : "Save Profile"}
                </button>
              </form>
            )}

            {showAdminModal && (
              <form onSubmit={handleAdminLoginSubmit}>
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="login-pf-back-toggle"
                >
                  &larr; Back to Patient Login
                </button>
                <div className="login-pf-card-header">
                  <h2 className="login-pf-card-title">Admin Login</h2>
                  <p className="login-pf-card-subtitle">Access the administrative dashboard.</p>
                </div>
                
                <div className="login-pf-form-group">
                  <label className="login-pf-form-label">Admin Email</label>
                  <div className="login-pf-input-icon-wrapper">
                    <svg className="login-pf-input-icon" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    <input
                      type="email"
                      placeholder="Enter admin email"
                      value={aEmail}
                      onChange={(e) => setAEmail(e.target.value)}
                      className="login-pf-form-input"
                    />
                  </div>
                </div>

                <div className="login-pf-form-group" style={{ marginBottom: '2rem' }}>
                  <label className="login-pf-form-label">Password</label>
                  <div className="login-pf-input-icon-wrapper">
                    <svg className="login-pf-input-icon" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={apassword}
                      onChange={(e) => setAPassword(e.target.value)}
                      className="login-pf-form-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="login-pf-btn-primary login-pf-btn-danger"
                  style={{ marginBottom: '1.5rem' }}
                >
                  {isLoading ? "Logging in..." : "Login as Admin"}
                </button>
                
                <div className="login-pf-divider">OR</div>

                <div className="login-pf-admin-toggle">
                  <button
                    type="button"
                    onClick={() => navigate("/adminsignup")}
                    className="login-pf-link-admin"
                  >
                    Register a new admin
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
