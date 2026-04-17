const WORDS = [
  "Nexus Storm","Void Realm","Stellar Drift","Iron Protocol",
  "Ghost Weave","Arcane Uprising","Season 7","Cross Platform",
  "Ultra-Low Latency","4K Ray Tracing","Daily Tournaments","Cloud Gaming",
];

export default function Ticker({ reverse = false }) {
  const doubled = [...WORDS, ...WORDS];
  return (
    <div className="ticker-wrap">
      <div className={`ticker-track${reverse ? " rev" : ""}`}>
        {doubled.map((w, i) => (
          <span key={i} className="ticker-item">
            {w}<span className="ticker-sep"> ✦ </span>
          </span>
        ))}
      </div>
    </div>
  );
}
