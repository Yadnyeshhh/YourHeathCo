// src/components/ProgramSection.js

import React from 'react';

const ProgramSection = ({ data }) => {
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
    </div>
  );
};

export default ProgramSection;