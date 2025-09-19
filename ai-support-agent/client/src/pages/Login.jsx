import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import API_BASE_URL from "../config";

export default function Login() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, form);

      setToken(res.data.token);
      setUser(res.data.user);

      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h1 className="bot-title">🤖 ViralLens Assist</h1>
      <p className="bot-subtitle">Your AI-powered customer support agent</p>

      <h2>Login</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>

      <p>
        Don’t have an account?{" "}
        <span onClick={() => navigate("/register")} className="link">
          Register
        </span>
      </p>
    </div>
  );
}
