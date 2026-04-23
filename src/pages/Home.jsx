import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Ticker from "../components/Ticker";
import { GAMES } from "../data";

const BENTO = [
  { cls: "col2 tall", bg: "bento-bg-v", emoji: "💀", tag: "Battle Royale", title: "200 Players. Zero Mercy.", desc: "Drop into an ever-shrinking arena where only instinct and raw skill determine who walks out alive." },
  { cls: "mid",       bg: "bento-bg-b", emoji: null, tag: "Active Players", stat: "2.4M+", desc: "and growing every day." },
  { cls: "mid",       bg: "bento-bg-d", emoji: "🎮", tag: "Cross Platform", title: "Play Anywhere", desc: "PC, console, or mobile — your progress follows you everywhere." },
  { cls: "short",     bg: "bento-bg-d", emoji: null, tag: "Game Titles",    stat: "500+",  desc: "in the library." },
  { cls: "short",     bg: "bento-bg-d", emoji: "⚡", tag: "Performance",    title: "Ultra-Low Latency.", desc: "Global edge server infrastructure keeping you a frame ahead of the competition." },
  { cls: "col2 mid",  bg: "bento-bg-v", emoji: "🏆", tag: "Tournaments",    title: "Compete Daily. Win Real Prizes.", desc: "From casual weekend brackets to global championship leagues — your arena awaits." },
{ cls: "mid",       bg: "bento-bg-b", emoji: "🛡️", tag: "Fair Play",      title: "Zero Cheaters.", desc: "Proprietary AI anti-cheat ensures a perfectly level playing field for all." },
];

const STATS = [
  { num: "2.4M+", label: "Active Players" },
  { num: "500+",  label: "Games Available" },
  { num: "12K+",  label: "Tournaments Hosted" },
  { num: "99.9%", label: "Uptime SLA" },
];

export default function Home() {
  const heroRef = useRef(null);
  const featured = GAMES.filter(g => g.featured).slice(0, 3);

  // Optimized Hero Parallax
  useEffect(() => {
    let ticking = false;
    
    const updateParallax = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollY * 0.25}px)`;
        heroRef.current.style.opacity = Math.max(1 - scrollY / 700, 0).toString();
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero">
        {/* Dynamic Background Elements */}
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-orb1" />
        <div className="hero-orb2" />

        <div className="hero-content" ref={heroRef}>
          
          <h1 className="hero-title">
            <span style={{ fontSize: "0.3em", letterSpacing: "0.18em", color: "rgba(156,163,175,0.7)", display: "block", marginBottom: "1.2rem", textTransform: "uppercase", fontFamily: "var(--ff-mono)", fontWeight: 400 }}>
              Welcome to Nexus
            </span>
            Redefine Your <br />
            <span className="hl">Reality</span>
          </h1>

          <div className="hero-bottom">
            <p className="hero-desc">
              Step into the ultimate cross-platform ecosystem. With 500+ premium titles, zero-latency performance, and 2.4 million players ready to challenge your legacy. <strong>The next move is yours.</strong>
            </p>
            
            <div className="hero-cta">
              <Link to="/register" className="btn-yellow">Drop In Now →</Link>
              <Link to="/games" className="btn-outline">Browse Library</Link>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator has been completely removed */}
      </section>

      {/* ── TICKER ── */}
      <Ticker />

      {/* ── ABOUT / BENTO ── */}
      <section style={{ padding:"8rem 0" }}>
        <div className="container">
          <div style={{ marginBottom:"4rem" }}>
            <span className="section-tag">About Nexus</span>
            <h2 style={{ fontFamily:"var(--ff-display)", fontSize:"clamp(2.5rem,6vw,5.5rem)", textTransform:"uppercase", letterSpacing:"-2px", maxWidth:700, lineHeight:.97 }}>
              One Platform.<br /><span className="clip-text">Infinite Worlds.</span>
            </h2>
          </div>

          <div className="bento-grid">
            {BENTO.map((b, i) => (
              <div key={i} className={`bento-card ${b.cls}`}>
                <div className={`bento-inner ${b.bg}`}>
                  {b.emoji && <div className="bento-emoji">{b.emoji}</div>}
                  <div className="bento-tag">{b.tag}</div>
                  {b.stat
                    ? <><div className="bento-stat">{b.stat}</div><p className="bento-desc">{b.desc}</p></>
                    : <><div className="bento-title">{b.title}</div><p className="bento-desc">{b.desc}</p></>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER 2 ── */}
      <Ticker reverse />

      {/* ── FEATURED GAMES ── */}
      <section style={{ padding:"6rem 0" }}>
        <div className="container">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"2.8rem", flexWrap:"wrap", gap:"1rem" }}>
            <div>
              <span className="section-tag">Featured Titles</span>
              <h2 style={{ fontFamily:"var(--ff-display)", fontSize:"clamp(2rem,4vw,4rem)", textTransform:"uppercase", letterSpacing:"-1px" }}>
                Top Games This Week
              </h2>
            </div>
            <Link to="/games" className="btn-outline btn-sm">View All →</Link>
          </div>

          <div className="games-grid">
            {featured.map((g) => (
              <div key={g.id} className="game-card">
                <div className={`game-thumb ${g.thumb}`}>
                  <span>{g.emoji}</span>
                  {g.featured && <span className="game-badge">Featured</span>}
                </div>
                <div className="game-body">
                  <p className="game-genre">{g.genre}</p>
                  <h3 className="game-name">{g.title}</h3>
                  <p className="game-desc">{g.description}</p>
                  <div className="game-footer">
                    <span className="game-rating">★ {g.rating}</span>
                    <span className="game-platforms">{g.platforms.slice(0,3).join(" · ")}</span>
                  </div>
                  <p className="game-players">● {g.players} playing now</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            {STATS.map((s, i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:"8rem 0" }}>
        <div className="container">
          <div className="cta-block">
            <span className="section-tag">Join the Universe</span>
            <h2>Your Legend<br /><span className="clip-text">Starts Now</span></h2>
            <p>Join 2.4 million players already competing on NEXUS. Free to start. Forever to master.</p>
            <div className="cta-btns">
              <Link to="/register" className="btn-yellow">Create Free Account</Link>
              <Link to="/games"    className="btn-outline">Browse Games</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}