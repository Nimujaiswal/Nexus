import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in-view");
      }),
      { threshold: 0.08 }
    );
    const els = document.querySelectorAll(".sr");
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []); // Fix: empty dep array prevents a new observer being created on every render
}
