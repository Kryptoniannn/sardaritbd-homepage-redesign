import { useEffect, useRef, useState } from "react";
import { gsap, safeRefresh } from "../gsapSetup";
import { WORKS } from "../data";
import { ArrowIcon, Button, Magnetic, SectionTag, SplitWords } from "../ui";

export default function Works() {
  const secRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bgWordRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef<HTMLSpanElement>(null);
  const [selected, setSelected] = useState<(typeof WORKS)[number] | null>(null);

  useEffect(() => {
    const sec = secRef.current;
    const track = trackRef.current;
    if (!sec || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const getDist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const cards = gsap.utils.toArray<HTMLElement>(".work-card", track);
      const innerImgs = gsap.utils.toArray<HTMLElement>(".work-img", track);

      const tween = gsap.to(track, {
        x: () => -getDist(),
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: () => `+=${Math.max(600, getDist())}`,
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (barRef.current) {
              barRef.current.style.transform = `scaleX(${self.progress})`;
            }
            if (idxRef.current) {
              const cur = Math.min(WORKS.length, Math.max(1, Math.ceil(self.progress * WORKS.length)));
              idxRef.current.textContent = `0${cur}`;
            }
            const vel = gsap.utils.clamp(-8, 8, self.getVelocity() / -300);
            gsap.to(cards, {
              skewX: vel,
              rotateY: vel * 0.7,
              transformPerspective: 1000,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
            });
          },
        },
      });

      // Counter-parallax giant background watermark
      if (bgWordRef.current) {
        gsap.fromTo(
          bgWordRef.current,
          { xPercent: 8 },
          {
            xPercent: -35,
            ease: "none",
            scrollTrigger: {
              trigger: sec,
              start: "top top",
              end: () => `+=${Math.max(600, getDist())}`,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      // Optical inner image pan inside horizontal containerAnimation
      innerImgs.forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -7, scale: 1.16 },
          {
            xPercent: 7,
            scale: 1.16,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          }
        );
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section id="works" ref={secRef} className="relative overflow-hidden bg-[#060815]">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-55" />

        <div className="relative flex h-screen flex-col justify-center overflow-hidden">
          {/* Giant Scrubbed Background Watermark */}
          <div
            ref={bgWordRef}
            aria-hidden="true"
            className="font-display pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-[24vw] font-extrabold leading-none text-outline opacity-[0.11] will-change-transform"
          >
            RECENT WORKS · SARDAR IT · RECENT WORKS
          </div>

          {/* Horizontal Cinema Track */}
          <div
            ref={trackRef}
            className="relative z-10 flex w-max items-center gap-7 px-6 will-change-transform md:gap-12 md:px-16"
          >
            {/* Intro Slide */}
            <div className="w-[84vw] shrink-0 md:w-[34vw] md:max-w-[480px]">
              <SectionTag className="mb-7">Recent Works</SectionTag>
              <h2 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight md:text-6xl">
                <SplitWords text="Our proud [projects] make us excel" />
              </h2>
              <p className="mt-6 text-base leading-relaxed text-white/65">
                Bring to the table win-win survival strategies to dotted proactive domination. At the end of the going
                forward, a new normal that has evolved generation.
              </p>
              <div className="mt-9 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.26em] text-[#ffd000]">
                <span>Scroll to Glide</span>
                <span>→</span>
              </div>
            </div>

            {/* 4 Authentic Sardar IT Portfolio Cards */}
            {WORKS.map((w, i) => (
              <article
                key={i}
                data-cursor="INSPECT"
                onClick={() => setSelected(w)}
                className="work-card group relative w-[82vw] shrink-0 cursor-pointer will-change-transform md:w-[40vw] md:max-w-[650px]"
              >
                <div className="spot relative aspect-[4/3] overflow-hidden rounded-[2rem] p-2 shadow-[0_30px_90px_rgba(0,0,0,0.7)]">
                  <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] bg-[#0b1026]">
                    <img
                      src={w.img}
                      alt={`${w.tech} – ${w.cat}`}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onLoad={() => safeRefresh(200)}
                      className="work-img h-full w-full object-cover object-top transition-[filter] duration-700 group-hover:brightness-110 will-change-transform"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04050c]/85 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-90" />

                    <span className="glass absolute left-5 top-5 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#ffd000]">
                      {w.tech}
                    </span>

                    <span className="absolute right-5 top-5 flex h-12 w-12 -translate-y-2 items-center justify-center rounded-full bg-[#ffd000] text-[#04050c] opacity-0 shadow-xl transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowIcon className="h-5 w-5" />
                    </span>

                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">
                          Featured Case Study
                        </p>
                        <h3 className="font-display mt-1 text-2xl font-extrabold text-white md:text-3xl">{w.cat}</h3>
                      </div>
                      <span className="font-display text-5xl font-extrabold text-outline-gold">0{i + 1}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* End CTA Slide */}
            <div className="flex w-[72vw] shrink-0 flex-col items-start justify-center pr-12 md:w-[28vw]">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#ffd000]">Next Project</p>
              <h3 className="font-display mt-3 text-3xl font-extrabold md:text-5xl">
                Ready to build yours with Sardar IT?
              </h3>
              <div className="mt-7">
                <Magnetic>
                  <Button href="#contact">
                    Start Your Project <ArrowIcon />
                  </Button>
                </Magnetic>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Rail */}
          <div className="absolute bottom-8 left-6 right-6 z-20 flex items-center gap-6 md:left-16 md:right-16">
            <div className="font-display flex items-baseline gap-1 text-sm font-bold tabular-nums">
              <span ref={idxRef} className="text-xl text-[#ffd000]">
                01
              </span>
              <span className="text-white/40">/ 0{WORKS.length}</span>
            </div>
            <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/12">
              <div
                ref={barRef}
                style={{ transform: "scaleX(0)" }}
                className="h-full origin-left bg-gradient-to-r from-[#1946e0] via-[#6f93ff] to-[#ffd000]"
              />
            </div>
            <span className="hidden text-[11px] uppercase tracking-[0.25em] text-white/45 sm:block">
              Click any card to inspect
            </span>
          </div>
        </div>
      </section>

      {/* Project Quick-Inspect Lightbox Modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-[220] flex items-center justify-center bg-[#04050c]/85 p-4 backdrop-blur-xl md:p-10"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] p-4 shadow-[0_30px_120px_rgba(25,70,224,0.5)] md:p-6"
          >
            <div className="mb-4 flex items-center justify-between px-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#ffd000]">{selected.tech}</span>
                <h3 className="font-display text-2xl font-extrabold text-white">{selected.cat}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#ffd000] hover:text-[#04050c]"
              >
                Close ✕
              </button>
            </div>
            <img
              src={selected.img}
              alt={`${selected.tech} – ${selected.cat}`}
              referrerPolicy="no-referrer"
              className="w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
