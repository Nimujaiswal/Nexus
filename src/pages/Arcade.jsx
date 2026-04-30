import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";

/* ═══════════════════════════════════════
   GAME DEFINITIONS — map to GAMES data
═══════════════════════════════════════ */
export const PLAYABLE_GAMES = {
  1: { id:"storm",   name:"Nexus Storm",     mode:"aim",    color:"#e8ff4d", icon:"💀" },
  2: { id:"void",    name:"Void Realm",      mode:"rpg",    color:"#7c4dff", icon:"🗡️" },
  3: { id:"stellar", name:"Stellar Drift",   mode:"dodge",  color:"#4fb7dd", icon:"🚀" },
  4: { id:"iron",    name:"Iron Protocol",   mode:"reflex", color:"#f87171", icon:"🔥" },
  5: { id:"ghost",   name:"Ghost Weave",     mode:"memory", color:"#4ade80", icon:"👻" },
  6: { id:"arcane",  name:"Arcane Uprising", mode:"moba",   color:"#a78bfa", icon:"⚡" },
  7: { id:"volt",    name:"Volt Strike",     mode:"race",   color:"#fb923c", icon:"🏎️" },
  8: { id:"rift",    name:"Rift Breaker",    mode:"tower",  color:"#22d3ee", icon:"🌌" },
  9: { id:"shadow",  name:"Shadow Court",    mode:"fight",  color:"#f472b6", icon:"🥋" },
};

/* ═══════════════════════════════════════════════════════
   GAME 1: AIM BLITZ — "Nexus Storm" / FPS feel
═══════════════════════════════════════════════════════ */
function AimBlitz({ onScore, onExit, gameName, gameColor }) {
  const [phase,    setPhase]    = useState("idle");
  const [score,    setScore]    = useState(0);
  const [combo,    setCombo]    = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [targets,  setTargets]  = useState([]);
  const [hits,     setHits]     = useState(0);
  const [misses,   setMisses]   = useState(0);
  const [floats,   setFloats]   = useState([]);
  const areaRef  = useRef(null);
  const spawnRef = useRef(null);
  const timerRef = useRef(null);
  const idRef    = useRef(0);
  const floatId  = useRef(0);

  const spawnTarget = useCallback(() => {
    if (!areaRef.current) return;
    const { width, height } = areaRef.current.getBoundingClientRect();
    const size = 30 + Math.random() * 35;
    const isGold = Math.random() < 0.12;
    idRef.current++;
    const t = {
      id:   idRef.current,
      x:    size/2 + Math.random() * (width  - size),
      y:    size/2 + Math.random() * (height - size),
      size, isGold,
      life: isGold ? 900 : 1400 + Math.random() * 600,
    };
    setTargets(prev => [...prev.slice(-10), t]);
    setTimeout(() => {
      setTargets(prev => prev.filter(x => x.id !== t.id));
      setMisses(m => m + 1);
      setCombo(0);
    }, t.life);
  }, []);

  const start = useCallback(() => {
    setScore(0); setCombo(0); setMaxCombo(0);
    setTimeLeft(45); setHits(0); setMisses(0);
    setTargets([]); setFloats([]); setPhase("playing");
    spawnRef.current = setInterval(spawnTarget, 650);
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

  const hitTarget = useCallback((t, e) => {
    e.stopPropagation();
    const newCombo = combo + 1;
    const pts = t.isGold ? (50 * Math.max(1, newCombo)) : (10 * Math.max(1, Math.floor(newCombo/3)));
    setScore(s => s + pts);
    setCombo(newCombo);
    setMaxCombo(m => Math.max(m, newCombo));
    setHits(h => h + 1);
    setTargets(prev => prev.filter(x => x.id !== t.id));
    onScore(Math.round(pts / 3));
    floatId.current++;
    const fid = floatId.current;
    setFloats(prev => [...prev, { id:fid, x:t.x, y:t.y, pts, gold:t.isGold }]);
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== fid)), 900);
  }, [combo, onScore]);

  useEffect(() => () => { clearInterval(spawnRef.current); clearInterval(timerRef.current); }, []);

  const acc = hits + misses > 0 ? Math.round(hits/(hits+misses)*100) : 0;
  const timePct = (timeLeft/45)*100;

  return (
    <div className="game-fullscreen" style={{"--gc": gameColor}}>
      {phase === "idle" && (
        <div className="game-splash">
          <div className="game-splash-icon">{gameColor && "💀"}</div>
          <h2 className="game-splash-title">{gameName}</h2>
          <p className="game-splash-sub">Hit targets before they vanish. Gold targets = 5× points. Build combos for multipliers.</p>
          <div className="game-splash-stats">
            <div className="gss-item"><span className="gss-val">45s</span><span className="gss-lbl">Match Time</span></div>
            <div className="gss-item"><span className="gss-val">5×</span><span className="gss-lbl">Gold Bonus</span></div>
            <div className="gss-item"><span className="gss-val">∞</span><span className="gss-lbl">Combo Multi</span></div>
          </div>
          <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={start}>▶ START MATCH</button>
        </div>
      )}

      {phase === "playing" && (
        <>
          <div className="game-hud">
            <div className="hud-left">
              <span className="hud-score">{score.toLocaleString()}</span>
              <span className="hud-label">SCORE</span>
            </div>
            <div className="hud-center">
              <div className="hud-timer-bar">
                <div className="hud-timer-fill" style={{width:`${timePct}%`, background: timePct < 30 ? "var(--red)" : gameColor}} />
              </div>
              <span className="hud-time">{timeLeft}s</span>
            </div>
            <div className="hud-right">
              {combo > 1 && <span className="hud-combo" style={{color:gameColor}}>×{combo} COMBO</span>}
              <span className="hud-acc">{acc}% ACC</span>
            </div>
          </div>
          <div ref={areaRef} className="aim-arena" onClick={() => { setMisses(m=>m+1); setCombo(0); }}>
            {targets.map(t => (
              <div key={t.id} className={`aim-blitz-target ${t.isGold?"gold":""}`}
                style={{left:t.x, top:t.y, width:t.size, height:t.size, animationDuration:`${t.life}ms`, "--gc":gameColor}}
                onClick={e => hitTarget(t, e)} />
            ))}
            {floats.map(f => (
              <div key={f.id} className={`float-score ${f.gold?"gold":""}`} style={{left:f.x, top:f.y, color: f.gold?"#ffd700":gameColor}}>
                +{f.pts}
              </div>
            ))}
          </div>
        </>
      )}

      {phase === "result" && (
        <div className="game-result">
          <div className="result-rank" style={{color:gameColor}}>{acc>80?"S":acc>60?"A":acc>40?"B":"C"}</div>
          <div className="result-score">{score.toLocaleString()}</div>
          <div className="result-label">FINAL SCORE</div>
          <div className="result-stats">
            <div className="rs-item"><span style={{color:gameColor}}>{hits}</span><span>Hits</span></div>
            <div className="rs-item"><span style={{color:"var(--red)"}}>{misses}</span><span>Misses</span></div>
            <div className="rs-item"><span style={{color:"var(--green)"}}>{acc}%</span><span>Accuracy</span></div>
            <div className="rs-item"><span style={{color:gameColor}}>×{maxCombo}</span><span>Best Combo</span></div>
          </div>
          <div className="result-actions">
            <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={start}>PLAY AGAIN</button>
            <button className="game-exit-btn" onClick={onExit}>EXIT</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   GAME 2: DODGE BLITZ — "Stellar Drift" / space dodge
═══════════════════════════════════════════════════════ */
function DodgeBlitz({ onScore, onExit, gameName, gameColor }) {
  const [phase,    setPhase]    = useState("idle");
  const [score,    setScore]    = useState(0);
  const [lives,    setLives]    = useState(3);
  const [player,   setPlayer]   = useState({ x:50, y:75 });
  const [bullets,  setBullets]  = useState([]);
  const [stars,    setStars]    = useState([]);
  const [wave,     setWave]     = useState(1);
  const gameRef  = useRef(null);
  const animRef  = useRef(null);
  const stateRef = useRef({ bullets:[], score:0, lives:3, wave:1, active:false });
  const lastSpawn = useRef(0);
  const lastScore = useRef(0);

  const initStars = () => Array.from({length:40}, (_,i) => ({
    id:i, x:Math.random()*100, y:Math.random()*100,
    size:Math.random()*2+.5, speed:0.3+Math.random()*0.8, opacity:Math.random()*.6+.2
  }));

  const start = useCallback(() => {
    stateRef.current = { bullets:[], score:0, lives:3, wave:1, active:true };
    setScore(0); setLives(3); setWave(1);
    setBullets([]); setPlayer({x:50,y:75});
    setStars(initStars()); setPhase("playing");
    lastSpawn.current = 0; lastScore.current = Date.now();
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const handleMove = (e) => {
      if (!gameRef.current) return;
      const rect = gameRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = Math.max(3, Math.min(97, ((clientX - rect.left) / rect.width) * 100));
      const y = Math.max(3, Math.min(97, ((clientY - rect.top)  / rect.height)* 100));
      setPlayer({x, y});
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove",  handleMove, {passive:true});
    return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("touchmove", handleMove); };
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing") return;
    let pPos = {x:50, y:75};
    const unsub = setPlayer.toString; // capture ref
    const getPlayer = () => pPos;
    setPlayer(p => { pPos = p; return p; });

    const loop = (ts) => {
      if (!stateRef.current.active) return;
      const spawnInterval = Math.max(400, 1200 - stateRef.current.wave * 60);
      if (ts - lastSpawn.current > spawnInterval) {
        lastSpawn.current = ts;
        const type = Math.random();
        const newBullet = {
          id: ts + Math.random(),
          x: Math.random() * 90 + 5,
          y: -5,
          vx: (Math.random()-0.5) * (type < 0.3 ? 3 : 1),
          vy: 1.2 + stateRef.current.wave * 0.12 + Math.random() * 0.8,
          size: type < 0.15 ? 4 : type < 0.4 ? 2.5 : 1.8,
          type: type < 0.15 ? "big" : type < 0.4 ? "med" : "small",
          color: type < 0.15 ? "#f87171" : type < 0.4 ? "#fb923c" : "#fbbf24",
        };
        stateRef.current.bullets = [...stateRef.current.bullets, newBullet];
      }
      stateRef.current.bullets = stateRef.current.bullets
        .map(b => ({...b, x:b.x+b.vx*0.4, y:b.y+b.vy*0.4}))
        .filter(b => b.y < 108 && b.x > -5 && b.x < 105);

      // Collision
      setPlayer(p => {
        stateRef.current.bullets.forEach(b => {
          const dist = Math.sqrt((b.x-p.x)**2 + (b.y-p.y)**2);
          if (dist < b.size + 2.5) {
            stateRef.current.lives -= 1;
            stateRef.current.bullets = stateRef.current.bullets.filter(x => x.id !== b.id);
            if (stateRef.current.lives <= 0) {
              stateRef.current.active = false;
              setPhase("result");
            }
            setLives(stateRef.current.lives);
          }
        });
        return p;
      });

      setBullets([...stateRef.current.bullets]);

      // Score over time
      if (Date.now() - lastScore.current > 500) {
        stateRef.current.score += 5;
        setScore(stateRef.current.score);
        onScore(1);
        lastScore.current = Date.now();
      }
      // Wave up
      if (stateRef.current.score > 0 && stateRef.current.score % 200 === 0) {
        stateRef.current.wave = Math.floor(stateRef.current.score / 200) + 1;
        setWave(stateRef.current.wave);
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(animRef.current); stateRef.current.active = false; };
  }, [phase, onScore]);

  return (
    <div className="game-fullscreen" style={{"--gc": gameColor}}>
      {phase === "idle" && (
        <div className="game-splash">
          <div className="game-splash-icon">🚀</div>
          <h2 className="game-splash-title">{gameName}</h2>
          <p className="game-splash-sub">Move your mouse / finger to dodge incoming asteroids. Survive as long as possible. Lives: 3</p>
          <div className="game-splash-stats">
            <div className="gss-item"><span className="gss-val">3</span><span className="gss-lbl">Lives</span></div>
            <div className="gss-item"><span className="gss-val">∞</span><span className="gss-lbl">Waves</span></div>
            <div className="gss-item"><span className="gss-val">+5</span><span className="gss-lbl">Per 0.5s</span></div>
          </div>
          <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={start}>▶ LAUNCH</button>
        </div>
      )}
      {phase === "playing" && (
        <>
          <div className="game-hud">
            <div className="hud-left"><span className="hud-score">{score}</span><span className="hud-label">SCORE</span></div>
            <div className="hud-center"><span className="hud-wave" style={{color:gameColor}}>WAVE {wave}</span></div>
            <div className="hud-right"><span className="hud-lives">{Array.from({length:3},(_,i)=><span key={i} style={{opacity:i<lives?1:.15,fontSize:"1.1rem"}}>🚀</span>)}</span></div>
          </div>
          <div ref={gameRef} className="dodge-arena" style={{cursor:"none"}}>
            {stars.map(s => (
              <div key={s.id} className="dodge-star" style={{left:`${s.x}%`,top:`${s.y}%`,width:s.size,height:s.size,opacity:s.opacity}} />
            ))}
            {bullets.map(b => (
              <div key={b.id} className="dodge-bullet" style={{left:`${b.x}%`,top:`${b.y}%`,width:`${b.size*0.7}%`,height:`${b.size*0.7}%`,background:b.color,boxShadow:`0 0 ${b.size*3}px ${b.color}`}} />
            ))}
            <div className="dodge-player" style={{left:`${player.x}%`,top:`${player.y}%`}}>
              <div className="dp-ship" style={{filter:`drop-shadow(0 0 12px ${gameColor})`}}>🚀</div>
              <div className="dp-shield" style={{borderColor:gameColor}} />
            </div>
          </div>
        </>
      )}
      {phase === "result" && (
        <div className="game-result">
          <div className="result-rank" style={{color:gameColor}}>{score>800?"S":score>500?"A":score>250?"B":"C"}</div>
          <div className="result-score">{score.toLocaleString()}</div>
          <div className="result-label">DISTANCE TRAVELLED</div>
          <div className="result-stats">
            <div className="rs-item"><span style={{color:gameColor}}>{wave}</span><span>Waves</span></div>
            <div className="rs-item"><span style={{color:"var(--red)"}}>{3-lives}</span><span>Deaths</span></div>
          </div>
          <div className="result-actions">
            <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={start}>PLAY AGAIN</button>
            <button className="game-exit-btn" onClick={onExit}>EXIT</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   GAME 3: REFLEX DUEL — "Iron Protocol" / reaction
═══════════════════════════════════════════════════════ */
function ReflexDuel({ onScore, onExit, gameName, gameColor }) {
  const [phase,    setPhase]    = useState("idle");
  const [round,    setRound]    = useState(0);
  const [results,  setResults]  = useState([]);
  const [state,    setState]    = useState("wait"); // wait|draw|shot|early
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const ROUNDS = 5;

  const nextRound = useCallback((r) => {
    setState("wait");
    const delay = 2000 + Math.random() * 3500;
    timerRef.current = setTimeout(() => {
      startRef.current = performance.now();
      setState("draw");
    }, delay);
  }, []);

  const startGame = useCallback(() => {
    setRound(0); setResults([]); setPhase("playing");
    nextRound(0);
  }, [nextRound]);

  const handleShoot = useCallback(() => {
    if (state === "wait") {
      clearTimeout(timerRef.current);
      setState("early");
      setTimeout(() => { const r = round+1; setRound(r); if(r>=ROUNDS){setPhase("result");}else nextRound(r); }, 1200);
      setResults(p => [...p, {ms:-1, label:"EARLY!", color:"var(--red)"}]);
    } else if (state === "draw") {
      const ms = Math.round(performance.now() - startRef.current);
      const label = ms<150?"LEGENDARY":ms<200?"ELITE":ms<280?"FAST":ms<400?"GOOD":"SLOW";
      const color = ms<150?"#ffd700":ms<200?"var(--yellow)":ms<280?"var(--green)":ms<400?"var(--blue)":"var(--white-dim)";
      setResults(p => [...p, {ms, label, color}]);
      onScore(ms<200?60:ms<300?40:ms<500?20:10);
      setState("shot");
      const r = round+1;
      setTimeout(() => { setRound(r); if(r>=ROUNDS){setPhase("result");}else nextRound(r); }, 1000);
    }
  }, [state, round, nextRound, onScore]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const best = results.filter(r=>r.ms>0).length ? Math.min(...results.filter(r=>r.ms>0).map(r=>r.ms)) : null;
  const avg  = results.filter(r=>r.ms>0).length ? Math.round(results.filter(r=>r.ms>0).reduce((a,b)=>a+b.ms,0)/results.filter(r=>r.ms>0).length) : null;

  return (
    <div className="game-fullscreen" style={{"--gc":gameColor}}>
      {phase === "idle" && (
        <div className="game-splash">
          <div className="game-splash-icon">🔥</div>
          <h2 className="game-splash-title">{gameName}</h2>
          <p className="game-splash-sub">5 rounds of reflex duels. Wait for DRAW — then click as fast as possible. Shoot early = penalty!</p>
          <div className="game-splash-stats">
            <div className="gss-item"><span className="gss-val">5</span><span className="gss-lbl">Rounds</span></div>
            <div className="gss-item"><span className="gss-val">150ms</span><span className="gss-lbl">Legendary</span></div>
            <div className="gss-item"><span className="gss-val">500ms</span><span className="gss-lbl">Limit</span></div>
          </div>
          <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={startGame}>▶ DUEL START</button>
        </div>
      )}
      {phase === "playing" && (
        <div className={`reflex-duel-arena ${state}`} onClick={handleShoot} style={{"--gc":gameColor}}>
          <div className="duel-round-dots">
            {Array.from({length:ROUNDS},(_,i)=>(
              <div key={i} className={`duel-dot ${i<round?"done":i===round?"active":""}`} style={i<round?{background:gameColor}:{}} />
            ))}
          </div>
          <div className="duel-center">
            {state==="wait"  && <><div className="duel-icon" style={{opacity:.3}}>🎯</div><div className="duel-msg" style={{color:"var(--white-dim)"}}>STEADY...</div><div className="duel-sub">Wait for the signal</div></>}
            {state==="draw"  && <><div className="duel-icon duel-flash">🔥</div><div className="duel-msg" style={{color:gameColor}}>DRAW!</div><div className="duel-sub">SHOOT NOW!</div></>}
            {state==="shot"  && <><div className="duel-icon">💥</div><div className="duel-msg" style={{color:gameColor}}>{results[results.length-1]?.ms}ms</div><div className="duel-sub" style={{color:results[results.length-1]?.color}}>{results[results.length-1]?.label}</div></>}
            {state==="early" && <><div className="duel-icon">💀</div><div className="duel-msg" style={{color:"var(--red)"}}>TOO EARLY</div><div className="duel-sub">Penalty round</div></>}
          </div>
          <div className="duel-history">
            {results.map((r,i)=>(
              <span key={i} style={{color:r.color,fontFamily:"var(--ff-mono)",fontSize:".7rem",letterSpacing:"2px"}}>
                {r.ms<0?"EARLY":r.ms+"ms"}
              </span>
            ))}
          </div>
        </div>
      )}
      {phase === "result" && (
        <div className="game-result">
          <div className="result-rank" style={{color:gameColor}}>{best&&best<180?"S":best&&best<250?"A":best&&best<400?"B":"C"}</div>
          <div className="result-score">{best ?? "—"}ms</div>
          <div className="result-label">BEST REACTION</div>
          <div className="result-stats">
            <div className="rs-item"><span style={{color:gameColor}}>{best ?? "—"}ms</span><span>Best</span></div>
            <div className="rs-item"><span style={{color:"var(--blue)"}}>{avg ?? "—"}ms</span><span>Average</span></div>
            <div className="rs-item"><span style={{color:"var(--red)"}}>{results.filter(r=>r.ms<0).length}</span><span>Early Shots</span></div>
          </div>
          <div className="result-actions">
            <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={startGame}>REMATCH</button>
            <button className="game-exit-btn" onClick={onExit}>EXIT</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   GAME 4: GHOST MEMORY — "Ghost Weave" / memory
═══════════════════════════════════════════════════════ */
function GhostMemory({ onScore, onExit, gameName, gameColor }) {
  const SIZE  = 4;
  const TOTAL = SIZE * SIZE;
  const [seq,   setSeq]   = useState([]);
  const [input, setInput] = useState([]);
  const [phase, setPhase] = useState("idle");
  const [lit,   setLit]   = useState(null);
  const [level, setLevel] = useState(1);
  const [best,  setBest]  = useState(0);
  const [shake, setShake] = useState(false);

  const startLevel = useCallback((lvl) => {
    const n = lvl + 2;
    const newSeq = Array.from({length:n}, () => Math.floor(Math.random()*TOTAL));
    setSeq(newSeq); setInput([]); setPhase("showing");
    let i = 0;
    const show = () => {
      if (i >= newSeq.length) { setLit(null); setTimeout(() => setPhase("input"), 300); return; }
      setLit(null);
      setTimeout(() => { setLit(newSeq[i]); i++; setTimeout(show, Math.max(350, 600-lvl*15)); }, 200);
    };
    setTimeout(show, 700);
  }, [TOTAL]);

  const handleCell = useCallback((idx) => {
    if (phase !== "input") return;
    const newInput = [...input, idx];
    setInput(newInput);
    if (newInput[newInput.length-1] !== seq[newInput.length-1]) {
      setShake(true); setTimeout(() => setShake(false), 500);
      setPhase("fail"); setBest(b => Math.max(b, level-1));
      return;
    }
    if (newInput.length === seq.length) {
      onScore(level * 25);
      const next = level + 1;
      setLevel(next); setBest(b => Math.max(b, level));
      setTimeout(() => startLevel(next), 900);
    }
  }, [phase, input, seq, level, startLevel, onScore]);

  // Color tiles based on position
  const tileColors = useMemo(() => {
    const hues = [0,30,60,120,180,210,270,300];
    return Array.from({length:TOTAL}, (_,i) => `hsl(${hues[i%hues.length]},70%,55%)`);
  }, [TOTAL]);

  return (
    <div className="game-fullscreen" style={{"--gc":gameColor}}>
      {phase === "idle" && (
        <div className="game-splash">
          <div className="game-splash-icon">👻</div>
          <h2 className="game-splash-title">{gameName}</h2>
          <p className="game-splash-sub">Watch the colour sequence light up — then repeat it perfectly. Gets harder every level.</p>
          <div className="game-splash-stats">
            <div className="gss-item"><span className="gss-val">4×4</span><span className="gss-lbl">Grid</span></div>
            <div className="gss-item"><span className="gss-val">∞</span><span className="gss-lbl">Levels</span></div>
            <div className="gss-item"><span className="gss-val">+25</span><span className="gss-lbl">Per Level</span></div>
          </div>
          <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={() => { setLevel(1); startLevel(1); }}>▶ START</button>
        </div>
      )}
      {(phase !== "idle") && (
        <div className="ghost-memory-wrap">
          <div className="game-hud" style={{position:"relative",padding:"1rem 2rem"}}>
            <div className="hud-left"><span className="hud-score" style={{fontSize:"1.4rem"}}>LVL {level}</span><span className="hud-label">LEVEL</span></div>
            <div className="hud-center">
              <span style={{fontFamily:"var(--ff-mono)",fontSize:".7rem",letterSpacing:"3px",color:
                phase==="showing"?"var(--blue)":phase==="input"?gameColor:phase==="fail"?"var(--red)":"var(--green)"}}>
                {phase==="showing"?"WATCH":phase==="input"?`${input.length}/${seq.length}`:phase==="fail"?"WRONG!":"CORRECT!"}
              </span>
            </div>
            <div className="hud-right"><span className="hud-score" style={{fontSize:"1.4rem"}}>{best}</span><span className="hud-label">BEST</span></div>
          </div>
          <div className={`ghost-grid ${shake?"shake":""}`}>
            {Array.from({length:TOTAL}, (_,i) => (
              <div key={i}
                className={`ghost-cell ${lit===i?"lit":""} ${phase==="input"?"clickable":""} ${phase==="fail"&&input[input.length-1]===i?"wrong":""}`}
                style={{"--tc":tileColors[i]}}
                onClick={() => handleCell(i)}
              />
            ))}
          </div>
          {phase === "fail" && (
            <div style={{textAlign:"center",marginTop:"1.5rem"}}>
              <p style={{color:"var(--white-dim)",marginBottom:"1rem",fontFamily:"var(--ff-mono)",fontSize:".7rem",letterSpacing:"2px"}}>BEST LEVEL: {best} · LEVEL REACHED: {level-1}</p>
              <div style={{display:"flex",gap:"1rem",justifyContent:"center"}}>
                <button className="game-start-btn" style={{background:gameColor,color:"#000",padding:".7rem 1.8rem"}} onClick={() => {setLevel(1);startLevel(1);}}>RETRY</button>
                <button className="game-exit-btn" onClick={onExit}>EXIT</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   GAME 5: MOBA BRAWL — "Arcane Uprising" / tap brawler
═══════════════════════════════════════════════════════ */
function MobaBrawl({ onScore, onExit, gameName, gameColor }) {
  const [phase,   setPhase]   = useState("idle");
  const [hp,      setHp]      = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);
  const [score,   setScore]   = useState(0);
  const [combo,   setCombo]   = useState(0);
  const [wave,    setWave]    = useState(1);
  const [log,     setLog]     = useState([]);
  const [cooldowns, setCooldowns] = useState({q:0,w:0,e:0,r:0});
  const [effects, setEffects] = useState({shield:false,rage:false,stun:false});
  const [anim,    setAnim]    = useState(null);
  const timerRef = useRef(null);
  const cdRef    = useRef(null);
  const logId    = useRef(0);

  const addLog = useCallback((msg, color="#fff") => {
    logId.current++;
    const id = logId.current;
    setLog(p => [...p.slice(-4), {id, msg, color}]);
    setTimeout(() => setLog(p => p.filter(l => l.id !== id)), 2500);
  }, []);

  const enemyAttack = useCallback(() => {
    setEffects(ef => {
      if (ef.stun) { addLog("Enemy stunned! No damage.", "var(--yellow)"); return ef; }
      const dmg = ef.shield ? Math.floor((8 + Math.random()*6)/2) : Math.floor(8 + Math.random()*6 + wave*1.5);
      setHp(h => {
        const newHp = Math.max(0, h - dmg);
        if (newHp <= 0) { setPhase("result"); }
        return newHp;
      });
      addLog(`Enemy hits you for ${dmg}${ef.shield?" (blocked half)":""}!`, "var(--red)");
      return ef;
    });
  }, [wave, addLog]);

  const attack = useCallback((ability) => {
    if (phase !== "playing") return;
    const now = Date.now();
    if (cooldowns[ability] > now) return;

    const configs = {
      q: {name:"Quick Strike", dmg:[12,18], cd:800,   color:"var(--yellow)", emoji:"⚡"},
      w: {name:"Power Slash",  dmg:[25,35], cd:2500,  color:"var(--orange)", emoji:"🔥"},
      e: {name:"Barrier",      dmg:[0,0],   cd:4000,  color:"var(--blue)",   emoji:"🛡️", shield:true},
      r: {name:"ULTIMATE",     dmg:[55,80], cd:8000,  color:"var(--violet)", emoji:"💥", rage:true},
    };
    const cfg = configs[ability];
    const dmg = Math.floor(cfg.dmg[0] + Math.random()*(cfg.dmg[1]-cfg.dmg[0]));
    const newCombo = ability === "q" ? combo + 1 : combo;
    const finalDmg = Math.floor(dmg * (1 + newCombo * 0.05 + (effects.rage ? 0.5 : 0)));
    setCombo(ability === "q" ? newCombo : 0);

    if (cfg.shield) {
      setEffects(ef => ({...ef, shield:true}));
      setTimeout(() => setEffects(ef => ({...ef, shield:false})), 3000);
      addLog("Barrier active! Damage halved for 3s.", cfg.color);
    } else if (cfg.rage) {
      setEffects(ef => ({...ef, rage:true}));
      setTimeout(() => setEffects(ef => ({...ef, rage:false})), 4000);
      addLog(`ULTIMATE! ${finalDmg} damage + RAGE MODE!`, cfg.color);
    } else {
      addLog(`${cfg.emoji} ${cfg.name}: ${finalDmg} damage!${newCombo>1?` (×${newCombo} combo)`:""}`, cfg.color);
    }

    if (finalDmg > 0) {
      setAnim(ability);
      setTimeout(() => setAnim(null), 300);
      setEnemyHp(h => {
        const newHp = Math.max(0, h - finalDmg);
        if (newHp <= 0) {
          const pts = wave * 100 + newCombo * 20;
          setScore(s => s + pts);
          onScore(Math.floor(pts/5));
          addLog(`Wave ${wave} cleared! +${pts} pts`, "var(--green)");
          const nextWave = wave + 1;
          setWave(nextWave);
          setEnemyHp(Math.min(100, 60 + nextWave * 8));
          setEffects(ef => ({...ef, stun:true}));
          setTimeout(() => setEffects(ef => ({...ef, stun:false})), 500);
        }
        return newHp;
      });
    }

    setCooldowns(cd => ({...cd, [ability]: now + cfg.cd}));
    setTimeout(() => setCooldowns(cd => ({...cd, [ability]: 0})), cfg.cd);

    // Enemy counterattack
    setTimeout(enemyAttack, 600 + Math.random()*400);
  }, [phase, cooldowns, combo, effects, wave, enemyAttack, addLog, onScore]);

  const startGame = () => {
    setHp(100); setEnemyHp(100); setScore(0); setCombo(0);
    setWave(1); setLog([]); setCooldowns({q:0,w:0,e:0,r:0});
    setEffects({shield:false,rage:false,stun:false}); setPhase("playing");
  };

  const AbilityBtn = ({key:k, id, label, emoji, color, cd:cdTime}) => {
    const onCd = cooldowns[id] > Date.now();
    return (
      <button key={k} className={`moba-btn ${onCd?"on-cd":""}`}
        style={{"--ac":color, "--gc":gameColor}} onClick={() => attack(id)}>
        <span className="moba-btn-emoji">{emoji}</span>
        <span className="moba-btn-label">{label}</span>
        <span className="moba-btn-key">{id.toUpperCase()}</span>
        {onCd && <div className="moba-cd-overlay" />}
      </button>
    );
  };

  return (
    <div className="game-fullscreen" style={{"--gc":gameColor}}>
      {phase === "idle" && (
        <div className="game-splash">
          <div className="game-splash-icon">⚡</div>
          <h2 className="game-splash-title">{gameName}</h2>
          <p className="game-splash-sub">Tap abilities to attack enemies. Build combo with Q. Use W/E/R strategically. Defeat waves to score.</p>
          <div className="game-splash-stats">
            <div className="gss-item"><span className="gss-val">Q</span><span className="gss-lbl">Quick Strike</span></div>
            <div className="gss-item"><span className="gss-val">W</span><span className="gss-lbl">Power Slash</span></div>
            <div className="gss-item"><span className="gss-val">R</span><span className="gss-lbl">Ultimate</span></div>
          </div>
          <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={startGame}>▶ ENTER ARENA</button>
        </div>
      )}
      {phase === "playing" && (
        <div className="moba-arena">
          {/* HP bars */}
          <div className="moba-hp-row">
            <div className="moba-hp-block">
              <div className="moba-hp-label">YOU</div>
              <div className="moba-hp-bar-wrap">
                <div className="moba-hp-bar" style={{width:`${hp}%`, background:hp>50?"var(--green)":hp>25?"var(--orange)":"var(--red)"}} />
              </div>
              <div className="moba-hp-num">{hp}</div>
            </div>
            <div className="moba-vs">⚡</div>
            <div className="moba-hp-block" style={{textAlign:"right"}}>
              <div className="moba-hp-label">WAVE {wave}</div>
              <div className="moba-hp-bar-wrap">
                <div className="moba-hp-bar" style={{width:`${enemyHp}%`, background:"var(--red)", marginLeft:"auto"}} />
              </div>
              <div className="moba-hp-num">{enemyHp}</div>
            </div>
          </div>

          {/* Battle field */}
          <div className="moba-field">
            <div className={`moba-char player-char ${anim?"hit":""} ${effects.rage?"rage":""} ${effects.shield?"shielded":""}`}>
              <div className="mc-emoji">🧙</div>
              {effects.shield && <div className="mc-shield-ring" style={{borderColor:gameColor}}/>}
              {effects.rage && <div className="mc-rage-glow" style={{background:`${gameColor}22`}}/>}
              {combo>2 && <div className="mc-combo-badge" style={{background:gameColor}}>×{combo}</div>}
            </div>
            <div className="moba-clash">
              {log.slice(-1).map(l => <div key={l.id} className="clash-float" style={{color:l.color}}>{l.msg}</div>)}
            </div>
            <div className={`moba-char enemy-char ${effects.stun?"stunned":""}`}>
              <div className="mc-emoji">{wave>4?"🐉":wave>2?"👹":"👾"}</div>
              {effects.stun && <div className="mc-stun-stars">⭐⭐⭐</div>}
            </div>
          </div>

          {/* Score & combo */}
          <div style={{textAlign:"center",padding:".5rem",fontFamily:"var(--ff-display)",fontSize:"1.4rem",color:gameColor}}>{score.toLocaleString()} PTS</div>

          {/* Ability buttons */}
          <div className="moba-abilities">
            <AbilityBtn id="q" label="Quick" emoji="⚡" color="var(--yellow)" />
            <AbilityBtn id="w" label="Slash" emoji="🔥" color="var(--orange)" />
            <AbilityBtn id="e" label="Shield" emoji="🛡️" color="var(--blue)" />
            <AbilityBtn id="r" label="ULTI" emoji="💥" color={gameColor} />
          </div>
        </div>
      )}
      {phase === "result" && (
        <div className="game-result">
          <div className="result-rank" style={{color:gameColor}}>{wave>6?"S":wave>4?"A":wave>2?"B":"C"}</div>
          <div className="result-score">{score.toLocaleString()}</div>
          <div className="result-label">BATTLE SCORE</div>
          <div className="result-stats">
            <div className="rs-item"><span style={{color:gameColor}}>{wave-1}</span><span>Waves Cleared</span></div>
            <div className="rs-item"><span style={{color:"var(--red)"}}>{hp <= 0 ? "Defeated" : "Victory"}</span><span>Outcome</span></div>
          </div>
          <div className="result-actions">
            <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={startGame}>REMATCH</button>
            <button className="game-exit-btn" onClick={onExit}>EXIT</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   GAME LAUNCHER MODAL
═══════════════════════════════════════════════════════ */
export function GameModal({ gameId, onClose }) {
  const meta = PLAYABLE_GAMES[gameId];
  if (!meta) return null;

  const [started, setStarted] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const addScore = useCallback(n => setSessionScore(s => s+n), []);

  const GameComponent = {
    aim:    AimBlitz,
    dodge:  DodgeBlitz,
    reflex: ReflexDuel,
    memory: GhostMemory,
    moba:   MobaBrawl,
    rpg:    GhostMemory,   // fallback
    race:   AimBlitz,      // fallback
    tower:  MobaBrawl,     // fallback
    fight:  ReflexDuel,    // fallback
  }[meta.mode];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="game-modal-overlay" onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
      <div className="game-modal">
        <div className="game-modal-header" style={{borderColor:`${meta.color}33`}}>
          <div style={{display:"flex",alignItems:"center",gap:".8rem"}}>
            <span style={{fontSize:"1.5rem"}}>{meta.icon}</span>
            <div>
              <div style={{fontFamily:"var(--ff-display)",fontSize:"1.3rem",letterSpacing:".5px"}}>{meta.name}</div>
              <div style={{fontFamily:"var(--ff-mono)",fontSize:".52rem",letterSpacing:"3px",color:"var(--white-dim)",textTransform:"uppercase"}}>
                {meta.mode.toUpperCase()} MODE
              </div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
            {sessionScore > 0 && (
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"var(--ff-display)",fontSize:"1.3rem",color:meta.color,lineHeight:1}}>{sessionScore}</div>
                <div style={{fontFamily:"var(--ff-mono)",fontSize:".48rem",letterSpacing:"2px",color:"var(--white-dim)"}}>SESSION PTS</div>
              </div>
            )}
            <button className="game-modal-close" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="game-modal-body">
          <GameComponent onScore={addScore} onExit={onClose} gameName={meta.name} gameColor={meta.color} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ARCADE PAGE — standalone /arcade route
═══════════════════════════════════════════════════════ */
const ARCADE_GAMES = [
  { id:1,  mode:"aim",    name:"Nexus Storm",     desc:"Hit targets before they vanish. Gold targets = 5× bonus.",          icon:"💀", color:"#e8ff4d", tags:["FPS","Reaction"] },
  { id:3,  mode:"dodge",  name:"Stellar Drift",   desc:"Dodge asteroids with your mouse. Survive wave after wave.",          icon:"🚀", color:"#4fb7dd", tags:["Dodge","Survival"] },
  { id:4,  mode:"reflex", name:"Iron Protocol",   desc:"5-round reflex duel. Wait for DRAW then shoot as fast as you can.",  icon:"🔥", color:"#f87171", tags:["Reflex","Duel"] },
  { id:5,  mode:"memory", name:"Ghost Weave",     desc:"Coloured memory grid. Watch, memorise, repeat. Level up endlessly.", icon:"👻", color:"#4ade80", tags:["Memory","Strategy"] },
  { id:6,  mode:"moba",   name:"Arcane Uprising", desc:"Tap-to-attack MOBA brawler. Build combos, use ultimates, win.",      icon:"⚡", color:"#a78bfa", tags:["MOBA","Combat"] },
];

export default function Arcade() {
  const [activeGame, setActiveGame] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const addScore = useCallback(n => setTotalScore(s => s+n), []);

  return (
    <main style={{paddingTop:"8rem",paddingBottom:"6rem",minHeight:"100vh"}}>
      <div className="container">

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:"1.5rem",marginBottom:"3rem"}}>
          <div>
            <span className="section-tag">Mini Arcade</span>
            <h1 style={{fontFamily:"var(--ff-display)",fontSize:"clamp(3rem,8vw,6rem)",textTransform:"uppercase",letterSpacing:"-2px",lineHeight:.92}}>
              Test Your<br /><span className="clip-text">Skills</span>
            </h1>
            <p style={{color:"var(--white-dim)",marginTop:"1rem",maxWidth:480,lineHeight:1.75,fontSize:".93rem"}}>
              Five fully playable browser games — no download, no login. Pure skill, pure competition.
            </p>
          </div>
          {totalScore > 0 && (
            <div className="arcade-score-badge">
              <div style={{fontFamily:"var(--ff-mono)",fontSize:".52rem",letterSpacing:"3px",color:"var(--white-dim)",marginBottom:".3rem"}}>SESSION SCORE</div>
              <div style={{fontFamily:"var(--ff-display)",fontSize:"2.8rem",lineHeight:1,background:"linear-gradient(135deg,var(--yellow),var(--blue))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{totalScore.toLocaleString()}</div>
            </div>
          )}
        </div>

        {/* Game cards grid */}
        <div className="arcade-cards-grid">
          {ARCADE_GAMES.map(g => (
            <div key={g.id} className="arcade-card" style={{"--gc":g.color}}>
              <div className="arcade-card-top" style={{background:`radial-gradient(ellipse 80% 80% at 50% 30%, ${g.color}18, transparent)`}}>
                <div className="arcade-card-icon">{g.icon}</div>
                <div className="arcade-card-tags">
                  {g.tags.map(t => <span key={t} className="arcade-card-tag">{t}</span>)}
                </div>
              </div>
              <div className="arcade-card-body">
                <h3 className="arcade-card-title">{g.name}</h3>
                <p className="arcade-card-desc">{g.desc}</p>
                <button className="arcade-card-btn" style={{background:g.color,color:"#000"}}
                  onClick={() => setActiveGame(g.id)}>
                  ▶ Play Now
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={{textAlign:"center",marginTop:"4rem"}}>
          <Link to="/games" className="btn-outline">Browse Full Game Library →</Link>
        </div>
      </div>

      {/* Game Modal */}
      {activeGame && (
        <GameModal gameId={activeGame} onClose={() => setActiveGame(null)} />
      )}
    </main>
  );
}
