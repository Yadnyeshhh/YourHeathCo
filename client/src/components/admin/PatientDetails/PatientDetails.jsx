import "./PatientDetails.css";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../styles/admin/PatientDetails.css";
import Sidebar from "../Sidebar/Sidebar";
import { getSchedule, updateMeds } from "../../../services/scheduleService";
import { updatePatientStatus } from "../../../services/patientStatusService";
import api from "../../../services/api";

const PatientDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const patient = state?.patient;
  const [isEditing, setIsEditing] = useState(false);
  const [schedule, setSchedule] = useState(null);

  const [isDoctorEditing, setIsDoctorEditing] = useState(false);
  const [doctor, setDoctor] = useState(patient?.assignedDoctor || patient?.patientStatus?.assignedDoctor || "");
  const [appointment, setAppointment] = useState(patient?.nextAppointment || patient?.patientStatus?.nextAppointment || "");
  const [admittedStatus, setAdmittedStatus] = useState(
    patient?.admitted ? "Admitted" : "Not Admitted",
  );

  useEffect(() => {
    const fetchPatientSchedule = async () => {
      try {
        if (patient?._id) {
          const res = await getSchedule(patient._id);
          setSchedule(res?.data || res || null);
        }
      } catch (err) {
        console.error("Failed to fetch schedule:", err.message);
      }
    };
    fetchPatientSchedule();
  }, [patient]);

  if (!patient) return <div style={{ padding: '2rem' }}>Patient not found</div>;

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const handleChange = (dayKey, field, value, type = "medicine") => {
  const updated = { ...(schedule || {}) };
  // Ensure the day entry exists
  if (!updated[dayKey]) {
    updated[dayKey] = { medicines: [], meal: {} };
  }
  if (type === "medicine") {
    // Initialize medicines array if empty
    if (!updated[dayKey].medicines || updated[dayKey].medicines.length === 0) {
      updated[dayKey].medicines = [{ name: "", time: "" }];
    }
    updated[dayKey].medicines[0][field] = value;
  } else {
    // Initialize meal object if missing
    if (!updated[dayKey].meal) {
      updated[dayKey].meal = { breakfast: "", lunch: "", dinner: "" };
    }
    updated[dayKey].meal[field] = value;
  }
  setSchedule(updated);
};

  const handleSave = async () => {
    try {
      await updateMeds(patient._id, schedule);
      alert("Medications & Meals updated successfully!");
      setIsEditing(false);
    } catch (err) {
      alert("Could not save medications: " + err.message);
    }
  };

  const handleDoctorSave = async () => {
    try {
      await updatePatientStatus(patient._id, {
        assignedDoctor: doctor,
        nextAppointment: appointment,
      });
      alert("✅ Doctor & appointment updated successfully!");
      setIsDoctorEditing(false);
    } catch (err) {
      alert("Could not update doctor assignment: " + err.message);
    }
  };

  const handleUnassign = async () => {
    const confirmUnassign = window.confirm(
      `Are you sure you want to unassign ${patient.name} from your admin list?`
    );
    if (!confirmUnassign) return;
    try {
      await api.patch(`/user/unassign/${patient._id}`);
      alert("✅ Patient successfully unassigned!");
      navigate(-1);
    } catch (err) {
      alert(err.message || "Error while unassigning patient");
    }
  };

  return (
    <div className="admin-details-container">
      <Sidebar />
      <div className="admin-details-main">
        <button className="admin-back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2>{patient.name}</h2>
        <p>Age: {patient.age}</p>
        <p>Contact: {patient.contact}</p>

        <div className="section">
          <h3>Admitted Status</h3>
          <form
            className="doctor-form"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await updatePatientStatus(patient._id, {
                  admitted: admittedStatus === "Admitted",
                });
                alert("✅ Admitted status updated successfully!");
              } catch (err) {
                alert("Error updating admitted status: " + err.message);
              }
            }}
          >
            <div className="form-group">
              <label htmlFor="admittedStatus">Select Status</label>
              <select
                id="admittedStatus"
                className="status-select"
                value={admittedStatus}
                onChange={(e) => setAdmittedStatus(e.target.value)}
              >
                <option value="Admitted">Admitted</option>
                <option value="Not Admitted">Not Admitted</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="update-status-btn">
                Update Status
              </button>
            </div>
          </form>
        </div>

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
                onChange={(e) => setAppointment(e.target.value)}
                disabled={!isDoctorEditing}
              />
            </div>

            <div className="form-actions">
              {isDoctorEditing ? (
                <>
                  <button type="button" className="save-btn" onClick={handleDoctorSave}>
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setIsDoctorEditing(false)}
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

        <div className="section">
          <h3>Medications</h3>
          {!schedule ? (
            <p>No schedule defined.</p>
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
                  const med = dayData?.medicines?.[0] || { name: "", time: "" };
                  return (
                    <tr key={`med-${dayKey}`}>
                      <td>{capitalize(dayKey)}</td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={med.name}
                            onChange={(e) => handleChange(dayKey, "name", e.target.value, "medicine")}
                          />
                        ) : (
                          med.name || ""
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            value={med.time}
                            onChange={(e) => handleChange(dayKey, "time", e.target.value, "medicine")}
                          />
                        ) : (
                          med.time || ""
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="section">
          <h3>Meals</h3>
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
              {(schedule ? Object.entries(schedule) : [
                ['Monday', {}],
                ['Tuesday', {}],
                ['Wednesday', {}],
                ['Thursday', {}],
                ['Friday', {}],
                ['Saturday', {}],
                ['Sunday', {}],
              ]).map(([dayKey, dayData]) => {
                const meal = dayData?.meal || { breakfast: "", lunch: "", dinner: "" };
                return (
                  <tr key={`meal-${dayKey}`}>
                    <td>{capitalize(dayKey)}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={meal.breakfast}
                          onChange={(e) => handleChange(dayKey, "breakfast", e.target.value, "meal")} 
                        />
                      ) : (
                        meal.breakfast || ""
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={meal.lunch}
                          onChange={(e) => handleChange(dayKey, "lunch", e.target.value, "meal")} 
                        />
                      ) : (
                        meal.lunch || ""
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          value={meal.dinner}
                          onChange={(e) => handleChange(dayKey, "dinner", e.target.value, "meal")} 
                        />
                      ) : (
                        meal.dinner || ""
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {/* Edit/Save button for meals */}
          {isEditing ? (
            <button className="save-btn" onClick={handleSave}>Save</button>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Meals</button>
          )}
        </div>

        {schedule && (
          <div className="medication-actions">
            {isEditing ? (
              <button className="save-btn" onClick={handleSave}>Save</button>
            ) : (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
            )}
          </div>
        )}

        <div className="unassign-section">
          <button className="unassign-btn" onClick={handleUnassign}>
            Unassign Patient
          </button>
        </div>
      </div>
    </div>
  );
};
export default PatientDetails;
