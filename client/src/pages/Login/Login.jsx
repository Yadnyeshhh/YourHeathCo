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
    <div className="login-screen-container">
      <button onClick={() => navigate("/")} className="login-back-button">
        &larr; Back
      </button>

      <div className="login-card-wrapper">
        {/* Left Image */}
        <div className="login-image-section">
          <img
            src="/login card.png"
            alt="Side Illustration"
            className="login-side-image"
          />
        </div>

        {/* Right Side */}
        <div className="login-form-section">
          {showAlert && (
            <div className="login-alert-banner">{alertMessage}</div>
          )}

          {/* LOGIN / SIGNUP FORM */}
          {!showProfileForm && !showAdminModal && (
            <form onSubmit={handleUserFormSubmit} className="login-form-card">
              <h2 className="login-form-title">
                {isSignInMode ? "Sign in" : "Create Account"}
              </h2>

              <input
                type="email"
                placeholder="Email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="login-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                className="login-input"
              />
              {!isSignInMode && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={userConfirmPassword}
                  onChange={(e) => setUserConfirmPassword(e.target.value)}
                  className="login-input"
                />
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="login-submit-button blue"
              >
                {isLoading ? "Processing..." : isSignInMode ? "Login" : "Next"}
              </button>

              <p className="login-footer-text">
                {isSignInMode ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignInMode(!isSignInMode)}
                  className="login-link-button blue-text"
                >
                  {isSignInMode ? "Sign up" : "Login"}
                </button>
              </p>

              <p className="login-footer-text">
                Are you an admin?{" "}
                <button
                  type="button"
                  onClick={() => setShowAdminModal(true)}
                  className="login-link-button red-text"
                >
                  Admin Login
                </button>
              </p>
            </form>
          )}

          {/* PROFILE FORM */}
          {showProfileForm && (
            <form onSubmit={handleProfileFormSubmit} className="login-form-card">
              <h2 className="login-form-title">Complete Profile</h2>

              <input
                type="text"
                placeholder="Full Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="login-input"
                required
              />
              <input
                type="number"
                placeholder="Age"
                value={userAge}
                onChange={(e) => setUserAge(e.target.value)}
                className="login-input"
                required
              />
              <select
                value={userGender}
                onChange={(e) => setUserGender(e.target.value)}
                className="login-input"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="tel"
                placeholder="Contact (10 digits)"
                value={userContact}
                onChange={(e) => setUserContact(e.target.value)}
                className="login-input"
                required
              />
              <select
                value={userBloodGroup}
                onChange={(e) => setUserBloodGroup(e.target.value)}
                className="login-input login-mb-large"
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

              <button
                type="submit"
                disabled={isLoading}
                className="login-submit-button green"
              >
                {isLoading ? "Saving Profile..." : "Save Profile"}
              </button>

              {/* BUG FIX 3: Added back button so user isn't trapped on the profile form */}
              <p className="login-footer-text">
                <button
                  type="button"
                  onClick={() => setShowProfileForm(false)}
                  className="login-link-button blue-text"
                >
                  &larr; Back to Sign Up
                </button>
              </p>
            </form>
          )}

          {/* ADMIN LOGIN FORM */}
          {showAdminModal && (
            <form onSubmit={handleAdminLoginSubmit} className="login-form-card">
              <h2 className="login-form-title">Admin Login</h2>
              <input
                type="email"
                placeholder="Admin Email"
                value={aEmail}  // BUG FIX 4: Restored the missing `value` prop — without it the input
                                // is uncontrolled and aEmail state stays empty, making login impossible
                onChange={(e) => setAEmail(e.target.value)}
                className="login-input focus-red"
              />
              <input
                type="password"
                placeholder="Password"
                value={apassword}
                onChange={(e) => setAPassword(e.target.value)}
                className="login-input focus-red"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="login-submit-button red"
              >
                {isLoading ? "Logging in..." : "Login as Admin"}
              </button>
              <p className="login-footer-text">
                Back to{" "}
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="login-link-button blue-text"
                >
                  User Login
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => navigate("/adminsignup")}
                  className="login-link-button blue-text login-ml-sm"
                >
                  Register a new admin
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}