import "./PatientProfileModal.css";
import React, { useState } from "react";
import { updateUser } from "../../../services/userService";

const PatientProfileModal = ({
  isOpen,
  onClose,
  patientData,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(patientData || {});

  React.useEffect(() => {
    setEditedData(patientData || {});
  }, [patientData]);

  if (!isOpen) return null;

  const pfp = { display: "flex" };
  const pfpinfo = { width: "50%" };
  const pfpimg = { width: "50%", marginLeft: "auto" };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await updateUser(patientData._id, editedData);
      setIsEditing(false);
      const updatedUser = response?.data?.user || response?.user || editedData;
      if (onUpdate) onUpdate(updatedUser);
    } catch (err) {
      alert("Could not update patient details: " + err.message);
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
                      value={editedData.name || ""}
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <strong>Age:</strong>{" "}
                    <input
                      type="number"
                      name="age"
                      value={editedData.age || ""}
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <strong>Gender:</strong>{" "}
                    <select
                      name="gender"
                      value={editedData.gender || ""}
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
                      value={editedData.contact || ""}
                      onChange={handleChange}
                    />
                  </p>
                  <p>
                    <strong>Blood Group:</strong>{" "}
                    <input
                      type="text"
                      name="bloodGroup"
                      value={editedData.bloodGroup || ""}
                      onChange={handleChange}
                    />
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>Name:</strong> {patientData.name}
                  </p>
                  <p>
                    <strong>Age:</strong> {patientData.age}
                  </p>

                  <p>
                    <strong>Gender:</strong> {patientData.gender}
                  </p>
                  <p>
                    <strong>Contact:</strong> {patientData.contact}
                  </p>
                  <p>
                    <strong>Blood Group:</strong> {patientData.bloodGroup}
                  </p>
                </>
              )}
            </div>

            <div style={pfpimg}>
              <img
                src="/profile.png"
                alt="Profile"
                className="patientprofilemodal-inline-1"
              />
            </div>
          </div>
        )}

        <div className="patientprofilemodal-inline-2">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="save-btn">
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              Edit
            </button>
          )}
          <button onClick={onClose} className="modal-close-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default PatientProfileModal;
