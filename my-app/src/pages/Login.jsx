import React, { useState , useEffect} from "react";
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
  const [aemail, setAEmail] = useState("");
  const [apassword, setAPassword] = useState("");
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Alerts
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [userToken, setUserToken] = useState("");

  useEffect(() => {
  const savedToken = localStorage.getItem("token");
  if (savedToken) setUserToken(savedToken);
}, []);

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
        // ---- SIGNUP (step 1) ----
        if (!userEmail || !userPassword || !userConfirmPassword) {
          return showCustomAlert("Please fill in all signup fields.");
        }
        if (userPassword !== userConfirmPassword) {
          return showCustomAlert("Passwords do not match.");
        }

        // proceed to profile form
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
        localStorage.setItem("token", json.token); 
  localStorage.setItem("userEmail", json.email);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 via-blue-400 to-blue-200">
    <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-700 transition"
      >
        ← Back
      </button>
      <div className="flex w-full max-w-6xl bg-white/90 shadow-xl rounded-2xl overflow-hidden">
        {/* Left Image */}
        <div className="hidden md:block w-1/2">
          <img src="/login card.png" alt="Side Illustration" className="h-full w-full object-cover" />
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center">
          {showAlert && (
            <div className="mb-4 w-full bg-red-500 text-white py-2 px-4 rounded-lg text-center">
              {alertMessage}
            </div>
          )}

          {/* LOGIN / SIGNUP FORM */}
          {!showProfileForm && !showAdminModal && (
            <form onSubmit={handleUserFormSubmit} className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-4">
                {isSignInMode ? "Sign in" : "Create Account"}
              </h2>

              <input
                type="email"
                placeholder="Email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full mb-4 px-4 py-3 border rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                className="w-full mb-4 px-4 py-3 border rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-400"
              />
              {!isSignInMode && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={userConfirmPassword}
                  onChange={(e) => setUserConfirmPassword(e.target.value)}
                  className="w-full mb-4 px-4 py-3 border rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-400"
                />
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                {isLoading ? "Processing..." : isSignInMode ? "Login" : "Next"}
              </button>

              <p className="text-center text-sm mt-4 text-gray-600">
                {isSignInMode ? "Don’t have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignInMode(!isSignInMode);
                  }}
                  className="text-blue-500 hover:underline"
                >
                  {isSignInMode ? "Sign up" : "Login"}
                </button>
              </p>

              <p className="text-center text-sm mt-2 text-gray-600">
                Are you an admin?{" "}
                <button
                  type="button"
                  onClick={() => setShowAdminModal(true)}
                  className="text-red-500 hover:underline"
                >
                  Admin Login
                </button>
              </p>
            </form>
          )}

          {/* PROFILE FORM (after signup step 1) */}
          {showProfileForm && (
            <form onSubmit={handleProfileFormSubmit} className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-4">Complete Profile</h2>

              <input
                type="text"
                placeholder="Full Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full mb-4 px-4 py-3 border rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="number"
                placeholder="Age"
                value={userAge}
                onChange={(e) => setUserAge(e.target.value)}
                min="0"
                className="w-full mb-4 px-4 py-3 border rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <select
                value={userGender}
                onChange={(e) => setUserGender(e.target.value)}
                className="w-full mb-4 px-4 py-3 border rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-400"
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
                className="w-full mb-4 px-4 py-3 border rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <select
                value={userBloodGroup}
                onChange={(e) => setUserBloodGroup(e.target.value)}
                className="w-full mb-6 px-4 py-3 border rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-400"
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
              >
                {isLoading ? "Saving Profile..." : "Save Profile"}
              </button>
            </form>
          )}

          {/* ADMIN LOGIN FORM */}
          {showAdminModal && (
            <form onSubmit={handleAdminLoginSubmit} className="w-full max-w-sm bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
              <input
                type="email"
                placeholder="Admin Email"
                value={aemail}
                onChange={(e) => setAEmail(e.target.value)}
                className="w-full mb-4 px-4 py-3 border rounded-full text-sm outline-none focus:ring-2 focus:ring-red-400"
              />
              <input
                type="password"
                placeholder="Password"
                value={apassword}
                onChange={(e) => setAPassword(e.target.value)}
                className="w-full mb-4 px-4 py-3 border rounded-full text-sm outline-none focus:ring-2 focus:ring-red-400"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
              >
                {isLoading ? "Logging in..." : "Login as Admin"}
              </button>
              <p className="text-center text-sm mt-4 text-gray-600">
                Back to{" "}
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="text-blue-500 hover:underline"
                >
                  User Login
                </button>
               <br></br>
                <button
                  type="button"
                  onClick={() => navigate("/adminsignup")}
                  className="text-blue-500 hover:underline ml-[10px]"
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
