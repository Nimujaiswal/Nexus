import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Ticker from "../components/Ticker";
import { GAMES, FEATURES, LEADERBOARD } from "../data";

const SHOWCASE_GAMES = [
  { emoji:"💀", genre:"Battle Royale", title:"Nexus Storm",     rating:"★ 9.4", players:"1.2M playing",  avatar:"🐺", player:"ShadowWolf_X", score:"98,420", bg:"linear-gradient(135deg,#130538,#1a0645,#0c1f45)" },
  { emoji:"🗡️", genre:"RPG",          title:"Void Realm",      rating:"★ 9.7", players:"890K playing",  avatar:"🔮", player:"VoidRunner99",  score:"78,900", bg:"linear-gradient(135deg,#061a0e,#0a3d1f,#05140b)" },
  { emoji:"🚀", genre:"Adventure",    title:"Stellar Drift",   rating:"★ 9.1", players:"640K playing",  avatar:"🚀", player:"StarPilot",     score:"68,400", bg:"linear-gradient(135deg,#1a0606,#3d0a0a,#200808)" },
  { emoji:"⚡", genre:"MOBA",         title:"Arcane Uprising", rating:"★ 9.5", players:"2.1M playing",  avatar:"⚡", player:"NeonViper",     score:"91,055", bg:"linear-gradient(135deg,#0e061a,#270640,#0a0320)" },
];

const TRUST_ITEMS = [
  { icon:"🏆", stat:"$5M+",   label:"Prize Money Awarded" },
  { icon:"🌍", stat:"150+",   label:"Countries Represented" },
  { icon:"⭐", stat:"4.9/5",  label:"Average User Rating" },
  { icon:"🛡️", stat:"99.99%", label:"Cheat-Free Matches" },
];

const TESTIMONIALS = [
  { avatar:"🐺", name:"ShadowWolf_X", role:"Rank #1 Global · Nexus Storm",     quote:"NEXUS completely changed how I compete. The matchmaking is insanely good — every game feels fair and intense." },
  { avatar:"🔮", name:"VoidRunner99",  role:"Pro Player · Void Realm",           quote:"Sub-10ms latency is real. I switched from three other platforms and the difference is night and day." },
  { avatar:"🚀", name:"StarPilot",     role:"Content Creator · 2.4M Followers",  quote:"The community tools are unmatched. I stream directly from NEXUS and clip sharing is seamlessly built in." },
];

const HERO_STATS = [
  { num:"2.4M+", label:"Active Players" },
  { num:"500+",  label:"Games"          },
  { num:"<10ms", label:"Latency"        },
  { num:"99.9%", label:"Uptime"         },
];

export default function Home() {
  const navigate = useNavigate();
  const featured = GAMES.filter(g => g.featured).slice(0, 3);
  const [activeGame, setActiveGame] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveGame(i => (i + 1) % SHOWCASE_GAMES.length), 3800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveTestimonial(i => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);

  const game = SHOWCASE_GAMES[activeGame];
  const testimonial = TESTIMONIALS[activeTestimonial];

  return (
    <main>

      {/* ══════════════════════════════════════
          HERO — Value prop in under 3 seconds
      ══════════════════════════════════════ */}
      <section className="hero" aria-label="Hero section">
        <div className="hero-bg" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orb1" aria-hidden="true" />
        <div className="hero-orb2" aria-hidden="true" />

        <div className="hero-inner">
          {/* Left — Headline + CTA */}
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="live-dot" aria-hidden="true" />
              <span>840K Players Online Now</span>
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
              <Link to="/register" className="btn-yellow" aria-label="Create free account">
                Start for Free →
              </Link>
              <Link to="/games" className="btn-outline" aria-label="Browse game library">
                Explore Games
              </Link>
            </div>

            <div className="hero-stats" role="list" aria-label="Platform statistics">
              {HERO_STATS.map((s, i) => (
                <div key={i} className="hero-stat-item" role="listitem">
                  <div className="hero-stat-num" aria-label={`${s.num} ${s.label}`}>{s.num}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Live showcase card */}
          <div className="hero-right">
            <div className="hero-badge hero-badge-1" aria-hidden="true">
              <span className="hero-badge-icon">🏆</span>
              <div className="hero-badge-text">
                <span className="hero-badge-title">Season 7 Live</span>
                <span className="hero-badge-sub">$1M PRIZE POOL</span>
              </div>
            </div>
            <div className="hero-badge hero-badge-2" aria-hidden="true">
              <span className="hero-badge-icon">⚡</span>
              <div className="hero-badge-text">
                <span className="hero-badge-title">Match Found</span>
                <span className="hero-badge-sub">2.3s MATCHMAKING</span>
              </div>
            </div>

            <div className="hero-showcase" role="region" aria-label="Live game showcase">
              <div className="showcase-header">
                <div className="showcase-dots" aria-hidden="true"><span /><span /><span /></div>
                <span className="showcase-label">NEXUS PLATFORM</span>
                <div className="showcase-live"><span className="live-dot" />LIVE</div>
              </div>

              <div className="showcase-game" style={{ background: game.bg }} aria-hidden="true">
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
                      <div style={{ fontFamily:"var(--ff-mono)", fontSize:"var(--text-xs)", color:"var(--white-25)", letterSpacing:"2px" }}>TOP PLAYER</div>
                    </div>
                  </div>
                  <div className="showcase-player-score">{game.score}</div>
                </div>

                {/* Indicator dots */}
                <div style={{ display:"flex", gap:"var(--s2)", marginBottom:"var(--s3)", justifyContent:"center" }} role="tablist" aria-label="Game selector">
                  {SHOWCASE_GAMES.map((_, i) => (
                    <button
                      key={i} role="tab" aria-selected={i === activeGame}
                      aria-label={`Show game ${i + 1}`}
                      onClick={() => setActiveGame(i)}
                      style={{ width: i===activeGame?"20px":"6px", height:"6px", borderRadius:"3px", background: i===activeGame?"var(--yellow)":"rgba(255,255,255,.2)", border:"none", cursor:"pointer", transition:"all .3s", padding:0 }}
                    />
                  ))}
                </div>

                <button className="showcase-btn" onClick={() => navigate("/arcade")} aria-label="Play now in arcade">
                  ▶  Play Now — It's Free
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <Ticker />

      {/* ══════════════════════════════════════
          PROBLEM — Why NEXUS exists
      ══════════════════════════════════════ */}
      <section style={{ padding:"var(--s24) 0", background:"var(--bg-2)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }} aria-labelledby="problem-heading">
        <div className="container">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--s16)", alignItems:"center" }}>
            <div className="sr">
              <span className="section-tag">The Problem</span>
              <h2 id="problem-heading" style={{ fontSize:"clamp(2rem,4vw,3.5rem)", letterSpacing:"-1px", marginBottom:"var(--s5)" }}>
                Gaming is<br /><span style={{ color:"var(--red)" }}>Fragmented.</span>
              </h2>
              <p style={{ color:"var(--white-50)", lineHeight:1.9, fontSize:"var(--text-lg)", marginBottom:"var(--s5)" }}>
                You have games on 6 different platforms, pay for 4 subscriptions, and still get matched against cheaters with 200ms ping.
              </p>
              <p style={{ color:"var(--white-50)", lineHeight:1.9, fontSize:"var(--text-md)" }}>
                Your progress doesn't follow you. Your friends are on different systems. And every platform charges you more for less.
              </p>
            </div>
            <div className="sr" style={{ display:"flex", flexDirection:"column", gap:"var(--s3)" }}>
              {[
                { icon:"😤", prob:"6 launchers for 6 games", sol:"One platform, everything" },
                { icon:"💸", prob:"Multiple paid subscriptions", sol:"Free forever, premium optional" },
                { icon:"😞", prob:"Cheaters in every lobby",   sol:"Kernel-level AI anti-cheat" },
                { icon:"📵", prob:"Progress lost switching devices", sol:"Universal cloud saves" },
              ].map((item, i) => (
                <div key={i} style={{ display:"flex", gap:"var(--s4)", alignItems:"center", background:"var(--bg-3)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", padding:"var(--s4) var(--s5)" }}>
                  <span style={{ fontSize:"1.5rem", flexShrink:0 }}>{item.icon}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ color:"var(--white-50)", fontSize:"var(--text-sm)", textDecoration:"line-through" }}>{item.prob}</div>
                    <div style={{ color:"var(--green)", fontSize:"var(--text-base)", fontWeight:600, marginTop:"2px" }}>✓ {item.sol}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES — Solution showcase
      ══════════════════════════════════════ */}
      <section style={{ padding:"var(--s24) 0" }} aria-labelledby="features-heading">
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:"var(--s16)" }} className="sr">
            <span className="section-tag">Why NEXUS</span>
            <h2 id="features-heading" style={{ fontSize:"clamp(2.2rem,5vw,4.5rem)", letterSpacing:"-2px", maxWidth:600, margin:"0 auto var(--s4)" }}>
              Built for Champions.
            </h2>
            <p style={{ color:"var(--white-50)", maxWidth:480, margin:"0 auto", fontSize:"var(--text-lg)", lineHeight:1.8 }}>
              Every feature engineered to give you the edge.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"var(--s4)" }} className="features-4-grid">
            {FEATURES.slice(0,8).map((f,i) => (
              <div key={i} className="sr feat-card" style={{ transitionDelay:`${i*.05}s` }}>
                <div style={{ fontSize:"2rem", marginBottom:"var(--s3)", lineHeight:1 }}>{f.icon}</div>
                <div style={{ fontFamily:"var(--ff-mono)", fontSize:"var(--text-xs)", letterSpacing:"3px", color:"var(--violet)", textTransform:"uppercase", marginBottom:"var(--s2)" }}>{f.num}</div>
                <h3 style={{ fontSize:"var(--text-xl)", marginBottom:"var(--s2)", letterSpacing:".3px" }}>{f.name}</h3>
                <p style={{ color:"var(--white-50)", fontSize:"var(--text-base)", lineHeight:1.75 }}>{f.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Ticker reverse />

      {/* ══════════════════════════════════════
          FEATURED GAMES
      ══════════════════════════════════════ */}
      <section style={{ padding:"var(--s20) 0", background:"var(--bg-2)", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)" }} aria-labelledby="games-heading">
        <div className="container">
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"var(--s10)", flexWrap:"wrap", gap:"var(--s4)" }}>
            <div className="sr">
              <span className="section-tag">Featured Titles</span>
              <h2 id="games-heading" style={{ fontSize:"clamp(1.8rem,4vw,3.5rem)", letterSpacing:"-1px" }}>Top Games This Week</h2>
            </div>
            <Link to="/games" className="btn-outline btn-sm sr">View All 500+ →</Link>
          </div>
          <div className="games-grid">
            {featured.map(g => (
              <article key={g.id} className="game-card sr">
                <div className={`game-thumb ${g.thumb}`} aria-hidden="true">
                  <span>{g.emoji}</span>
                  {g.featured && <span className="game-badge">Featured</span>}
                </div>
                <div className="game-body">
                  <p className="game-genre">{g.genre}</p>
                  <h3 className="game-name">{g.title}</h3>
                  <p className="game-desc">{g.description}</p>
                  <div className="game-footer">
                    <span className="game-rating" aria-label={`Rating ${g.rating}`}>★ {g.rating}</span>
                    <span className="game-platforms">{g.platforms.slice(0,3).join(" · ")}</span>
                  </div>
                  <p className="game-players" aria-live="polite">● {g.players} playing now</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS — Social proof numbers
      ══════════════════════════════════════ */}
      <section className="stats-strip" aria-label="Platform statistics">
        <div className="container">
          <div className="stats-grid">
            {[
              { num:"2.4M+", label:"Monthly Active Players" },
              { num:"500+",  label:"Games in Library"       },
              { num:"$5M+",  label:"Prize Money Awarded"    },
              { num:"99.9%", label:"Platform Uptime"        },
            ].map((s,i) => (
              <div key={i} className="sr" style={{ textAlign:"center", transitionDelay:`${i*.08}s` }}>
                <div className="stat-num" aria-label={`${s.num} ${s.label}`}>{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS — Social proof
      ══════════════════════════════════════ */}
      <section style={{ padding:"var(--s24) 0" }} aria-labelledby="testimonials-heading">
        <div className="container">
          <div style={{ textAlign:"center", marginBottom:"var(--s12)" }} className="sr">
            <span className="section-tag">Player Voices</span>
            <h2 id="testimonials-heading" style={{ fontSize:"clamp(2rem,4vw,3.5rem)", letterSpacing:"-1px" }}>
              Trusted by Millions
            </h2>
          </div>

          {/* Trust items */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"var(--s4)", marginBottom:"var(--s12)" }} className="trust-grid sr">
            {TRUST_ITEMS.map((t,i) => (
              <div key={i} style={{ background:"var(--bg-2)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", padding:"var(--s6)", textAlign:"center" }}>
                <div style={{ fontSize:"1.8rem", marginBottom:"var(--s2)" }}>{t.icon}</div>
                <div style={{ fontFamily:"var(--ff-display)", fontSize:"1.8rem", background:"linear-gradient(135deg,var(--yellow),var(--blue))", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1, marginBottom:"var(--s1)" }}>{t.stat}</div>
                <div style={{ fontFamily:"var(--ff-mono)", fontSize:"var(--text-xs)", letterSpacing:"2px", color:"var(--white-25)", textTransform:"uppercase" }}>{t.label}</div>
              </div>
            ))}
          </div>

          {/* Rotating testimonial */}
          <div style={{ maxWidth:680, margin:"0 auto" }} className="sr">
            <div style={{ background:"var(--bg-2)", border:"1px solid var(--border)", borderRadius:"var(--r-2xl)", padding:"var(--s10)", textAlign:"center", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:"var(--s5)", left:"var(--s6)", fontSize:"4rem", opacity:.08, fontFamily:"serif", lineHeight:1 }}>"</div>
              <p style={{ fontSize:"var(--text-lg)", color:"var(--white-80)", lineHeight:1.85, marginBottom:"var(--s6)", fontStyle:"italic", position:"relative", zIndex:1 }}>
                "{testimonial.quote}"
              </p>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"var(--s3)" }}>
                <span style={{ fontSize:"1.8rem" }}>{testimonial.avatar}</span>
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontWeight:700 }}>{testimonial.name}</div>
                  <div style={{ fontFamily:"var(--ff-mono)", fontSize:"var(--text-xs)", color:"var(--blue)", letterSpacing:"2px" }}>{testimonial.role}</div>
                </div>
              </div>
              {/* Dots */}
              <div style={{ display:"flex", gap:"var(--s2)", justifyContent:"center", marginTop:"var(--s6)" }}>
                {TESTIMONIALS.map((_,i) => (
                  <button key={i} onClick={()=>setActiveTestimonial(i)} aria-label={`Testimonial ${i+1}`}
                    style={{ width:i===activeTestimonial?"20px":"6px", height:"6px", borderRadius:"3px", background:i===activeTestimonial?"var(--blue)":"rgba(255,255,255,.2)", border:"none", cursor:"pointer", transition:"all .3s", padding:0 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ARCADE PROMO
      ══════════════════════════════════════ */}
      <section style={{ padding:"0 0 var(--s24)" }} aria-labelledby="arcade-heading">
        <div className="container">
          <div className="arcade-promo-card sr">
            <div className="arcade-promo-glow" aria-hidden="true" />
            <div className="arcade-promo-left">
              <span className="section-tag">Free Mini Games</span>
              <h2 id="arcade-heading" className="arcade-promo-title">
                Mini Arcade<br /><span className="clip-yellow">No Download.</span>
              </h2>
              <p className="arcade-promo-desc">
                7 unique browser games — minesweeper, cipher decoding, dodge, racing, MOBA combat and more. Free. Instant. In-browser.
              </p>
              <Link to="/arcade" className="btn-yellow" aria-label="Play arcade games">Play Free →</Link>
            </div>
            <div className="arcade-promo-right">
              {[
                { icon:"💀", name:"Battle Grid",    score:"Strategy"  },
                { icon:"👻", name:"Ghost Weave",    score:"Cipher"    },
                { icon:"🏎️", name:"Volt Strike",    score:"Racing"    },
                { icon:"🥋", name:"Shadow Court",   score:"Fighting"  },
              ].map((g,i) => (
                <div key={i} className={`arcade-mini-card${i===3?" span2":""}`}>
                  <div className="amc-icon">{g.icon}</div>
                  <div className="amc-name">{g.name}</div>
                  <div className="amc-score">{g.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FINAL CTA — Conversion section
      ══════════════════════════════════════ */}
      <section style={{ padding:"var(--s24) 0" }} aria-labelledby="cta-heading">
        <div className="container">
          <div className="cta-block sr">
            <span className="section-tag" style={{ justifyContent:"center" }}>Free Forever</span>
            <h2 id="cta-heading">Your Legend<br /><span className="clip-text">Starts Today.</span></h2>
            <p>Join 2.4 million players on the most advanced gaming platform on Earth. Free to start. No credit card. No catch.</p>
            <div className="cta-btns">
              <Link to="/register" className="btn-yellow" aria-label="Create free account">Create Free Account →</Link>
              <Link to="/games" className="btn-outline" aria-label="Browse games">Browse 500+ Games</Link>
            </div>
            <p style={{ marginTop:"var(--s5)", fontFamily:"var(--ff-mono)", fontSize:"var(--text-xs)", color:"var(--white-25)", letterSpacing:"2px", textTransform:"uppercase" }}>
              No credit card · Free forever · Cancel anytime
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
