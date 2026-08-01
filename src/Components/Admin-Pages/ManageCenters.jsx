import "./ManageCenters.css"; // 'I' small letter undali, mostly case sensitive issue rakunda
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const ManageCenters = () => {
  const [centers, setCenters] = useState([]);

  const loadCenters = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/admin/centers/");
      
      /* IKKADA CHANGE: 
         Backend nundi response { "centers": [...] } ani vasthe idhi correct.
         Leda direct ga list [...] vasthe 'res.data' ani ivvali.
      */
      const data = res.data.centers || res.data; 
      setCenters(Array.isArray(data) ? data : []);
      
    } catch (err) {
      console.error("Error loading centers:", err);
      setCenters([]);
    }
  };

  const toggleStatus = async (id, status) => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/admin/toggle-center/",
        { id, status }
      );
      // Backend success message 'success' key lo unte idhi work avthundi
      alert(res.data.success || "Status updated successfully!");
      loadCenters();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  useEffect(() => {
    loadCenters();
  }, []);

  return (
    <>
      <header>
        <div id="brand-name">
          <h1>Medication Donation Center Locator</h1>
        </div>
        <div className="components">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/admin">Back</NavLink>
          <NavLink to="/login">Logout</NavLink>
        </div>
      </header>

      <main>
        <h2>Manage Donation Centers</h2>

        <table className="events-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Center Name</th>
              <th>Center Type</th> 
              <th>Location</th>
              <th>Contact</th>
              <th>Timings</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {/* Optional chaining '?.' use chesthe undefined error radhu */}
            {centers?.map((c, i) => (
              <tr key={c.id || i}>
                <td>{c.id}</td>
                <td>{c.center_name}</td>
                <td>{c.donation_type}</td>
                <td>{c.location}</td>
                <td>{c.categories || "N/A"}</td>
                <td>{c.timings}</td>
                <td>{c.status}</td>
                <td>
                  <button
                    onClick={() =>
                      toggleStatus(
                        c.id,
                        c.status === "active" ? "inactive" : "active"
                      )
                    }
                  >
                    {c.status === "active" ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
};

export default ManageCenters;