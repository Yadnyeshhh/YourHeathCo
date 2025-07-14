import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/login.css";

const apiUrl = import.meta.env.VITE_API_URL;


const Login = () => {
  const navigate = useNavigate();

  const [isSignInMode, setIsSignInMode] = useState(true);
  const [showProfileForm, setShowProfileForm] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userConfirmPassword, setUserConfirmPassword] = useState("");

  const [userName, setUserName] = useState("");
  const [userAge, setUserAge] = useState("");
  const [userGender, setUserGender] = useState("");
  const [userContact, setUserContact] = useState("");
  const [userBloodGroup, setUserBloodGroup] = useState("");

  const [aemail, setAEmail] = useState("");
  const [apassword, setAPassword] = useState("");

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const closeCustomAlert = () => {
    setShowAlert(false);
    setAlertMessage("");
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
          localStorage.setItem("user", JSON.stringify(json));
          navigate("/pdashboard");
        }
      } catch (err) {
        setError(err.message);
        showCustomAlert("Network error. Please check your connection.");
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

    if (!userName || !userAge || !userGender || !userContact || !userBloodGroup) {
      setIsLoading(false);
      return showCustomAlert("Please fill in all profile fields.");
    }

    if (isNaN(userAge) || parseInt(userAge) <= 0) {
      setIsLoading(false);
      return showCustomAlert("Please enter a valid age.");
    }

    if (!/^[0-9]{10}$/.test(userContact)) {
      setIsLoading(false);
      return showCustomAlert("Please enter a valid 10-digit contact number.");
    }

    try {
      const response = await fetch(`${apiUrl}/api/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          age: parseInt(userAge),
          gender: userGender,
          contact: userContact,
          bloodGroup: userBloodGroup,
          email: userEmail,
          password: userPassword,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        showCustomAlert(json.error || "Signup failed");
      } else {
        localStorage.setItem("user", JSON.stringify(json));
        showCustomAlert("Signup successful!");
        navigate("/pdashboard");
      }
    } catch (err) {
      setError(err.message);
      showCustomAlert("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    if (!aemail || !apassword) {
      return showCustomAlert("Please enter admin credentials.");
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: aemail, password: apassword }),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
        showCustomAlert(json.error || "Admin login failed");
      } else {
        localStorage.setItem("admin", JSON.stringify(json));
        navigate("/admin");
      }
    } catch (err) {
      setError(err.message);
      showCustomAlert("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login--body">
        {showAlert && (
          <div className="custom-alert-overlay">
            <div className="custom-alert-box">
              <p>{alertMessage}</p>
              <button onClick={closeCustomAlert} className="custom-alert-button">
                OK
              </button>
            </div>
          </div>
        )}

        <button
          className="admin-login-top-right-button"
          onClick={() => setShowAdminModal(true)}
        >
          Admin Login
        </button>

        {!showProfileForm ? (
          <div className="login--container">
            <div className="form-container">
              <form onSubmit={handleUserFormSubmit}>
                <h1>{isSignInMode ? "Sign In" : "Sign Up"}</h1>
                <input
                  type="email"
                  placeholder="Email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  required
                />
                {!isSignInMode && (
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={userConfirmPassword}
                    onChange={(e) => setUserConfirmPassword(e.target.value)}
                    required
                  />
                )}
                {isSignInMode && <a href="#">Forgot your password?</a>}
                <button type="submit" className="login--button" disabled={isLoading}>
                  {isLoading ? "Loading..." : isSignInMode ? "LOG IN" : "SIGN UP"}
                </button>
              </form>
              <p className="signup-text">
                {isSignInMode ? "New here?" : "Already have an account?"}{" "}
                <span
                  onClick={() => {
                    setIsSignInMode(!isSignInMode);
                    setShowProfileForm(false);
                  }}
                >
                  {isSignInMode ? "Sign Up" : "Sign In"}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="login--container profile-form-container">
            <div className="form-container">
              <h2>Complete Your Profile</h2>
              <form onSubmit={handleProfileFormSubmit}>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={userAge}
                  onChange={(e) => setUserAge(e.target.value)}
                  min="0"
                  required
                />
                <select
                  value={userGender}
                  onChange={(e) => setUserGender(e.target.value)}
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
                  pattern="[0-9]{10}"
                  required
                />
                <select
                  value={userBloodGroup}
                  onChange={(e) => setUserBloodGroup(e.target.value)}
                  required
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                <button type="submit" className="login--button" disabled={isLoading}>
                  {isLoading ? "Saving Profile..." : "Save Profile"}
                </button>
              </form>
            </div>
          </div>
        )}

        {showAdminModal && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-content">
              <button
                className="admin-modal-close"
                onClick={() => setShowAdminModal(false)}
              >
                &times;
              </button>
              <h2>Admin Login</h2>
              <form onSubmit={handleAdminLoginSubmit}>
                <input
                  type="email"
                  placeholder="Admin Email"
                  value={aemail}
                  onChange={(e) => setAEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Admin Password"
                  value={apassword}
                  onChange={(e) => setAPassword(e.target.value)}
                  required
                />
                <button type="submit" className="login--button" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
