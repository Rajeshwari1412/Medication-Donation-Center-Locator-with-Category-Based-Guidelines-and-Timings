import "./Admin.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();

  // Load users
  const loadUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/admin/");
      setUsers(res.data.users || []);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Approve user
  const approveUser = async (username) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/approve/",
        { username }
      );
      alert(res.data.success);
      loadUsers();
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  // Navigation functions
  const openAddCenters = () => {
    navigate("/addcenters"); // ✅ correct
  };

  const openManageCenters = () => {
    navigate("/managecenters");
  };

  const openTimings = () => {
    navigate("/centertimings");
  };

  return (
    <>
      <header>
        <div id="brand-name">
          <h1>Medication Donation Center Locator</h1>
        </div>

        <div className="components">
          <NavLink to="/">Home</NavLink>

          <button
            id="details-btn"
            onClick={() => setShowTable(!showTable)}
          >
            {showTable ? "Hide Users" : "User Approvals"}
          </button>

          <NavLink to="/login">Logout</NavLink>
        </div>
      </header>

      <main>
        <h2>Admin Dashboard</h2>

        {/* Users Table */}
        {showTable && (
          <table id="admin-table" border="1">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Approved</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.mobile}</td>
                  <td>{user.approved}</td>
                  <td>
                    {user.approved === 0 ? (
                      <button
                        id="approve-btn"
                        onClick={() => approveUser(user.username)}
                      >
                        Approve
                      </button>
                    ) : (
                      "Approved"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Cards */}
        <div id="event-catogeries">

          <div className="card-box">
            <h3 id="catogeries-head">Add Donation Centers</h3>
            <p id="random-words">
              Register new medication donation centers with location and contact details.
            </p>
            <button className="catogeries-btn" onClick={openAddCenters}>
              ADD
            </button>
          </div>

          <div className="card-box">
            <h3 id="catogeries-head">Manage Centers</h3>
            <p id="random-words">
              Enable, disable, or update existing donation centers.
            </p>
            <button className="catogeries-btn2" onClick={openManageCenters}>
              Manage
            </button>
          </div>

          <div className="card-box">
            <h3 id="catogeries-head">Center Timings</h3>
            <p id="random-words">
              Control donation timings and availability for each center.
            </p>
            <button className="catogeries-btn4" onClick={openTimings}>
              Timings
            </button>
          </div>

        </div>
      </main>

      <footer>
        <h4>&copy; 2026 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};

export default Admin;