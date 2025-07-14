import React from 'react';
import './stylesheets/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="admin-menu">
        <h2 className="admin-title">Institution</h2>
        <ul className="admin-menu-items">
          <li className="admin-menu-item"><a href='/admin'>Dashboard</a></li>
          <li className="admin-menu-item"><a>Settings</a></li>
          <li className="admin-menu-item"><a>Alerts</a></li>
          <li className="admin-menu-item"><a>Settings</a></li>
          <li className="admin-menu-item"><a>Help</a></li>
        </ul>
      </div>
      <div className="admin-user-info">
        <p className="admin-label">Logged in as:</p>
        <p className="admin-name">Dr. Yadnyesh</p>
      </div>
    </div>
  );
};

export default Sidebar;
