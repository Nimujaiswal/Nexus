import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound-num">404</div>
      <span className="section-tag">Page Not Found</span>
      <h2>You've Wandered<br /><span className="clip-text">Off the Map</span></h2>
      <p>This page doesn't exist — but the gaming universe is still out there waiting for you.</p>
      <Link to="/" className="btn-yellow">Return to Home Base</Link>
    </div>
  );
}
