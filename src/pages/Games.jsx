import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { GameModal, PLAYABLE_GAMES } from "./Arcade";
import { GAMES } from "../data";

const ALL_GENRES = ["All", ...new Set(GAMES.map(g => g.genre))];

const GENRE_ICONS = {
  "All":"🎮","Battle Royale":"💀","RPG":"🗡️","Adventure":"🚀",
  "FPS":"🔥","Stealth":"👻","MOBA":"⚡","Racing":"🏎️","Strategy":"🌌","Fighting":"🥋"
};

export default function Games() {
  useScrollReveal();
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [sort,   setSort]   = useState("rating");
  const [activeGame, setActiveGame] = useState(null);

  const filtered = GAMES
    .filter(g => {
      const matchGenre  = active === "All" || g.genre === active;
      const matchSearch = g.title.toLowerCase().includes(search.toLowerCase()) || g.genre.toLowerCase().includes(search.toLowerCase());
      return matchGenre && matchSearch;
    })
    .sort((a, b) => sort === "rating" ? b.rating - a.rating : b.players.replace(/[^0-9.]/g,"") - a.players.replace(/[^0-9.]/g,""));

  return (
    <main style={{ paddingTop:"8rem", paddingBottom:"6rem", minHeight:"100vh" }}>
      <div className="container">

        {/* Hero */}
        <div className="page-hero sr">
          <span className="section-tag">Game Library</span>
          <h1>Explore <span className="clip-text">All Games</span></h1>
          <p>From brutal battle royales to immersive open worlds — your next obsession is here.</p>
        </div>

        {/* Search + Sort bar */}
        <div className="games-search-row sr">
          <div className="games-search-wrap">
            <span className="games-search-icon">🔍</span>
            <input
              className="games-search-input"
              placeholder="Search games or genre..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="games-search-clear" onClick={() => setSearch("")}>✕</button>
            )}
          </div>
          <div className="games-sort-wrap">
            <span style={{ fontFamily:"var(--ff-mono)", fontSize:".58rem", letterSpacing:"2px", color:"var(--white-dim)", textTransform:"uppercase" }}>Sort by</span>
            <button className={`filter-btn btn-sm ${sort==="rating"?"active":""}`} onClick={() => setSort("rating")}>Rating</button>
            <button className={`filter-btn btn-sm ${sort==="players"?"active":""}`} onClick={() => setSort("players")}>Players</button>
          </div>
        </div>

        {/* Genre filters */}
        <div className="filter-bar sr">
          {ALL_GENRES.map(g => (
            <button key={g} className={`filter-btn${active===g?" active":""}`} onClick={() => setActive(g)}>
              {GENRE_ICONS[g] || "🎮"} {g}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.5rem" }}>
          <p style={{ fontFamily:"var(--ff-mono)", fontSize:".6rem", letterSpacing:"2px", color:"var(--white-dim)", textTransform:"uppercase" }}>
            {filtered.length} {filtered.length === 1 ? "title" : "titles"} found
          </p>
          {(search || active !== "All") && (
            <button
              style={{ background:"none", border:"none", color:"var(--blue)", fontFamily:"var(--ff-mono)", fontSize:".58rem", letterSpacing:"2px", cursor:"pointer", textDecoration:"underline", textTransform:"uppercase" }}
              onClick={() => { setSearch(""); setActive("All"); }}
            >
              Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="games-empty">
            <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🔍</div>
            <h3 style={{ fontFamily:"var(--ff-display)", fontSize:"1.8rem", marginBottom:".5rem" }}>No games found</h3>
            <p style={{ color:"var(--white-dim)" }}>Try a different search or filter</p>
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
                  <div className="game-tags">
                    {g.tags.slice(0,3).map(t => <span key={t} className="game-tag">{t}</span>)}
                  </div>
                  <div className="game-footer">
                    <span className="game-rating">★ {g.rating}</span>
                    <span className="game-platforms">{g.platforms.slice(0,3).join(" · ")}</span>
                  </div>
                  <div className="game-bottom-row">
                    <p className="game-players">● {g.players} playing</p>
                    <button className="game-play-btn" onClick={() => setActiveGame(g.id)}>▶ Play</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {activeGame && <GameModal gameId={activeGame} onClose={() => setActiveGame(null)} />}
    </main>
  );
}
