import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { IMG } from "../data";
import ThreeStage from "../ThreeStage";
import { ArrowIcon, Button, Counter, Magnetic, SplitWords, Tilt } from "../ui";

const CHIPS = [
  { t: "Web Developers", pos: "-left-4 top-[34%] lg:-left-11", z: 70 },
  { t: "Graphics Designers", pos: "-right-3 top-[22%] lg:-right-9", z: 85 },
  { t: "Digital Marketers", pos: "-left-5 bottom-[27%] lg:-left-12", z: 65 },
  { t: "Code Poets", pos: "left-10 -bottom-7", z: 90 },
];

export default function Hero({ ready }: { ready: boolean }) {
  const secRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;

    const ctx = gsap.context(() => {
      if (!ready) {
        gsap.set(".hero-stagger", { y: 32, opacity: 0 });
        gsap.set(stageRef.current, { y: 60, scale: 0.9, rotateY: -10, opacity: 0, transformPerspective: 1200 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(".hero-stagger", {
        y: 0,
        opacity: 1,
        duration: 0.95,
        stagger: 0.09,
        delay: 0.05,
      }).to(
        stageRef.current,
        {
          y: 0,
          scale: 1,
          rotateY: 0,
          opacity: 1,
          duration: 1.25,
        },
        0.12
      );

      gsap.utils.toArray<HTMLElement>(".hero-chip").forEach((chip, idx) => {
        gsap.to(chip, {
          y: idx % 2 === 0 ? -12 : 12,
          x: idx % 2 === 0 ? 5 : -5,
          duration: 2.6 + idx * 0.45,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      gsap.to(leftRef.current, {
        yPercent: -18,
        opacity: 0.18,
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(stageRef.current, {
        yPercent: -12,
        scale: 1.05,
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      if (sealRef.current) {
        gsap.to(sealRef.current, {
          rotation: 540,
          ease: "none",
          scrollTrigger: {
            trigger: sec,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      }
    }, sec);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="home"
      ref={secRef}
      className="relative min-h-screen overflow-hidden pb-24 pt-32 md:pb-32 md:pt-40"
    >
      <div className="aurora blob1 pointer-events-none absolute -left-40 -top-40 h-[58vh] w-[58vw] rounded-full bg-[#1946e0]" />
      <div className="aurora blob2 pointer-events-none absolute -right-32 top-1/4 h-[45vh] w-[42vw] rounded-full bg-[#3d6bff]/70" />
      <div className="aurora blob1 pointer-events-none absolute bottom-0 left-1/3 h-[26vh] w-[30vw] rounded-full bg-[#ffd000]/22" />
      <div className="grid-bg pointer-events-none absolute inset-0" />

      {/* Real-time Three.js 3D Crystal Sculpture + Gyroscope Rings + Depth Galaxy */}
      <ThreeStage />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#04050c] to-transparent" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.08fr_0.92fr] 2xl:pl-24">
        {/* Left Copy */}
        <div ref={leftRef} className="relative">
          <img
            src={IMG.arrow}
            alt=""
            referrerPolicy="no-referrer"
            className="hero-stagger pointer-events-none absolute -left-8 -top-10 hidden h-16 w-auto opacity-85 brightness-150 xl:block"
          />

          <div className="hero-stagger glass mb-7 inline-flex items-center gap-3 rounded-full py-1.5 pl-2 pr-5 text-xs font-medium tracking-wide text-white/85">
            <span className="rounded-full bg-[#ffd000] px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#04050c]">
              SardarIT Solution
            </span>
            <span>Activities · Global Freelancing Powerhouse</span>
          </div>

          <div className="relative">
            <h1 className="font-display text-[2.65rem] font-extrabold leading-[1.04] tracking-tight sm:text-6xl xl:text-[5.25rem]">
              <SplitWords
                text="We Are Leading [Freelancing] Services in the Global Community"
                highlightClassName="font-serif-ed italic font-normal tracking-normal px-1 text-[1.12em]"
                active={ready}
                stagger={0.045}
                delay={0.05}
              />
            </h1>
          </div>

          <p className="hero-stagger mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg">
            Sardar IT is one of the best freelancing-based IT service provider companies in Bangladesh. We have Web
            Developers, Graphics Designers, Digital marketers, and Code Poets.
          </p>
          <p className="hero-stagger mt-3 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
            Our commitment to excellence is unwavering. We carefully vet freelancers to ensure you&apos;re working with
            the best in the industry, delivering high-quality results every time.
          </p>

          <div className="hero-stagger mt-9 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Button href="#about">
                Learn More <ArrowIcon />
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href="#services" variant="ghost">
                Our Services <ArrowIcon />
              </Button>
            </Magnetic>
          </div>

          {/* Authentic 1.5k+ Clients Bar + Sparkline */}
          <div className="hero-stagger mt-12 flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-7">
            <div className="flex items-center gap-5">
              <div className="rounded-full bg-white/10 p-1.5 backdrop-blur">
                <img src={IMG.heroUsers} alt="Global clients" referrerPolicy="no-referrer" className="h-10 w-auto" />
              </div>
              <div className="h-9 w-px bg-white/15" />
              <p className="text-sm leading-snug text-white/75">
                Over{" "}
                <span className="font-display text-xl font-extrabold text-[#ffd000]">1.5k+ Client</span>
                <br />
                all over the world
              </p>
            </div>

            <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 sm:flex">
              <svg viewBox="0 0 80 26" className="h-6 w-16" fill="none" aria-hidden="true">
                <path
                  d="M2 22 L16 17 L28 19 L42 10 L56 12 L78 2"
                  stroke="#ffd000"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="78" cy="2" r="2.5" fill="#ffd000" />
              </svg>
              <div>
                <p className="font-mono-hud text-[9px] uppercase tracking-widest text-white/45">Satisfaction</p>
                <p className="font-display text-sm font-extrabold text-white">100% Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 3D Spatial Holographic Stage */}
        <div ref={stageRef} className="relative mx-auto w-full max-w-xl">
          <span className="font-mono-hud pointer-events-none absolute -right-4 -top-6 hidden text-xs text-[#ffd000]/60 sm:block">+</span>
          <span className="font-mono-hud pointer-events-none absolute -bottom-8 -left-4 hidden text-xs text-[#ffd000]/60 sm:block">+</span>

          <Tilt max={8} className="relative">
            <div className="pointer-events-none absolute -inset-5 rounded-[2.6rem] bg-gradient-to-br from-[#1946e0] via-[#3d6bff]/30 to-[#ffd000]/60 opacity-55 blur-2xl" />

            <div className="spot relative rounded-[2.1rem] p-2.5 shadow-[0_30px_110px_rgba(0,0,0,0.8)]">
              <div className="relative overflow-hidden rounded-[1.65rem]">
                <img
                  src={IMG.office1}
                  alt="Sardar IT team collaborating at Mirpur HQ"
                  referrerPolicy="no-referrer"
                  className="aspect-[4/4.35] w-full object-cover transition-transform duration-1000 hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04050c]/88 via-[#04050c]/15 to-[#1946e0]/20" />

                <div className="glass absolute right-4 top-4 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/90">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Live Studio · Mirpur HQ
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <div className="glass rounded-2xl px-4 py-3">
                    <p className="font-mono-hud text-[9px] uppercase tracking-[0.2em] text-white/60">Average Review</p>
                    <p className="font-display text-2xl font-extrabold">
                      4.9 <span className="text-[#ffd000]">★</span>
                    </p>
                  </div>
                  <div className="glass rounded-2xl px-4 py-3 text-right">
                    <p className="font-mono-hud text-[9px] uppercase tracking-[0.2em] text-white/60">Projects</p>
                    <p className="font-display text-2xl font-extrabold">
                      <Counter to={2} suffix="K+" />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{ transform: "translateZ(95px)" }}
              className="glass-bright absolute -left-6 -top-8 z-30 hidden w-40 overflow-hidden rounded-2xl p-1.5 shadow-2xl sm:block md:-left-10"
            >
              <img
                src={IMG.office3}
                alt="Sardar IT developers"
                referrerPolicy="no-referrer"
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
              <p className="font-mono-hud px-2 py-1.5 text-[9px] font-semibold uppercase tracking-wider text-white/85">
                45+ Experts
              </p>
            </div>

            <div
              style={{ transform: "translateZ(85px)" }}
              className="absolute -bottom-9 -right-4 h-32 w-32 md:-right-9 md:h-38 md:w-38"
            >
              <div className="absolute inset-0 rounded-full bg-white shadow-[0_0_65px_rgba(255,208,0,0.5)]" />
              <div className="spin-slow absolute inset-0">
                <img ref={sealRef} src={IMG.ring} alt="" referrerPolicy="no-referrer" className="h-full w-full" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <a
                  href="#works"
                  aria-label="Explore recent works"
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector("#works")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1946e0] text-white shadow-lg transition-transform hover:scale-110 hover:bg-[#ffd000] hover:text-[#04050c] md:h-14 md:w-14"
                >
                  <ArrowIcon className="h-5 w-5" />
                </a>
              </div>
            </div>

            {CHIPS.map((c) => (
              <div
                key={c.t}
                style={{ transform: `translateZ(${c.z}px)` }}
                className={`hero-chip glass absolute hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white shadow-2xl sm:flex ${c.pos}`}
              >
                <span className="h-2 w-2 rounded-full bg-[#ffd000] shadow-[0_0_10px_#ffd000]" />
                {c.t}
              </div>
            ))}
          </Tilt>
        </div>
      </div>
    </section>
  );
}
