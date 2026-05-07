import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    const reveal = (el) => el.classList.add("in-view");

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          reveal(e.target);
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.04, rootMargin: "0px 0px -30px 0px" }
    );

    const init = () => {
      const els = document.querySelectorAll(".sr:not(.in-view)");
      els.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If already visible in viewport, reveal immediately
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          reveal(el);
        } else {
          observer.observe(el);
        }
      });
    };

    // Run after paint so DOM is ready
    const raf = requestAnimationFrame(() => setTimeout(init, 60));

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);
}
