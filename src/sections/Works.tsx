import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap, safeRefresh } from "../gsapSetup";
import { WORKS } from "../data";
import { ArrowIcon, Button, Magnetic, SectionTag, SplitWords } from "../ui";

const subscribeDesktop = (cb: () => void) => {
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

const CUBE_FACES = [
  { rx: 0, ry: 0 },
  { rx: 0, ry: -90 },
  { rx: 0, ry: -180 },
  { rx: 0, ry: -270 },
];

function ProjectCube({
  onInspect,
}: {
  onInspect: (w: (typeof WORKS)[number]) => void;
}) {
  const cubeRef = useRef<HTMLDivElement>(null);
  const [face, setFace] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const iv = window.setInterval(() => {
      setFace((f) => (f + 1) % WORKS.length);
    }, 3200);
    return () => window.clearInterval(iv);
  }, [paused]);

  useEffect(() => {
    const el = cubeRef.current;
    if (!el) return;
    const target = CUBE_FACES[face];
    gsap.to(el, {
      rotateX: target.rx - 7,
      rotateY: target.ry - 14,
      duration: 1.15,
      ease: "expo.out",
    });
  }, [face]);

  return (
    <div
      className="mt-7 flex items-center gap-5"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* 3D Cube Stage */}
      <div
        style={{ perspective: "900px" }}
        className="relative h-32 w-32 shrink-0 sm:h-36 sm:w-36"
      >
        <div
          ref={cubeRef}
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(-7deg) rotateY(-14deg)",
          }}
          className="relative h-full w-full will-change-transform"
        >
          {WORKS.map((w, idx) => {
            const angle = idx * 90;
            const half = 68;
            return (
              <button
                key={idx}
                type="button"
                data-cursor="3D VIEW"
                onClick={() => onInspect(w)}
                style={{
                  transform: `rotateY(${angle}deg) translateZ(${half}px)`,
                  backfaceVisibility: "hidden",
                }}
                className="group absolute inset-0 overflow-hidden rounded-2xl border border-white/25 bg-[#0a0f24] shadow-[0_14px_40px_rgba(0,0,0,0.7)]"
              >
                <img
                  src={w.img}
                  alt={w.cat}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04050c]/90 via-transparent to-transparent" />
                <span className="font-mono-hud absolute bottom-2 left-2.5 text-[9px] font-bold uppercase tracking-widest text-[#ffd000]">
                  {w.tech}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cube Face Controls */}
      <div className="min-w-0">
        <p className="font-mono-hud text-[9px] uppercase tracking-[0.26em] text-white/45">
          Interactive 3D Cube
        </p>
        <p className="font-display mt-1 truncate text-base font-bold text-white">
          {WORKS[face].cat}
        </p>
        <div className="mt-2.5 flex items-center gap-1.5">
          {WORKS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setFace(idx)}
              className={`font-mono-hud rounded-full px-2.5 py-1 text-[10px] font-bold transition-all ${
                face === idx
                  ? "bg-[#ffd000] text-[#04050c]"
                  : "border border-white/15 bg-white/[0.04] text-white/60 hover:text-white"
              }`}
            >
              0{idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Works() {
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true
  );
  const secRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bgWordRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef<HTMLSpanElement>(null);
  const [selected, setSelected] = useState<(typeof WORKS)[number] | null>(null);

  useEffect(() => {
    const sec = secRef.current;
    const track = trackRef.current;
    if (!sec || !track || !isDesktop) return;
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
            const vel = gsap.utils.clamp(-7.5, 7.5, self.getVelocity() / -310);
            gsap.to(cards, {
              skewX: vel,
              rotateY: vel * 0.7,
              transformPerspective: 1100,
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
            });
          },
        },
      });

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

      innerImgs.forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -7, scale: 1.15 },
          {
            xPercent: 7,
            scale: 1.15,
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
  }, [isDesktop]);

  useEffect(() => {
    if (isDesktop) return;
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const max = Math.max(1, track.scrollWidth - track.clientWidth);
      const p = track.scrollLeft / max;
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (idxRef.current) {
        const cur = Math.min(WORKS.length, Math.max(1, Math.ceil(p * WORKS.length) || 1));
        idxRef.current.textContent = `0${cur}`;
      }
    };
    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [isDesktop]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <>
      <section id="works" ref={secRef} className="relative overflow-hidden bg-[#060815]">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-55" />

        <div className={`relative flex flex-col justify-center overflow-hidden ${isDesktop ? "h-screen" : "py-20"}`}>
          <div
            ref={bgWordRef}
            aria-hidden="true"
            className="font-display pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap text-[24vw] font-extrabold leading-none text-outline opacity-[0.1] will-change-transform"
          >
            RECENT WORKS · SARDAR IT · RECENT WORKS
          </div>

          <div
            ref={trackRef}
            className={`rail-scroll relative z-10 flex items-center gap-7 px-6 md:gap-12 md:px-16 ${
              isDesktop ? "w-max will-change-transform" : "snap-x snap-mandatory overflow-x-auto pb-8"
            }`}
          >
            {/* Intro Slide + Little-Troop-inspired Interactive 3D Tumble Cube */}
            <div className="w-[84vw] shrink-0 snap-center md:w-[36vw] md:max-w-[500px]">
              <SectionTag className="mb-6">Recent Works</SectionTag>
              <h2 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight md:text-6xl">
                <SplitWords
                  text="Our proud [projects] make us excel"
                  highlightClassName="font-serif-ed italic font-normal"
                />
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-white/65 md:text-base">
                Bring to the table win-win survival strategies to dotted proactive domination. At the end of the going
                forward, a new normal that has evolved generation.
              </p>

              <ProjectCube onInspect={setSelected} />
            </div>

            {/* 4 Browser-Framed Case Study Cards */}
            {WORKS.map((w, i) => (
              <article
                key={i}
                data-cursor="INSPECT"
                onClick={() => setSelected(w)}
                className="work-card group relative w-[82vw] shrink-0 cursor-pointer snap-center will-change-transform md:w-[42vw] md:max-w-[660px]"
              >
                <div className="spot relative overflow-hidden rounded-[2rem] p-2.5 shadow-[0_32px_95px_rgba(0,0,0,0.75)]">
                  <div className="mb-2 flex items-center justify-between rounded-t-[1.35rem] border border-white/8 bg-[#0b1024]/90 px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="font-mono-hud truncate px-3 text-[10px] tracking-wider text-white/45">
                      sardaritbd.com/works/{w.tech.toLowerCase()}
                    </span>
                    <span className="font-mono-hud text-[10px] font-bold text-[#ffd000]">0{i + 1}</span>
                  </div>

                  <div className="relative aspect-[4/2.9] overflow-hidden rounded-[1.35rem] bg-[#0b1026]">
                    <img
                      src={w.img}
                      alt={`${w.tech} – ${w.cat}`}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onLoad={() => safeRefresh(200)}
                      className="work-img h-full w-full object-cover object-top transition-[filter] duration-700 group-hover:brightness-110 will-change-transform"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04050c]/92 via-transparent to-transparent opacity-65 transition-opacity duration-500 group-hover:opacity-90" />

                    <span className="glass absolute left-4 top-4 rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#ffd000]">
                      {w.tech}
                    </span>

                    <span className="absolute right-4 top-4 flex h-11 w-11 -translate-y-2 items-center justify-center rounded-full bg-[#ffd000] text-[#04050c] opacity-0 shadow-xl transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowIcon className="h-5 w-5" />
                    </span>

                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                      <div>
                        <p className="font-mono-hud text-[10px] uppercase tracking-[0.24em] text-white/60">
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
            <div className="flex w-[72vw] shrink-0 snap-center flex-col items-start justify-center pr-12 md:w-[28vw]">
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

          <div
            className={`z-20 flex items-center gap-6 ${
              isDesktop ? "absolute bottom-8 left-6 right-6 md:left-16 md:right-28" : "mt-2 px-6"
            }`}
          >
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
              Click cube or any card to inspect
            </span>
          </div>
        </div>
      </section>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          className="fixed inset-0 z-[220] flex items-center justify-center bg-[#04050c]/88 p-4 backdrop-blur-xl md:p-10"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="glass-bright relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] p-4 shadow-[0_30px_120px_rgba(25,70,224,0.5)] md:p-6"
          >
            <div className="mb-4 flex items-center justify-between px-2">
              <div>
                <span className="font-mono-hud text-xs font-bold uppercase tracking-[0.25em] text-[#ffd000]">
                  {selected.tech}
                </span>
                <h3 className="font-display text-2xl font-extrabold text-white">{selected.cat}</h3>
              </div>
              <div className="flex items-center gap-3">
                <Button href="#contact" onClick={() => setSelected(null)} className="!px-5 !py-2.5 !text-xs">
                  Build Similar <ArrowIcon className="h-3.5 w-3.5" />
                </Button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#ffd000] hover:text-[#04050c]"
                >
                  Close ✕
                </button>
              </div>
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
