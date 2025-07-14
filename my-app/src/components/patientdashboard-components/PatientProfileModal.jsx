// src/components/PatientProfileModal.js

import React from 'react';

const PatientProfileModal = ({ isOpen, onClose, patientData }) => {
  if (!isOpen) {
    return null; // Don't render the modal if it's not open
  }

  return (
    <div className="modal-overlay">
  <div className="modal-content">
    <h2 className="modal-title">Patient Profile</h2>
    {!patientData ? (
      <p>Loading profile...</p>
    ) : (
      <div className="patient-details">
        <p><strong>Name:</strong> {patientData.name}</p>
        <p><strong>Age:</strong> {patientData.age}</p>
        <p><strong>Gender:</strong> {patientData.gender}</p>
        <p><strong>Contact:</strong> {patientData.contact}</p>
        <p><strong>Blood Group:</strong> {patientData.bloodGroup}</p>
      </div>
    )}
    <button onClick={onClose} className="modal-close-button">Close</button>
  </div>
</div>

  );
};

export default PatientProfileModal;