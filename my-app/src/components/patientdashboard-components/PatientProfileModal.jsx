

import React from 'react';

const PatientProfileModal = ({ isOpen, onClose, patientData }) => {
  if (!isOpen) {
    return null; 
  }
  const pfpimg = {
      width: "50%",
      marginLeft: "auto",
    };
    const pfpinfo ={
    width: "50%",
    };
    const pfp ={
    display : "flex",
    };

  return (
    <div className="modal-overlay">
  <div className="modal-content">
    <h2 className="modal-title">Patient Profile</h2>
    {!patientData ? (
      <p>Loading profile...</p>
    ) : (
      <div style={pfp}>
      <div className="patient-details" style={pfpinfo}>
        <p><strong>Name:</strong> {patientData.name}</p>
        <p><strong>Age:</strong> {patientData.age}</p>
        <p><strong>Gender:</strong> {patientData.gender}</p>
        <p><strong>Contact:</strong> {patientData.contact}</p>
        <p><strong>Blood Group:</strong> {patientData.bloodGroup}</p>
      </div>
      <div style={pfpimg} >
      <img src="/profile.png"  />
      </div>  
      </div>
      
    )}
    <button onClick={onClose} className="modal-close-button">Close</button>
  </div>
</div>

  );
};

export default PatientProfileModal;