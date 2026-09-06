import "./AddPatient.css";
import React, { useState, useEffect } from "react";
import "../../../styles/admin/addpatient.css";
import { useLocation } from "react-router-dom";
import Modal from "../Modal/Modal";
import { InteractiveGridPattern } from "../../../assets/gridBgPattern";
import { searchUsers } from "../../../services/userService";
import api from "../../../services/api";

const AddPatient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    gender: "",
    bloodGroup: "",
    minAge: "",
    maxAge: ""
  });
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const adminId = location.state?.id || "";

  const fetchUsersList = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await searchUsers(searchTerm, {
        gender: filters.gender,
        bloodGroup: filters.bloodGroup,
        minAge: filters.minAge,
        maxAge: filters.maxAge,
        page
      });
      const data = response?.data || response;
      setUsers(data?.users || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      setError("Failed to load users. " + err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersList();
    // eslint-disable-next-line
  }, [page]);

  const handleAssign = async (userId) => {
    try {
      await api.patch(`/user/assign/${userId}`, { adminId });
      alert("User successfully assigned!");
      fetchUsersList();
      setShowModal(false);
    } catch (err) {
      alert(err.message || "Error assigning user");
    }
  };

  return (
    <div className="add-patient-page-wrapper">
      <InteractiveGridPattern 
        width={40}
        height={40} 
        squares={[30, 30]}
        className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        squaresClassName="stroke-gray-700 stroke-[1] hover:fill-teal-500/30"
      />
      <div className="add-patient-container">
        <h1 className="add-patient-title">Add Patient to Your Admin List</h1>

        <div className="filter-section">
          <input 
            type="text" 
            placeholder="Search by name, email, or contact" 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />

          <select value={filters.gender} onChange={e => setFilters({ ...filters, gender: e.target.value })}>
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select value={filters.bloodGroup} onChange={e => setFilters({ ...filters, bloodGroup: e.target.value })}>
            <option value="">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          <input 
            type="number" 
            placeholder="Min Age" 
            value={filters.minAge} 
            onChange={e => setFilters({ ...filters, minAge: e.target.value })} 
          />
          <input 
            type="number" 
            placeholder="Max Age" 
            value={filters.maxAge} 
            onChange={e => setFilters({ ...filters, maxAge: e.target.value })} 
          />

          <button className="search-btn" onClick={() => { setPage(1); fetchUsersList(); }}>
            Search
          </button>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="user-list">
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : users.length === 0 ? (
            <p className="no-results">No unassigned users found.</p>
          ) : (
            users.map(user => (
              <div className="user-card" key={user._id}>
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Contact:</strong> {user.contact}</p>
                  <p><strong>Gender:</strong> {user.gender}</p>
                  <p><strong>Blood Group:</strong> {user.bloodGroup}</p>
                  <p><strong>Age:</strong> {user.age}</p>
                </div>
                <button className="assign-btn" onClick={() => {
                  setSelectedUser(user);
                  setShowModal(true);
                }}>
                  Assign
                </button>
              </div>
            ))
          )}
        </div>

        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>

        {showModal && selectedUser && (
          <Modal 
            title="Confirm Assignment" 
            message={`Are you sure you want to assign ${selectedUser.name} to your admin list?`} 
            onConfirm={() => handleAssign(selectedUser._id)} 
            onCancel={() => setShowModal(false)} 
          />
        )}
      </div>
    </div>
  );
};
export default AddPatient;
