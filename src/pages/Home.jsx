import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Ticker from "../components/Ticker";
import { GAMES, FEATURES, LEADERBOARD } from "../data";
import { useScrollReveal } from "../hooks/useScrollReveal";

const SHOWCASE_GAMES = [
  { emoji:"💀", genre:"Battle Royale", title:"Nexus Storm",     rating:"★ 9.4", players:"1.2M playing",  avatar:"🐺", player:"ShadowWolf_X", score:"98,420", bg:"linear-gradient(135deg,#130538,#1a0645,#0c1f45)" },
  { emoji:"🗡️", genre:"RPG",          title:"Void Realm",      rating:"★ 9.7", players:"890K playing",  avatar:"🔮", player:"VoidRunner99",  score:"78,900", bg:"linear-gradient(135deg,#061a0e,#0a3d1f,#05140b)" },
  { emoji:"🚀", genre:"Adventure",    title:"Stellar Drift",   rating:"★ 9.1", players:"640K playing",  avatar:"🚀", player:"StarPilot",     score:"68,400", bg:"linear-gradient(135deg,#1a0606,#3d0a0a,#200808)" },
  { emoji:"⚡", genre:"MOBA",         title:"Arcane Uprising", rating:"★ 9.5", players:"2.1M playing",  avatar:"⚡", player:"NeonViper",     score:"91,055", bg:"linear-gradient(135deg,#0e061a,#270640,#0a0320)" },
];

const HERO_STATS = [
  { num:"2.4M+", label:"Active Players" },
  { num:"500+",  label:"Games"          },
  { num:"<10ms", label:"Latency"        },
  { num:"99.9%", label:"Uptime"         },
];

const TRUST_ITEMS = [
  { icon:"🏆", stat:"$5M+",    label:"Prize Money Awarded"  },
  { icon:"🌍", stat:"150+",    label:"Countries"             },
  { icon:"⭐", stat:"4.9/5",   label:"User Rating"           },
  { icon:"🛡️", stat:"99.99%", label:"Cheat-Free Matches"    },
];

const TESTIMONIALS = [
  { avatar:"🐺", name:"ShadowWolf_X", role:"Rank #1 Global · Nexus Storm",    quote:"NEXUS completely changed how I compete. The matchmaking is insanely good — every game feels fair and intense." },
  { avatar:"🔮", name:"VoidRunner99",  role:"Pro Player · Void Realm",          quote:"Sub-10ms latency is real. I switched from three other platforms and the difference is night and day." },
  { avatar:"🚀", name:"StarPilot",     role:"Content Creator · 2.4M Followers", quote:"The community tools are unmatched. I stream directly from NEXUS and clip sharing is seamlessly built in." },
];

const PROBLEMS = [
  { icon:"😤", prob:"6 launchers for 6 games",         sol:"One platform, everything"    },
  { icon:"💸", prob:"Multiple paid subscriptions",     sol:"Free forever, premium optional" },
  { icon:"😞", prob:"Cheaters in every lobby",         sol:"Kernel-level AI anti-cheat"  },
  { icon:"📵", prob:"Progress lost switching devices", sol:"Universal cloud saves"        },
];

export default function Home() {
  useScrollReveal();
  const navigate = useNavigate();
  const featured = GAMES.filter(g => g.featured).slice(0, 3);
  const [activeGame,        setActiveGame]        = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveGame(i => (i + 1) % SHOWCASE_GAMES.length), 3800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);

  const game        = SHOWCASE_GAMES[activeGame];
  const testimonial = TESTIMONIALS[activeTestimonial];

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
              The Gaming<br />
              Universe<br />
              <span className="hl">Redefined.</span>
            </h1>

            <p className="hero-desc">
              500+ premium games, AI matchmaking, and sub-10ms latency —
              all in one free cross-platform ecosystem.
            </p>

            <div className="hero-cta">
              <Link to="/register" className="btn-yellow">Start for Free →</Link>
              <Link to="/games"    className="btn-outline">Explore Games</Link>
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

          {/* RIGHT — Showcase */}
          <div className="hero-right">
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
                <span className="hero-badge-title">Match Found</span>
                <span className="hero-badge-sub">2.3s MATCHMAKING</span>
              </div>
            </div>

            <div className="hero-showcase">
              <div className="showcase-header">
                <div className="showcase-dots"><span /><span /><span /></div>
                <span className="showcase-label">NEXUS PLATFORM</span>
                <div className="showcase-live"><span className="live-dot" />LIVE</div>
              </div>
              <div className="showcase-game" style={{ background: game.bg }}>
                <div className="showcase-game-glow" />
                <div className="showcase-game-particles" />
                <span className="showcase-game-emoji">{game.emoji}</span>
              </div>
              <div className="showcase-info">
                <div className="showcase-game-meta">
                  <span className="showcase-game-genre">{game.genre}</span>
                  <span className="showcase-game-rating">{game.rating}</span>
                </div>
                <div className="showcase-game-title">{game.title}</div>
                <div className="showcase-game-players">● {game.players}</div>
                <div className="showcase-player-row">
                  <div className="showcase-player-info">
                    <div className="showcase-player-avatar">{game.avatar}</div>
                    <div>
                      <div className="showcase-player-name">{game.player}</div>
                      <div style={{ fontFamily:"var(--ff-mono)", fontSize:".48rem", color:"var(--white-25)", letterSpacing:"2px" }}>TOP PLAYER</div>
                    </div>
                  </div>
                  <div className="showcase-player-score">{game.score}</div>
                </div>
                <div style={{ display:"flex", gap:"6px", marginBottom:"12px", justifyContent:"center" }}>
                  {SHOWCASE_GAMES.map((_, i) => (
                    <button key={i} onClick={() => setActiveGame(i)}
                      style={{ width:i===activeGame?"20px":"6px", height:"6px", borderRadius:"3px",
                        background:i===activeGame?"#e9ff4e":"rgba(255,255,255,.2)",
                        border:"none", cursor:"pointer", transition:"all .3s", padding:0 }}
                    />
                  ))}
                </div>
                <button className="showcase-btn" onClick={() => navigate("/arcade")}>
                  ▶  Play Now — It's Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Ticker />

      {/* ── PROBLEM ── */}
      <section className="home-section bg-alt">
        <div className="container">
          <div className="two-col-grid">
            <div className="sr">
              <span className="section-tag">The Problem</span>
              <h2 className="h2-lg">Gaming is<br /><span style={{ color:"#f87171" }}>Fragmented.</span></h2>
              <p className="body-text mt-4">
                You have games on 6 different platforms, pay for 4 subscriptions,
                and still get matched against cheaters with 200ms ping.
              </p>
              <p className="body-text mt-3">
                Your progress doesn't follow you. Your friends are on different systems.
                Every platform charges you more for less.
              </p>
            </div>
            <div className="sr" style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {PROBLEMS.map((item, i) => (
                <div key={i} className="problem-row">
                  <span style={{ fontSize:"1.4rem", flexShrink:0 }}>{item.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ color:"rgba(240,240,248,.4)", fontSize:".85rem", textDecoration:"line-through" }}>{item.prob}</div>
                    <div style={{ color:"#4ade80", fontSize:".9rem", fontWeight:600, marginTop:"2px" }}>✓ {item.sol}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="home-section">
        <div className="container">
          <div className="section-header sr">
            <span className="section-tag">Why NEXUS</span>
            <h2 className="h2-lg">Built for Champions.</h2>
            <p className="body-text" style={{ maxWidth:480, margin:"0 auto" }}>Every feature engineered to give you the edge.</p>
          </div>
          <div className="feat-grid">
            {FEATURES.slice(0, 8).map((f, i) => (
              <div key={i} className="feat-card sr" style={{ transitionDelay:`${i * 0.06}s` }}>
                <div style={{ fontSize:"2rem", marginBottom:"12px", lineHeight:1 }}>{f.icon}</div>
                <div style={{ fontFamily:"var(--ff-mono)", fontSize:".55rem", letterSpacing:"3px", color:"var(--violet)", textTransform:"uppercase", marginBottom:"8px" }}>{f.num}</div>
                <h3 style={{ fontSize:"1.1rem", marginBottom:"8px" }}>{f.name}</h3>
                <p style={{ color:"rgba(240,240,248,.5)", fontSize:".85rem", lineHeight:1.7 }}>{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Ticker reverse />

      {/* ── FEATURED GAMES ── */}
      <section className="home-section bg-alt">
        <div className="container">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"40px", flexWrap:"wrap", gap:"16px" }}>
            <div className="sr">
              <span className="section-tag">Featured Titles</span>
              <h2 style={{ fontFamily:"var(--ff-display)", fontSize:"clamp(1.8rem,4vw,3rem)", textTransform:"uppercase", letterSpacing:"-1px" }}>Top Games This Week</h2>
            </div>
            <Link to="/games" className="btn-outline btn-sm sr">View All 500+ →</Link>
          </div>
          <div className="games-grid">
            {featured.map(g => (
              <article key={g.id} className="game-card sr">
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
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-strip">
        <div className="container">
          <div className="stats-grid">
            {[
              { num:"2.4M+", label:"Monthly Active Players" },
              { num:"500+",  label:"Games in Library"       },
              { num:"$5M+",  label:"Prize Money Awarded"    },
              { num:"99.9%", label:"Platform Uptime"        },
            ].map((s, i) => (
              <div key={i} className="sr" style={{ textAlign:"center", transitionDelay:`${i*.08}s` }}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="home-section">
        <div className="container">
          <div className="section-header sr">
            <span className="section-tag">Player Voices</span>
            <h2 className="h2-lg">Trusted by Millions</h2>
          </div>

          <div className="trust-row sr">
            {TRUST_ITEMS.map((t, i) => (
              <div key={i} className="trust-card">
                <div style={{ fontSize:"1.6rem", marginBottom:"8px" }}>{t.icon}</div>
                <div className="trust-stat">{t.stat}</div>
                <div className="trust-label">{t.label}</div>
              </div>
            ))}
          </div>

          <div className="testimonial-card sr">
            <div className="testimonial-quote-mark">"</div>
            <p className="testimonial-text">"{testimonial.quote}"</p>
            <div className="testimonial-author">
              <span style={{ fontSize:"1.8rem" }}>{testimonial.avatar}</span>
              <div>
                <div style={{ fontWeight:700 }}>{testimonial.name}</div>
                <div style={{ fontFamily:"var(--ff-mono)", fontSize:".55rem", color:"var(--blue)", letterSpacing:"2px" }}>{testimonial.role}</div>
              </div>
            </div>
            <div style={{ display:"flex", gap:"8px", justifyContent:"center", marginTop:"20px" }}>
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  style={{ width:i===activeTestimonial?"20px":"6px", height:"6px", borderRadius:"3px",
                    background:i===activeTestimonial?"var(--blue)":"rgba(255,255,255,.2)",
                    border:"none", cursor:"pointer", transition:"all .3s", padding:0 }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ARCADE PROMO ── */}
      <section className="home-section bg-alt">
        <div className="container">
          <div className="arcade-promo-card sr">
            <div className="arcade-promo-glow" />
            <div className="arcade-promo-left">
              <span className="section-tag">Free Mini Games</span>
              <h2 className="arcade-promo-title">
                Mini Arcade<br /><span className="clip-yellow">No Download.</span>
              </h2>
              <p className="arcade-promo-desc">
                7 unique browser games — minesweeper, cipher decoding, dodge, racing, MOBA brawl and more. Free. Instant. In-browser.
              </p>
              <Link to="/arcade" className="btn-yellow">Play Free →</Link>
            </div>
            <div className="arcade-promo-right">
              {[
                { icon:"💀", name:"Battle Grid",  score:"Strategy" },
                { icon:"👻", name:"Ghost Weave",  score:"Cipher"   },
                { icon:"🏎️", name:"Volt Strike",  score:"Racing"   },
                { icon:"🥋", name:"Shadow Court", score:"Fighting" },
              ].map((g, i) => (
                <div key={i} className={`arcade-mini-card${i === 3 ? " span2" : ""}`}>
                  <div className="amc-icon">{g.icon}</div>
                  <div className="amc-name">{g.name}</div>
                  <div className="amc-score">{g.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="home-section">
        <div className="container">
          <div className="cta-block sr">
            <span className="section-tag" style={{ justifyContent:"center" }}>Free Forever</span>
            <h2>Your Legend<br /><span className="clip-text">Starts Today.</span></h2>
            <p>Join 2.4 million players on the most advanced gaming platform on Earth. Free to start. No credit card. No catch.</p>
            <div className="cta-btns">
              <Link to="/register" className="btn-yellow">Create Free Account →</Link>
              <Link to="/games"    className="btn-outline">Browse 500+ Games</Link>
            </div>
            <p style={{ marginTop:"20px", fontFamily:"var(--ff-mono)", fontSize:".55rem", color:"rgba(240,240,248,.25)", letterSpacing:"2px", textTransform:"uppercase" }}>
              No credit card · Free forever · Cancel anytime
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
