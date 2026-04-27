import React, { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const { data } = await API.post("/auth/login", { email, password });

    console.log("LOGIN RESPONSE:", data); // 👈 ADD THIS

    localStorage.setItem("token", data.token);

    console.log("TOKEN SAVED:", localStorage.getItem("token")); // 👈 ADD THIS

    navigate("/dashboard");
  } catch (err) {
    console.log("LOGIN ERROR:", err.response?.data || err.message);
    alert("Login failed");
  }
};
  return (
    <div style={{ padding: 40 }}>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <br /><br />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <br /><br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}