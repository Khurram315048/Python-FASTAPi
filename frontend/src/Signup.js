import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Login.css"; // We can reuse Login.css for consistent styling
import "./Signup.css"; // Specific overrides

const api = axios.create({
  baseURL: "http://localhost:8000",
});

function Signup() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
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
    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Exclude confirm_password before sending if API doesn't need it
      const { confirm_password, ...payload } = form;
      await api.post("/signup", payload);
      setMessage("Account created successfully! Please log in.");
      setForm({ email: "", username: "", password: "", confirm_password: "" });
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-brand">🚀</span>
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join us and start building</p>
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
            <label>Username</label>
            <input
              type="text"
              name="username"
              className="auth-input"
              placeholder="johndoe"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
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

            <div className="form-group">
              <label>Confirm Password</label>
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
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? 
            <a href="/login" className="auth-link">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;