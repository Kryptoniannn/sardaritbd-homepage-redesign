import { useEffect, useRef, useState } from "react";
import { gsap } from "../gsapSetup";
import { IMG, PROCESS } from "../data";
import { SectionTag, SplitWords } from "../ui";

const PROC_IMGS = [IMG.proc1, IMG.proc2, IMG.proc3, IMG.proc4];

export default function Process() {
  const secRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const sec = secRef.current;
    const pin = pinRef.current;
    if (!sec || !pin) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const frames = gsap.utils.toArray<HTMLElement>(".proc-frame", pin);
      const imgs = gsap.utils.toArray<HTMLElement>(".proc-img", pin);

      // Prepare frames 1..3 clipped at bottom
      frames.forEach((f, idx) => {
        if (idx > 0) {
          gsap.set(f, { clipPath: "inset(100% 0% 0% 0% round 28px)" });
        } else {
          gsap.set(f, { clipPath: "inset(0% 0% 0% 0% round 28px)" });
        }
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 0.75,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              PROCESS.length - 1,
              Math.floor(self.progress * PROCESS.length * 0.999)
            );
            setActiveIdx(idx);
            if (barRef.current) {
              barRef.current.style.transform = `scaleX(${self.progress})`;
            }
          },
        },
      });

      for (let i = 1; i < frames.length; i++) {
        const pos = i - 1;
        tl.to(
          frames[i],
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            duration: 1,
            ease: "power2.inOut",
          },
          pos
        )
          .fromTo(
            imgs[i],
            { scale: 1.28 },
            { scale: 1, duration: 1, ease: "power2.out" },
            pos
          )
          .to(
            imgs[i - 1],
            { scale: 0.9, filter: "brightness(0.45)", duration: 1, ease: "power2.inOut" },
            pos
          );
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="process" ref={secRef} className="relative overflow-hidden">
      <div className="aurora blob2 pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-[#1946e0]/45" />

      {/* Desktop Pinned Split-Screen Stage */}
      <div ref={pinRef} className="hidden min-h-screen flex-col justify-center py-20 lg:flex">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Left Narrative & Interactive Step Rail */}
          <div>
            <SectionTag className="mb-6">Working Process</SectionTag>
            <h2 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight xl:text-6xl">
              <SplitWords text="Our Working Process - How [We Work] For Our Customers" />
            </h2>

            {/* Horizontal Laser Progress Bar */}
            <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                ref={barRef}
                style={{ transform: "scaleX(0.25)" }}
                className="h-full origin-left bg-gradient-to-r from-[#1946e0] via-[#6f93ff] to-[#ffd000]"
              />
            </div>

            {/* 4 Stages Accordion / Telemetry */}
            <div className="mt-8 space-y-3">
              {PROCESS.map((p, i) => {
                const isAct = activeIdx === i;
                return (
                  <div
                    key={p.t}
                    onClick={() => setActiveIdx(i)}
                    className={`cursor-pointer rounded-2xl border p-5 transition-all duration-500 ${
                      isAct
                        ? "border-[#ffd000]/60 bg-white/[0.07] shadow-[0_14px_50px_rgba(25,70,224,0.28)]"
                        : "border-white/8 bg-white/[0.02] opacity-55 hover:opacity-85"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-extrabold transition-colors duration-300 ${
                            isAct ? "bg-[#ffd000] text-[#04050c]" : "bg-white/10 text-white/70"
                          }`}
                        >
                          0{i + 1}
                        </span>
                        <h3 className="font-display text-2xl font-extrabold text-white">
                          {p.t}
                          <span className="text-[#ffd000]">:</span>
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#ffd000]">
                        {isAct ? "Active Stage" : `Step 0${i + 1}`}
                      </span>
                    </div>
                    <div
                      className={`grid transition-all duration-500 ${
                        isAct ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <p className="overflow-hidden pl-14 text-sm leading-relaxed text-white/75 xl:text-base">{p.d}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 4-Layer Clip-Path Aperture Stack */}
          <div className="relative mx-auto aspect-[4/4.6] w-full max-w-lg">
            <div className="pointer-events-none absolute -inset-4 rounded-[2.4rem] bg-gradient-to-tr from-[#1946e0]/50 via-transparent to-[#ffd000]/40 blur-2xl" />

            <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/15 bg-[#070a18] shadow-[0_30px_90px_rgba(0,0,0,0.75)]">
              {PROC_IMGS.map((src, i) => (
                <div key={src} className="proc-frame absolute inset-0 overflow-hidden rounded-[28px]">
                  <img
                    src={src}
                    alt={PROCESS[i].t}
                    referrerPolicy="no-referrer"
                    className="proc-img h-full w-full object-cover will-change-transform"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04050c]/90 via-transparent to-[#04050c]/25" />
                </div>
              ))}

              {/* Floating Step HUD Overlay */}
              <div className="absolute left-6 right-6 top-6 z-20 flex items-center justify-between">
                <span className="glass rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#ffd000]">
                  Phase 0{activeIdx + 1} / 04
                </span>
                <span className="font-display text-4xl font-extrabold text-white drop-shadow">
                  0{activeIdx + 1}
                </span>
              </div>

              <div className="glass absolute bottom-6 left-6 right-6 z-20 rounded-2xl p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#ffd000]">
                  {PROCESS[activeIdx].t}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-white/85">{PROCESS[activeIdx].d}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Responsive Timeline */}
      <div className="mx-auto max-w-3xl px-6 py-24 lg:hidden">
        <SectionTag className="mb-6">Working Process</SectionTag>
        <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
          <SplitWords text="Our Working Process - How [We Work] For Our Customers" />
        </h2>
        <div className="mt-14 space-y-10">
          {PROCESS.map((p, i) => (
            <div key={p.t} className="spot overflow-hidden rounded-3xl p-5">
              <img
                src={PROC_IMGS[i]}
                alt={p.t}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="aspect-[16/10] w-full rounded-2xl object-cover"
              />
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffd000] font-display text-sm font-extrabold text-[#04050c]">
                  0{i + 1}
                </span>
                <h3 className="font-display text-2xl font-extrabold">
                  {p.t}
                  <span className="text-[#ffd000]">:</span>
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/72">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
