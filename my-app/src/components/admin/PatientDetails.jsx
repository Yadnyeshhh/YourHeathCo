import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './stylesheets/PatientDetails.css';
import Sidebar from './Sidebar';
const apiUrl = import.meta.env.VITE_API_URL;

const PatientDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const patient = state?.patient;

  const [isEditing, setIsEditing] = useState(false);
  const [schedule, setSchedule] = useState(null);
  
  // New states for doctor assignment
  const [isDoctorEditing, setIsDoctorEditing] = useState(false);
  const [doctor , setDoctor] = useState(patient.assignedDoctor
);
const [appointment , setAppointment] = useState(patient.nextAppointment
)
useEffect(() => {
  if (patient?.nextAppointment) {
    const isoString = patient.nextAppointment;
    const formatted = isoString.slice(0, 16); // "YYYY-MM-DDTHH:mm"
    setAppointment(formatted);
  }
}, [patient]);  

  if (!patient) return <div>Patient not found</div>;

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const handleChange = (dayKey, field, value, type = 'medicine') => {
    const updated = { ...schedule };

    if (type === 'medicine') {
      if (!updated[dayKey].medicines || !updated[dayKey].medicines[0]) {
        updated[dayKey].medicines = [{ name: '', time: '' }];
      }
      updated[dayKey].medicines[0][field] = value;
    } else {
      if (!updated[dayKey].meal) {
        updated[dayKey].meal = { breakfast: '', lunch: '', dinner: '' };
      }
      updated[dayKey].meal[field] = value;
    }

    setSchedule(updated);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/meds_meals/patient/${patient._id}/medications`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ schedule }),
        }
      );

      if (!response.ok) throw new Error('Failed to update medications');

      const updatedPatient = await response.json();
      console.log('Updated:', updatedPatient);
      setIsEditing(false);
    } catch (err) {
      console.error('Save error:', err);
      alert('Could not save medications.');
    }
  };

 const handleDoctorSave = async () => {
  try {
    const storedAdmin = localStorage.getItem("admin");
    if (!storedAdmin) return alert("Admin not logged in");

    const { token } = JSON.parse(storedAdmin);

    const response = await fetch(
      `${apiUrl}/api/patient-status/${patient._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assignedDoctor: doctor,
          nextAppointment: appointment,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to update status");

    alert("✅ Doctor & appointment updated successfully!");
    setIsDoctorEditing(false);
  } catch (err) {
    console.error("Save error:", err);
    alert("Could not update doctor assignment.");
  }
};


  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/api/meds_meals/patient/${patient._id}/schedule`
        );
        if (!res.ok) throw new Error('Failed to fetch schedule');

        const data = await res.json();
        setSchedule(data);
      } catch (err) {
        console.error('Failed to fetch schedule:', err);
      }
    };

    if (patient?._id) {
      fetchSchedule();
    }
  }, [patient]);

  return (
    <div className="admin-details-container">
      <Sidebar />
      <div className="admin-details-main">
        <button className="admin-back-button" onClick={() => navigate(-1)}>← Back</button>
        <h2>{patient.name}</h2>
        <p>Age: {patient.age}</p>
        <p>Condition: {patient.condition}</p>
        <p><strong>Medical History:</strong> {patient.history}</p>

        {/* Doctor Assignment Form */}
        <div className="section">
          <h3>Assigned Doctor</h3>
          <form className="doctor-form">
            <div className="form-group">
              <label htmlFor="doctor">Doctor Name</label>
              <input
                type="text"
                id="doctor"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                disabled={!isDoctorEditing}
                placeholder="Enter doctor name"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="appointment">Appointment Date</label>
              <input
                type="datetime-local"
                id="appointment"
                value={appointment}
                onChange={(e) => setAppointment( e.target.value )}
                disabled={!isDoctorEditing}
              />
            </div>

            <div className="form-actions">
              {isDoctorEditing ? (
                <>
                  <button 
                    type="button" 
                    className="save-btn" 
                    onClick={handleDoctorSave}
                  >
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn" 
                    onClick={() => {
                      setIsDoctorEditing(false);
                      setDoctorData({ doctor: patient.doctor, appointment: patient.appointment });
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  type="button" 
                  className="edit-btn" 
                  onClick={() => setIsDoctorEditing(true)}
                >
                  Edit Assignment
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Medications Table */}
        <div className="section">
          <h3>Medications</h3>
          {!schedule ? (
            <p>Loading schedule...</p>
          ) : (
            <table className="medication-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Medicine</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(schedule).map(([dayKey, dayData]) => {
                  const med = dayData?.medicines?.[0] || { name: '', time: '' };
                  return (
                    <tr key={`med-${dayKey}`}>
                      <td>{capitalize(dayKey)}</td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => handleChange(dayKey, 'name', e.target.value, 'medicine')}
                          />
                        ) : (
                          med.name || ''
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={med.time}
                            onChange={(e) => handleChange(dayKey, 'time', e.target.value, 'medicine')}
                          />
                        ) : (
                          med.time || ''
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Meals Table */}
        <div className="section">
          <h3>Meals</h3>
          {!schedule ? (
            <p>Loading schedule...</p>
          ) : (
            <table className="medication-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Breakfast</th>
                  <th>Lunch</th>
                  <th>Dinner</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(schedule).map(([dayKey, dayData]) => {
                  const meal = dayData?.meal || { breakfast: '', lunch: '', dinner: '' };
                  return (
                    <tr key={`meal-${dayKey}`}>
                      <td>{capitalize(dayKey)}</td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={meal.breakfast}
                            onChange={(e) => handleChange(dayKey, 'breakfast', e.target.value, 'meal')}
                          />
                        ) : (
                          meal.breakfast || ''
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={meal.lunch}
                            onChange={(e) => handleChange(dayKey, 'lunch', e.target.value, 'meal')}
                          />
                        ) : (
                          meal.lunch || ''
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={meal.dinner}
                            onChange={(e) => handleChange(dayKey, 'dinner', e.target.value, 'meal')}
                          />
                        ) : (
                          meal.dinner || ''
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Edit/Save Controls */}
        {schedule && (
          <div className="medication-actions">
            {isEditing ? (
              <button className="save-btn" onClick={handleSave}>Save</button>
            ) : (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDetails;