import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Admin from "./components/admin/Admin/Admin";
import PatientDetails from "./components/admin/PatientDetails/PatientDetails";
import AddPatient from "./components/admin/AddPatient/AddPatient";
import Dashboard from "./pages/PatientDashboard/PatientDashboard";
import Adminsiginup from "./pages/AdminSignup/AdminSignup";
import { ProtectedRoute, AdminProtectedRoute } from "./components/common/ProtectedRoute";
import './index.css';
import './styles/PD.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/adminsignup" element={<Adminsiginup />} />

      {/* Patient Protected Routes */}
      <Route 
        path="/pdashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
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
