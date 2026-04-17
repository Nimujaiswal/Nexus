import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { GAMES } from "../data";

const ALL_GENRES = ["All", ...new Set(GAMES.map(g => g.genre))];

export default function Games() {
  useScrollReveal();
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = GAMES.filter(g => {
    const matchGenre = active === "All" || g.genre === active;
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase()) || g.genre.toLowerCase().includes(search.toLowerCase());
    return matchGenre && matchSearch;
  });

  return (
    <main style={{ paddingTop:"8rem", paddingBottom:"6rem", minHeight:"100vh" }}>
      <div className="container">
        <div className="page-hero sr">
          <span className="section-tag">Game Library</span>
          <h1>Explore <span className="clip-text">All Games</span></h1>
          <p>From brutal battle royales to immersive open worlds — your next obsession is here.</p>
        </div>

        {/* Search + Filters */}
        <div className="sr" style={{ marginBottom:"2rem" }}>
          <input
            className="form-input"
            placeholder="Search games..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth:360, marginBottom:"1.2rem", cursor:"none" }}
          />
        </div>

        <div className="filter-bar sr">
          {ALL_GENRES.map(g => (
            <button key={g} className={`filter-btn${active === g ? " active" : ""}`} onClick={() => setActive(g)}>
              {g}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"5rem", color:"var(--white-dim)" }}>
            No games found. Try a different search or filter.
          </div>
        ) : (
          <div className="games-grid">
            {filtered.map((g, i) => (
              <div key={g.id} className="game-card sr" style={{ transitionDelay:`${(i % 6) * 0.065}s` }}>
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
        )}

        <div className="sr" style={{ textAlign:"center", marginTop:"2rem", color:"var(--white-dim)", fontFamily:"var(--ff-mono)", fontSize:".7rem", letterSpacing:"2px" }}>
          SHOWING {filtered.length} OF {GAMES.length} TITLES
        </div>
      </div>
    </main>
  );
}
