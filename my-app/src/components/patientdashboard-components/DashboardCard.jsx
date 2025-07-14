import React, { useState } from 'react';
import LucideIcon from './LucideIcon.jsx';

const DashboardCard = ({ title, value, icon, colorClass, meds }) => {
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
      return (
        <table className="data-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Medicine</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {meds && meds.length > 0 ? (
              meds.map((row) =>
                row.medicines.length > 0 ? (
                  row.medicines.map((med, idx) => (
                    <tr key={`${row.day}-${idx}`}>
                      <td>{row.day.charAt(0).toUpperCase() + row.day.slice(1)}</td>
                      <td>{med.name}</td>
                      <td>{med.time}</td>
                    </tr>
                  ))
                ) : (
                  <tr key={`${row.day}-empty`}>
                    <td>{row.day.charAt(0).toUpperCase() + row.day.slice(1)}</td>
                    <td colSpan="2">No medicine</td>
                  </tr>
                )
              )
            ) : (
              <tr><td colSpan="3">No data available</td></tr>
            )}
          </tbody>
        </table>
      );
    }

    if (lowerTitle === 'meals') {
      return (
        <table className="data-table">
          <thead>
            <tr>
              <th>Day</th>
              <th>Breakfast</th>
              <th>Lunch</th>
              <th>Dinner</th>
            </tr>
          </thead>
          <tbody>
            {meds && meds.length > 0 ? (
              meds.map((row) => (
                <tr key={row.day}>
                  <td>{row.day.charAt(0).toUpperCase() + row.day.slice(1)}</td>
                  <td>{row.meal?.breakfast || '-'}</td>
                  <td>{row.meal?.lunch || '-'}</td>
                  <td>{row.meal?.dinner || '-'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4">No data available</td></tr>
            )}
          </tbody>
        </table>
      );
    }

    // For other cards
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>🚧 This section is under maintenance.</p>
      </div>
    );
  };

  return (
    <>
      <div className="dashboard-card-upper">
        <button className={`dashboard-card-${title}`} onClick={handleClick}>
          <div className={`dashboard-card-icon-wrapper ${colorClass}`}>
            <LucideIcon name={icon} size={24} />
          </div>
          <div className="dashboard-card-content">
            <div className="dashboard-card-title">{title}</div>
          </div>
        </button>
      </div>

      {showTable && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{title} Details</h3>
            {renderTable()}
            <button className="close-button" onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardCard;
