import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm]     = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const { login }           = useAuth();
  const navigate            = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <Link to="/">NEX<em>US</em></Link>
        </div>

        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-sub">Sign in to continue your gaming journey</p>

        {error && <div className="form-error">⚠ {error}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: "1.5rem" }}>
            <label className="form-label">Password</label>
            <input
              className="form-input"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem", marginTop: "-1rem" }}>
            <a href="#" style={{ fontSize: ".78rem", color: "var(--blue)", textDecoration: "none" }}>
              Forgot password?
            </a>
          </div>

          <button className="form-submit" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div className="auth-divider">
          <span /><p>or continue with</p><span />
        </div>

        <div className="social-btns">
          <button className="social-btn">🎮 Steam</button>
          <button className="social-btn">💠 Discord</button>
        </div>

        <div className="auth-switch">
          Don't have an account? <Link to="/register">Join free</Link>
        </div>
      </div>
    </div>
  );
}
