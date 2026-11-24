import { useEffect, useRef, useState } from "react";
import { gsap } from "../gsapSetup";
import { CAPABILITIES } from "../data";
import { ArrowIcon, SectionTag, SplitWords, goTo } from "../ui";

/**
 * Awwwards-style index list: hovering a row summons a floating preview that
 * lerps toward the cursor and banks into the direction of travel.
 */
export default function Capabilities() {
  const secRef = useRef<HTMLElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cap-row",
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.07,
          ease: "expo.out",
          scrollTrigger: { trigger: sec, start: "top 76%", once: true },
        }
      );
    }, sec);
    return () => ctx.revert();
  }, []);

  // Cursor-following preview with velocity banking
  useEffect(() => {
    const el = floatRef.current;
    if (!el || !canHover) return;

    gsap.set(el, { xPercent: -50, yPercent: -50, x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const xTo = gsap.quickTo(el, "x", { duration: 0.55, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.55, ease: "power3" });
    const rTo = gsap.quickTo(el, "rotation", { duration: 0.7, ease: "power3" });
    let lastX = 0;

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      rTo(gsap.utils.clamp(-13, 13, dx * 0.55));
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [canHover]);

  useEffect(() => {
    const el = floatRef.current;
    if (!el || !canHover) return;
    gsap.to(el, {
      autoAlpha: active === null ? 0 : 1,
      scale: active === null ? 0.75 : 1,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });
  }, [active, canHover]);

  return (
    <section ref={secRef} className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionTag className="mb-7">Capability Index</SectionTag>
            <h2 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl">
              <SplitWords text="Everything we build, [end to end]" highlightClassName="font-serif-ed italic font-normal" />
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/60 md:text-base">
            Hover any discipline to preview the studio behind it — or tap through on mobile. Every line below is
            delivered in-house by the Sardar IT team.
          </p>
        </div>

        <div
          className="mt-14 border-t border-white/12"
          onMouseLeave={() => setActive(null)}
        >
          {CAPABILITIES.map((c, i) => (
            <button
              key={c.title}
              type="button"
              data-cursor="OPEN"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => goTo("#contact")}
              className="cap-row group relative block w-full border-b border-white/12 py-6 text-left md:py-8"
            >
              <span
                className="cap-row-line pointer-events-none absolute inset-x-0 bottom-[-1px] h-[2px]"
                style={{ background: "linear-gradient(90deg, var(--accent), #ffd000)" }}
              />

              <div className="flex items-center gap-5 md:gap-8">
                <span className="font-display w-10 shrink-0 text-sm font-bold tabular-nums text-white/35 md:w-14 md:text-base">
                  {c.n}
                </span>

                {/* Mobile / touch thumbnail */}
                {!canHover && (
                  <img
                    src={c.img}
                    alt=""
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="h-14 w-20 shrink-0 rounded-xl object-cover"
                  />
                )}

                <span className="min-w-0 flex-1">
                  <span className="cap-row-title font-display block text-2xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                    {c.title}
                  </span>
                  <span className="mt-1 block text-xs text-white/50 md:text-sm">{c.note}</span>
                </span>

                <span className="hidden shrink-0 rounded-full border border-white/15 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-white/60 lg:block">
                  {c.tag}
                </span>

                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-500 group-hover:border-transparent group-hover:bg-[#ffd000] group-hover:text-[#04050c]">
                  <ArrowIcon className="h-4 w-4" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Floating cursor-tracked preview */}
      {canHover && (
        <div
          ref={floatRef}
          aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-[60] h-[19rem] w-[15rem] overflow-hidden rounded-3xl border border-white/20 opacity-0 shadow-[0_30px_90px_rgba(0,0,0,0.7)] md:h-[23rem] md:w-[19rem]"
        >
          {CAPABILITIES.map((c, i) => (
            <img
              key={c.title}
              src={c.img}
              alt=""
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
              style={{ opacity: active === i ? 1 : 0 }}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04050c]/80 via-transparent to-transparent" />
          <span className="absolute bottom-4 left-4 rounded-full bg-[#ffd000] px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#04050c]">
            Sardar IT Studio
          </span>
        </div>
      )}
    </section>
  );
}
