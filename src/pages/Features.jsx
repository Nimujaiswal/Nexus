import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { FEATURES, SPECS } from "../data";

export default function Features() {
  useScrollReveal();

  return (
    <main style={{ paddingTop:"8rem", paddingBottom:"6rem", minHeight:"100vh" }}>
      <div className="container">

        {/* Hero text */}
        <div className="sr" style={{ maxWidth:820, marginBottom:"6rem" }}>
          <span className="section-tag">Platform Features</span>
          <h1 style={{ fontFamily:"var(--ff-display)", fontSize:"clamp(3rem,7vw,7rem)", textTransform:"uppercase", letterSpacing:"-3px", lineHeight:.95 }}>
            Built for<br /><span className="clip-text">Champions</span>
          </h1>
          <p style={{ color:"var(--white-dim)", fontSize:"1.05rem", lineHeight:1.8, marginTop:"1.5rem", maxWidth:540 }}>
            Every feature engineered to give you the edge. From hardware-level
            anti-cheat to AI matchmaking — NEXUS is the infrastructure serious gamers demand.
          </p>
        </div>

        {/* Feature rows */}
        <div style={{ marginBottom:"6rem" }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-row sr" style={{ transitionDelay:`${i * 0.05}s` }}>
              <div className="feature-num">{f.num}</div>
              <div className="feature-name">
                <span style={{ marginRight:".7rem" }}>{f.icon}</span>{f.name}
              </div>
              <div className="feature-detail">{f.detail}</div>
            </div>
          ))}
        </div>

        {/* Specs */}
        <div className="sr">
          <span className="section-tag">Platform Specs</span>
          <h2 style={{ fontFamily:"var(--ff-display)", fontSize:"clamp(2rem,4vw,3.5rem)", textTransform:"uppercase", letterSpacing:"-1px", marginBottom:"2.5rem" }}>
            By the Numbers
          </h2>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(210px, 1fr))", gap:"1rem", marginBottom:"6rem" }}>
          {SPECS.map((s, i) => (
            <div key={i} className="spec-card sr" style={{ transitionDelay:`${i * 0.055}s` }}>
              <div className="spec-icon">{s.icon}</div>
              <div className="spec-label">{s.label}</div>
              <div className="spec-value">{s.value}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="cta-block sr">
          <span className="section-tag">Get Started</span>
          <h2>Ready to <span className="clip-yellow">Dominate?</span></h2>
          <p>All features included in every account. No paywalls. No pay-to-win.</p>
          <div className="cta-btns">
            <Link to="/register" className="btn-yellow">Join Free Today</Link>
            <Link to="/games"    className="btn-outline">Browse Games</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
