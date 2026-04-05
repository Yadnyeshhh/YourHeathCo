import "./Sidebar.css";
import React from 'react';
import LucideIcon from "../LucideIcon/LucideIcon";
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = ({
  profile,
  isOpen,
  onClose,
  messagesCount = 2,
  appointmentsCount = 3
}) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { name: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard', active: true },
    { name: 'Appointments', icon: 'Calendar', path: '#', badge: appointmentsCount },
    { name: 'Medical Records', icon: 'FileText', path: '#' },
    { name: 'Prescriptions', icon: 'ClipboardPlus', path: '#' },
    { name: 'Test Results', icon: 'BarChart2', path: '#' },
    { name: 'Billing & Payments', icon: 'CreditCard', path: '#' },
    { name: 'Messages', icon: 'MessageCircle', path: '#', badge: messagesCount },
    { name: 'Settings', icon: 'Settings', path: '#' },
  ];

  // Derive user info
  const name = profile?.name || "John Patient";
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  const patientId = profile?.patientId || "#12345";

  return (
    <nav className={`sb-pt-root ${isOpen ? "open" : ""}`}>
      {/* Header / Logo */}
      <div className="sb-pt-header">
        <h2 className="sb-pt-logo-text">YourHealthCo</h2>
        <button className="sb-pt-menu-btn" onClick={onClose} aria-label="Close menu">
          {/* <LucideIcon name="Menu" size={24} /> */}
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="sb-pt-nav-section">
        {menuItems.map((item, index) => (
          <NavLink
            to={item.path}
            key={index}
            className={`sb-pt-item ${item.active ? 'sb-pt-item-active' : ''}`}
            onClick={item.active ? undefined : (e) => e.preventDefault()}
          >
            <div className="sb-pt-item-left">
              <LucideIcon name={item.icon} size={20} className="sb-pt-item-icon" />
              <span>{item.name}</span>
            </div>
          </NavLink>
        ))}

        <div className="sb-pt-divider"></div>

        <NavLink to="#" className="sb-pt-item" onClick={(e) => e.preventDefault()}>
          <div className="sb-pt-item-left">
            <LucideIcon name="HelpCircle" size={20} className="sb-pt-item-icon" />
            <span>Help & Support</span>
          </div>
        </NavLink>

        <NavLink to="#" className="sb-pt-item sb-pt-emergency-item" onClick={(e) => e.preventDefault()}>
          <div className="sb-pt-item-left">
            <LucideIcon name="PhoneCall" size={20} className="sb-pt-item-icon" />
            <span>Emergency</span>
          </div>
        </NavLink>
      </div>

      {/* Bottom User Card */}
      <div className="sb-pt-user-card">
        <div className="sb-pt-user-info-row">
          <div className="sb-pt-avatar">{initials}</div>
          <div className="sb-pt-details">
            <h3 className="sb-pt-user-name">{name}</h3>
          </div>
        </div>

        <button className="sb-pt-signout-btn" onClick={handleSignOut}>
          <LucideIcon name="LogOut" size={18} />
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;