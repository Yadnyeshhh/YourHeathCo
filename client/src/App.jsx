import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Admin from "./components/admin/Admin/Admin";
import PatientDetails from "./components/admin/PatientDetails/PatientDetails";
import AddPatient from "./components/admin/AddPatient/AddPatient";
import Dashboard from "./pages/PatientDashboard/PatientDashboard";
import Meals from "./pages/Meals/Meals";
import Meds from "./pages/Meds/Meds";
import Appointments from "./pages/Appointments/Appointments";
import Doctors from "./pages/Doctors/Doctors";
import Profile from "./pages/Profile/Profile";
import Adminsiginup from "./pages/AdminSignup/AdminSignup";
import { ProtectedRoute, AdminProtectedRoute } from "./components/common/ProtectedRoute";
import './index.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/adminsignup" element={<Adminsiginup />} />

      {/* Patient Protected Routes */}
      <Route 
        path="/pdashboard" 
        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
      />
      <Route 
        path="/meals" 
        element={<ProtectedRoute><Meals /></ProtectedRoute>} 
      />
      <Route 
        path="/meds" 
        element={<ProtectedRoute><Meds /></ProtectedRoute>} 
      />
      <Route 
        path="/appointments" 
        element={<ProtectedRoute><Appointments /></ProtectedRoute>} 
      />
      <Route 
        path="/doctors" 
        element={<ProtectedRoute><Doctors /></ProtectedRoute>} 
      />
      <Route 
        path="/profile" 
        element={<ProtectedRoute><Profile /></ProtectedRoute>} 
      />

      {/* Admin Protected Routes */}
      <Route 
        path="/admin" 
        element={
          <AdminProtectedRoute>
            <Admin />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/patient/:id" 
        element={
          <AdminProtectedRoute>
            <PatientDetails />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/addpatient" 
        element={
          <AdminProtectedRoute>
            <AddPatient />
          </AdminProtectedRoute>
        } 
      />
    </Routes>
  );
};

export default App;
