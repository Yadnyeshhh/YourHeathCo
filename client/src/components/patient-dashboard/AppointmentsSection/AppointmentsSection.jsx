import "./AppointmentsSection.css";
import React from 'react';

const AppointmentsSection = ({
  data,
  nextAppointment
}) => {
  return (
    <div className="db-vitals-root">
      <div className="db-vitals-card">
        <h2 className="db-vitals-card-title">Appointments</h2>

        <div className="db-vitals-list-grid">
          {data.map((item, index) => (
            <div key={index} className="db-vitals-list-item">
              <span className="db-vitals-item-title">{item.title}</span>
              <span className="db-vitals-item-count">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {nextAppointment && (
        <div className="db-vitals-appointment-card">
          <h3 className="db-vitals-appointment-title">Next Appointment</h3>
          <p className="db-vitals-appointment-time">{new Date(nextAppointment).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};
export default AppointmentsSection;