import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="notfound">
      <div className="notfound-num" aria-hidden="true">404</div>
      <h1 className="notfound" style={{ fontFamily:"var(--ff-display)" }}>Page Not Found</h1>
      <p>Looks like this sector doesn't exist. Let's get you back to the fight.</p>
      <div style={{ display:"flex", gap:"var(--s3)", flexWrap:"wrap", justifyContent:"center" }}>
        <Link to="/" className="btn-yellow">Back to Home →</Link>
        <Link to="/games" className="btn-outline">Browse Games</Link>
      </div>
    </main>
  );
}
