import "./Register.css";
import axios from "axios";
import { useState } from "react";

const Register = () => {
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    mobile: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Password validation
    if (form.password !== form.confirm_password) {
      setMsgType("error");
      setMessage("Passwords do not match ❌");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        form
      );

      console.log("RESPONSE:", res.data); // 🔥 VERY IMPORTANT

      if (res.data.error) {
        setMsgType("error");
        setMessage(res.data.error);
      } else {
        setMsgType("success");

        // ✅ Handle any backend response format
        setMessage(
          res.data.success ||
          res.data.message ||
          "Registered Successfully ✅"
        );

        // ✅ Clear form after success
        setForm({
          username: "",
          email: "",
          password: "",
          confirm_password: "",
          mobile: "",
          address: "",
        });
      }

    } catch (err) {
      console.error("FULL ERROR:", err);

      if (err.code === "ERR_NETWORK") {
        setMsgType("error");
        setMessage("Backend server is not running ❌");
      } else if (err.response) {
        // 🔥 Backend error message capture
        setMsgType("error");
        setMessage(
          err.response.data.error ||
          err.response.data.message ||
          "Server error ❌"
        );
      } else {
        setMsgType("error");
        setMessage("Something went wrong ❌");
      }
    }
  };

  return (
    <main>
      <h2>Register</h2>

      {message && (
        <p className={`msg ${msgType}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter User Name"
            required
            autoFocus
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter Email"
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter Password"
            required
          />
        </div>

        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirm_password"
            value={form.confirm_password}
            onChange={handleChange}
            placeholder="Re-enter password"
            required
          />
        </div>

        <div>
          <label>Mobile Number:</label>
          <input
            type="tel"
            name="mobile"
            value={form.mobile}
            inputMode="numeric"
            maxLength="10"
            pattern="[0-9]{10}"
            placeholder="Enter mobile number"
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Address:</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            rows="2"
            cols="30"
            placeholder="Enter full address"
            required
          ></textarea>
        </div>

        <button type="submit" id="btn-sub">
          Submit
        </button>
      </form>
    </main>
  );
};

export default Register;