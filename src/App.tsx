import { useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, safeRefresh } from "./gsapSetup";
import ShaderBg from "./ShaderBg";
import { Cursor, Preloader, ScrollProgress, lenisRef } from "./ui";
import Nav from "./sections/Nav";
import Hero from "./sections/Hero";
import About, { Strip } from "./sections/About";
import Services from "./sections/Services";
import Process from "./sections/Process";
import Stats from "./sections/Stats";
import Learning from "./sections/Learning";
import Works from "./sections/Works";
import Marketplaces from "./sections/Marketplaces";
import Founder from "./sections/Founder";
import Team from "./sections/Team";
import { ContactSection, Footer } from "./sections/Contact";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLoading(false);
      setReady(true);
      return;
    }

    const lenis = new Lenis({
      lerp: 0.088,
      wheelMultiplier: 1,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => safeRefresh(150)).catch(() => {});
    }

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const handleDone = useCallback(() => {
    setLoading(false);
    setReady(true);
    safeRefresh(220);
  }, []);

  return (
    <div className="noise relative min-h-screen bg-[#04050c] text-[#eef1ff]">
      <ShaderBg />
      {loading && <Preloader onDone={handleDone} />}
      <Cursor />
      <ScrollProgress />
      <Nav ready={ready} />
      <main className="relative z-10">
        <Hero ready={ready} />
        <Strip />
        <About />
        <Services />
        <Process />
        <Stats />
        <Learning />
        <Works />
        <Marketplaces />
        <Founder />
        <Team />
        <ContactSection />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
