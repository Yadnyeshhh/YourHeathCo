// src/components/TeamTodaySection.js

import React from 'react';

const TeamTodaySection = ({ data }) => {
  return (
    <div className="team-today-section">
      <h2 className="team-today-section-title">Team Today</h2>
      <ul className="team-today-list">
        {data.map((member, index) => (
          <li key={index} className="team-today-member-item">
            <img src={member.avatar} alt={member.name} className="team-today-member-avatar" />
            <div className="team-today-member-info">
              <div className="team-today-member-name">{member.name}</div>
              <div className="team-today-member-designation">{member.designation}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamTodaySection;