import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

// Keep the previous listing position so Back from a product returns to that product card.
const ScrollToTop = () => {
  const { pathname, key } = useLocation();

  useLayoutEffect(() => {
    const storageKey = `furniture-scroll:${key}`;
    const savedPosition = Number(sessionStorage.getItem(storageKey));
    let frame = 0;
    let frames = 0;
    let listening = false;

    const savePosition = () => {
      sessionStorage.setItem(storageKey, String(window.scrollY));
    };
    const startSaving = () => {
      if (listening) return;
      listening = true;
      window.addEventListener("scroll", savePosition, { passive: true });
    };

    // Product pages should always open at the top so the gallery and product
    // information begin on the same row, even if this history key has stale scroll state.
    if (pathname.startsWith("/product/")) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      startSaving();
    } else if (Number.isFinite(savedPosition) && savedPosition > 0) {
      const restore = () => {
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
        if (maxScroll >= savedPosition || frames >= 120) {
          window.scrollTo({ top: Math.min(savedPosition, maxScroll), left: 0, behavior: "instant" });
          startSaving();
          return;
        }
        frames += 1;
        frame = window.requestAnimationFrame(restore);
      };
      frame = window.requestAnimationFrame(restore);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      startSaving();
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (listening) savePosition();
      if (listening) window.removeEventListener("scroll", savePosition);
    };
  }, [pathname, key]);

  return null;
};

export default ScrollToTop;
