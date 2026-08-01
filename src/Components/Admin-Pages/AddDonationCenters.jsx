import { useState } from "react";
import axios from "axios";
import "../../App.css";

function AddDonationCenters() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    category: "",
    timings: "",
    guidelines: "",
    latitude: "",
    longitude: "",
  });

  // handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/add-center/",
        {
          name: form.name,
          address: form.address,
          category: form.category,
          timings: form.timings,
          guidelines: form.guidelines,
          latitude: form.latitude ? parseFloat(form.latitude) : 0,
          longitude: form.longitude ? parseFloat(form.longitude) : 0,
        }
      );

      console.log("SUCCESS:", response.data);
      alert("Center Added Successfully ✅");

      // reset form
      setForm({
        name: "",
        address: "",
        category: "",
        timings: "",
        guidelines: "",
        latitude: "",
        longitude: "",
      });

    } catch (error) {
      console.error("FULL ERROR:", error);
      console.log("BACKEND ERROR:", error.response?.data);

      alert(
        "Error: " +
        (error.response?.data
          ? JSON.stringify(error.response.data)
          : "Something went wrong")
      );
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add Donation Center</h2>

      <form onSubmit={handleSubmit} className="form-box">

        <input
          type="text"
          name="name"
          placeholder="Center Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Organ">Organ</option>
          <option value="Blood">Blood</option>
          <option value="Medicine">Medicine</option>
        </select>

        <input
          type="text"
          name="timings"
          placeholder="Timings (e.g. 9AM - 5PM)"
          value={form.timings}
          onChange={handleChange}
        />

        <textarea
          name="guidelines"
          placeholder="Guidelines"
          value={form.guidelines}
          onChange={handleChange}
        ></textarea>

        <div className="row">
          <input
            type="text"
            name="latitude"
            placeholder="Latitude"
            value={form.latitude}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="longitude"
            placeholder="Longitude"
            value={form.longitude}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Save Center</button>

      </form>
    </div>
  );
}

export default AddDonationCenters;