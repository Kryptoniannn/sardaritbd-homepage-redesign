import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { IMG } from "../data";
import { ArrowIcon, Button, Counter, Magnetic, SplitWords, Tilt } from "../ui";

function ConstellationCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 1;
    let h = 1;
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; vx: number; vy: number; r: number; c: string };
    let ps: P[] = [];

    const resize = () => {
      const b = canvas.getBoundingClientRect();
      w = Math.max(1, b.width);
      h = Math.max(1, b.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(85, Math.max(24, Math.floor((w * h) / 17000)));
      ps = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        r: Math.random() * 1.9 + 0.6,
        c: Math.random() > 0.76 ? "255,208,0" : "115,152,255",
      }));
    };

    const onMove = (e: MouseEvent) => {
      const b = canvas.getBoundingClientRect();
      mouse.x = e.clientX - b.left;
      mouse.y = e.clientY - b.top;
    };

    const tick = () => {
      if (!document.hidden) {
        ctx.clearRect(0, 0, w, h);
        for (let i = 0; i < ps.length; i++) {
          const p = ps[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d > 0.5 && d < 170) {
            const force = ((170 - d) / 170) * 0.08;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
          p.vx *= 0.986;
          p.vy *= 0.986;
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) { p.x = 0; p.vx *= -1; }
          if (p.x > w) { p.x = w; p.vx *= -1; }
          if (p.y < 0) { p.y = 0; p.vy *= -1; }
          if (p.y > h) { p.y = h; p.vy *= -1; }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.c},0.92)`;
          ctx.fill();

          for (let j = i + 1; j < ps.length; j++) {
            const q = ps[j];
            const dd = Math.hypot(p.x - q.x, p.y - q.y);
            if (dd < 125) {
              ctx.strokeStyle = `rgba(115,152,255,${(1 - dd / 125) * 0.26})`;
              ctx.lineWidth = 0.65;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.stroke();
            }
          }
          if (d < 195) {
            ctx.strokeStyle = `rgba(255,208,0,${(1 - d / 195) * 0.55})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}

const CHIPS = [
  { t: "Web Developers", pos: "-left-4 top-[10%] md:-left-8", z: 70 },
  { t: "Graphics Designers", pos: "-right-3 top-[24%] md:-right-7", z: 85 },
  { t: "Digital Marketers", pos: "-left-5 bottom-[28%] md:-left-10", z: 65 },
  { t: "Code Poets", pos: "right-4 -bottom-4", z: 90 },
];

export default function Hero({ ready }: { ready: boolean }) {
  const secRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLImageElement>(null);
  const swooshRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;

    const ctx = gsap.context(() => {
      if (!ready) {
        gsap.set(".hero-stagger", { y: 36, opacity: 0 });
        gsap.set(stageRef.current, { y: 70, scale: 0.88, rotateY: -12, opacity: 0, transformPerspective: 1200 });
        if (swooshRef.current) gsap.set(swooshRef.current, { strokeDasharray: 320, strokeDashoffset: 320 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(".hero-stagger", {
        y: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.11,
        delay: 0.15,
      })
        .to(
          stageRef.current,
          {
            y: 0,
            scale: 1,
            rotateY: 0,
            opacity: 1,
            duration: 1.5,
          },
          0.25
        );

      if (swooshRef.current) {
        tl.to(
          swooshRef.current,
          { strokeDashoffset: 0, duration: 1.3, ease: "power3.out" },
          0.85
        );
      }

      // Floating chips organic oscillation
      gsap.utils.toArray<HTMLElement>(".hero-chip").forEach((chip, idx) => {
        gsap.to(chip, {
          y: idx % 2 === 0 ? -13 : 13,
          x: idx % 2 === 0 ? 5 : -5,
          duration: 2.6 + idx * 0.45,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });

      // Scroll-scrubbed cinematic camera exit
      gsap.to(leftRef.current, {
        yPercent: -18,
        opacity: 0.2,
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
      {/* Layered lighting */}
      <div className="aurora blob1 pointer-events-none absolute -left-40 -top-40 h-[58vh] w-[58vw] rounded-full bg-[#1946e0]" />
      <div className="aurora blob2 pointer-events-none absolute -right-32 top-1/4 h-[45vh] w-[42vw] rounded-full bg-[#3d6bff]/70" />
      <div className="aurora blob1 pointer-events-none absolute bottom-0 left-1/3 h-[26vh] w-[30vw] rounded-full bg-[#ffd000]/25" />
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <ConstellationCanvas />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#04050c] to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.08fr_0.92fr]">
        {/* Left Copy */}
        <div ref={leftRef} className="relative">
          {/* Sardar IT original floating arrow accent */}
          <img
            src={IMG.arrow}
            alt=""
            referrerPolicy="no-referrer"
            className="hero-stagger pointer-events-none absolute -left-8 -top-10 hidden h-16 w-auto opacity-80 brightness-150 xl:block"
          />

          <div className="hero-stagger glass mb-7 inline-flex items-center gap-3 rounded-full py-1.5 pl-2 pr-5 text-xs font-medium tracking-wide text-white/85">
            <span className="rounded-full bg-[#ffd000] px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#04050c]">
              Sardar IT
            </span>
            <span>Premier Freelancing &amp; IT Powerhouse · Bangladesh</span>
          </div>

          <div className="relative">
            <h1 className="font-display text-[2.65rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl xl:text-[5.25rem]">
              <SplitWords
                text="We Are Leading [Freelancing] Services in the Global Community"
                active={ready}
                chars
                delay={0.12}
              />
            </h1>
            <svg
              aria-hidden="true"
              viewBox="0 0 310 18"
              className="mt-2 h-4 w-56 text-[#ffd000] sm:w-72"
              fill="none"
            >
              <path
                ref={swooshRef}
                d="M4 13 C 82 2, 215 2, 306 11"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="hero-stagger mt-6 max-w-xl text-base leading-relaxed text-white/72 md:text-lg">
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

          {/* Authentic 1.5k+ Clients Bar */}
          <div className="hero-stagger mt-12 flex flex-wrap items-center gap-5 border-t border-white/10 pt-7">
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
        </div>

        {/* Right 3D Spatial Holographic Stage */}
        <div ref={stageRef} className="relative mx-auto w-full max-w-xl">
          <Tilt max={8} className="relative">
            {/* Ambient halo */}
            <div className="pointer-events-none absolute -inset-5 rounded-[2.6rem] bg-gradient-to-br from-[#1946e0] via-[#3d6bff]/30 to-[#ffd000]/60 opacity-55 blur-2xl" />

            {/* Primary Cinema Card */}
            <div className="spot relative rounded-[2.1rem] p-2.5 shadow-[0_30px_100px_rgba(0,0,0,0.75)]">
              <div className="relative overflow-hidden rounded-[1.65rem]">
                <img
                  src={IMG.office1}
                  alt="Sardar IT team collaborating at Mirpur HQ"
                  referrerPolicy="no-referrer"
                  className="aspect-[4/4.35] w-full object-cover transition-transform duration-1000 hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04050c]/85 via-[#04050c]/15 to-[#1946e0]/20" />

                {/* Top live status pill */}
                <div className="glass absolute left-4 top-4 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/90">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  Live Studio · Mirpur HQ
                </div>

                {/* Bottom telemetry */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                  <div className="glass rounded-2xl px-4 py-3">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Average Review</p>
                    <p className="font-display text-2xl font-extrabold">
                      4.9 <span className="text-[#ffd000]">★</span>
                    </p>
                  </div>
                  <div className="glass rounded-2xl px-4 py-3 text-right">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Projects</p>
                    <p className="font-display text-2xl font-extrabold">
                      <Counter to={2} suffix="K+" />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Floating Picture-in-Picture Plane */}
            <div
              style={{ transform: "translateZ(55px)" }}
              className="glass-bright absolute -left-6 -top-7 hidden w-40 overflow-hidden rounded-2xl p-1.5 shadow-2xl sm:block md:-left-10"
            >
              <img
                src={IMG.office3}
                alt="Sardar IT developers"
                referrerPolicy="no-referrer"
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
              <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/80">
                45+ Experts
              </p>
            </div>

            {/* Rotating Official Seal (Velocity-Scrubbed + Continuous Spin) */}
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

            {/* 4 Floating 3D Discipline Chips */}
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
