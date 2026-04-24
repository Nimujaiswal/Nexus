import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

const GAMES = [
  { id: "reflex",  icon: "⚡", name: "Reflex Strike",  desc: "Click targets before they vanish. Test your reaction time.",     color: "#e8ff4d" },
  { id: "memory",  icon: "🧠", name: "Memory Matrix",  desc: "Memorise the pattern. Repeat it. How deep can you go?",          color: "#4fb7dd" },
  { id: "aim",     icon: "🎯", name: "Aim Trainer",    desc: "Hit moving targets. Precision and speed — both matter.",         color: "#f87171" },
];

/* ─────────────────────────── REFLEX GAME ─────────────────────────── */
function ReflexGame({ onScore }) {
  const [phase, setPhase]     = useState("idle"); // idle|wait|go|result|dead
  const [reaction, setReaction] = useState(null);
  const [best, setBest]       = useState(null);
  const [rounds, setRounds]   = useState(0);
  const [total, setTotal]     = useState(0);
  const startRef = useRef(null);
  const timerRef = useRef(null);

  const start = useCallback(() => {
    setPhase("wait");
    setReaction(null);
    const delay = 1500 + Math.random() * 3000;
    timerRef.current = setTimeout(() => {
      startRef.current = performance.now();
      setPhase("go");
    }, delay);
  }, []);

  const handleClick = useCallback(() => {
    if (phase === "go") {
      const ms = Math.round(performance.now() - startRef.current);
      setReaction(ms);
      setPhase("result");
      const newRounds = rounds + 1;
      const newTotal  = total + ms;
      setRounds(newRounds);
      setTotal(newTotal);
      setBest(b => b === null ? ms : Math.min(b, ms));
      onScore(ms < 200 ? 50 : ms < 300 ? 30 : ms < 500 ? 10 : 5);
    } else if (phase === "wait") {
      clearTimeout(timerRef.current);
      setPhase("dead");
    } else if (phase === "idle" || phase === "result" || phase === "dead") {
      start();
    }
  }, [phase, start, rounds, total, onScore]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const avg = rounds > 0 ? Math.round(total / rounds) : null;
  const grade = reaction ? (reaction < 180 ? {label:"ELITE",color:"#e8ff4d"} : reaction < 250 ? {label:"FAST",color:"#4ade80"} : reaction < 400 ? {label:"OK",color:"#4fb7dd"} : {label:"SLOW",color:"#f87171"}) : null;

  return (
    <div className="arcade-game-wrap">
      <div className="reflex-stats">
        <div className="reflex-stat"><span className="rs-val">{best ?? "—"}ms</span><span className="rs-lbl">Best</span></div>
        <div className="reflex-stat"><span className="rs-val">{avg ?? "—"}{avg ? "ms" : ""}</span><span className="rs-lbl">Avg ({rounds})</span></div>
      </div>

      <div
        className={`reflex-target ${phase}`}
        onClick={handleClick}
        style={{ userSelect:"none" }}
      >
        {phase === "idle"   && <><div className="rt-icon">⚡</div><div className="rt-msg">Click to Start</div></>}
        {phase === "wait"   && <><div className="rt-icon" style={{opacity:.4}}>👀</div><div className="rt-msg" style={{color:"var(--white-dim)"}}>Wait for it…</div></>}
        {phase === "go"     && <><div className="rt-icon go-pulse">🟢</div><div className="rt-msg go-text">CLICK NOW!</div></>}
        {phase === "dead"   && <><div className="rt-icon">💀</div><div className="rt-msg" style={{color:"var(--red)"}}>Too Early! Click to retry</div></>}
        {phase === "result" && (
          <>
            <div className="rt-icon">{reaction < 200 ? "🔥" : reaction < 350 ? "⚡" : "🐢"}</div>
            <div className="rt-reaction">{reaction}ms</div>
            {grade && <div className="rt-grade" style={{color:grade.color}}>{grade.label}</div>}
            <div className="rt-msg" style={{fontSize:".75rem",marginTop:".5rem",color:"var(--white-dim)"}}>Click to play again</div>
          </>
        )}
      </div>

      <div className="reflex-hint">
        {phase === "wait" && "Don't click yet — wait for GREEN"}
        {phase === "go"   && "GO GO GO!"}
        {(phase === "idle" || phase === "result") && "Human average: 250ms · Elite gamers: <150ms"}
        {phase === "dead" && "Clicked too early!"}
      </div>
    </div>
  );
}

/* ─────────────────────────── MEMORY GAME ─────────────────────────── */
function MemoryGame({ onScore }) {
  const SIZE = 4;
  const TOTAL = SIZE * SIZE;
  const [seq, setSeq]         = useState([]);
  const [input, setInput]     = useState([]);
  const [phase, setPhase]     = useState("idle"); // idle|showing|input|win|fail
  const [lit, setLit]         = useState(null);
  const [level, setLevel]     = useState(1);
  const [best, setBest]       = useState(0);

  const startLevel = useCallback((lvl) => {
    const newSeq = Array.from({length: lvl + 2}, () => Math.floor(Math.random() * TOTAL));
    setSeq(newSeq);
    setInput([]);
    setPhase("showing");
    let i = 0;
    const show = () => {
      if (i >= newSeq.length) { setLit(null); setPhase("input"); return; }
      setLit(null);
      setTimeout(() => { setLit(newSeq[i]); i++; setTimeout(show, 600); }, 250);
    };
    setTimeout(show, 600);
  }, [TOTAL]);

  const handleCell = useCallback((idx) => {
    if (phase !== "input") return;
    const newInput = [...input, idx];
    setInput(newInput);
    const correct = seq.slice(0, newInput.length);
    if (newInput.some((v, i) => v !== correct[i])) {
      setPhase("fail");
      setBest(b => Math.max(b, level - 1));
      return;
    }
    if (newInput.length === seq.length) {
      onScore(level * 20);
      const next = level + 1;
      setLevel(next);
      setBest(b => Math.max(b, level));
      setTimeout(() => startLevel(next), 800);
    }
  }, [phase, input, seq, level, startLevel, onScore]);

  return (
    <div className="arcade-game-wrap">
      <div className="reflex-stats">
        <div className="reflex-stat"><span className="rs-val">Lvl {level}</span><span className="rs-lbl">Current</span></div>
        <div className="reflex-stat"><span className="rs-val">{seq.length}</span><span className="rs-lbl">Sequence</span></div>
        <div className="reflex-stat"><span className="rs-val">{best}</span><span className="rs-lbl">Best</span></div>
      </div>

      {phase === "idle" ? (
        <div className="memory-idle" onClick={() => { setLevel(1); startLevel(1); }}>
          <div style={{fontSize:"3rem",marginBottom:"1rem"}}>🧠</div>
          <div style={{fontFamily:"var(--ff-display)",fontSize:"1.6rem",marginBottom:".5rem"}}>Memory Matrix</div>
          <div style={{color:"var(--white-dim)",fontSize:".85rem",marginBottom:"1.5rem"}}>Watch the pattern, repeat it</div>
          <button className="btn-yellow">Start Game</button>
        </div>
      ) : (
        <>
          <div className="memory-grid">
            {Array.from({length: TOTAL}, (_, i) => (
              <div
                key={i}
                className={`memory-cell ${lit === i ? "lit" : ""} ${phase === "fail" && input[input.length-1] === i ? "wrong" : ""} ${phase === "input" ? "clickable" : ""}`}
                onClick={() => handleCell(i)}
              />
            ))}
          </div>
          <div className="reflex-hint">
            {phase === "showing" && `Watch carefully — ${seq.length} tiles to remember`}
            {phase === "input"   && `Repeat the sequence — ${input.length}/${seq.length}`}
            {phase === "fail"    && <span style={{color:"var(--red)"}}>Wrong! Best: Level {best} · <button onClick={() => {setLevel(1);startLevel(1);}} style={{background:"none",border:"none",color:"var(--yellow)",cursor:"pointer",fontFamily:"var(--ff-body)",fontWeight:700,fontSize:"inherit"}}>Try Again</button></span>}
            {phase === "win"     && <span style={{color:"var(--green)"}}>Level {level - 1} complete!</span>}
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────── AIM TRAINER ─────────────────────────── */
function AimGame({ onScore }) {
  const [targets, setTargets] = useState([]);
  const [score, setScore]     = useState(0);
  const [misses, setMisses]   = useState(0);
  const [phase, setPhase]     = useState("idle");
  const [timeLeft, setTimeLeft] = useState(30);
  const [hits, setHits]       = useState(0);
  const areaRef = useRef(null);
  const spawnRef = useRef(null);
  const timerRef = useRef(null);
  const idRef = useRef(0);

  const spawnTarget = useCallback(() => {
    if (!areaRef.current) return;
    const { width, height } = areaRef.current.getBoundingClientRect();
    const size = 36 + Math.random() * 28;
    idRef.current++;
    const t = {
      id: idRef.current,
      x: size/2 + Math.random() * (width  - size),
      y: size/2 + Math.random() * (height - size),
      size,
      life: 1200 + Math.random() * 800,
      born: Date.now(),
    };
    setTargets(prev => [...prev.slice(-8), t]);
    const ttl = setTimeout(() => {
      setTargets(prev => prev.filter(x => x.id !== t.id));
      setMisses(m => m + 1);
    }, t.life);
    return ttl;
  }, []);

  const startGame = useCallback(() => {
    setScore(0); setMisses(0); setHits(0); setTimeLeft(30);
    setTargets([]); setPhase("playing");
    spawnRef.current = setInterval(spawnTarget, 700);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(spawnRef.current);
          clearInterval(timerRef.current);
          setPhase("result"); setTargets([]);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [spawnTarget]);

  const hitTarget = useCallback((id, e) => {
    e.stopPropagation();
    setTargets(prev => prev.filter(t => t.id !== id));
    const pts = 10;
    setScore(s => s + pts);
    setHits(h => h + 1);
    onScore(pts);
  }, [onScore]);

  useEffect(() => () => { clearInterval(spawnRef.current); clearInterval(timerRef.current); }, []);

  const acc = hits + misses > 0 ? Math.round((hits / (hits + misses)) * 100) : 0;

  return (
    <div className="arcade-game-wrap">
      {phase === "playing" && (
        <div className="aim-hud">
          <div className="reflex-stat"><span className="rs-val" style={{color:"var(--yellow)"}}>{score}</span><span className="rs-lbl">Score</span></div>
          <div className="reflex-stat"><span className="rs-val" style={{color:"var(--red)"}}>{timeLeft}s</span><span className="rs-lbl">Time</span></div>
          <div className="reflex-stat"><span className="rs-val">{acc}%</span><span className="rs-lbl">Accuracy</span></div>
        </div>
      )}

      {phase === "idle" && (
        <div className="memory-idle" onClick={startGame}>
          <div style={{fontSize:"3rem",marginBottom:"1rem"}}>🎯</div>
          <div style={{fontFamily:"var(--ff-display)",fontSize:"1.6rem",marginBottom:".5rem"}}>Aim Trainer</div>
          <div style={{color:"var(--white-dim)",fontSize:".85rem",marginBottom:"1.5rem"}}>30 seconds · hit as many targets as possible</div>
          <button className="btn-yellow">Start</button>
        </div>
      )}

      {phase === "result" && (
        <div className="memory-idle">
          <div style={{fontSize:"3rem",marginBottom:".8rem"}}>{acc > 70 ? "🎯" : acc > 40 ? "😅" : "💀"}</div>
          <div style={{fontFamily:"var(--ff-display)",fontSize:"2.5rem",color:"var(--yellow)",marginBottom:".3rem"}}>{score} pts</div>
          <div style={{fontFamily:"var(--ff-mono)",fontSize:".62rem",letterSpacing:"3px",color:"var(--white-dim)",marginBottom:"1.5rem"}}>
            {hits} HITS · {misses} MISSES · {acc}% ACC
          </div>
          <div style={{color: acc>70?"var(--green)":acc>40?"var(--blue)":"var(--red)", fontFamily:"var(--ff-display)", fontSize:"1.4rem", marginBottom:"1.5rem"}}>
            {acc > 80 ? "PRO LEVEL 🔥" : acc > 60 ? "SOLID PLAY ⚡" : acc > 40 ? "KEEP GRINDING 💪" : "NEEDS PRACTICE 🐌"}
          </div>
          <button className="btn-yellow" onClick={startGame}>Play Again</button>
        </div>
      )}

      {phase === "playing" && (
        <div ref={areaRef} className="aim-area" onClick={() => setMisses(m => m + 1)}>
          {targets.map(t => (
            <div
              key={t.id}
              className="aim-target"
              style={{ left: t.x, top: t.y, width: t.size, height: t.size,
                '--life': `${t.life}ms`,
                animationDuration: `${t.life}ms`,
              }}
              onClick={(e) => hitTarget(t.id, e)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── MAIN PAGE ─────────────────────────── */
export default function Arcade() {
  const [active, setActive]   = useState("reflex");
  const [totalScore, setTotalScore] = useState(0);
  const addScore = useCallback(n => setTotalScore(s => s + n), []);

  return (
    <main>
      <section style={{paddingTop:"6rem",paddingBottom:"8rem",minHeight:"100vh"}}>
        <div className="container">
          {/* Header */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:"1rem",marginBottom:"3rem"}}>
            <div>
              <span className="section-tag">Mini Arcade</span>
              <h1 style={{fontFamily:"var(--ff-display)",fontSize:"clamp(3rem,8vw,6rem)",textTransform:"uppercase",letterSpacing:"-2px",lineHeight:.92}}>
                Test Your<br /><span className="clip-text">Skills</span>
              </h1>
              <p style={{color:"var(--white-dim)",marginTop:"1rem",maxWidth:480,lineHeight:1.7,fontSize:".93rem"}}>
                Sharpen your reflexes, memory and aim. Three mini-games built to benchmark your true gamer DNA.
              </p>
            </div>
            <div className="arcade-score-badge">
              <div style={{fontFamily:"var(--ff-mono)",fontSize:".54rem",letterSpacing:"3px",color:"var(--white-dim)",marginBottom:".3rem"}}>SESSION SCORE</div>
              <div style={{fontFamily:"var(--ff-display)",fontSize:"2.5rem",lineHeight:1,background:"linear-gradient(135deg,var(--yellow),var(--blue))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{totalScore}</div>
            </div>
          </div>

          {/* Game selector */}
          <div className="arcade-tabs">
            {GAMES.map(g => (
              <button
                key={g.id}
                className={`arcade-tab ${active === g.id ? "active" : ""}`}
                onClick={() => setActive(g.id)}
                style={active === g.id ? {"--tab-color": g.color} : {}}
              >
                <span style={{fontSize:"1.4rem"}}>{g.icon}</span>
                <div>
                  <div style={{fontWeight:700,fontSize:".88rem"}}>{g.name}</div>
                  <div style={{fontSize:".72rem",color:"var(--white-dim)",marginTop:".1rem"}}>{g.desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Game area */}
          <div className="arcade-area">
            {active === "reflex" && <ReflexGame  onScore={addScore} key="reflex" />}
            {active === "memory" && <MemoryGame  onScore={addScore} key="memory" />}
            {active === "aim"    && <AimGame     onScore={addScore} key="aim"    />}
          </div>

          {/* Back CTA */}
          <div style={{textAlign:"center",marginTop:"4rem"}}>
            <p style={{color:"var(--white-dim)",marginBottom:"1.2rem",fontSize:".9rem"}}>Ready for the real thing?</p>
            <Link to="/games" className="btn-yellow">Browse Full Game Library →</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
