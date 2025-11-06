// src/components/TeamTodaySection.js

import React from 'react';

const TeamTodaySection = ({ doctor }) => {
  // Function to get initials from doctor name
  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  return (
    <div className="team-today-section">
      <h2 className="team-today-section-title">Consulting Doctor</h2>
      <ul className="team-today-list">
        <li className="team-today-member-item">
          <div className="team-today-member-avatar">
            {getInitials(doctor)}
          </div>
          <div className="team-today-member-info">
            <div className="team-today-member-name">{doctor}</div>
            <div className="team-today-member-designation">Primary Physician</div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default TeamTodaySection;
