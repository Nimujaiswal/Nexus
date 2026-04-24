import { useScrollReveal } from "../hooks/useScrollReveal";
import { LEADERBOARD } from "../data";

export default function Leaderboard() {
  useScrollReveal();

  return (
    <main style={{ paddingTop:"8rem", paddingBottom:"6rem", minHeight:"100vh" }}>
      <div className="container">
        <div className="page-hero sr">
          <span className="section-tag">Global Rankings</span>
          <h1>Top <span className="clip-yellow">Champions</span></h1>
          <p>The best players on the planet, ranked by score, win rate, and sheer dominance.</p>
        </div>

        {/* Podium top 3 */}
        <div className="sr" style={{ display:"grid", gridTemplateColumns:"1fr 1.15fr 1fr", gap:"1rem", marginBottom:"3rem", alignItems:"flex-end" }}>
          {/* 2nd */}
          <div style={{
            background:"var(--bg-2)", border:"1px solid var(--border)",
            borderRadius:"var(--radius)", padding:"2rem", textAlign:"center",
            borderTop:"3px solid #c0c0c0",
          }}>
            <div style={{ fontSize:"2.5rem", marginBottom:".5rem" }}>{LEADERBOARD[1].avatar}</div>
            <div style={{ fontFamily:"var(--ff-mono)", fontSize:".6rem", color:"#c0c0c0", letterSpacing:"3px", marginBottom:".4rem" }}>2ND PLACE</div>
            <div style={{ fontFamily:"var(--ff-display)", fontSize:"1.3rem", letterSpacing:".5px" }}>{LEADERBOARD[1].name}</div>
            <div style={{ color:"var(--white-dim)", fontSize:".8rem", marginTop:".3rem" }}>{LEADERBOARD[1].game}</div>
            <div style={{ fontFamily:"var(--ff-display)", fontSize:"2rem", color:"#c0c0c0", marginTop:".8rem" }}>{LEADERBOARD[1].score}</div>
          </div>
          {/* 1st */}
          <div style={{
            background:"linear-gradient(135deg,#1a0f3d,#0d0620)",
            border:"1px solid rgba(237,255,102,.25)",
            borderRadius:"var(--radius)", padding:"2.5rem", textAlign:"center",
            borderTop:"3px solid var(--yellow)",
            boxShadow:"0 0 40px rgba(237,255,102,.1)",
          }}>
            <div style={{ fontSize:"3rem", marginBottom:".5rem" }}>{LEADERBOARD[0].avatar}</div>
            <div style={{ fontFamily:"var(--ff-mono)", fontSize:".6rem", color:"var(--yellow)", letterSpacing:"3px", marginBottom:".4rem" }}>🏆 1ST PLACE</div>
            <div style={{ fontFamily:"var(--ff-display)", fontSize:"1.5rem", letterSpacing:".5px" }}>{LEADERBOARD[0].name}</div>
            <div style={{ color:"var(--white-dim)", fontSize:".8rem", marginTop:".3rem" }}>{LEADERBOARD[0].game}</div>
            <div style={{ fontFamily:"var(--ff-display)", fontSize:"2.5rem", color:"var(--yellow)", marginTop:".8rem" }}>{LEADERBOARD[0].score}</div>
          </div>
          {/* 3rd */}
          <div style={{
            background:"var(--bg-2)", border:"1px solid var(--border)",
            borderRadius:"var(--radius)", padding:"2rem", textAlign:"center",
            borderTop:"3px solid #cd7f32",
          }}>
            <div style={{ fontSize:"2.5rem", marginBottom:".5rem" }}>{LEADERBOARD[2].avatar}</div>
            <div style={{ fontFamily:"var(--ff-mono)", fontSize:".6rem", color:"#cd7f32", letterSpacing:"3px", marginBottom:".4rem" }}>3RD PLACE</div>
            <div style={{ fontFamily:"var(--ff-display)", fontSize:"1.3rem", letterSpacing:".5px" }}>{LEADERBOARD[2].name}</div>
            <div style={{ color:"var(--white-dim)", fontSize:".8rem", marginTop:".3rem" }}>{LEADERBOARD[2].game}</div>
            <div style={{ fontFamily:"var(--ff-display)", fontSize:"2rem", color:"#cd7f32", marginTop:".8rem" }}>{LEADERBOARD[2].score}</div>
          </div>
        </div>

        {/* Full table */}
        <div className="sr" style={{ background:"var(--bg-2)", border:"1px solid var(--border)", borderRadius:"var(--radius)", overflow:"hidden" }}>
          <div className="lb-table-wrap"><table className="lb-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Game</th>
                <th>Score</th>
                <th>Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {LEADERBOARD.map((p, i) => (
                <tr key={i} className={`rank-${p.rank}`}>
                  <td><span className="lb-rank">{String(p.rank).padStart(2,"0")}</span></td>
                  <td>
                    <span className="lb-avatar">{p.avatar}</span>
                    {p.name}
                  </td>
                  <td style={{ color:"var(--white-dim)", fontSize:".88rem" }}>{p.game}</td>
                  <td>
                    <div className="lb-bar-wrap">
                      <div className="lb-bar">
                        <div className="lb-bar-fill" style={{ width:`${p.pct}%` }} />
                      </div>
                      <span style={{ fontFamily:"var(--ff-mono)", fontSize:".78rem", whiteSpace:"nowrap" }}>{p.score}</span>
                    </div>
                  </td>
                  <td><span className="lb-win">{p.win}</span></td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>

        {/* Season info */}
        <div className="sr" style={{
          marginTop:"3rem", display:"grid",
          gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"1rem",
        }}>
          {[
            { icon:"📅", label:"Season", value:"Season 7" },
            { icon:"⏱️", label:"Ends In", value:"14 Days" },
            { icon:"💰", label:"Prize Pool", value:"$250,000" },
            { icon:"🎮", label:"Active Games", value:"All Titles" },
          ].map((item, i) => (
            <div key={i} className="spec-card" style={{ textAlign:"center" }}>
              <div className="spec-icon">{item.icon}</div>
              <div className="spec-label">{item.label}</div>
              <div className="spec-value">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
