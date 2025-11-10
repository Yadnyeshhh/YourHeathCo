// src/components/ProgramSection.js

import React from 'react';
import "./stylesheets/programsection.css"

const ProgramSection = ({ data, nextAppointment }) => {
  return (
    <div className="program-section">
      <h2 className="program-section-title">Quick Updates</h2>
      
      <div className="program-list-grid">
        {data.map((item, index) => (
          <div key={index} className="program-list-item">
            <span className="program-list-item-title">{item.title}</span>
            <span className="program-list-item-count">{item.count}</span>
          </div>
        ))}
      </div>

      {/* ✅ Show next appointment once at the bottom */}
      {nextAppointment && (
        <div className="next-appointment">
          <h3>Next Appointment</h3>
          <p>{new Date(nextAppointment).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default ProgramSection;
