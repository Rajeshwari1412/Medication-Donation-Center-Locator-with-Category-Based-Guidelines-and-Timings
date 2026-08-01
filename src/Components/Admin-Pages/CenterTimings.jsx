import "./CenterTimings.css";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const CenterTimings = () => {
  const [centers, setCenters] = useState([]);
  const [editId, setEditId] = useState(null);
  const [newTiming, setNewTiming] = useState("");

  
  const loadCenters = async () => {
    const res = await axios.get(
      "http://127.0.0.1:8000/api/admin/centers/"
    );
    setCenters(res.data.centers || []);
  };

  
  const updateTiming = async (id) => {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/admin/update-timing/",
      { id, timings: newTiming }
    );
    alert(res.data.success);
    setEditId(null);
    setNewTiming("");
    loadCenters();
  };

  
  const toggleStatus = async (id, status) => {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/admin/toggle-center/",
      { id, status }
    );
    alert(res.data.success);
    loadCenters();
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
        <h2>Donation Center Timings</h2>

        <table className="res-table">
          <thead>
            <tr>
              <th>ID</th>
               <th>Center Type</th> 
              <th>Center Name</th>
              <th>Location</th>
              <th>Timings</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {centers.map((c, i) => (
              <tr key={i}>
                <td>{c.id}</td>
                  <td>{c.donation_type}</td>
                <td>{c.center_name}</td>
                <td>{c.location}</td>

                <td>
                  {editId === c.id ? (
                    <input
                      type="text"
                      value={newTiming}
                      onChange={(e) => setNewTiming(e.target.value)}
                      placeholder="e.g. 9AM - 6PM"
                    />
                  ) : (
                    c.timings
                  )}
                </td>

                <td>{c.status}</td>

                <td>
                  {editId === c.id ? (
                    <button
                      className="btn-accept"
                      onClick={() => updateTiming(c.id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="btn-accept"
                      onClick={() => {
                        setEditId(c.id);
                        setNewTiming(c.timings);
                      }}
                    >
                      Edit Timing
                    </button>
                  )}

                  <button
                    className="btn-reject"
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

export default CenterTimings;
