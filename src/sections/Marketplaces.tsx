import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { IMG } from "../data";
import { SectionTag, SplitWords, Tilt } from "../ui";

const LOGOS = [
  { src: IMG.fiverr, name: "Fiverr", tag: "Level-Up Seller Hub", cls: "h-12 md:h-14" },
  { src: IMG.upwork, name: "Upwork", tag: "Enterprise & Agency", cls: "h-20 md:h-24" },
  { src: IMG.freelancer, name: "Freelancer", tag: "Global Bidding", cls: "h-12 md:h-14" },
  { src: IMG.pph, name: "PeoplePerHour", tag: "Certified Talent", cls: "h-12 md:h-14" },
];

export default function Marketplaces() {
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".mkt-pod",
        { y: 70, opacity: 0, rotateX: -22, scale: 0.9, transformPerspective: 1000 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 1.1,
          stagger: 0.12,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".mkt-grid",
            start: "top 84%",
            once: true,
          },
        }
      );
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={secRef} className="relative overflow-hidden py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <SectionTag className="mb-7">Where We Deliver</SectionTag>
          <h2 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl">
            <SplitWords text="Target [Marketplaces]" />
          </h2>
        </div>

        {/* Central Sardar IT Core Node + Animated SVG Laser Circuits */}
        <div className="relative mt-14 hidden flex-col items-center lg:flex">
          <div className="relative z-10 flex items-center gap-3 rounded-full bg-white px-6 py-3 shadow-[0_0_60px_rgba(25,70,224,0.65)]">
            <img src={IMG.logo} alt="Sardar IT Core" referrerPolicy="no-referrer" className="h-7 w-auto" />
          </div>

          <svg viewBox="0 0 1000 110" className="h-24 w-full max-w-5xl overflow-visible" fill="none" aria-hidden="true">
            {[125, 375, 625, 875].map((x, idx) => (
              <g key={idx}>
                <path
                  d={`M 500 0 C 500 58, ${x} 42, ${x} 108`}
                  stroke="rgba(111,147,255,0.22)"
                  strokeWidth="1.5"
                />
                <path
                  d={`M 500 0 C 500 58, ${x} 42, ${x} 108`}
                  stroke="#ffd000"
                  strokeWidth="2"
                  strokeDasharray="10 38"
                  className="dash-flow"
                />
                <circle cx={x} cy="108" r="4" fill="#ffd000" />
              </g>
            ))}
          </svg>
        </div>

        {/* 4 Magnetic 3D Marketplace Pods */}
        <div className="mkt-grid mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
          {LOGOS.map((l) => (
            <div key={l.name} className="mkt-pod">
              <Tilt max={12}>
                <div
                  data-cursor={l.name.toUpperCase()}
                  className="group relative flex h-48 flex-col items-center justify-between overflow-hidden rounded-[2rem] border border-white/20 bg-white p-7 shadow-[0_24px_70px_rgba(0,0,0,0.5)] transition-shadow duration-500 hover:shadow-[0_24px_80px_rgba(25,70,224,0.5)]"
                >
                  {/* Animated Holographic Sweep */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-[#1946e0]/15 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                  <div className="flex w-full items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-[#04050c]/45">
                    <span>{l.tag}</span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>

                  <img
                    src={l.src}
                    alt={l.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className={`relative max-w-[82%] object-contain transition-transform duration-500 group-hover:scale-110 ${l.cls}`}
                  />

                  <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#1946e0]">
                    Active Marketplace ↗
                  </span>
                </div>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
