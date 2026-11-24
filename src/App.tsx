import { useCallback, useEffect, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, safeRefresh } from "./gsapSetup";
import ShaderBg from "./ShaderBg";
import ChapterRail from "./ChapterRail";
import CommandPalette from "./CommandPalette";
import { CHAPTERS, chapterById, shaderAccent } from "./theme";
import { Cursor, Preloader, ScrollProgress, lenisRef } from "./ui";
import Nav from "./sections/Nav";
import Hero from "./sections/Hero";
import About, { Strip } from "./sections/About";
import MaskZoom from "./sections/MaskZoom";
import Capabilities from "./sections/Capabilities";
import Services from "./sections/Services";
import Process from "./sections/Process";
import Stats from "./sections/Stats";
import Learning from "./sections/Learning";
import Works from "./sections/Works";
import Marketplaces from "./sections/Marketplaces";
import Founder from "./sections/Founder";
import Team from "./sections/Team";
import WhyUs from "./sections/WhyUs";
import { ContactSection, Footer } from "./sections/Contact";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [chapter, setChapter] = useState("intro");
  const [cmdOpen, setCmdOpen] = useState(false);

  /* Global Cmd+K / Ctrl+K shortcut for Command Palette */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Smooth scroll engine, driven by the single GSAP ticker */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLoading(false);
      setReady(true);
      return;
    }

    const lenis = new Lenis({ lerp: 0.088, wheelMultiplier: 1, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
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

  /* Chapter detection — resolved from scroll position so fast jumps never skip */
  useEffect(() => {
    if (loading) return;
    const blocks = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    if (!blocks.length) return;

    let frame = 0;
    let current = "";

    const resolve = () => {
      frame = 0;
      const line = window.scrollY + window.innerHeight * 0.45;
      let next = blocks[0].dataset.chapter || "intro";
      for (const el of blocks) {
        if (el.offsetTop <= line) next = el.dataset.chapter || next;
      }
      if (next !== current) {
        current = next;
        setChapter(next);
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(resolve);
    };

    resolve();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [loading]);

  /* Accent hue travels across the UI and into the WebGL aurora */
  useEffect(() => {
    const [r, g, b] = chapterById(chapter).accent;
    const root = document.documentElement;
    const proxy = {
      r: shaderAccent.r * 255,
      g: shaderAccent.g * 255,
      b: shaderAccent.b * 255,
    };

    const tween = gsap.to(proxy, {
      r,
      g,
      b,
      duration: 1.1,
      ease: "power2.out",
      onUpdate: () => {
        const cr = Math.round(proxy.r);
        const cg = Math.round(proxy.g);
        const cb = Math.round(proxy.b);
        root.style.setProperty("--accent", `rgb(${cr} ${cg} ${cb})`);
        root.style.setProperty("--accent-soft", `rgb(${cr} ${cg} ${cb} / 0.35)`);
        shaderAccent.r = proxy.r / 255;
        shaderAccent.g = proxy.g / 255;
        shaderAccent.b = proxy.b / 255;
      },
    });

    return () => {
      tween.kill();
    };
  }, [chapter]);

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
      <ChapterRail chapter={chapter} />
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <Nav ready={ready} onOpenCmd={() => setCmdOpen(true)} />

      <main className="relative z-10">
        <div data-chapter="intro">
          <Hero ready={ready} />
          <Strip />
        </div>

        <div className="hairline-div mx-auto max-w-7xl" />

        <div data-chapter="studio">
          <About />
          <MaskZoom />
        </div>

        <div className="hairline-div mx-auto max-w-7xl" />

        <div data-chapter="services">
          <Capabilities />
          <Services />
        </div>

        <div className="hairline-div mx-auto max-w-7xl" />

        <div data-chapter="process">
          <Process />
          <Stats />
        </div>

        <div className="hairline-div mx-auto max-w-7xl" />

        <div data-chapter="works">
          <Learning />
          <Works />
          <Marketplaces />
        </div>

        <div className="hairline-div mx-auto max-w-7xl" />

        <div data-chapter="people">
          <Founder />
          <Team />
          <WhyUs />
        </div>

        <div className="hairline-div mx-auto max-w-7xl" />

        <div data-chapter="contact">
          <ContactSection />
        </div>
      </main>

      <div className="relative z-10">
        <Footer />
      </div>

      {/* Chapter read-out, mirrors the rail for narrow viewports */}
      <div className="pointer-events-none fixed bottom-5 left-5 z-[70] hidden items-center gap-2 rounded-full border border-white/12 bg-[#04050c]/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/70 backdrop-blur md:flex xl:hidden">
        <span className="h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />
        {CHAPTERS.find((c) => c.id === chapter)?.index} ·{" "}
        {CHAPTERS.find((c) => c.id === chapter)?.label}
      </div>
    </div>
  );
}
