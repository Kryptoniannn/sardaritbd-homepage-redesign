import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { STATS } from "../data";
import { Counter, SectionTag, SplitWords, Tilt, spotMove } from "../ui";

const PCTS = [0.92, 0.88, 0.98, 1.0, 0.85, 0.94];

export default function Stats() {
  const secRef = useRef<HTMLElement>(null);
  const vaultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    const vault = vaultRef.current;
    if (!sec || !vault) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Scrubbed 3D vault expansion
      gsap.fromTo(
        vault,
        { scale: 0.9, rotateX: 8, transformPerspective: 1200 },
        {
          scale: 1,
          rotateX: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sec,
            start: "top 92%",
            end: "top 35%",
            scrub: 0.6,
          },
        }
      );

      // Stagger cards + draw SVG radial rings
      gsap.fromTo(
        ".stat-card",
        { y: 70, opacity: 0, scale: 0.92 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.05,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: vault,
            start: "top 75%",
            once: true,
          },
        }
      );

      gsap.utils.toArray<SVGCircleElement>(".stat-arc", vault).forEach((arc, i) => {
        const c = 2 * Math.PI * 18;
        gsap.fromTo(
          arc,
          { strokeDashoffset: c },
          {
            strokeDashoffset: c * (1 - PCTS[i % PCTS.length]),
            duration: 2.1,
            delay: 0.15 + i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: vault,
              start: "top 75%",
              once: true,
            },
          }
        );
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  const circ = 2 * Math.PI * 18;

  return (
    <section ref={secRef} className="relative px-4 py-16 md:px-8 md:py-24">
      <div
        ref={vaultRef}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/15 bg-gradient-to-br from-[#102266] via-[#090f2b] to-[#04050c] px-6 py-20 shadow-[0_35px_120px_rgba(0,0,0,0.8)] will-change-transform md:rounded-[3.5rem] md:px-14 md:py-28"
      >
        <div className="aurora blob1 pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#1946e0]" />
        <div className="aurora blob2 pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-[#ffd000]/30" />
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-75" />

        <div className="relative text-center">
          <SectionTag className="mb-7">Our Companies</SectionTag>
          <h2 className="font-display mx-auto max-w-4xl text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl">
            <SplitWords text="We run all kinds of [IT SERVICES] that grow your success" />
          </h2>
        </div>

        <div className="relative mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((s, i) => (
            <div key={s.label} className="stat-card">
              <Tilt max={7}>
                <div onMouseMove={spotMove} className="spot group rounded-[2rem] p-8 md:p-9">
                  <div className="relative z-10 flex items-start justify-between">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/50">
                      0{i + 1}
                    </span>
                    <svg className="h-11 w-11 -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
                      <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" />
                      <circle
                        className="stat-arc"
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="#ffd000"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={circ}
                      />
                    </svg>
                  </div>

                  <div className="relative z-10 mt-4">
                    <div className="font-display text-6xl font-extrabold leading-none tracking-tight md:text-7xl">
                      <Counter to={s.to} dec={s.dec} suffix={s.suffix} />
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                      <span className="h-[2px] w-10 bg-[#ffd000] transition-all duration-500 group-hover:w-20" />
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">{s.label}</p>
                    </div>
                  </div>
                </div>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
