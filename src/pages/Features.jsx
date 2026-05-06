import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { FEATURES, SPECS } from "../data";

export default function Features() {
  useScrollReveal();
  return (
    <main style={{ paddingTop:"8rem", paddingBottom:"var(--s24)", minHeight:"100vh" }}>
      <div className="container">

        <div className="page-hero sr">
          <span className="section-tag">Platform Features</span>
          <h1>Built for<br /><span className="clip-text">Champions.</span></h1>
          <p>Every feature engineered to give you the edge — from hardware anti-cheat to AI matchmaking and sub-10ms servers.</p>
        </div>

        {/* Spec cards */}
        <section aria-labelledby="specs-heading" style={{ marginBottom:"var(--s20)" }}>
          <h2 id="specs-heading" className="sr-only">Platform Specifications</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"var(--s4)" }} className="sr spec-grid">
            {SPECS.map((s,i) => (
              <div key={i} className="spec-card" style={{ transitionDelay:`${i*.04}s` }}>
                <div className="spec-icon" aria-hidden="true">{s.icon}</div>
                <div className="spec-label">{s.label}</div>
                <div className="spec-value" aria-label={`${s.label}: ${s.value}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature rows */}
        <section aria-labelledby="features-heading" style={{ marginBottom:"var(--s20)" }}>
          <div style={{ marginBottom:"var(--s10)" }} className="sr">
            <span className="section-tag">All Features</span>
            <h2 id="features-heading" style={{ fontSize:"clamp(2rem,4vw,3.5rem)", letterSpacing:"-1px" }}>What You Get</h2>
          </div>
          <div role="list">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-row sr" role="listitem" style={{ transitionDelay:`${i*.05}s` }}>
                <div className="feature-num" aria-hidden="true">{f.num}</div>
                <h3 className="feature-name">
                  <span aria-hidden="true" style={{ marginRight:"var(--s2)" }}>{f.icon}</span>
                  {f.name}
                </h3>
                <p className="feature-detail">{f.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="cta-block sr">
          <h2>Ready to<br /><span className="clip-text">Experience It?</span></h2>
          <p>Every feature is live right now. Join free — no subscription required.</p>
          <div className="cta-btns">
            <Link to="/register" className="btn-yellow">Get Started Free →</Link>
            <Link to="/arcade" className="btn-outline">Try Mini Arcade</Link>
          </div>
        </div>

      </div>
    </main>
  );
}
