import "./User.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const User = () => {
  const [user, setUser] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();

  const loadUser = async () => {
    const username = localStorage.getItem("username");

    const res = await axios.get(
      `http://127.0.0.1:8000/api/userdetails/?username=${username}`
    );

    setUser(res.data.user);
  };

  useEffect(() => {
    loadUser();
  }, []);

  
  const openCenters = () => navigate("/donation-centers");

  return (
    <>
      <header>
        <div id="brand-name">
          <h1>Medication Donation Center Locator</h1>
        </div>

        <div className="components">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/login">Logout</NavLink>
        </div>
      </header>

      <main>
        <h2>User Page</h2>

        
        <div id="event-catogeries">
          
          
          <div className="card-box">
            <h3 id="catogeries-head">My Profile</h3>
            <p id="random-words">
              View your personal registration details.
            </p>
            <button
              className="catogeries-btn"
              id="use-btn12"
              onClick={() => setShowTable(!showTable)}
            >
              {showTable ? "Hide Details" : "View Details"}
            </button>
          </div>

          
          <div className="card-box">
            <h3 id="catogeries-head">Donation Centers</h3>
            <p id="random-words">
              Locate nearby medication donation centers and guidelines.
            </p>
            <button className="catogeries-btn2" onClick={openCenters}>
              View Centers
            </button>
          </div>

        </div>

        
        {showTable && user && (
          <>
            <h3 className="tab-h3">My Details</h3>
            <table border="1" id="admin-table">
              <tbody>
                <tr>
                  <th>Username</th>
                  <td>{user.username}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{user.email}</td>
                </tr>
                <tr>
                  <th>Mobile</th>
                  <td>{user.mobile}</td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td>{user.address}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </main>

      <footer>
        <h4>&copy; 2026 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};

export default User;
