import { useEffect, useState } from "react";

export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let v = 0;
    const id = setInterval(() => {
      v += Math.random() * 22 + 10;
      if (v >= 100) {
        setPct(100);
        clearInterval(id);
        setTimeout(onDone, 400);
        return;
      }
      setPct(Math.floor(v));
    }, 70);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <div id="page-loader">
      <div className="loader-logo">NEX<em>US</em></div>
      <div className="loader-track">
        <div className="loader-fill" style={{ width: pct + "%" }} />
      </div>
      <div className="loader-pct">{pct}%</div>
    </div>
  );
}
