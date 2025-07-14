// src/components/Header.js

import React, { useState ,useEffect} from 'react';
import LucideIcon from './LucideIcon.jsx'; // Import the new LucideIcon component
import PatientProfileModal from './PatientProfileModal';
import { patientMockData } from '../../data/mockData';  // Import mock patient data

const Header = ({profile , meds}) => {

  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

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

      <PatientProfileModal 
        isOpen={isPatientModalOpen}
        onClose={handleClosePatientModal}
        patientData={profile} 
        meds = {meds }
      />
    </header>
  );
};

export default Header;