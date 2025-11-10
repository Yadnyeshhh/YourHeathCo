import React, { useState } from 'react';
import LucideIcon from './LucideIcon.jsx';
import PatientProfileModal from './PatientProfileModal';
import "./stylesheets/header.css"

const Header = ({ profile }) => {
  // Modal open state
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  // Patient state to hold current profile
  const [selectedPatient, setSelectedPatient] = useState(profile);

  // Get token from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userToken = user?.token;

  const handleOpenPatientModal = () => {
    setIsPatientModalOpen(true);
  };

  const handleClosePatientModal = () => {
    setIsPatientModalOpen(false);
  };

  return (
    <header className="dashboard-header">
      <h1 className="dashboard-header-title">Dashboard</h1>

      <div className="dashboard-header-actions">
        <button className="header-icon-button">
          <LucideIcon name="Search" size={20} className="header-icon" />
        </button>
        <button className="header-icon-button">
          <LucideIcon name="Bell" size={20} className="header-icon" />
        </button>
        <button className="header-new-patient-button" onClick={handleOpenPatientModal}>
          <LucideIcon name="UserRoundPen" size={18} className="header-new-patient-icon" />
          Profile
        </button>
      </div>

      {/* Patient Profile Modal */}
      <PatientProfileModal 
        isOpen={isPatientModalOpen}
        onClose={handleClosePatientModal}
        patientData={selectedPatient}
        token={userToken} 
        onUpdate={(updatedPatient) => setSelectedPatient(updatedPatient)} 
      />
    </header>
  );
};

export default Header;
