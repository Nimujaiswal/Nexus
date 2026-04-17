import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">NEX<em>US</em></span>
            <p>The ultimate gaming universe. Compete, explore, and dominate across hundreds of worlds with millions of players worldwide.</p>
          </div>
          <div className="footer-col">
            <h4>Navigate</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/games">Games</Link></li>
              <li><Link to="/features">Features</Link></li>
              <li><Link to="/story">Our Story</Link></li>
              <li><Link to="/leaderboard">Leaderboard</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <ul>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Join Free</Link></li>
              <li><Link to="/contact">Support</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">DMCA</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 NEXUS Gaming. All rights reserved.</p>
          <p>Built with React · Vite · React Router</p>
        </div>
      </div>
    </footer>
  );
}
