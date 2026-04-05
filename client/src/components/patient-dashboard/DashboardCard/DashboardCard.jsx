import "./DashboardCard.css";
import React, { useState } from 'react';
import LucideIcon from "../LucideIcon/LucideIcon";

const DashboardCard = ({
  title,
  value,
  icon,
  colorClass,
  meds
}) => {
  const [showTable, setShowTable] = useState(false);
  const handleClick = () => {
    setShowTable(true);
  };
  const handleClose = () => {
    setShowTable(false);
  };
  const lowerTitle = title.toLowerCase();
  const renderTable = () => {
    if (lowerTitle === 'medicines') {
      return <table className="db-card-data-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Medicine</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {meds && meds.length > 0 ? meds.map(row => row.medicines.length > 0 ? row.medicines.map((med, idx) => <tr key={`${row.day}-${idx}`}>
                      <td>{row.day.charAt(0).toUpperCase() + row.day.slice(1)}</td>
                      <td>{med.name}</td>
                      <td>{med.time}</td>
                    </tr>) : <tr key={`${row.day}-empty`}>
                    <td>{row.day.charAt(0).toUpperCase() + row.day.slice(1)}</td>
                    <td colSpan="2">No medicine</td>
                  </tr>) : <tr><td colSpan="3">No data available</td></tr>}
          </tbody>
        </table>;
    }
    if (lowerTitle === 'meals') {
      return <table className="db-card-data-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Dinner</th>
            </tr>
          </thead>
          <tbody>
            {meds && meds.length > 0 ? meds.map(row => <tr key={row.day}>
                  <td>{row.day.charAt(0).toUpperCase() + row.day.slice(1)}</td>
                  <td>{row.meal?.breakfast || '-'}</td>
                  <td>{row.meal?.lunch || '-'}</td>
                  <td>{row.meal?.dinner || '-'}</td>
                </tr>) : <tr><td colSpan="4">No data available</td></tr>}
          </tbody>
        </table>;
    }

    // For other cards
    return <div className="db-card-inline-1">
        <p>🚧 This section is under maintenance.</p>
      </div>;
  };
  return <>
      <div className="db-card-upper">
        <button className="db-card-button" onClick={handleClick}>
          <div className={`db-card-icon-wrapper ${colorClass}`}>
            <LucideIcon name={icon} size={24} />
          </div>
          <div className="db-card-content">
            <div className="db-card-title">{title}</div>
          </div>
        </button>
      </div>

      {showTable && <div className="db-card-modal-overlay" onClick={handleClose}>
          <div className="db-card-modal-content" onClick={e => e.stopPropagation()}>
            <h3>{title} Details</h3>
            {renderTable()}
            <button className="db-card-close-button" onClick={handleClose}>Close</button>
          </div>
        </div>}
    </>;
};
export default DashboardCard;