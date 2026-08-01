import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting login data:", data);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/login/", data);
      console.log("Response from backend:", JSON.stringify(res.data, null, 2));

      const backendData = res.data;

      // Check for error message from backend
      if (backendData.error) {
        setMsgType("error");
        setMessage(backendData.error);
        return;
      }

      // 1️⃣ If backend sends 'role' directly
      if (backendData.role === "admin") {
        localStorage.setItem("isUserLoggedIn", "true");
        localStorage.setItem("username", backendData.username || data.username);
        localStorage.setItem("role", "admin");
        navigate("/admin");
        return;
      }
      if (backendData.role === "user") {
        localStorage.setItem("isUserLoggedIn", "true");
        localStorage.setItem("username", backendData.username || data.username);
        localStorage.setItem("role", "user");
        navigate("/user");
        return;
      }

      // 2️⃣ If backend sends 'user' object (common in Django DRF)
      if (backendData.user) {
        const user = backendData.user;
        const isAdmin = user.is_staff || user.role === "admin";

        localStorage.setItem("isUserLoggedIn", "true");
        localStorage.setItem("username", user.username);
        localStorage.setItem("role", isAdmin ? "admin" : "user");
        navigate(isAdmin ? "/admin" : "/user");
        return;
      }

      // Fallback
      setMsgType("error");
      setMessage("Invalid Credentials");

    } catch (err) {
      console.error("Login error:", err.response || err);
      setMsgType("error");
      setMessage(err.response?.data?.error || "Invalid username or password");
    }
  };

  return (
    <main>
      <h2>Login</h2>

      {message && (
        <p className={`msg ${msgType}`} style={{ textAlign: "center" }}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            name="username"
            type="text"
            autoFocus
            placeholder="Enter Username"
            value={data.username}
            onChange={(e) => setData({ ...data, username: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            name="password"
            type="password"
            placeholder="Enter Password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            required
          />
        </div>

        <button type="submit" id="log-btn">
          Submit
        </button>
      </form>
    </main>
  );
};

export default Login;