import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { IMG, MARQUEE, SERVICES } from "../data";
import { ArrowIcon, Reveal, ScrambleText, SectionTag, SplitWords, Tilt, goTo, spotMove } from "../ui";

const PREVIEWS = [IMG.office1, IMG.proc2, IMG.proc3, IMG.learn2];

export default function Services() {
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cards = sec.querySelectorAll(".srv-card");
      gsap.fromTo(
        cards,
        {
          y: 110,
          opacity: 0,
          rotateY: -24,
          rotateX: 14,
          scale: 0.9,
          transformPerspective: 1100,
        },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          rotateX: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.13,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".srv-grid",
            start: "top 82%",
            once: true,
          },
        }
      );

      // Subtle scrubbed differential stagger on scroll
      cards.forEach((card, i) => {
        gsap.to(card, {
          yPercent: i % 2 === 1 ? -10 : 6,
          ease: "none",
          scrollTrigger: {
            trigger: ".srv-grid",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={secRef} className="relative overflow-hidden bg-[#060815] py-24 md:py-36">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-65" />
      <div className="aurora blob1 pointer-events-none absolute left-1/4 top-0 h-80 w-80 rounded-full bg-[#1946e0]/50" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <SectionTag className="mb-7">What We Do</SectionTag>
            <h2 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl">
              <SplitWords text="We Are Increasing [Business Success] With Technology" />
            </h2>
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-lg text-base leading-relaxed text-white/65 md:text-lg">
              SardarIT has compelling digital experiences that captivate audiences and drive meaningful connections. Our
              digital agency combines innovation, strategy, and expertise to fuel your online success. Your satisfaction
              is our top priority as we work and thrive together.
            </p>
          </Reveal>
        </div>

        {/* 4 Holographic 3D Service Cards */}
        <div className="srv-grid mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <div key={s.title} className={`srv-card ${i % 2 === 1 ? "lg:mt-12" : ""}`}>
              <Tilt max={9}>
                <div
                  onMouseMove={spotMove}
                  data-cursor="HIRE US"
                  onClick={() => goTo("#contact")}
                  className="spot group relative flex h-[28rem] cursor-pointer flex-col justify-between rounded-[2rem] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
                >
                  {/* Hover studio background reveal */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
                    <img
                      src={PREVIEWS[i % PREVIEWS.length]}
                      alt=""
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="h-full w-full scale-125 object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-28"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#04050c] via-[#060815]/80 to-[#1946e0]/20" />
                  </div>

                  {/* Top Icon + Outlined Index */}
                  <div
                    style={{ transform: "translateZ(42px)" }}
                    className="relative z-10 flex items-start justify-between"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-[0_12px_45px_rgba(25,70,224,0.45)] transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:shadow-[0_12px_45px_rgba(255,208,0,0.45)]">
                      <img src={s.icon} alt={s.title} referrerPolicy="no-referrer" className="h-14 w-14 object-contain" />
                    </div>
                    <span className="font-display text-5xl font-extrabold text-outline transition-all duration-500 group-hover:text-outline-gold">
                      {s.n}
                    </span>
                  </div>

                  {/* Bottom Content */}
                  <div style={{ transform: "translateZ(32px)" }} className="relative z-10 border-t border-white/10 pt-5 transition-colors duration-500 group-hover:border-[#ffd000]/50">
                    <h3 className="font-display text-2xl font-extrabold leading-tight text-white">
                      <ScrambleText text={s.title} />
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/68 transition-colors group-hover:text-white/90">
                      {s.text}
                    </p>
                    <a
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        goTo("#contact");
                      }}
                      className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.22em] text-[#ffd000]"
                    >
                      <span>Contact Us</span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ffd000]/15 transition-all duration-300 group-hover:bg-[#ffd000] group-hover:text-[#04050c]">
                        <ArrowIcon className="h-3.5 w-3.5" />
                      </span>
                    </a>
                  </div>
                </div>
              </Tilt>
            </div>
          ))}
        </div>

        {/* Interactive Capability Tag Matrix */}
        <Reveal delay={0.2} className="mt-16 border-t border-white/10 pt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
              Core Capabilities
            </span>
            <div className="flex flex-wrap gap-2.5">
              {MARQUEE.map((cap) => (
                <button
                  key={cap}
                  type="button"
                  onClick={() => goTo("#contact")}
                  className="glass rounded-full px-4 py-2 text-xs font-semibold text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ffd000]/60 hover:text-[#ffd000]"
                >
                  {cap} ➺
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
