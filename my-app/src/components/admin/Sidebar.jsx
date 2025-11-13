import React from "react";
import { useNavigate } from "react-router-dom";
import "./stylesheets/Sidebar.css";

const Sidebar = ({ admin, id }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/login");
  };

  const handleAddPatient = () => {
    // Navigate to AddPatient page with admin ID as a route param or state
    navigate(`/addpatient` , {
        state: {
          id,
        },
      });
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-menu">
        <h2 className="admin-title">{admin}</h2>
        <ul className="admin-menu-items">
          <li className="admin-menu-item">
            <a href="/admin">Dashboard</a>
          </li>

          <li
            className="admin-menu-item"
            style={{ cursor: "pointer" }}
            onClick={handleAddPatient}
          >
            Add-patient
          </li>

          <li className="admin-menu-item">
            <a href="#">Settings</a>
          </li>
          <li className="admin-menu-item">
            <a href="#">Alerts</a>
          </li>
          <li className="admin-menu-item">
            <a href="#">Help</a>
          </li>

          <li
            className="admin-menu-item"
            style={{ color: "red", cursor: "pointer" }}
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </div>

      <div className="admin-user-info">
        <p className="admin-label">Logged in as:</p>
        <p className="admin-name">{admin}</p>
      </div>
    </div>
  );
};

export default Sidebar;
