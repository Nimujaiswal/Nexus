import { Link } from "react-router-dom";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { TIMELINE, TEAM } from "../data";

export default function Story() {
  useScrollReveal();
  return (
    <main style={{ paddingTop:"8rem", paddingBottom:"var(--s24)", minHeight:"100vh" }}>
      <div className="container">

        <div className="page-hero sr">
          <span className="section-tag">Our Story</span>
          <h1>Built by<br /><span className="clip-text">Gamers. For Gamers.</span></h1>
          <p>From a garage in 2018 to 2.4 million players — this is the NEXUS story.</p>
        </div>

        {/* Mission */}
        <section aria-labelledby="mission-heading" style={{ marginBottom:"var(--s24)" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--s16)", alignItems:"center" }} className="story-split sr">
            <div className="story-text">
              <span className="section-tag">Mission</span>
              <h2 id="mission-heading">One Platform.<br />Every Gamer.</h2>
              <p>Gaming shouldn't require six launchers, four subscriptions, and a tolerance for cheaters. We set out to build the platform we always wished existed — unified, fair, and blazing fast.</p>
              <p>Today NEXUS serves 2.4 million monthly active players across 150 countries, with 500+ titles and a community that defines competitive gaming's future.</p>
            </div>
            <div className="story-img" aria-hidden="true">🎮</div>
          </div>
        </section>

        {/* Timeline */}
        <section aria-labelledby="timeline-heading" style={{ marginBottom:"var(--s24)" }}>
          <div style={{ textAlign:"center", marginBottom:"var(--s16)" }} className="sr">
            <span className="section-tag">The Journey</span>
            <h2 id="timeline-heading" style={{ fontSize:"clamp(2rem,4vw,3.5rem)", letterSpacing:"-1px" }}>8 Years. One Vision.</h2>
          </div>
          <div className="timeline" role="list">
            {TIMELINE.map((t, i) => (
              <div key={i} className="tl-item sr" role="listitem" style={{ transitionDelay:`${i*.06}s` }}>
                {i % 2 === 0 ? (
                  <>
                    <div className="tl-card">
                      <div className="tl-year">{t.year}</div>
                      <div className="tl-title">{t.title}</div>
                      <p className="tl-desc">{t.desc}</p>
                    </div>
                    <div className="tl-dot" aria-label={t.year}>{t.icon}</div>
                    <div />
                  </>
                ) : (
                  <>
                    <div />
                    <div className="tl-dot" aria-label={t.year}>{t.icon}</div>
                    <div className="tl-card">
                      <div className="tl-year">{t.year}</div>
                      <div className="tl-title">{t.title}</div>
                      <p className="tl-desc">{t.desc}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section aria-labelledby="team-heading" style={{ marginBottom:"var(--s24)" }}>
          <div style={{ textAlign:"center", marginBottom:"var(--s12)" }} className="sr">
            <span className="section-tag">The Team</span>
            <h2 id="team-heading" style={{ fontSize:"clamp(2rem,4vw,3.5rem)", letterSpacing:"-1px" }}>The Founders</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"var(--s4)" }} className="sr team-grid">
            {TEAM.map((m,i) => (
              <div key={i} style={{ background:"var(--bg-2)", border:"1px solid var(--border)", borderRadius:"var(--r-xl)", padding:"var(--s8)", textAlign:"center" }}>
                <div style={{ fontSize:"3rem", marginBottom:"var(--s4)", filter:"drop-shadow(0 0 16px rgba(92,45,255,.3))" }}>{m.emoji}</div>
                <h3 style={{ fontSize:"var(--text-xl)", marginBottom:"var(--s1)" }}>{m.name}</h3>
                <p style={{ fontFamily:"var(--ff-mono)", fontSize:"var(--text-xs)", color:"var(--blue)", letterSpacing:"2px", textTransform:"uppercase" }}>{m.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="cta-block sr">
          <h2>Be Part of<br /><span className="clip-text">The Story.</span></h2>
          <p>2.4 million players are already writing their legacy. Your chapter starts free.</p>
          <div className="cta-btns">
            <Link to="/register" className="btn-yellow">Join NEXUS Free →</Link>
            <Link to="/contact" className="btn-outline">Get in Touch</Link>
          </div>
        </div>

      </div>
    </main>
  );
}
