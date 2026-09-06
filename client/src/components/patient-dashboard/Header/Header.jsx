import "./Header.css";
import React, { useState } from "react";
import LucideIcon from "../LucideIcon/LucideIcon";
import PatientProfileModal from "../PatientProfileModal/PatientProfileModal";
import { getToken } from "../../../utils/auth.js";

const Header = ({ profile }) => {
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(profile);

  // Token is stored as plain string under the key "token" by the Login page
  const token = getToken();

  const handleOpenPatientModal = () => setIsPatientModalOpen(true);
  const handleClosePatientModal = () => setIsPatientModalOpen(false);

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

      <PatientProfileModal
        isOpen={isPatientModalOpen}
        onClose={handleClosePatientModal}
        patientData={selectedPatient}
        token={token}
        onUpdate={(updatedPatient) => setSelectedPatient(updatedPatient)}
      />
    </header>
  );
};

export default Header;
