import "./TeamTodaySection.css";
import React from 'react';

const TeamTodaySection = ({
  doctor
}) => {
  // Function to get initials from doctor name
  const getInitials = name => {
    if (!name || name.trim().length === 0) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };
  return (
    <div className="db-doctor-root">
      <h2 className="db-doctor-title">Consulting Doctor</h2>
      <ul className="db-doctor-list">
        <li className="db-doctor-item">
          <div className="db-doctor-avatar">
            {getInitials(doctor)}
          </div>
          <div className="db-doctor-info">
            <div className="db-doctor-name">{doctor}</div>
            <div className="db-doctor-designation">Primary Physician</div>
          </div>
        </li>
      </ul>
    </div>
  );
};
export default TeamTodaySection;