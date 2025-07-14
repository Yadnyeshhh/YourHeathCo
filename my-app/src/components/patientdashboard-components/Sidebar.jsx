import React , {useEffect} from 'react';
import LucideIcon from './LucideIcon.jsx'; // Import the new LucideIcon component
import { useNavigate } from 'react-router-dom';



const Sidebar = ({ navItems , profile }) => {
   const navigate = useNavigate(); 
 const user = JSON.parse(localStorage.getItem("user"));
 const logOut = (name) => {
  if (name === "Logout") {
    localStorage.removeItem("user");
    navigate("/login"); 
    return;
  }


  // 🧭 Handle normal navigation or selection
  console.log(`Navigating to: ${name}`);
};
  console.log(profile)
  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-logo-section">
          {/* You can add your logo here */}
          {/* <LucideIcon name="HeartPulse" className="sidebar-logo-icon" size={28} /> */}
          {/* <span className="sidebar-logo-text">eCare MD</span> */}
        </div>
        <nav>
          <ul className="sidebar-nav-list">
            {navItems.map((item, index) => (
              <li key={index} className="sidebar-nav-item-wrapper">
                <a
                 onClick={() => logOut(item.name)}
                  href="#"
                  className={`sidebar-nav-item ${
                    item.active ? 'sidebar-nav-item-active' : 'sidebar-nav-item-inactive'
                  }`}
                >
                
                  <LucideIcon name={item.icon} className="sidebar-nav-item-icon" size={20} />
                  <span className="sidebar-nav-item-text">{item.name}</span>
                  {item.count && (
                    <span
                      className={`sidebar-nav-item-count ${
                        item.active ? 'sidebar-nav-item-count-active' : 'sidebar-nav-item-count-inactive'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                 
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="sidebar-user-profile-section">
        <img
          src={`https://placehold.co/40x40/F0F4F8/000000?text=${profile?.name?.[0] || 'U'}`}
          alt="User Avatar"
          className="sidebar-user-avatar"
        />
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">{profile.name}</div>
          <div className="sidebar-user-role">member</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;