import React from 'react';
import './stylesheets/Patientcard.css';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;
const PatientCard = ({ patient , institue}) => {
  const navigate = useNavigate();

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/patient/${patient.id}`, { state: { patient , institue } }); // ← Pass patient as state
  };





  return (
    <div className="admin-patient-card" onClick={handleViewDetails}>
    
      <img src="/profile.png" alt={`${patient.name}'s profile`} className="patient-photo" />
      <h3>{patient.name}</h3>
      <button className="view-details-button" onClick={handleViewDetails}>
        View Details
      </button>
    </div>
  );
};

export default PatientCard;
