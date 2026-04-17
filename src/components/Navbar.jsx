import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/games", label: "Games" },
  { to: "/features", label: "Features" },
  { to: "/story", label: "Story" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <Link to="/" className="nav-logo">NEX<em>US</em></Link>

        <ul className="nav-links">
          {LINKS.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) => isActive ? "active" : ""}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          {user ? (
            <>
              <span className="nav-user">Hey, <strong>{user.username}</strong></span>
              <button className="nav-ghost" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login"><button className="nav-ghost">Sign In</button></Link>
              <Link to="/register"><button className="nav-solid">Join Free</button></Link>
            </>
          )}
        </div>

        <button className="nav-hamburger" onClick={() => setOpen(o => !o)}>
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="mobile-menu" onClick={() => setOpen(false)}>
          {LINKS.map(l => (
            <Link key={l.to} to={l.to}>{l.label}</Link>
          ))}
          {user ? (
            <button
              onClick={handleLogout}
              style={{ background:"none",border:"none",color:"var(--white-dim)",
                fontFamily:"var(--ff-display)",fontSize:"2rem",letterSpacing:"4px",cursor:"none" }}
            >
              SIGN OUT
            </button>
          ) : (
            <Link to="/register">JOIN FREE</Link>
          )}
        </div>
      )}
    </>
  );
}
