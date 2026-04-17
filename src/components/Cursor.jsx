import { useEffect } from "react";

export default function Cursor() {
  useEffect(() => {
    const dot  = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    const progress = document.getElementById("scroll-progress");
    let rx = 0, ry = 0, dx = 0, dy = 0;

    const onMove = (e) => { dx = e.clientX; dy = e.clientY; };
    document.addEventListener("mousemove", onMove, { passive: true });

    const animate = () => {
      if (dot)  { dot.style.left = dx + "px"; dot.style.top = dy + "px"; }
      rx += (dx - rx) * 0.1;
      ry += (dy - ry) * 0.1;
      if (ring) { ring.style.left = rx + "px"; ring.style.top = ry + "px"; }
      requestAnimationFrame(animate);
    };
    animate();

    const enter = () => document.body.classList.add("cursor-hover");
    const leave = () => document.body.classList.remove("cursor-hover");
    const targets = () => document.querySelectorAll("a,button,.game-card,.bento-card,.feature-row,.tl-card,.spec-card,.filter-btn,.social-btn");
    const attachHover = () => targets().forEach(el => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });
    attachHover();

    const onDown = () => document.body.classList.add("cursor-click");
    const onUp   = () => document.body.classList.remove("cursor-click");
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup",   onUp);

    const onLeave  = () => { if(dot) dot.style.opacity="0"; if(ring) ring.style.opacity="0"; };
    const onEnter  = () => { if(dot) dot.style.opacity="1"; if(ring) ring.style.opacity="1"; };
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    const onScroll = () => {
      if (!progress) return;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct  = docH > 0 ? (window.scrollY / docH) * 100 : 0;
      progress.style.width = pct + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const mo = new MutationObserver(attachHover);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup",   onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("scroll", onScroll);
      mo.disconnect();
    };
  }, []);

  return (
    <>
      <div id="scroll-progress" />
      <div id="cursor-dot" />
      <div id="cursor-ring" />
    </>
  );
}
