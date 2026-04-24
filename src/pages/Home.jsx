import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Ticker from "../components/Ticker";
import { GAMES } from "../data";

const BENTO = [
  { cls:"col2 tall", bg:"bento-bg-v", emoji:"💀", tag:"Battle Royale",  title:"200 Players. Zero Mercy.", desc:"Drop into an ever-shrinking arena where only instinct and raw skill determine who walks out alive." },
  { cls:"mid",       bg:"bento-bg-b", emoji:null,  tag:"Active Players", stat:"2.4M+", desc:"and growing every day." },
  { cls:"mid",       bg:"bento-bg-d", emoji:"🎮",  tag:"Cross Platform", title:"Play Anywhere",           desc:"PC, console, or mobile — your progress follows you everywhere." },
  { cls:"short",     bg:"bento-bg-d", emoji:null,  tag:"Game Titles",    stat:"500+",  desc:"in the library." },
  { cls:"short",     bg:"bento-bg-d", emoji:"⚡",  tag:"Performance",    title:"Sub-10ms Latency.",       desc:"Edge servers, always a frame ahead." },
  { cls:"col2 mid",  bg:"bento-bg-v", emoji:"🏆",  tag:"Tournaments",    title:"Compete Daily. Win Real Prizes.", desc:"From casual weekend brackets to global championship leagues." },
  { cls:"mid",       bg:"bento-bg-b", emoji:"🛡️", tag:"Fair Play",      title:"Zero Cheaters.",          desc:"Proprietary AI anti-cheat ensures a perfectly level playing field." },
];

const HERO_STATS = [
  { num:"2.4M+", label:"Active Players" },
  { num:"500+",  label:"Games"          },
  { num:"<10ms", label:"Latency"        },
  { num:"99.9%", label:"Uptime"         },
];

const PAGE_STATS = [
  { num:"2.4M+", label:"Active Players"     },
  { num:"500+",  label:"Games Available"    },
  { num:"12K+",  label:"Tournaments Hosted" },
  { num:"99.9%", label:"Uptime SLA"         },
];

const SHOWCASE_GAMES = [
  { emoji:"💀", genre:"Battle Royale", title:"Nexus Storm",     rating:"★ 9.4", players:"● 1.2M playing",  avatar:"🐺", player:"ShadowWolf_X", score:"98,420",  bg:"linear-gradient(135deg,#130538,#1a0645,#0c1f45)" },
  { emoji:"🗡️", genre:"RPG",          title:"Void Realm",      rating:"★ 9.7", players:"● 890K playing",  avatar:"🔮", player:"VoidRunner99",  score:"78,900",  bg:"linear-gradient(135deg,#061a0e,#0a3d1f,#05140b)" },
  { emoji:"🚀", genre:"Adventure",    title:"Stellar Drift",   rating:"★ 9.1", players:"● 640K playing",  avatar:"🚀", player:"StarPilot",     score:"68,400",  bg:"linear-gradient(135deg,#1a0606,#3d0a0a,#200808)" },
  { emoji:"⚡", genre:"MOBA",         title:"Arcane Uprising", rating:"★ 9.5", players:"● 2.1M playing",  avatar:"⚡", player:"NeonViper",     score:"91,055",  bg:"linear-gradient(135deg,#0e061a,#270640,#0a0320)" },
];

export default function Home() {
  const navigate = useNavigate();
  const featured = GAMES.filter(g => g.featured).slice(0, 3);
  const [activeGame, setActiveGame] = useState(0);

  // Auto-rotate showcase card
  useEffect(() => {
    const id = setInterval(() => setActiveGame(i => (i + 1) % SHOWCASE_GAMES.length), 3500);
    return () => clearInterval(id);
  }, []);

  const game = SHOWCASE_GAMES[activeGame];

  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-orb1" />
        <div className="hero-orb2" />

        <div className="hero-inner">
          {/* LEFT */}
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="live-dot" />
              840K Players Online Now
            </div>

            <h1 className="hero-title">
              Redefine<br />
              Your<br />
              <span className="hl">Reality</span>
            </h1>

            <p className="hero-desc">
              The ultimate cross-platform gaming ecosystem. 500+ premium titles,
              zero-latency performance, and 2.4 million players ready to challenge your legacy.
            </p>

            <div className="hero-cta">
              <Link to="/register" className="btn-yellow">Drop In Now →</Link>
              <Link to="/games"    className="btn-outline">Browse Library</Link>
            </div>

            <div className="hero-stats">
              {HERO_STATS.map((s, i) => (
                <div key={i} className="hero-stat-item">
                  <div className="hero-stat-num">{s.num}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Showcase Card */}
          <div className="hero-right">
            {/* Floating badges */}
            <div className="hero-badge hero-badge-1">
              <span className="hero-badge-icon">🏆</span>
              <div className="hero-badge-text">
                <span className="hero-badge-title">Season 7 Live</span>
                <span className="hero-badge-sub">$1M PRIZE POOL</span>
              </div>
            </div>
            <div className="hero-badge hero-badge-2">
              <span className="hero-badge-icon">⚡</span>
              <div className="hero-badge-text">
                <span className="hero-badge-title">New Match Found</span>
                <span className="hero-badge-sub">2.3s MATCHMAKING</span>
              </div>
            </div>

            <div className="hero-showcase">
              {/* Window chrome */}
              <div className="showcase-header">
                <div className="showcase-dots">
                  <span /><span /><span />
                </div>
                <span className="showcase-label">NEXUS PLATFORM</span>
                <div className="showcase-live">
                  <span className="live-dot" />
                  LIVE
                </div>
              </div>

              {/* Game art */}
              <div className="showcase-game" style={{ background: game.bg }}>
                <div className="showcase-game-glow" />
                <div className="showcase-game-particles" />
                <span className="showcase-game-emoji">{game.emoji}</span>
              </div>

              {/* Game info */}
              <div className="showcase-info">
                <div className="showcase-game-meta">
                  <span className="showcase-game-genre">{game.genre}</span>
                  <span className="showcase-game-rating">{game.rating}</span>
                </div>
                <div className="showcase-game-title">{game.title}</div>
                <div className="showcase-game-players">{game.players}</div>

                {/* Top player */}
                <div className="showcase-player-row">
                  <div className="showcase-player-info">
                    <div className="showcase-player-avatar">{game.avatar}</div>
                    <div>
                      <div className="showcase-player-name">{game.player}</div>
                      <div style={{ fontFamily:"var(--ff-mono)", fontSize:".5rem", color:"var(--white-dim)", letterSpacing:"2px" }}>TOP PLAYER</div>
                    </div>
                  </div>
                  <div className="showcase-player-score">{game.score}</div>
                </div>

                {/* Game selector dots */}
                <div style={{ display:"flex", gap:".5rem", marginBottom:"1rem", justifyContent:"center" }}>
                  {SHOWCASE_GAMES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveGame(i)}
                      style={{
                        width: i === activeGame ? "20px" : "6px",
                        height: "6px", borderRadius: "3px",
                        background: i === activeGame ? "var(--yellow)" : "rgba(255,255,255,.2)",
                        border: "none", cursor: "pointer",
                        transition: "all .3s cubic-bezier(.4,0,.2,1)",
                        padding: 0,
                      }}
                    />
                  ))}
                </div>

                <button className="showcase-btn" onClick={() => navigate("/arcade")}>
                  ▶ &nbsp;Play Now — It's Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <Ticker />

      {/* ── BENTO ── */}
      <section style={{ padding:"8rem 0" }}>
        <div className="container">
          <div style={{ marginBottom:"4rem" }}>
            <span className="section-tag">About Nexus</span>
            <h2 style={{ fontFamily:"var(--ff-display)", fontSize:"clamp(2.5rem,6vw,5.5rem)", textTransform:"uppercase", letterSpacing:"-2px", maxWidth:700, lineHeight:.96 }}>
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

      <Ticker reverse />

      {/* ── FEATURED GAMES ── */}
      <section style={{ padding:"6rem 0" }}>
        <div className="container">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"2.8rem", flexWrap:"wrap", gap:"1rem" }}>
            <div>
              <span className="section-tag">Featured Titles</span>
              <h2 style={{ fontFamily:"var(--ff-display)", fontSize:"clamp(2rem,4vw,4rem)", textTransform:"uppercase", letterSpacing:"-1px" }}>Top Games This Week</h2>
            </div>
            <Link to="/games" className="btn-outline btn-sm">View All →</Link>
          </div>
          <div className="games-grid">
            {featured.map(g => (
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
            {PAGE_STATS.map((s, i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── ARCADE PROMO ── */}
      <section style={{ padding:"0 0 6rem" }}>
        <div className="container">
          <div className="arcade-promo-card">
            <div className="arcade-promo-glow" />
            <div className="arcade-promo-left">
              <span className="section-tag">New Feature</span>
              <h2 className="arcade-promo-title">
                Mini Arcade<br /><span className="clip-yellow">Free to Play</span>
              </h2>
              <p className="arcade-promo-desc">
                Test your reflexes, memory, and aim in three browser-based mini-games. No install needed.
              </p>
              <Link to="/arcade" className="btn-yellow">Play Now</Link>
            </div>
            <div className="arcade-promo-right">
              <div className="arcade-mini-card span1">
                <div className="amc-icon">⚡</div>
                <div className="amc-name">Reflex Strike</div>
                <div className="amc-score">250ms avg</div>
              </div>
              <div className="arcade-mini-card span1">
                <div className="amc-icon">🧠</div>
                <div className="amc-name">Memory Matrix</div>
                <div className="amc-score">Level 8 avg</div>
              </div>
              <div className="arcade-mini-card span2">
                <div className="amc-icon">🎯</div>
                <div className="amc-name">Aim Trainer</div>
                <div className="amc-score">65 acc avg</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:"8rem 0" }}>
        <div className="container">
          <div className="cta-block">
            <span className="section-tag" style={{ justifyContent:"center" }}>Join the Universe</span>
            <h2>Your Legend<br /><span className="clip-text">Starts Now</span></h2>
            <p>Join 2.4 million players already competing on NEXUS. Free to start. Forever to master.</p>
            <div className="cta-btns">
              <Link to="/register" className="btn-yellow">Create Free Account →</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
