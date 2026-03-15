import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./components/admin/Admin";
import PatientDetails from "./components/admin/PatientDetails";
import AddPatient from "./components/admin/AddPatient";
import Dashboard from "./pages/PatientDashboard";
import Adminsiginup from "./pages/AdminSignup";
import './index.css';
import './styles/PD.css'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pdashboard" element={<Dashboard />} />
         <Route path="/admin" element={<Admin />} />
        <Route path="/patient/:id" element={<PatientDetails />} />
        <Route path="/adminsignup" element={<Adminsiginup />} />
        <Route path="/addpatient" element={<AddPatient />} />
      </Routes>
    </>
  );
};

export default App;
