import React, { useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

const PatientProfileModal = ({ isOpen, onClose, patientData, token, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(patientData || {});

  if (!isOpen) return null;

  const pfp = { display: "flex" };
  const pfpinfo = { width: "50%" };
  const pfpimg = { width: "50%", marginLeft: "auto" };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/user/update/${patientData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(editedData),
      });

      if (response.ok) {
        const data = await response.json();
        setIsEditing(false);
        if (onUpdate) onUpdate(data.user); 
      } else {
        const error = await response.json();
        alert("Failed to update: " + (error.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Error updating:", err);
      alert("Error updating patient details.");
    }
  };



  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Patient Profile</h2>

        {!patientData ? (
          <p>Loading profile...</p>
        ) : (
          <div style={pfp}>
            <div className="patient-details" style={pfpinfo}>
              {isEditing ? (
                <>
                  <p>
                    <strong>Name:</strong>{" "}
                    <input
                      type="text"
                      name="name"
                      value={editedData.name}
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <strong>Age:</strong>{" "}
                    <input
                      type="number"
                      name="age"
                      value={editedData.age}
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <strong>Gender:</strong>{" "}
                    <select
                      name="gender"
                      value={editedData.gender}
                      onChange={handleChange}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </p>
                  <p>
                    <strong>Contact:</strong>{" "}
                    <input
                      type="text"
                      name="contact"
                      value={editedData.contact}
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <strong>Blood Group:</strong>{" "}
                    <input
                      type="text"
                      name="bloodGroup"
                      value={editedData.bloodGroup}
                      onChange={handleChange}
                    />
                  </p>
                </>
              ) : (
                <>
                  <p><strong>Name:</strong> {patientData.name}</p>
                  <p><strong>Age:</strong> {patientData.age}</p>
                  <p><strong>Gender:</strong> {patientData.gender}</p>
                  <p><strong>Contact:</strong> {patientData.contact}</p>
                  <p><strong>Blood Group:</strong> {patientData.bloodGroup}</p>
                </>
              )}
            </div>

            <div style={pfpimg}>
              <img
                src="/profile.png"
                alt="Profile"
                style={{  borderRadius: "50%" , width: "100%",
    height: "100%"}}
              />
            </div>
          </div>
        )}

        <div style={{ marginTop: "20px" }}>
          {isEditing ? (
            <>
              <button onClick={handleSave} className="save-btn">Save</button>
              <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
          )}
          <button onClick={onClose} className="modal-close-button">Close</button>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileModal;
