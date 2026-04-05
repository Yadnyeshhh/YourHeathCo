import "./Header.css";
import React, { useState } from "react";
import LucideIcon from "../LucideIcon/LucideIcon";
import PatientProfileModal from "../PatientProfileModal/PatientProfileModal";

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
    <header className="db-header-root">
      <h1 className="db-header-title">Dashboard</h1>

      <div className="db-header-actions">
        <button className="db-header-icon-button">
          <LucideIcon name="Bell" size={20} className="db-header-icon" />
        </button>
        <button
          className="db-header-new-patient-button"
          onClick={handleOpenPatientModal}
        >
          <LucideIcon
            name="UserRoundPen"
            size={18}
            className="db-header-new-patient-icon"
          />
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
