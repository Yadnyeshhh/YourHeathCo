import React , {useEffect , useState} from 'react';
import './stylesheets/Admin.css';
import Sidebar from './Sidebar';
import PatientCard from './PatientCard';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;


const Admin = () => {
  const [patients, setPatients] = useState([]);
 useEffect(() => {
  const fetchPatients = async () => {
    try {
      const storedAdmin = localStorage.getItem("admin");
      if (!storedAdmin) {
        console.warn("No admin data found in localStorage.");
        return;
      }

      const admin = JSON.parse(storedAdmin);
      const token = admin?.token;

      if (!token) {
        console.warn("No admin token found. Admin not logged in.");
        return;
      }

      // ✅ Fetch all users for this admin
      const res = await axios.get(`${apiUrl}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPatients(res.data);
    } catch (err) {
      console.error("Failed to fetch admin's patients:", err);
    }
  };

  fetchPatients();
}, []);


  

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-main">
        <h1>Patient Dashboard</h1>
        <div className="patient-grid">
          {patients.map((patient) => (
            <PatientCard key={patient._id} patient={patient} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
