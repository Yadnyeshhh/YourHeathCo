import "./Login.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const apiUrl = import.meta.env.VITE_API_URL;
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

  // BUG FIX 1: Removed unused `userToken` state and the useEffect that set it
  // (the token is stored in localStorage on login/signup — no need to mirror it in state)

  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isSignInMode) {
      // ---- LOGIN ----
      if (!userEmail || !userPassword) {
        return showCustomAlert("Please fill in all login fields.");
      }
      setIsLoading(true);
      try {
        const response = await fetch(`${apiUrl}/api/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, password: userPassword }),
        });
        const json = await response.json();
        if (!response.ok) {
          setError(json.error);
          showCustomAlert(json.error || "Login failed");
        } else {
          // BUG FIX 2: Store token and email consistently (same pattern as signup),
          // instead of storing the whole object under "user" and never saving "token"
          localStorage.setItem("token", json.token);
          localStorage.setItem("userEmail", json.email);
          navigate("/pdashboard");
        }
      } catch (err) {
        setError(err.message);
        showCustomAlert("Network error. Please check your connection.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // ---- SIGNUP (step 1) ----
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
      const response = await fetch(`${apiUrl}/api/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName.trim(),
          age: age,
          gender: userGender,
          contact: userContact,
          bloodGroup: userBloodGroup,
          email: userEmail.trim(),
          password: userPassword,
        }),
      });

      let json;
      try {
        json = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        setError(json.error);
        showCustomAlert(json.error || "Signup failed");
        return;
      }

      localStorage.setItem("token", json.token);
      localStorage.setItem("userEmail", json.email);

      // Reset profile form fields
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
      const response = await fetch(`${apiUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: aEmail, password: apassword }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        showCustomAlert(json.error || "Admin login failed");
        return;
      }

      if (json && json.email && json.token) {
        localStorage.setItem(
          "admin",
          JSON.stringify({ email: json.email, token: json.token })
        );
        navigate("/admin", {
          state: {
            instituteName: json.instituteName,
            address: json.address,
            id: json._id,
          },
        });
      } else {
        showCustomAlert("Invalid server response.");
      }
    } catch (err) {
      setError(err.message);
      showCustomAlert("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-pf-root">
      <div className="login-pf-container">
        {/* Left Image Background & Hero Section */}
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

        {/* Right Side: Form Container */}
        <div className="login-pf-form-section">
          <div className="login-pf-card">
            {showAlert && (
              <div className="login-pf-alert-banner">{alertMessage}</div>
            )}

            {/* LOGIN / SIGNUP FORM */}
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

                <div className="login-pf-social-buttons">
                  <button type="button" className="login-pf-btn-social">
                    <svg className="login-pf-social-icon" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    Continue with Google
                  </button>
                  <button type="button" className="login-pf-btn-social">
                    <svg className="login-pf-social-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.74s2.83.67 3.65 1.57c-3.13 1.65-2.58 5.48.56 6.72-1.02 2.62-1.99 4.2-2.87 4.62zm-3.17-14.86c-.52 2.37-2.84 4-5.06 3.61.64-2.5 2.87-3.99 5.06-3.61z"/></svg>
                    Continue with Apple
                  </button>
                </div>

                <div className="login-pf-security-note">
                  <svg className="login-pf-security-icon" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
                  256-bit SSL Encryption
                </div>

                <div className="login-pf-support-link">
                  Need Help? <button type="button" className="login-pf-support-link-text">Contact Support</button>
                </div>

                <div className="login-pf-admin-toggle">
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(true)}
                    className="login-pf-link-admin"
                  >
                    Login as Administrator
                  </button>
                   <br />
                   <br />
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

            {/* PROFILE FORM */}
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

            {/* ADMIN LOGIN FORM */}
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