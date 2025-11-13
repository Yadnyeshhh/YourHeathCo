import React, { useState, useEffect } from "react";
import "./stylesheets/addpatient.css";
import { useLocation } from "react-router-dom";
import Modal from "./Modal";

// ✅ Use VITE_API_URL or fallback to localhost:5000
const apiUrl = import.meta.env.VITE_API_URL;

const AddPatient = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    gender: "",
    bloodGroup: "",
    minAge: "",
    maxAge: "",
  });
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
 const id  = location.state.id;
 console.log(location.state.id)
const adminData = JSON.parse(localStorage.getItem("admin")) || {}; // parse the stored object
const token = adminData.token || "";
const adminId = id || "";

//  localStorage.getItem("adminToken")
  // ✅ Fetch unassigned users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const queryParams = new URLSearchParams({
        query: searchTerm,
        gender: filters.gender,
        bloodGroup: filters.bloodGroup,
        minAge: filters.minAge,
        maxAge: filters.maxAge,
        page,
      }).toString();

      console.log("Fetching from:", `${apiUrl}/api/user/search?${queryParams}`);

      const res = await fetch(`${apiUrl}/api/user/search?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Failed to fetch users (Status: ${res.status})`);

      const data = await res.json();

      if (Array.isArray(data)) {
        setUsers(data);
        setTotalPages(1);
      } else {
        setUsers(data?.users || []);
        setTotalPages(data?.totalPages || 1);
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Failed to load users. Try again later.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [page]);

  // ✅ Assign user to admin
  const handleAssign = async (userId) => {
    try {
      const res = await fetch(`${apiUrl}/api/user/assign/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Assignment failed");
      }

      alert("User successfully assigned!");
      fetchUsers();
      setShowModal(false);
    } catch (err) {
      console.error("Assign error:", err);
      alert(err.message || "Error assigning user");
    }
  };
 


  return (
    <div className="add-patient-container">
      <h1 className="add-patient-title">Add Patient to Your Admin List</h1>

      {/* Filters */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search by name, email, or contact"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filters.gender}
          onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select
          value={filters.bloodGroup}
          onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
        >
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
          onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Age"
          value={filters.maxAge}
          onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
        />

        <button
          className="search-btn"
          onClick={() => {
            setPage(1);
            fetchUsers();
          }}
        >
          Search
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="error-text">{error}</p>}

      {/* User List */}
      <div className="user-list">
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : users.length === 0 ? (
          <p className="no-results">No unassigned users found.</p>
        ) : (
          users.map((user) => (
            <div className="user-card" key={user._id}>
              <div className="user-info">
                <h3>{user.name}</h3>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Contact:</strong> {user.contact}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
                <p><strong>Blood Group:</strong> {user.bloodGroup}</p>
                <p><strong>Age:</strong> {user.age}</p>
              </div>
              <button
                className="assign-btn"
                onClick={() => {
                  setSelectedUser(user);
                  setShowModal(true);
                }}
              >
                Assign
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && selectedUser && (
        <Modal
          title="Confirm Assignment"
          message={`Are you sure you want to assign ${selectedUser.name} to your admin list?`}
          onConfirm={() => handleAssign(selectedUser._id)}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AddPatient;
