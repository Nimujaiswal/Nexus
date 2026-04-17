import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm]       = useState({ username: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const { register }          = useAuth();
  const navigate              = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6)       { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      register(form.username, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <Link to="/">NEX<em>US</em></Link>
        </div>

        <h2 className="auth-title">Join NEXUS</h2>
        <p className="auth-sub">Create your free account and start gaming</p>

        {error && <div className="form-error">⚠ {error}</div>}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              name="username"
              value={form.username}
              onChange={onChange}
              placeholder="Choose a username"
              required
              minLength={3}
            />
          </div>

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

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="Min 6 chars"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm</label>
              <input
                className="form-input"
                name="confirm"
                type="password"
                value={form.confirm}
                onChange={onChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Password strength indicator */}
          {form.password.length > 0 && (
            <div style={{ marginBottom: "1.2rem" }}>
              <div style={{ display: "flex", gap: ".3rem", marginBottom: ".3rem" }}>
                {[1,2,3,4].map(n => (
                  <div key={n} style={{
                    flex: 1, height: "3px", borderRadius: "2px",
                    background: form.password.length >= n * 3
                      ? n <= 1 ? "#f87171" : n <= 2 ? "#fb923c" : n <= 3 ? "#facc15" : "var(--green)"
                      : "var(--bg-3)",
                    transition: "background .3s",
                  }} />
                ))}
              </div>
              <p style={{ fontSize: ".68rem", color: "var(--white-dim)", fontFamily: "var(--ff-mono)" }}>
                {form.password.length < 4  ? "Weak" :
                 form.password.length < 8  ? "Fair" :
                 form.password.length < 12 ? "Good" : "Strong"}
              </p>
            </div>
          )}

          <p style={{ fontSize: ".75rem", color: "var(--white-dim)", lineHeight: 1.6, marginBottom: "1.4rem" }}>
            By creating an account you agree to our{" "}
            <a href="#" style={{ color: "var(--blue)", textDecoration: "none" }}>Terms of Service</a>{" "}
            and{" "}
            <a href="#" style={{ color: "var(--blue)", textDecoration: "none" }}>Privacy Policy</a>.
          </p>

          <button className="form-submit" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Free Account →"}
          </button>
        </form>

        <div className="auth-switch" style={{ marginTop: "1.4rem" }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
