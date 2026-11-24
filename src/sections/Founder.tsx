import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { IMG, TEAM } from "../data";
import ParallaxImg from "../ParallaxImg";
import { Counter, Reveal, SectionTag, SplitWords, spotMove } from "../ui";

const JOURNEY = [
  { n: "01", k: "Origin", v: "1 PC in Bedroom" },
  { n: "02", k: "Team Family", v: "30+ Members" },
  { n: "03", k: "Mentorship", v: "150+ Trained" },
  { n: "04", k: "Mission", v: "Zero Unemployment" },
];

export default function Founder() {
  const ceo = TEAM[0];
  const secRef = useRef<HTMLElement>(null);
  const sigRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".fnd-pill",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".fnd-pills",
            start: "top 86%",
            once: true,
          },
        }
      );

      if (sigRef.current) {
        gsap.fromTo(
          sigRef.current,
          { strokeDasharray: 280, strokeDashoffset: 280 },
          {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sigRef.current,
              start: "top 90%",
              once: true,
            },
          }
        );
      }
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={secRef} className="relative overflow-hidden py-24 md:py-36">
      <div className="aurora blob1 pointer-events-none absolute -right-40 top-0 h-[28rem] w-[28rem] rounded-full bg-[#1946e0]/50" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        {/* Architectural Portrait Stage */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-[#1946e0] to-[#ffd000] opacity-30 blur-3xl" />

          {/* Architectural corner brackets */}
          <span className="pointer-events-none absolute -left-3 -top-3 z-20 h-8 w-8 border-l-2 border-t-2 border-[#ffd000]" />
          <span className="pointer-events-none absolute -bottom-3 -right-3 z-20 h-8 w-8 border-b-2 border-r-2 border-[#ffd000]" />

          <ParallaxImg
            src={ceo.img}
            alt="Md Mamunur Roshid, Founder and CEO of Sardar IT"
            cursor="FOUNDER"
            className="aspect-square w-full"
            speed={7}
          />

          <div className="glass-bright absolute -bottom-6 right-2 z-20 rounded-2xl px-6 py-4 shadow-2xl md:-right-8">
            <p className="font-display text-4xl font-extrabold">
              <Counter to={150} suffix="+" />
            </p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/70">Entrepreneurs &amp; Members Trained</p>
          </div>

          <div className="absolute -left-6 -top-6 z-20 hidden h-24 w-24 rounded-full bg-white p-4 shadow-xl md:block">
            <img src={IMG.shape} alt="" referrerPolicy="no-referrer" className="spin-slow h-full w-full object-contain" />
          </div>
        </div>

        {/* Founder Story & Journey Milestones */}
        <div>
          <SectionTag className="mb-7">The Visionary</SectionTag>
          <h2 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl">
            <SplitWords text="Meet Sardar IT [Genius]" />
          </h2>

          <Reveal delay={0.1}>
            <p className="mt-8 text-base leading-relaxed text-white/78 md:text-lg">
              <span className="font-bold text-[#ffd000]">Mamunur Roshid</span> is a talented entrepreneur, trainer, web
              developer, and dreamer. He is the founder and CEO of Sardar IT. Sardar IT&apos;s journey started with a
              single PC in the bedroom. Currently a family of 30+ members. Moreover, he has trained 150+ members. He
              dreams of eliminating unemployment in Bangladesh and establishing the IT sector as an icon of success
              worldwide. In continuation of that, he now provides various services from online to offline training along
              with the freelancing marketplace and continues to contribute to the creation of entrepreneurs.
            </p>
          </Reveal>

          {/* 4-Step Founder Evolution Grid */}
          <div className="fnd-pills mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {JOURNEY.map((j) => (
              <div key={j.n} onMouseMove={spotMove} className="fnd-pill spot rounded-2xl p-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffd000]">{j.k}</span>
                <p className="font-display mt-1 text-sm font-extrabold text-white">{j.v}</p>
              </div>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8">
              <div className="flex items-center gap-5">
                <div className="h-14 w-1.5 rounded-full bg-gradient-to-b from-[#1946e0] to-[#ffd000]" />
                <div>
                  <p className="font-display text-3xl font-extrabold md:text-4xl">Md Mamunur Roshid</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#ffd000]">
                    Founder and CEO · Sardar IT
                  </p>
                </div>
              </div>

              <svg viewBox="0 0 180 42" className="h-10 w-36 text-[#ffd000]/80" fill="none" aria-hidden="true">
                <path
                  ref={sigRef}
                  d="M6 32 C 28 6, 42 36, 62 18 C 78 4, 92 34, 118 14 C 136 2, 150 28, 174 16"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
