import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

/* ─── GAME REGISTRY ─── */
export const PLAYABLE_GAMES = {
  1: { mode:"battle", name:"Nexus Storm",     color:"#e8ff4d", icon:"💀" },
  2: { mode:"rpg",    name:"Void Realm",      color:"#7c4dff", icon:"🗡️" },
  3: { mode:"dodge",  name:"Stellar Drift",   color:"#4fb7dd", icon:"🚀" },
  4: { mode:"sniper", name:"Iron Protocol",   color:"#f87171", icon:"🔥" },
  5: { mode:"stealth",name:"Ghost Weave",     color:"#4ade80", icon:"👻" },
  6: { mode:"moba",   name:"Arcane Uprising", color:"#a78bfa", icon:"⚡" },
  7: { mode:"race",   name:"Volt Strike",     color:"#fb923c", icon:"🏎️" },
  8: { mode:"tower",  name:"Rift Breaker",    color:"#22d3ee", icon:"🌌" },
  9: { mode:"fight",  name:"Shadow Court",    color:"#f472b6", icon:"🥋" },
};

/* ─────────────────────────────────────────────────
   GAME 1 · BATTLE GRID — "Nexus Storm"
   Minesweeper-style reveal + aim combo
──────────────────────────────────────────────────*/
function BattleGrid({ onScore, onExit, gameName, gameColor }) {
  const COLS=8, ROWS=6, MINES=10;
  const [board,    setBoard]    = useState(null);
  const [phase,    setPhase]    = useState("idle"); // idle|playing|won|dead
  const [flags,    setFlags]    = useState(new Set());
  const [revealed, setRevealed] = useState(new Set());
  const [score,    setScore]    = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const timerRef = useRef(null);

  const buildBoard = useCallback(() => {
    const cells = Array.from({length:COLS*ROWS},(_,i)=>({id:i,mine:false,num:0}));
    let placed=0;
    while(placed<MINES){
      const i=Math.floor(Math.random()*cells.length);
      if(!cells[i].mine){cells[i].mine=true;placed++;}
    }
    cells.forEach((c,i)=>{
      if(c.mine) return;
      const r=Math.floor(i/COLS),col=i%COLS;
      let n=0;
      for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
        const nr=r+dr,nc=col+dc;
        if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS&&cells[nr*COLS+nc].mine) n++;
      }
      c.num=n;
    });
    return cells;
  }, [COLS,ROWS,MINES]);

  const floodFill = useCallback((board, startId, rev) => {
    const stack=[startId]; const visited=new Set(rev);
    while(stack.length){
      const id=stack.pop();
      if(visited.has(id)) continue;
      visited.add(id);
      const cell=board[id];
      if(!cell.mine && cell.num===0){
        const r=Math.floor(id/COLS),c=id%COLS;
        for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
          const nr=r+dr,nc=c+dc;
          if(nr>=0&&nr<ROWS&&nc>=0&&nc<COLS) stack.push(nr*COLS+nc);
        }
      }
    }
    return visited;
  }, [COLS,ROWS]);

  const start = () => {
    const b=buildBoard(); setBoard(b);
    setRevealed(new Set()); setFlags(new Set());
    setScore(0); setTimeLeft(120); setPhase("playing");
    timerRef.current=setInterval(()=>{
      setTimeLeft(t=>{
        if(t<=1){clearInterval(timerRef.current);setPhase("won");return 0;}
        return t-1;
      });
    },1000);
  };

  const reveal = useCallback((id) => {
    if(phase!=="playing") return;
    if(flags.has(id)||revealed.has(id)) return;
    const cell=board[id];
    if(cell.mine){
      clearInterval(timerRef.current);
      setRevealed(new Set([...revealed,id]));
      setPhase("dead"); return;
    }
    const newRev = cell.num===0 ? floodFill(board,id,revealed) : new Set([...revealed,id]);
    setRevealed(newRev);
    const pts = cell.num===0?15:cell.num*8;
    setScore(s=>s+pts); onScore(Math.floor(pts/3));
    const safe=COLS*ROWS-MINES;
    if(newRev.size>=safe){clearInterval(timerRef.current);setPhase("won");}
  }, [phase,flags,revealed,board,floodFill,COLS,ROWS,MINES,onScore]);

  const flag = useCallback((e,id) => {
    e.preventDefault();
    if(phase!=="playing"||revealed.has(id)) return;
    setFlags(f=>{const nf=new Set(f); nf.has(id)?nf.delete(id):nf.add(id); return nf;});
  }, [phase,revealed]);

  useEffect(()=>()=>clearInterval(timerRef.current),[]);

  const NUM_COLORS=["","#4fb7dd","#4ade80","#f87171","#a78bfa","#fb923c","#22d3ee","#f472b6","#ffd700"];

  return (
    <div className="game-fullscreen" style={{"--gc":gameColor}}>
      {phase==="idle" && (
        <div className="game-splash">
          <div className="game-splash-icon">💀</div>
          <h2 className="game-splash-title">{gameName}</h2>
          <p className="game-splash-sub">Clear the minefield. Right-click / long-press to flag mines. Reveal all safe cells to win. You have 2 minutes.</p>
          <div className="game-splash-stats">
            <div className="gss-item"><span className="gss-val">{MINES}</span><span className="gss-lbl">Mines</span></div>
            <div className="gss-item"><span className="gss-val">2:00</span><span className="gss-lbl">Time Limit</span></div>
            <div className="gss-item"><span className="gss-val">8×6</span><span className="gss-lbl">Grid</span></div>
          </div>
          <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={start}>▶ DROP IN</button>
        </div>
      )}
      {(phase==="playing"||phase==="won"||phase==="dead") && (
        <>
          <div className="game-hud">
            <div className="hud-left"><span className="hud-score">{score}</span><span className="hud-label">SCORE</span></div>
            <div className="hud-center"><span className="hud-time" style={{color:timeLeft<30?"var(--red)":gameColor}}>{Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,"0")}</span></div>
            <div className="hud-right"><span className="hud-score">{MINES-flags.size}</span><span className="hud-label">MINES LEFT</span></div>
          </div>
          <div className="battle-grid-wrap">
            <div className="battle-grid" style={{gridTemplateColumns:`repeat(${COLS},1fr)`}}>
              {board && board.map((cell,i)=>{
                const isRev=revealed.has(i), isFlagged=flags.has(i);
                const isDead=phase==="dead"&&cell.mine;
                return (
                  <div key={i}
                    className={`bg-cell ${isRev?"rev":""} ${isDead?"mine":""} ${isFlagged?"flagged":""}`}
                    style={isRev&&cell.num>0?{color:NUM_COLORS[cell.num]}:{}}
                    onClick={()=>reveal(i)}
                    onContextMenu={e=>flag(e,i)}
                  >
                    {isDead?"💥":isFlagged&&!isRev?"🚩":isRev?(cell.mine?"💣":cell.num||""):""}
                  </div>
                );
              })}
            </div>
          </div>
          {(phase==="won"||phase==="dead") && (
            <div className="bg-overlay">
              <div className="result-rank" style={{color:gameColor}}>{phase==="won"?(score>400?"S":score>250?"A":"B"):"C"}</div>
              <div className="result-score">{score}</div>
              <div className="result-label">{phase==="won"?"FIELD CLEARED":"MINE HIT"}</div>
              <div className="result-actions" style={{marginTop:"1rem"}}>
                <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={start}>REDEPLOY</button>
                <button className="game-exit-btn" onClick={onExit}>EXIT</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   GAME 2 · WORD CIPHER — "Ghost Weave" (Stealth)
   Decode codewords under time pressure
──────────────────────────────────────────────────*/
const CIPHER_WORDS = [
  {word:"NEXUS",hint:"The gaming platform you're on"},
  {word:"GHOST",hint:"Invisible operative"},
  {word:"BLADE",hint:"Sharp edged weapon"},
  {word:"STORM",hint:"Violent weather event"},
  {word:"PIXEL",hint:"Smallest screen unit"},
  {word:"QUEST",hint:"A heroic journey or mission"},
  {word:"POWER",hint:"Strength or energy source"},
  {word:"LASER",hint:"Concentrated light beam"},
  {word:"ARENA",hint:"Battle or competition ground"},
  {word:"STACK",hint:"Pile of items on top"},
  {word:"DRIFT",hint:"Float or move sideways"},
  {word:"FORGE",hint:"Create with fire and metal"},
  {word:"VAULT",hint:"Jump over or secure storage"},
  {word:"PRIME",hint:"First in quality or number"},
  {word:"SONIC",hint:"Relating to sound or speed"},
];

function WordCipher({ onScore, onExit, gameName, gameColor }) {
  const [phase,    setPhase]    = useState("idle");
  const [idx,      setIdx]      = useState(0);
  const [guess,    setGuess]    = useState("");
  const [feedback, setFeedback] = useState(null); // null|"hit"|"miss"
  const [score,    setScore]    = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [solved,   setSolved]   = useState(0);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const WORDS = CIPHER_WORDS.slice(0, 12);

  const encode = (word) => {
    return word.split("").map((c,i)=>{
      const code = ((c.charCodeAt(0)-65+13)%26)+65;
      return String.fromCharCode(code);
    }).join(" ");
  };

  const startGame = () => {
    const shuffled=[...WORDS].sort(()=>Math.random()-.5);
    setIdx(0); setGuess(""); setScore(0);
    setSolved(0); setFeedback(null); setPhase("playing");
    setTimeLeft(90);
    timerRef.current=setInterval(()=>{
      setTimeLeft(t=>{
        if(t<=1){clearInterval(timerRef.current);setPhase("result");return 0;}
        return t-1;
      });
    },1000);
    setTimeout(()=>inputRef.current?.focus(),100);
  };

  const handleGuess = () => {
    if(!guess.trim()) return;
    const current = WORDS[idx % WORDS.length];
    if(guess.trim().toUpperCase()===current.word){
      const pts=timeLeft>60?80:timeLeft>30?60:40;
      setScore(s=>s+pts); onScore(Math.floor(pts/4));
      setSolved(s=>s+1); setFeedback("hit");
      setTimeout(()=>{setFeedback(null);setGuess("");setIdx(i=>i+1);inputRef.current?.focus();},600);
    } else {
      setFeedback("miss");
      setTimeout(()=>{setFeedback(null);setGuess("");},500);
    }
  };

  useEffect(()=>()=>clearInterval(timerRef.current),[]);

  const current = WORDS[idx % WORDS.length];

  return (
    <div className="game-fullscreen" style={{"--gc":gameColor}}>
      {phase==="idle" && (
        <div className="game-splash">
          <div className="game-splash-icon">👻</div>
          <h2 className="game-splash-title">{gameName}</h2>
          <p className="game-splash-sub">Decode the ROT-13 cipher. Each letter shifted 13 places. Solve as many words as you can in 90 seconds.</p>
          <div className="game-splash-stats">
            <div className="gss-item"><span className="gss-val">ROT13</span><span className="gss-lbl">Cipher</span></div>
            <div className="gss-item"><span className="gss-val">90s</span><span className="gss-lbl">Time Limit</span></div>
            <div className="gss-item"><span className="gss-val">+80</span><span className="gss-lbl">Early Bonus</span></div>
          </div>
          <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={startGame}>▶ DECRYPT</button>
        </div>
      )}
      {phase==="playing" && (
        <div className="cipher-wrap">
          <div className="game-hud">
            <div className="hud-left"><span className="hud-score">{score}</span><span className="hud-label">SCORE</span></div>
            <div className="hud-center">
              <div className="hud-timer-bar"><div className="hud-timer-fill" style={{width:`${(timeLeft/90)*100}%`,background:timeLeft<20?"var(--red)":gameColor}}/></div>
              <span className="hud-time" style={{color:timeLeft<20?"var(--red)":"inherit"}}>{timeLeft}s</span>
            </div>
            <div className="hud-right"><span className="hud-score">{solved}</span><span className="hud-label">SOLVED</span></div>
          </div>
          <div className="cipher-body">
            <div className="cipher-code">{encode(current.word)}</div>
            <div className="cipher-hint">💡 {current.hint}</div>
            <div className={`cipher-input-wrap ${feedback||""}`}>
              <input
                ref={inputRef}
                className="cipher-input"
                value={guess}
                onChange={e=>setGuess(e.target.value.toUpperCase())}
                onKeyDown={e=>e.key==="Enter"&&handleGuess()}
                maxLength={8}
                placeholder="TYPE YOUR ANSWER"
                autoComplete="off"
                style={{color:gameColor}}
              />
              <button className="cipher-submit" style={{background:gameColor,color:"#000"}} onClick={handleGuess}>→</button>
            </div>
            {feedback==="hit"  && <div className="cipher-feedback hit" style={{color:gameColor}}>✓ DECRYPTED!</div>}
            {feedback==="miss" && <div className="cipher-feedback miss">✗ WRONG CODE</div>}
            <div className="cipher-alpha">
              {Array.from({length:26},(_,i)=>{
                const from=String.fromCharCode(65+i);
                const to=String.fromCharCode((i+13)%26+65);
                return <span key={i} className="alpha-pair"><b>{from}</b>→{to}</span>;
              })}
            </div>
          </div>
        </div>
      )}
      {phase==="result" && (
        <div className="game-result">
          <div className="result-rank" style={{color:gameColor}}>{solved>=10?"S":solved>=7?"A":solved>=4?"B":"C"}</div>
          <div className="result-score">{score}</div>
          <div className="result-label">INTEL DECODED</div>
          <div className="result-stats">
            <div className="rs-item"><span style={{color:gameColor}}>{solved}</span><span>Decoded</span></div>
            <div className="rs-item"><span style={{color:"var(--blue)"}}>{WORDS.length-solved}</span><span>Missed</span></div>
          </div>
          <div className="result-actions">
            <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={startGame}>RETRY</button>
            <button className="game-exit-btn" onClick={onExit}>EXIT</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   GAME 3 · DODGE BLITZ — "Stellar Drift"
──────────────────────────────────────────────────*/
function DodgeBlitz({ onScore, onExit, gameName, gameColor }) {
  const [phase,   setPhase]   = useState("idle");
  const [score,   setScore]   = useState(0);
  const [lives,   setLives]   = useState(3);
  const [wave,    setWave]    = useState(1);
  const [player,  setPlayer]  = useState({x:50,y:75});
  const [bullets, setBullets] = useState([]);
  const [powerups,setPowerups]= useState([]);
  const [shield,  setShield]  = useState(false);
  const gameRef   = useRef(null);
  const stateRef  = useRef({bullets:[],powerups:[],score:0,lives:3,wave:1,active:false,shield:false});
  const animRef   = useRef(null);
  const lastSpawn = useRef(0);
  const lastPow   = useRef(0);
  const lastScore = useRef(0);
  const pidRef    = useRef(0);

  const start = useCallback(()=>{
    stateRef.current={bullets:[],powerups:[],score:0,lives:3,wave:1,active:true,shield:false};
    setScore(0);setLives(3);setWave(1);setPlayer({x:50,y:75});
    setBullets([]);setPowerups([]);setShield(false);setPhase("playing");
    lastSpawn.current=0;lastPow.current=0;lastScore.current=Date.now();
  },[]);

  useEffect(()=>{
    if(phase!=="playing") return;
    const move=e=>{
      if(!gameRef.current) return;
      const r=gameRef.current.getBoundingClientRect();
      const cx=e.touches?e.touches[0].clientX:e.clientX;
      const cy=e.touches?e.touches[0].clientY:e.clientY;
      setPlayer({x:Math.max(3,Math.min(97,(cx-r.left)/r.width*100)),y:Math.max(3,Math.min(97,(cy-r.top)/r.height*100))});
    };
    window.addEventListener("mousemove",move);
    window.addEventListener("touchmove",move,{passive:true});
    return()=>{window.removeEventListener("mousemove",move);window.removeEventListener("touchmove",move);};
  },[phase]);

  useEffect(()=>{
    if(phase!=="playing") return;
    const loop=ts=>{
      if(!stateRef.current.active) return;
      const si=Math.max(350,1000-stateRef.current.wave*45);
      if(ts-lastSpawn.current>si){
        lastSpawn.current=ts;
        const t=Math.random();
        pidRef.current++;
        stateRef.current.bullets=[...stateRef.current.bullets,{
          id:pidRef.current,x:Math.random()*90+5,y:-5,
          vx:(Math.random()-.5)*(t<.25?2.5:.8),
          vy:1.1+stateRef.current.wave*.1+Math.random()*.7,
          size:t<.12?5:t<.35?2.8:1.8,
          type:t<.12?"big":t<.35?"med":"small",
          color:t<.12?"#f87171":t<.35?"#fb923c":"#fbbf24",
        }];
      }
      if(ts-lastPow.current>8000){
        lastPow.current=ts; pidRef.current++;
        stateRef.current.powerups=[...stateRef.current.powerups,{
          id:pidRef.current,x:Math.random()*80+10,y:-5,vy:.4,type:"shield"
        }];
      }
      stateRef.current.bullets=stateRef.current.bullets.map(b=>({...b,x:b.x+b.vx*.35,y:b.y+b.vy*.35})).filter(b=>b.y<108&&b.x>-5&&b.x<105);
      stateRef.current.powerups=stateRef.current.powerups.map(p=>({...p,y:p.y+p.vy*.35})).filter(p=>p.y<108);

      setPlayer(p=>{
        stateRef.current.bullets.forEach(b=>{
          const d=Math.sqrt((b.x-p.x)**2+(b.y-p.y)**2);
          if(d<b.size+2.2&&!stateRef.current.shield){
            stateRef.current.bullets=stateRef.current.bullets.filter(x=>x.id!==b.id);
            stateRef.current.lives--;
            setLives(stateRef.current.lives);
            if(stateRef.current.lives<=0){stateRef.current.active=false;setPhase("result");}
          }
        });
        stateRef.current.powerups.forEach(pu=>{
          const d=Math.sqrt((pu.x-p.x)**2+(pu.y-p.y)**2);
          if(d<6){
            stateRef.current.powerups=stateRef.current.powerups.filter(x=>x.id!==pu.id);
            stateRef.current.shield=true; setShield(true);
            onScore(30);
            setTimeout(()=>{stateRef.current.shield=false;setShield(false);},5000);
          }
        });
        return p;
      });
      setBullets([...stateRef.current.bullets]);
      setPowerups([...stateRef.current.powerups]);
      if(Date.now()-lastScore.current>400){
        stateRef.current.score+=4; setScore(stateRef.current.score); onScore(1);
        lastScore.current=Date.now();
      }
      if(stateRef.current.score>0&&stateRef.current.score%300===0){
        stateRef.current.wave=Math.floor(stateRef.current.score/300)+1; setWave(stateRef.current.wave);
      }
      animRef.current=requestAnimationFrame(loop);
    };
    animRef.current=requestAnimationFrame(loop);
    return()=>{cancelAnimationFrame(animRef.current);stateRef.current.active=false;};
  },[phase,onScore]);

  return (
    <div className="game-fullscreen" style={{"--gc":gameColor}}>
      {phase==="idle"&&(
        <div className="game-splash">
          <div className="game-splash-icon">🚀</div>
          <h2 className="game-splash-title">{gameName}</h2>
          <p className="game-splash-sub">Move your cursor / finger to dodge asteroids. Collect 🛡️ shields for 5s invincibility. Waves intensify every 300pts.</p>
          <div className="game-splash-stats">
            <div className="gss-item"><span className="gss-val">3</span><span className="gss-lbl">Lives</span></div>
            <div className="gss-item"><span className="gss-val">∞</span><span className="gss-lbl">Waves</span></div>
            <div className="gss-item"><span className="gss-val">🛡️</span><span className="gss-lbl">Power-ups</span></div>
          </div>
          <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={start}>▶ LAUNCH</button>
        </div>
      )}
      {phase==="playing"&&(
        <>
          <div className="game-hud">
            <div className="hud-left"><span className="hud-score">{score}</span><span className="hud-label">SCORE</span></div>
            <div className="hud-center"><span className="hud-wave" style={{color:gameColor}}>WAVE {wave}</span>{shield&&<span style={{fontFamily:"var(--ff-mono)",fontSize:".58rem",color:"var(--blue)",letterSpacing:"2px",marginTop:".2rem"}}>🛡️ SHIELD</span>}</div>
            <div className="hud-right"><span className="hud-lives">{Array.from({length:3},(_,i)=><span key={i} style={{opacity:i<lives?1:.15,fontSize:"1rem"}}>🚀</span>)}</span></div>
          </div>
          <div ref={gameRef} className="dodge-arena" style={{cursor:"none",flex:1}}>
            {Array.from({length:40},(_,i)=>(
              <div key={i} className="dodge-star" style={{left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,width:Math.random()*2+.5,height:Math.random()*2+.5,opacity:Math.random()*.5+.1,position:"absolute",borderRadius:"50%",background:"white",pointerEvents:"none"}}/>
            ))}
            {bullets.map(b=>(
              <div key={b.id} className="dodge-bullet" style={{left:`${b.x}%`,top:`${b.y}%`,width:`${b.size*.6}%`,height:`${b.size*.6}%`,background:b.color,boxShadow:`0 0 ${b.size*3}px ${b.color}`,position:"absolute",borderRadius:"50%",transform:"translate(-50%,-50%)"}}/>
            ))}
            {powerups.map(p=>(
              <div key={p.id} style={{position:"absolute",left:`${p.x}%`,top:`${p.y}%`,transform:"translate(-50%,-50%)",fontSize:"1.4rem",filter:"drop-shadow(0 0 8px #4fb7dd)",animation:"splashBob 1s ease-in-out infinite"}}>🛡️</div>
            ))}
            <div className="dodge-player" style={{left:`${player.x}%`,top:`${player.y}%`,position:"absolute",transform:"translate(-50%,-50%)"}}>
              <div style={{fontSize:"1.8rem",transform:"rotate(-90deg)",filter:`drop-shadow(0 0 12px ${gameColor})`}}>🚀</div>
              {shield&&<div style={{position:"absolute",inset:"-10px",borderRadius:"50%",border:`2px solid var(--blue)`,opacity:.6,animation:"shieldPulse 1s ease-in-out infinite"}}/>}
            </div>
          </div>
        </>
      )}
      {phase==="result"&&(
        <div className="game-result">
          <div className="result-rank" style={{color:gameColor}}>{score>1000?"S":score>600?"A":score>300?"B":"C"}</div>
          <div className="result-score">{score.toLocaleString()}</div>
          <div className="result-label">DISTANCE FLOWN</div>
          <div className="result-stats">
            <div className="rs-item"><span style={{color:gameColor}}>{wave}</span><span>Waves</span></div>
            <div className="rs-item"><span style={{color:"var(--red)"}}>{3-lives}</span><span>Deaths</span></div>
          </div>
          <div className="result-actions">
            <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={start}>RELAUNCH</button>
            <button className="game-exit-btn" onClick={onExit}>EXIT</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   GAME 4 · SNIPER SEQUENCE — "Iron Protocol"
   Simon-Says with pattern complexity
──────────────────────────────────────────────────*/
const DIRECTIONS = ["↑","→","↓","←","↗","↘","↙","↖"];
function SniperSequence({ onScore, onExit, gameName, gameColor }) {
  const [phase,  setPhase]  = useState("idle");
  const [seq,    setSeq]    = useState([]);
  const [shown,  setShown]  = useState([]);
  const [input,  setInput]  = useState([]);
  const [active, setActive] = useState(null);
  const [score,  setScore]  = useState(0);
  const [round,  setRound]  = useState(1);
  const [status, setStatus] = useState(""); // showing|input|correct|wrong

  const showSeq = useCallback((sequence)=>{
    setStatus("showing"); setInput([]);
    let i=0;
    const show=()=>{
      if(i>=sequence.length){setActive(null);setStatus("input");return;}
      setActive(sequence[i]);
      setShown(sequence.slice(0,i+1));
      i++;
      setTimeout(show, Math.max(350,700-round*20));
    };
    setTimeout(show,600);
  },[round]);

  const startGame = ()=>{
    const first=[Math.floor(Math.random()*8)];
    setSeq(first);setShown([]);setInput([]);
    setScore(0);setRound(1);setPhase("playing");
    showSeq(first);
  };

  const handleInput = useCallback((dir)=>{
    if(status!=="input") return;
    const newInput=[...input,dir];
    setInput(newInput);
    if(dir!==seq[newInput.length-1]){
      setStatus("wrong");
      setTimeout(()=>{setPhase("result");},900);
      return;
    }
    if(newInput.length===seq.length){
      const pts=round*50;
      setScore(s=>s+pts); onScore(Math.floor(pts/5));
      setStatus("correct");
      const next=[...seq,Math.floor(Math.random()*8)];
      setRound(r=>r+1); setSeq(next);
      setTimeout(()=>showSeq(next),800);
    }
  },[status,input,seq,round,showSeq,onScore]);

  return (
    <div className="game-fullscreen" style={{"--gc":gameColor}}>
      {phase==="idle"&&(
        <div className="game-splash">
          <div className="game-splash-icon">🔥</div>
          <h2 className="game-splash-title">{gameName}</h2>
          <p className="game-splash-sub">Memorise the direction sequence — then repeat it in order. One mistake ends the mission. Sequences grow each round.</p>
          <div className="game-splash-stats">
            <div className="gss-item"><span className="gss-val">8</span><span className="gss-lbl">Directions</span></div>
            <div className="gss-item"><span className="gss-val">+50</span><span className="gss-lbl">Per Round</span></div>
            <div className="gss-item"><span className="gss-val">∞</span><span className="gss-lbl">Rounds</span></div>
          </div>
          <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={startGame}>▶ MISSION START</button>
        </div>
      )}
      {phase==="playing"&&(
        <div className="sniper-wrap">
          <div className="game-hud">
            <div className="hud-left"><span className="hud-score">{score}</span><span className="hud-label">SCORE</span></div>
            <div className="hud-center">
              <span style={{fontFamily:"var(--ff-mono)",fontSize:".7rem",letterSpacing:"3px",color:status==="showing"?"var(--blue)":status==="input"?gameColor:status==="correct"?"var(--green)":"var(--red)"}}>
                {status==="showing"?"MEMORISE":status==="input"?`${input.length}/${seq.length}`:status==="correct"?"CORRECT!":"WRONG!"}
              </span>
            </div>
            <div className="hud-right"><span className="hud-score">R{round}</span><span className="hud-label">ROUND</span></div>
          </div>
          {/* Sequence display */}
          <div className="sniper-seq-display">
            {shown.map((d,i)=>(
              <div key={i} className="ssd-cell" style={{background:input[i]!==undefined?(input[i]===d?"rgba(74,222,128,.2)":"rgba(248,113,113,.2)"):"rgba(255,255,255,.06)",borderColor:active===d&&i===shown.length-1?gameColor:"var(--border)"}}>
                <span style={{fontSize:"1.4rem",opacity:status==="input"?1:.6}}>{DIRECTIONS[d]}</span>
              </div>
            ))}
          </div>
          {/* Input grid */}
          <div className="sniper-grid">
            {DIRECTIONS.map((dir,i)=>(
              <button key={i}
                className={`sniper-btn ${active===i&&status==="showing"?"active":""}`}
                style={{borderColor:active===i&&status==="showing"?gameColor:"var(--border)",background:active===i&&status==="showing"?`${gameColor}22`:"var(--bg-3)"}}
                onClick={()=>handleInput(i)}
                disabled={status!=="input"}
              >
                {dir}
              </button>
            ))}
          </div>
        </div>
      )}
      {phase==="result"&&(
        <div className="game-result">
          <div className="result-rank" style={{color:gameColor}}>{round>10?"S":round>7?"A":round>4?"B":"C"}</div>
          <div className="result-score">{score.toLocaleString()}</div>
          <div className="result-label">MISSION SCORE</div>
          <div className="result-stats">
            <div className="rs-item"><span style={{color:gameColor}}>{round-1}</span><span>Rounds Cleared</span></div>
            <div className="rs-item"><span style={{color:"var(--blue)"}}>{seq.length}</span><span>Seq Length</span></div>
          </div>
          <div className="result-actions">
            <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={startGame}>RETRY</button>
            <button className="game-exit-btn" onClick={onExit}>EXIT</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   GAME 5 · MOBA BRAWL — "Arcane Uprising"
──────────────────────────────────────────────────*/
function MobaBrawl({ onScore, onExit, gameName, gameColor }) {
  const [phase,   setPhase]   = useState("idle");
  const [hp,      setHp]      = useState(100);
  const [eHp,     setEHp]     = useState(100);
  const [score,   setScore]   = useState(0);
  const [combo,   setCombo]   = useState(0);
  const [wave,    setWave]    = useState(1);
  const [log,     setLog]     = useState([]);
  const [cds,     setCds]     = useState({q:0,w:0,e:0,r:0});
  const [fx,      setFx]      = useState({shield:false,rage:false,stun:false,poison:false});
  const [anim,    setAnim]    = useState(null);
  const logRef = useRef(0);

  const addLog = useCallback((msg,color="#fff")=>{
    logRef.current++;
    const id=logRef.current;
    setLog(p=>[...p.slice(-3),{id,msg,color}]);
    setTimeout(()=>setLog(p=>p.filter(l=>l.id!==id)),2200);
  },[]);

  const enemyAttack = useCallback(()=>{
    setFx(ef=>{
      if(ef.stun){addLog("Enemy stunned!","var(--yellow)");return ef;}
      const base=9+wave*1.8+Math.random()*6;
      const dmg=ef.shield?Math.floor(base/2.5):Math.floor(base);
      setHp(h=>{const n=Math.max(0,h-dmg);if(n<=0)setPhase("result");return n;});
      addLog(`Enemy hit: ${dmg}dmg${ef.shield?" (blocked)":""}!`,"var(--red)");
      return ef;
    });
  },[wave,addLog]);

  const ABILITIES={
    q:{name:"Quick Strike",dmg:[10,16],cd:700, color:"var(--yellow)",emoji:"⚡",combo:true},
    w:{name:"Power Slash", dmg:[22,34],cd:2200,color:"var(--orange)",emoji:"🔥",combo:false},
    e:{name:"Void Shield", dmg:[0,0],  cd:3800,color:"var(--blue)",  emoji:"🛡️",shield:true},
    r:{name:"ULTIMATE",    dmg:[60,90],cd:9000,color:gameColor,      emoji:"💥",rage:true},
  };

  const attack = useCallback((id)=>{
    if(phase!=="playing") return;
    const now=Date.now();
    if(cds[id]>now) return;
    const cfg=ABILITIES[id];
    const dmg=Math.floor(cfg.dmg[0]+Math.random()*(cfg.dmg[1]-cfg.dmg[0]));
    const nc=cfg.combo?combo+1:0;
    const fd=Math.floor(dmg*(1+nc*.06+(fx.rage?.55:0)));
    setCombo(nc);
    if(cfg.shield){setFx(f=>({...f,shield:true}));setTimeout(()=>setFx(f=>({...f,shield:false})),3500);addLog("Void Shield: -60% damage for 3.5s","var(--blue)");}
    else if(cfg.rage){setFx(f=>({...f,rage:true}));setTimeout(()=>setFx(f=>({...f,rage:false})),4000);addLog(`ULTIMATE! ${fd} dmg + RAGE 4s`,gameColor);}
    else{addLog(`${cfg.emoji} ${cfg.name}: ${fd}${nc>1?` ×${nc} combo`:""}`,cfg.color);}
    if(fd>0){
      setAnim(id);setTimeout(()=>setAnim(null),280);
      setEHp(h=>{
        const n=Math.max(0,h-fd);
        if(n<=0){
          const pts=wave*120+nc*25;setScore(s=>s+pts);onScore(Math.floor(pts/5));
          addLog(`Wave ${wave} cleared! +${pts}pts`,"var(--green)");
          const nw=wave+1;setWave(nw);setEHp(Math.min(100,55+nw*9));
          setFx(f=>({...f,stun:true}));setTimeout(()=>setFx(f=>({...f,stun:false})),600);
          // poison on high waves
          if(nw>3){setFx(f=>({...f,poison:true}));addLog("Enemy is POISONED!","var(--green)");
            let ticks=4;const pt=setInterval(()=>{
              setEHp(h=>{const n=Math.max(0,h-6);return n;});
              if(--ticks<=0){clearInterval(pt);setFx(f=>({...f,poison:false}));}
            },800);}
        }
        return n;
      });
    }
    setCds(c=>({...c,[id]:now+cfg.cd}));
    setTimeout(()=>setCds(c=>({...c,[id]:0})),cfg.cd);
    setTimeout(enemyAttack,500+Math.random()*400);
  },[phase,cds,combo,fx,wave,enemyAttack,addLog,onScore,gameColor]);

  const startGame=()=>{setHp(100);setEHp(100);setScore(0);setCombo(0);setWave(1);setLog([]);setCds({q:0,w:0,e:0,r:0});setFx({shield:false,rage:false,stun:false,poison:false});setPhase("playing");};

  return (
    <div className="game-fullscreen" style={{"--gc":gameColor}}>
      {phase==="idle"&&(
        <div className="game-splash">
          <div className="game-splash-icon">⚡</div>
          <h2 className="game-splash-title">{gameName}</h2>
          <p className="game-splash-sub">QWER ability brawler. Chain Q combos for damage multipliers. Shield with E. Unleash R ultimate. Beat waves to score.</p>
          <div className="game-splash-stats">
            <div className="gss-item"><span className="gss-val">Q</span><span className="gss-lbl">Combo Chain</span></div>
            <div className="gss-item"><span className="gss-val">E</span><span className="gss-lbl">Shield Block</span></div>
            <div className="gss-item"><span className="gss-val">R</span><span className="gss-lbl">Ultimate</span></div>
          </div>
          <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={startGame}>▶ ENTER ARENA</button>
        </div>
      )}
      {phase==="playing"&&(
        <div className="moba-arena">
          <div className="moba-hp-row">
            <div className="moba-hp-block">
              <div className="moba-hp-label">YOU {fx.shield&&"🛡️"}</div>
              <div className="moba-hp-bar-wrap"><div className="moba-hp-bar" style={{width:`${hp}%`,background:hp>50?"var(--green)":hp>25?"var(--orange)":"var(--red)"}}/></div>
              <div className="moba-hp-num">{hp}</div>
            </div>
            <div className="moba-vs">VS</div>
            <div className="moba-hp-block" style={{textAlign:"right"}}>
              <div className="moba-hp-label">WAVE {wave} {fx.poison&&"☠️"}</div>
              <div className="moba-hp-bar-wrap"><div className="moba-hp-bar" style={{width:`${eHp}%`,background:"var(--red)",marginLeft:"auto"}}/></div>
              <div className="moba-hp-num">{eHp}</div>
            </div>
          </div>
          <div className="moba-field">
            <div className={`moba-char player-char ${anim?"hit":""} ${fx.rage?"rage":""} ${fx.shield?"shielded":""}`}>
              <div className="mc-emoji">🧙</div>
              {fx.shield&&<div className="mc-shield-ring" style={{borderColor:"var(--blue)"}}/>}
              {fx.rage&&<div className="mc-rage-glow" style={{background:`${gameColor}22`}}/>}
              {combo>2&&<div className="mc-combo-badge" style={{background:gameColor}}>×{combo}</div>}
            </div>
            <div className="moba-clash">
              {log.slice(-1).map(l=><div key={l.id} className="clash-float" style={{color:l.color}}>{l.msg}</div>)}
            </div>
            <div className={`moba-char enemy-char ${fx.stun?"stunned":""}`}>
              <div className="mc-emoji">{wave>5?"🐉":wave>3?"👹":"👾"}</div>
              {fx.stun&&<div className="mc-stun-stars">⭐⭐⭐</div>}
              {fx.poison&&<div style={{position:"absolute",top:"-18px",fontSize:".8rem",animation:"splashBob 1s infinite"}}>☠️</div>}
            </div>
          </div>
          <div style={{textAlign:"center",padding:".4rem",fontFamily:"var(--ff-display)",fontSize:"1.3rem",color:gameColor}}>{score.toLocaleString()} PTS</div>
          <div className="moba-abilities">
            {Object.entries(ABILITIES).map(([id,cfg])=>{
              const onCd=cds[id]>Date.now();
              return(
                <button key={id} className={`moba-btn ${onCd?"on-cd":""}`} style={{"--ac":cfg.color}} onClick={()=>attack(id)}>
                  <span className="moba-btn-emoji">{cfg.emoji}</span>
                  <span className="moba-btn-label">{cfg.name}</span>
                  <span className="moba-btn-key">{id.toUpperCase()}</span>
                  {onCd&&<div className="moba-cd-overlay"/>}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {phase==="result"&&(
        <div className="game-result">
          <div className="result-rank" style={{color:gameColor}}>{wave>6?"S":wave>4?"A":wave>2?"B":"C"}</div>
          <div className="result-score">{score.toLocaleString()}</div>
          <div className="result-label">ARENA SCORE</div>
          <div className="result-stats">
            <div className="rs-item"><span style={{color:gameColor}}>{wave-1}</span><span>Waves</span></div>
            <div className="rs-item"><span style={{color:hp>0?"var(--green)":"var(--red)"}}>{hp>0?"Survived":"Fallen"}</span><span>Status</span></div>
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

/* ─────────────────────────────────────────────────
   GAME 6 · VOLT RACE — "Volt Strike" (Racing)
   Tap-rhythm racing lane game
──────────────────────────────────────────────────*/
function VoltRace({ onScore, onExit, gameName, gameColor }) {
  const [phase,   setPhase]   = useState("idle");
  const [lane,    setLane]    = useState(1); // 0,1,2
  const [obstacles,setObs]   = useState([]);
  const [score,   setScore]   = useState(0);
  const [speed,   setSpeed]   = useState(1);
  const [combo,   setCombo]   = useState(0);
  const [hits,    setHits]    = useState(0);
  const [boosts,  setBoosts]  = useState([]);
  const aref   = useRef(null);
  const stRef  = useRef({obs:[],boosts:[],score:0,speed:1,combo:0,hits:0,lane:1,active:false});
  const oid    = useRef(0);
  const lastS  = useRef(0);
  const lastB  = useRef(0);

  const start = ()=>{
    stRef.current={obs:[],boosts:[],score:0,speed:1,combo:0,hits:0,lane:1,active:true};
    setObs([]);setBoosts([]);setScore(0);setSpeed(1);setCombo(0);setHits(0);setLane(1);setPhase("playing");
    lastS.current=0;lastB.current=0;
  };

  const changeLane=useCallback((dir)=>{
    if(stRef.current.phase==="result") return;
    const nl=Math.max(0,Math.min(2,stRef.current.lane+dir));
    stRef.current.lane=nl; setLane(nl);
  },[]);

  useEffect(()=>{
    if(phase!=="playing") return;
    const keys=e=>{if(e.key==="ArrowLeft")changeLane(-1);if(e.key==="ArrowRight")changeLane(1);};
    window.addEventListener("keydown",keys);
    return()=>window.removeEventListener("keydown",keys);
  },[phase,changeLane]);

  useEffect(()=>{
    if(phase!=="playing") return;
    let last=0;
    const loop=ts=>{
      if(!stRef.current.active) return;
      const dt=(ts-last)/16.67; last=ts;
      const sp=stRef.current.speed;

      // Spawn obstacles
      if(ts-lastS.current>Math.max(600,1400-stRef.current.score*.3)){
        lastS.current=ts; oid.current++;
        const takenLane=Math.floor(Math.random()*3);
        stRef.current.obs=[...stRef.current.obs,{id:oid.current,lane:takenLane,y:-8,type:Math.random()<.2?"wide":"normal"}];
      }
      // Spawn boosts
      if(ts-lastB.current>5000){
        lastB.current=ts; oid.current++;
        stRef.current.boosts=[...stRef.current.boosts,{id:oid.current,lane:Math.floor(Math.random()*3),y:-8}];
      }

      stRef.current.obs=stRef.current.obs.map(o=>({...o,y:o.y+sp*.45*dt}));
      stRef.current.boosts=stRef.current.boosts.map(b=>({...b,y:b.y+sp*.3*dt}));

      // Collision
      const playerLane=stRef.current.lane;
      let crashed=false;
      stRef.current.obs.forEach(o=>{
        if(o.y>72&&o.y<92){
          const hit=o.type==="wide"?(o.lane===playerLane||Math.abs(o.lane-playerLane)<=0.5):(o.lane===playerLane);
          if(hit){crashed=true;stRef.current.obs=stRef.current.obs.filter(x=>x.id!==o.id);}
        }
      });
      if(crashed){
        stRef.current.hits++;setHits(stRef.current.hits);stRef.current.combo=0;setCombo(0);
        if(stRef.current.hits>=3){stRef.current.active=false;setPhase("result");return;}
      }

      // Boost collection
      stRef.current.boosts.forEach(b=>{
        if(b.y>72&&b.y<92&&b.lane===playerLane){
          stRef.current.boosts=stRef.current.boosts.filter(x=>x.id!==b.id);
          stRef.current.combo+=3;setCombo(stRef.current.combo);
          stRef.current.score+=50;onScore(10);
        }
      });

      stRef.current.obs=stRef.current.obs.filter(o=>o.y<110);
      stRef.current.boosts=stRef.current.boosts.filter(b=>b.y<110);

      // Score
      stRef.current.score+=.12*sp*dt; setScore(Math.floor(stRef.current.score));
      stRef.current.speed=Math.min(3.5,1+stRef.current.score/800);setSpeed(stRef.current.speed);
      if(!crashed){stRef.current.combo+=.01;setCombo(Math.floor(stRef.current.combo));}
      setObs([...stRef.current.obs]);setBoosts([...stRef.current.boosts]);
      aref.current=requestAnimationFrame(loop);
    };
    aref.current=requestAnimationFrame(loop);
    return()=>{cancelAnimationFrame(aref.current);stRef.current.active=false;};
  },[phase,onScore]);

  const LANE_COLORS=["var(--blue)","var(--yellow)","var(--violet)"];

  return (
    <div className="game-fullscreen" style={{"--gc":gameColor}}>
      {phase==="idle"&&(
        <div className="game-splash">
          <div className="game-splash-icon">🏎️</div>
          <h2 className="game-splash-title">{gameName}</h2>
          <p className="game-splash-sub">Arrow keys ← → (or tap buttons) to switch lanes. Dodge obstacles. Collect ⚡ boosts. 3 crashes = game over.</p>
          <div className="game-splash-stats">
            <div className="gss-item"><span className="gss-val">3</span><span className="gss-lbl">Lanes</span></div>
            <div className="gss-item"><span className="gss-val">3</span><span className="gss-lbl">Lives</span></div>
            <div className="gss-item"><span className="gss-val">⚡</span><span className="gss-lbl">Boosts</span></div>
          </div>
          <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={start}>▶ RACE!</button>
        </div>
      )}
      {phase==="playing"&&(
        <>
          <div className="game-hud">
            <div className="hud-left"><span className="hud-score">{score.toLocaleString()}</span><span className="hud-label">SCORE</span></div>
            <div className="hud-center"><span style={{fontFamily:"var(--ff-display)",fontSize:"1.1rem",color:gameColor}}>×{speed.toFixed(1)} SPEED</span>{combo>5&&<span style={{fontFamily:"var(--ff-mono)",fontSize:".55rem",color:"var(--yellow)",letterSpacing:"2px"}}>COMBO {combo}</span>}</div>
            <div className="hud-right"><span className="hud-lives">{Array.from({length:3},(_,i)=><span key={i} style={{opacity:i<(3-hits)?1:.15,fontSize:"1rem"}}>🏎️</span>)}</span></div>
          </div>
          <div className="volt-track">
            {/* Road lines */}
            {[1,2].map(i=><div key={i} className="track-line" style={{left:`${i*33.3}%`}}/>)}
            {/* Obstacles */}
            {obstacles.map(o=>(
              <div key={o.id} className="volt-obstacle" style={{left:`${o.lane*33.3+5}%`,top:`${o.y}%`,width:o.type==="wide"?"28%":"20%",background:"var(--red)",boxShadow:"0 0 20px var(--red)"}}>
                {o.type==="wide"?"🚧":"🪨"}
              </div>
            ))}
            {/* Boosts */}
            {boosts.map(b=>(
              <div key={b.id} className="volt-boost" style={{left:`${b.lane*33.3+8}%`,top:`${b.y}%`}}>⚡</div>
            ))}
            {/* Player car */}
            <div className="volt-player" style={{left:`${lane*33.3+6.5}%`,transition:"left .12s cubic-bezier(.4,0,.2,1)"}}>
              <div style={{fontSize:"2.2rem",filter:`drop-shadow(0 0 16px ${gameColor})`,transform:"rotate(-90deg) scale(1.1)"}}>{gameColor==="#fb923c"?"🏎️":"🚗"}</div>
            </div>
          </div>
          {/* Lane buttons for touch */}
          <div className="volt-controls">
            <button className="volt-btn" onClick={()=>changeLane(-1)}>◀</button>
            <div style={{fontFamily:"var(--ff-mono)",fontSize:".6rem",color:"var(--white-dim)",letterSpacing:"3px",textTransform:"uppercase",alignSelf:"center"}}>STEER</div>
            <button className="volt-btn" onClick={()=>changeLane(1)}>▶</button>
          </div>
        </>
      )}
      {phase==="result"&&(
        <div className="game-result">
          <div className="result-rank" style={{color:gameColor}}>{score>2000?"S":score>1200?"A":score>600?"B":"C"}</div>
          <div className="result-score">{score.toLocaleString()}</div>
          <div className="result-label">RACE SCORE</div>
          <div className="result-stats">
            <div className="rs-item"><span style={{color:gameColor}}>{speed.toFixed(1)}×</span><span>Top Speed</span></div>
            <div className="rs-item"><span style={{color:"var(--red)"}}>{hits}</span><span>Crashes</span></div>
          </div>
          <div className="result-actions">
            <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={start}>REMATCH</button>
            <button className="game-exit-btn" onClick={onExit}>EXIT</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   GAME 7 · SHADOW DUEL — "Shadow Court" (Fighting)
   Turn-based fighting with prediction
──────────────────────────────────────────────────*/
const MOVES = [
  {id:"jab",    name:"Jab",      emoji:"👊",dmg:[8,14], cd:600,  cost:0,  color:"var(--yellow)"},
  {id:"kick",   name:"Kick",     emoji:"🦵",dmg:[15,24],cd:1400, cost:15, color:"var(--orange)"},
  {id:"special",name:"Special",  emoji:"💥",dmg:[30,45],cd:3500, cost:35, color:"#f472b6"},
  {id:"guard",  name:"Guard",    emoji:"🛡️",dmg:[0,0],  cd:1000, cost:0,  color:"var(--blue)",guard:true},
  {id:"charge", name:"Charge",   emoji:"⚡",dmg:[0,0],  cd:800,  cost:0,  color:"var(--green)",charge:true},
];

function ShadowDuel({ onScore, onExit, gameName, gameColor }) {
  const [phase,   setPhase]   = useState("idle");
  const [hp,      setHp]      = useState(100);
  const [eHp,     setEHp]     = useState(100);
  const [energy,  setEnergy]  = useState(50);
  const [score,   setScore]   = useState(0);
  const [round,   setRound]   = useState(1);
  const [log,     setLog]     = useState([]);
  const [cds,     setCds]     = useState({});
  const [guarding,setGuarding]= useState(false);
  const [eGuard,  setEGuard]  = useState(false);
  const [anim,    setAnim]    = useState(null);
  const lid = useRef(0);

  const addLog=useCallback((msg,color)=>{
    lid.current++;const id=lid.current;
    setLog(p=>[...p.slice(-3),{id,msg,color}]);
    setTimeout(()=>setLog(p=>p.filter(l=>l.id!==id)),2000);
  },[]);

  const enemyTurn=useCallback(()=>{
    const roll=Math.random();
    const eMove=roll<.1?"guard":roll<.4?"special":roll<.7?"kick":"jab";
    if(eMove==="guard"){setEGuard(true);addLog("Enemy guards!","var(--blue)");setTimeout(()=>setEGuard(false),1000);return;}
    const m=MOVES.find(x=>x.id===eMove);
    const dmg=Math.floor(m.dmg[0]+Math.random()*(m.dmg[1]-m.dmg[0]));
    setGuarding(g=>{
      const final=g?Math.floor(dmg*.25):dmg;
      setHp(h=>{const n=Math.max(0,h-final);if(n<=0)setPhase("result");return n;});
      addLog(`Enemy ${m.name}: ${final}dmg${g?" (blocked!)":""}!`,"var(--red)");
      return g;
    });
  },[addLog]);

  const doMove=useCallback((moveId)=>{
    if(phase!=="playing") return;
    const now=Date.now();
    if(cds[moveId]>now) return;
    const m=MOVES.find(x=>x.id===moveId);
    if(energy<m.cost){addLog("Not enough energy!","var(--red)");return;}
    if(m.guard){setGuarding(true);setTimeout(()=>setGuarding(false),1200);addLog("Blocking! Damage reduced 75%","var(--blue)");setCds(c=>({...c,[moveId]:now+m.cd}));setTimeout(()=>setCds(c=>({...c,[moveId]:0})),m.cd);return;}
    if(m.charge){setEnergy(e=>Math.min(100,e+30));addLog("Charged! +30 energy","var(--green)");setCds(c=>({...c,[moveId]:now+m.cd}));setTimeout(()=>setCds(c=>({...c,[moveId]:0})),m.cd);return;}
    const dmg=Math.floor(m.dmg[0]+Math.random()*(m.dmg[1]-m.dmg[0]));
    const final=eGuard?Math.floor(dmg*.2):dmg;
    setEnergy(e=>Math.max(0,e-m.cost));
    setAnim(moveId);setTimeout(()=>setAnim(null),280);
    addLog(`${m.emoji} ${m.name}: ${final}dmg${eGuard?" (guarded)":""}`,m.color);
    setEHp(h=>{
      const n=Math.max(0,h-final);
      if(n<=0){
        const pts=round*150;setScore(s=>s+pts);onScore(Math.floor(pts/5));
        addLog(`Round ${round} KO! +${pts}pts`,"var(--green)");
        setRound(r=>r+1);setEHp(Math.min(100,60+round*8));setEnergy(e=>Math.min(100,e+20));
      }
      return n;
    });
    setCds(c=>({...c,[moveId]:now+m.cd}));
    setTimeout(()=>setCds(c=>({...c,[moveId]:0})),m.cd);
    setEnergy(e=>Math.min(100,e+5));
    setTimeout(enemyTurn,400+Math.random()*300);
  },[phase,cds,energy,eGuard,round,enemyTurn,addLog,onScore]);

  // Energy regen
  useEffect(()=>{
    if(phase!=="playing") return;
    const id=setInterval(()=>setEnergy(e=>Math.min(100,e+2)),800);
    return()=>clearInterval(id);
  },[phase]);

  const startGame=()=>{setHp(100);setEHp(100);setEnergy(50);setScore(0);setRound(1);setLog([]);setCds({});setGuarding(false);setEGuard(false);setPhase("playing");};

  return (
    <div className="game-fullscreen" style={{"--gc":gameColor}}>
      {phase==="idle"&&(
        <div className="game-splash">
          <div className="game-splash-icon">🥋</div>
          <h2 className="game-splash-title">{gameName}</h2>
          <p className="game-splash-sub">Strategic fighting — manage energy, time your guard, predict enemy moves. Beat rounds to earn score multipliers.</p>
          <div className="game-splash-stats">
            <div className="gss-item"><span className="gss-val">⚡</span><span className="gss-lbl">Energy System</span></div>
            <div className="gss-item"><span className="gss-val">🛡️</span><span className="gss-lbl">Guard Mechanic</span></div>
            <div className="gss-item"><span className="gss-val">∞</span><span className="gss-lbl">Rounds</span></div>
          </div>
          <button className="game-start-btn" style={{background:gameColor,color:"#000"}} onClick={startGame}>▶ FIGHT!</button>
        </div>
      )}
      {phase==="playing"&&(
        <div className="moba-arena">
          {/* HP + Energy */}
          <div className="moba-hp-row">
            <div className="moba-hp-block">
              <div className="moba-hp-label">YOU {guarding&&"🛡️"}</div>
              <div className="moba-hp-bar-wrap"><div className="moba-hp-bar" style={{width:`${hp}%`,background:hp>50?"var(--green)":hp>25?"var(--orange)":"var(--red)"}}/></div>
              <div style={{display:"flex",alignItems:"center",gap:".5rem",marginTop:".3rem"}}>
                <div style={{flex:1,height:"4px",background:"rgba(255,255,255,.06)",borderRadius:"2px",overflow:"hidden"}}>
                  <div style={{width:`${energy}%`,height:"100%",background:"var(--yellow)",borderRadius:"2px",transition:"width .3s"}}/>
                </div>
                <span style={{fontFamily:"var(--ff-mono)",fontSize:".55rem",color:"var(--yellow)"}}>{Math.floor(energy)}⚡</span>
              </div>
            </div>
            <div className="moba-vs" style={{fontFamily:"var(--ff-display)",fontSize:"1rem"}}>R{round}</div>
            <div className="moba-hp-block" style={{textAlign:"right"}}>
              <div className="moba-hp-label">ENEMY {eGuard&&"🛡️"}</div>
              <div className="moba-hp-bar-wrap"><div className="moba-hp-bar" style={{width:`${eHp}%`,background:"var(--red)",marginLeft:"auto"}}/></div>
            </div>
          </div>
          {/* Fight arena */}
          <div className="moba-field">
            <div className={`moba-char player-char ${anim?"hit":""} ${guarding?"shielded":""}`}>
              <div className="mc-emoji">🥷</div>
              {guarding&&<div className="mc-shield-ring" style={{borderColor:gameColor}}/>}
            </div>
            <div className="moba-clash">
              {log.slice(-1).map(l=><div key={l.id} className="clash-float" style={{color:l.color}}>{l.msg}</div>)}
            </div>
            <div className={`moba-char enemy-char`}>
              <div className="mc-emoji">{round>4?"🦹":round>2?"👤":"🤺"}</div>
              {eGuard&&<div className="mc-shield-ring" style={{borderColor:"var(--red)"}}/>}
            </div>
          </div>
          <div style={{textAlign:"center",fontFamily:"var(--ff-display)",fontSize:"1.2rem",color:gameColor,padding:".3rem"}}>{score.toLocaleString()} PTS</div>
          {/* Move buttons */}
          <div className="moba-abilities" style={{gridTemplateColumns:"repeat(5,1fr)"}}>
            {MOVES.map(m=>{
              const onCd=cds[m.id]>Date.now();
              const noEnergy=energy<m.cost;
              return(
                <button key={m.id} className={`moba-btn ${onCd||noEnergy?"on-cd":""}`} style={{"--ac":m.color}} onClick={()=>doMove(m.id)}>
                  <span className="moba-btn-emoji">{m.emoji}</span>
                  <span className="moba-btn-label">{m.name}</span>
                  {m.cost>0&&<span style={{fontFamily:"var(--ff-mono)",fontSize:".45rem",color:"var(--yellow)"}}>{m.cost}⚡</span>}
                  {onCd&&<div className="moba-cd-overlay"/>}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {phase==="result"&&(
        <div className="game-result">
          <div className="result-rank" style={{color:gameColor}}>{round>6?"S":round>4?"A":round>2?"B":"C"}</div>
          <div className="result-score">{score.toLocaleString()}</div>
          <div className="result-label">FIGHT SCORE</div>
          <div className="result-stats">
            <div className="rs-item"><span style={{color:gameColor}}>{round-1}</span><span>Rounds Won</span></div>
            <div className="rs-item"><span style={{color:hp>0?"var(--green)":"var(--red)"}}>{hp>0?"Survived":"KO'd"}</span><span>Outcome</span></div>
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

/* ─────────────────────────────────────────────────
   GAME MODAL
──────────────────────────────────────────────────*/
export function GameModal({ gameId, onClose }) {
  const meta = PLAYABLE_GAMES[gameId];
  if(!meta) return null;
  const [sessionScore, setSessionScore] = useState(0);
  const addScore = useCallback(n=>setSessionScore(s=>s+n),[]);

  const GAME_MAP = {
    battle:  BattleGrid,
    stealth: WordCipher,
    dodge:   DodgeBlitz,
    sniper:  SniperSequence,
    moba:    MobaBrawl,
    race:    VoltRace,
    fight:   ShadowDuel,
    rpg:     SniperSequence,
    tower:   MobaBrawl,
  };
  const GameComponent = GAME_MAP[meta.mode] || BattleGrid;

  useEffect(()=>{document.body.style.overflow="hidden";return()=>{document.body.style.overflow="";};},[]);

  return (
    <div className="game-modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div className="game-modal">
        <div className="game-modal-header" style={{borderColor:`${meta.color}44`}}>
          <div style={{display:"flex",alignItems:"center",gap:".8rem"}}>
            <span style={{fontSize:"1.5rem"}}>{meta.icon}</span>
            <div>
              <div style={{fontFamily:"var(--ff-display)",fontSize:"1.2rem",letterSpacing:".5px"}}>{meta.name}</div>
              <div style={{fontFamily:"var(--ff-mono)",fontSize:".5rem",letterSpacing:"3px",color:meta.color,textTransform:"uppercase"}}>{meta.mode.toUpperCase()} MODE</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"1.2rem"}}>
            {sessionScore>0&&(
              <div style={{textAlign:"right"}}>
                <div style={{fontFamily:"var(--ff-display)",fontSize:"1.3rem",color:meta.color,lineHeight:1}}>{sessionScore.toLocaleString()}</div>
                <div style={{fontFamily:"var(--ff-mono)",fontSize:".46rem",letterSpacing:"2px",color:"var(--white-dim)"}}>SESSION</div>
              </div>
            )}
            <button className="game-modal-close" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="game-modal-body">
          <GameComponent onScore={addScore} onExit={onClose} gameName={meta.name} gameColor={meta.color}/>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   ARCADE PAGE
──────────────────────────────────────────────────*/
const ARCADE_LIST = [
  {id:1, name:"Nexus Storm",     mode:"battle", icon:"💀", color:"#e8ff4d", tags:["Strategy","Minesweeper"], desc:"Clear a minefield in 2 minutes. Right-click to flag mines. Reveal all safe cells."},
  {id:5, name:"Ghost Weave",     mode:"stealth",icon:"👻", color:"#4ade80", tags:["Word","Cipher"],    desc:"Decode ROT-13 encrypted words using hints. 90 seconds to crack as many as possible."},
  {id:3, name:"Stellar Drift",   mode:"dodge",  icon:"🚀", color:"#4fb7dd", tags:["Dodge","Survival"],desc:"Dodge asteroids with your cursor. Collect shields. Survive escalating waves."},
  {id:4, name:"Iron Protocol",   mode:"sniper", icon:"🔥", color:"#f87171", tags:["Memory","Sequence"],desc:"Memorise direction sequences and repeat them. One mistake ends the mission."},
  {id:6, name:"Arcane Uprising", mode:"moba",   icon:"⚡", color:"#a78bfa", tags:["MOBA","Combat"],   desc:"Chain Q combos, shield with E, unleash R ultimate. Defeat waves of enemies."},
  {id:7, name:"Volt Strike",     mode:"race",   icon:"🏎️", color:"#fb923c", tags:["Racing","Dodge"],  desc:"Switch lanes with arrow keys. Dodge obstacles, collect boost pads. 3 crashes = out."},
  {id:9, name:"Shadow Court",    mode:"fight",  icon:"🥋", color:"#f472b6", tags:["Fighting","Strategy"],desc:"Strategic turn-based fighter. Manage energy, time your guard, predict enemy moves."},
];

export default function Arcade() {
  const [active, setActive] = useState(null);
  const [total,  setTotal]  = useState(0);
  const addScore = useCallback(n=>setTotal(s=>s+n),[]);

  return (
    <main style={{paddingTop:"8rem",paddingBottom:"6rem",minHeight:"100vh"}}>
      <div className="container">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:"1.5rem",marginBottom:"3.5rem"}}>
          <div>
            <span className="section-tag">Mini Arcade</span>
            <h1 style={{fontFamily:"var(--ff-display)",fontSize:"clamp(3rem,8vw,6rem)",textTransform:"uppercase",letterSpacing:"-2px",lineHeight:.92}}>
              7 Games.<br /><span className="clip-text">Zero Downloads.</span>
            </h1>
            <p style={{color:"var(--white-dim)",marginTop:"1rem",maxWidth:480,lineHeight:1.75,fontSize:".93rem"}}>
              Every game is unique — strategy, memory, reflexes, combat, racing. Pick your mode and prove your skill right here.
            </p>
          </div>
          {total>0&&(
            <div className="arcade-score-badge">
              <div style={{fontFamily:"var(--ff-mono)",fontSize:".5rem",letterSpacing:"3px",color:"var(--white-dim)",marginBottom:".3rem"}}>SESSION SCORE</div>
              <div style={{fontFamily:"var(--ff-display)",fontSize:"2.8rem",lineHeight:1,background:"linear-gradient(135deg,var(--yellow),var(--blue))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{total.toLocaleString()}</div>
            </div>
          )}
        </div>

        <div className="arcade-cards-grid">
          {ARCADE_LIST.map(g=>(
            <div key={g.id} className="arcade-card" style={{"--gc":g.color}} onClick={()=>setActive(g.id)}>
              <div className="arcade-card-top" style={{background:`radial-gradient(ellipse 100% 100% at 50% 30%, ${g.color}1a, transparent)`}}>
                <div className="arcade-card-icon">{g.icon}</div>
                <div className="arcade-card-tags">{g.tags.map(t=><span key={t} className="arcade-card-tag">{t}</span>)}</div>
              </div>
              <div className="arcade-card-body">
                <h3 className="arcade-card-title">{g.name}</h3>
                <p className="arcade-card-desc">{g.desc}</p>
                <button className="arcade-card-btn" style={{background:g.color,color:"#000"}}>▶ Play Now</button>
              </div>
            </div>
          ))}
        </div>

        <div style={{textAlign:"center",marginTop:"4rem"}}>
          <Link to="/games" className="btn-outline">Browse Full Game Library →</Link>
        </div>
      </div>
      {active&&<GameModal gameId={active} onClose={()=>setActive(null)}/>}
    </main>
  );
}
