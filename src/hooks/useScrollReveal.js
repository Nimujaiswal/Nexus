import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const revealAll = () => {
      document.querySelectorAll(".sr:not(.in-view)").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100) {
          el.classList.add("in-view");
        }
      });
    };

    // Reveal immediately on mount
    revealAll();

    // Also reveal on scroll
    window.addEventListener("scroll", revealAll, { passive: true });
    return () => window.removeEventListener("scroll", revealAll);
  }, []);
}
