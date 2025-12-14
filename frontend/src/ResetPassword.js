import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Login.css"; // Reuse shared styles
import "./ResetPassword.css";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

function ResetPassword() {
  const [form, setForm] = useState({
    email: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
    if (form.new_password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await api.put("/ResetPassword", {
        email: form.email,
        password: form.new_password
      });
      setMessage("Password successfully reset! You can now login.");
      setForm({ email: "", new_password: "", confirm_password: "" });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to reset password");
    }
    setLoading(false);
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-brand">🔄</span>
          <h2>Reset Password</h2>
          <p className="auth-subtitle">Enter your email and new password</p>
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
            <label>New Password</label>
            <input
              type="password"
              name="new_password"
              className="auth-input"
              placeholder="••••••••"
              value={form.new_password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              name="confirm_password"
              className="auth-input"
              placeholder="••••••••"
              value={form.confirm_password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Resetting..." : "Set New Password"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Remembered it? 
            <a href="/login" className="auth-link">Back to Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;