import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Login.css";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Auto-clear messages
  useEffect(() => {
    if (error || message) {
      const timer = setTimeout(() => {
        setError("");
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, message]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/login", form);

      // 1. Store the token
      localStorage.setItem("token", res.data.access_token);

      setMessage("Login successful! Redirecting...");

      // 2. Redirect to Dashboard
      setTimeout(() => {
        window.location.href = "/"; 
      }, 1000);

    } catch (err) {
      // If 401 Unauthorized, backend sends "Invalid email or password"
      setError(err.response?.data?.detail || "Login failed");
      setLoading(false); // Stop loading animation on error
    }
  }; // <--- properly closed handleSubmit here

  // Return JSX is now correctly outside the handler
  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-brand">🔐</span>
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        {error && <div className="msg-box error">{error}</div>}
        {message && <div className="msg-box success">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="auth-input"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="auth-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? 
            <a href="/signup" className="auth-link">Sign up</a>
          </p>
          <p style={{ marginTop: '8px' }}>
            <a href="/reset-password" className="auth-link" style={{ marginLeft: 0 }}>Forgot Password?</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;