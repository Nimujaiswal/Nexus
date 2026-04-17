import { Link } from "react-router-dom";
import Ticker from "../components/Ticker";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { TIMELINE, TEAM } from "../data";

export default function Story() {
  useScrollReveal();

  return (
    <main style={{ paddingTop:"8rem", paddingBottom:"6rem", minHeight:"100vh" }}>
      <div className="container">

        {/* Page hero */}
        <div className="page-hero sr">
          <span className="section-tag">Our Story</span>
          <h1>Born to <span className="clip-text">Change Gaming</span></h1>
          <p>NEXUS started as a crazy idea in a garage and became the platform 2.4 million players call home. Here's how we got here.</p>
        </div>

        {/* Story blocks */}
        <div className="story-split sr">
          <div className="story-img">🎮</div>
          <div className="story-text">
            <span className="section-tag">The Beginning</span>
            <h2>Three Devs.<br />One Vision.</h2>
            <p>It started with a problem we all felt — gaming was fragmented. Your friends were on different platforms, progress didn't carry over, and lag ruined ranked matches. We decided to fix it.</p>
            <p>We quit our jobs, pooled our savings, and started building NEXUS. The first year was coffee, bugs, and zero sleep — but the vision never wavered.</p>
          </div>
        </div>

        <div className="story-split rev sr">
          <div className="story-img">🏆</div>
          <div className="story-text">
            <span className="section-tag">The Mission</span>
            <h2>Gaming Without<br />Boundaries</h2>
            <p>Our mission is simple: every gamer deserves access to world-class infrastructure, a fair playing field, and a community that pushes them to be better.</p>
            <p>We built everything from the ground up — our latency engine, matchmaking AI, and anti-cheat systems are all proprietary, because off-the-shelf just wasn't good enough.</p>
          </div>
        </div>
      </div>

      <Ticker />

      {/* Timeline */}
      <div className="container">
        <div className="sr" style={{ textAlign:"center", padding:"5rem 0 3.5rem" }}>
          <span className="section-tag">Milestones</span>
          <h2 style={{ fontFamily:"var(--ff-display)", fontSize:"clamp(2.5rem,5vw,4.5rem)", textTransform:"uppercase", letterSpacing:"-2px" }}>
            Our Journey
          </h2>
        </div>

        <div className="timeline">
          {TIMELINE.map((item, i) => {
            const isLeft = i % 2 === 0;
            return (
              <div key={i} className="tl-item sr" style={{ transitionDelay:`${i * 0.07}s` }}>
                {isLeft ? (
                  <>
                    <div className="tl-card">
                      <div className="tl-year">{item.year}</div>
                      <div className="tl-title">{item.title}</div>
                      <div className="tl-desc">{item.desc}</div>
                    </div>
                    <div className="tl-dot">{item.icon}</div>
                    <div />
                  </>
                ) : (
                  <>
                    <div />
                    <div className="tl-dot">{item.icon}</div>
                    <div className="tl-card">
                      <div className="tl-year">{item.year}</div>
                      <div className="tl-title">{item.title}</div>
                      <div className="tl-desc">{item.desc}</div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Team */}
        <div style={{ marginTop:"7rem" }}>
          <div className="sr" style={{ textAlign:"center", marginBottom:"3rem" }}>
            <span className="section-tag">The Team</span>
            <h2 style={{ fontFamily:"var(--ff-display)", fontSize:"clamp(2rem,4vw,4rem)", textTransform:"uppercase", letterSpacing:"-1px" }}>
              Gamers Who <span className="clip-text">Build for Gamers</span>
            </h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"1.2rem" }}>
            {TEAM.map((m, i) => (
              <div key={i} className="spec-card sr" style={{ textAlign:"center", transitionDelay:`${i * 0.1}s` }}>
                <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>{m.emoji}</div>
                <div style={{ fontFamily:"var(--ff-display)", fontSize:"1.25rem", letterSpacing:".5px", marginBottom:".3rem" }}>{m.name}</div>
                <div style={{ fontFamily:"var(--ff-mono)", fontSize:".6rem", letterSpacing:"2px", textTransform:"uppercase", color:"var(--white-dim)" }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="cta-block sr" style={{ marginTop:"6rem" }}>
          <span className="section-tag">Join Us</span>
          <h2>Be Part of<br /><span className="clip-text">The Story</span></h2>
          <p>2.4 million players and counting. Your chapter starts today.</p>
          <div className="cta-btns">
            <Link to="/register" className="btn-yellow">Join Free</Link>
            <Link to="/contact"  className="btn-outline">Get in Touch</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
