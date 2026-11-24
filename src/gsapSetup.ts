import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
  });
}

let refreshTimer: ReturnType<typeof setTimeout> | null = null;
export function safeRefresh(delay = 120) {
  if (typeof window === "undefined") return;
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => {
    try {
      ScrollTrigger.refresh();
    } catch {
      /* ignore transient unmount race */
    }
  }, delay);
}

export { gsap, ScrollTrigger };
