import React from "react";
import "./stylesheets/addpatient.css";

const Modal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="confirm-btn" onClick={onConfirm}>Confirm</button>
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
