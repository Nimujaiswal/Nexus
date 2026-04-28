import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { LEADERBOARD } from "../data";

const MEDAL = { 1:"🥇", 2:"🥈", 3:"🥉" };
const MEDAL_COLOR = { 1:"var(--yellow)", 2:"#c0c0c0", 3:"#cd7f32" };

export default function Leaderboard() {
  useScrollReveal();
  const [tab, setTab] = useState("global");

  return (
    <main style={{ paddingTop:"8rem", paddingBottom:"6rem", minHeight:"100vh" }}>
      <div className="container">

        {/* Header */}
        <div className="page-hero sr">
          <span className="section-tag">Global Rankings</span>
          <h1>Top <span className="clip-yellow">Champions</span></h1>
          <p>The best players on the planet, ranked by score, win rate, and sheer dominance.</p>
        </div>

        {/* Season banner */}
        <div className="season-banner sr">
          <div className="season-banner-left">
            <span className="season-tag">SEASON 7 · LIVE</span>
            <h3 className="season-title">$250,000 Prize Pool</h3>
            <p className="season-sub">14 days remaining — climb to earn your share</p>
          </div>
          <div className="season-stats">
            <div className="season-stat"><span className="ss-val">14</span><span className="ss-lbl">Days Left</span></div>
            <div className="season-stat"><span className="ss-val">12K+</span><span className="ss-lbl">Competitors</span></div>
            <div className="season-stat"><span className="ss-val">$250K</span><span className="ss-lbl">Prize Pool</span></div>
          </div>
        </div>

        {/* Podium top 3 */}
        <div className="podium sr">
          {/* 2nd */}
          <div className="podium-card rank-silver">
            <div className="podium-medal">🥈</div>
            <div className="podium-avatar">{LEADERBOARD[1].avatar}</div>
            <div className="podium-rank-label" style={{ color:"#c0c0c0" }}>2nd Place</div>
            <div className="podium-name">{LEADERBOARD[1].name}</div>
            <div className="podium-game">{LEADERBOARD[1].game}</div>
            <div className="podium-score" style={{ color:"#c0c0c0" }}>{LEADERBOARD[1].score}</div>
            <div className="podium-win">{LEADERBOARD[1].win} win rate</div>
          </div>

          {/* 1st */}
          <div className="podium-card rank-gold">
            <div className="podium-crown">👑</div>
            <div className="podium-medal">🥇</div>
            <div className="podium-avatar" style={{ fontSize:"3.5rem" }}>{LEADERBOARD[0].avatar}</div>
            <div className="podium-rank-label" style={{ color:"var(--yellow)" }}>Champion</div>
            <div className="podium-name">{LEADERBOARD[0].name}</div>
            <div className="podium-game">{LEADERBOARD[0].game}</div>
            <div className="podium-score" style={{ color:"var(--yellow)", fontSize:"2.4rem" }}>{LEADERBOARD[0].score}</div>
            <div className="podium-win">{LEADERBOARD[0].win} win rate</div>
          </div>

          {/* 3rd */}
          <div className="podium-card rank-bronze">
            <div className="podium-medal">🥉</div>
            <div className="podium-avatar">{LEADERBOARD[2].avatar}</div>
            <div className="podium-rank-label" style={{ color:"#cd7f32" }}>3rd Place</div>
            <div className="podium-name">{LEADERBOARD[2].name}</div>
            <div className="podium-game">{LEADERBOARD[2].game}</div>
            <div className="podium-score" style={{ color:"#cd7f32" }}>{LEADERBOARD[2].score}</div>
            <div className="podium-win">{LEADERBOARD[2].win} win rate</div>
          </div>
        </div>

        {/* Full rankings table */}
        <div className="lb-card sr">
          <div className="lb-card-header">
            <h3 style={{ fontFamily:"var(--ff-display)", fontSize:"1.6rem", letterSpacing:".5px" }}>Full Rankings</h3>
            <div style={{ display:"flex", gap:".5rem" }}>
              {["global","weekly","monthly"].map(t => (
                <button key={t} className={`filter-btn btn-sm${tab===t?" active":""}`} onClick={() => setTab(t)}>
                  {t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="lb-table-wrap">
            <table className="lb-table">
              <thead>
                <tr>
                  <th style={{ width:"50px" }}>#</th>
                  <th>Player</th>
                  <th>Game</th>
                  <th>Score</th>
                  <th>Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {LEADERBOARD.map((p, i) => (
                  <tr key={i} className={`rank-${p.rank}`}>
                    <td>
                      <span className="lb-rank">
                        {MEDAL[p.rank] || String(p.rank).padStart(2,"0")}
                      </span>
                    </td>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:".7rem" }}>
                        <span className="lb-avatar">{p.avatar}</span>
                        <div>
                          <div style={{ fontWeight:700, fontSize:".9rem" }}>{p.name}</div>
                          {p.rank <= 3 && <div style={{ fontFamily:"var(--ff-mono)", fontSize:".5rem", color:MEDAL_COLOR[p.rank], letterSpacing:"2px", textTransform:"uppercase" }}>Top {p.rank}</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ color:"var(--white-dim)", fontSize:".88rem" }}>{p.game}</td>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:".8rem" }}>
                        <div className="lb-bar">
                          <div className="lb-bar-fill" style={{ width:`${p.pct}%` }} />
                        </div>
                        <span style={{ fontFamily:"var(--ff-mono)", fontSize:".78rem", whiteSpace:"nowrap", minWidth:"52px" }}>{p.score}</span>
                      </div>
                    </td>
                    <td><span className="lb-win">{p.win}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
