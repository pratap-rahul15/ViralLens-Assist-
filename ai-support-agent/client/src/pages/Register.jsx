import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import API_BASE_URL from "../config";

export default function Register() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/signup`, form);

      setToken(res.data.token);
      setUser(res.data.user);

      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h1 className="bot-title">🤖 ViralLens Assist</h1>
      <p className="bot-subtitle">Join us and start chatting with your AI assistant</p>

      <h2>Register</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account?{" "}
        <span onClick={() => navigate("/login")} className="link">
          Login
        </span>
      </p>
    </div>
  );
}
