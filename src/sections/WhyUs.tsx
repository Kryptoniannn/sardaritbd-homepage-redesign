import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { WHY_US } from "../data";
import { ArrowIcon, Button, Magnetic, SectionTag, SplitWords } from "../ui";

/**
 * Sticky stacked cards — each panel pins under the nav and the one behind it
 * recedes in scale, blur and opacity as the next slides over.
 */
export default function WhyUs() {
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card", sec);

      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card, {
          scale: 0.9,
          y: -26,
          opacity: 0.32,
          filter: "blur(5px)",
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={secRef} className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <SectionTag className="mb-7">Why Sardar IT</SectionTag>
            <h2 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl">
              <SplitWords text="Four reasons clients [stay with us]" />
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/60 md:text-base">
            We carefully vet every freelancer on the roster, so you always work with the best in the industry — and
            get high-quality results every single time.
          </p>
        </div>

        <div className="mt-14 space-y-6">
          {WHY_US.map((w, i) => (
            <div key={w.title} className="sticky" style={{ top: `${96 + i * 22}px` }}>
              <article
                className="stack-card overflow-hidden rounded-[2rem] border border-white/12 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.6)] md:p-12"
                style={{
                  background: `linear-gradient(135deg, ${w.tint} 0%, #070b1c 58%, #04050c 100%)`,
                }}
              >
                <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
                  <div>
                    <div className="flex items-center gap-4">
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-2xl font-display text-lg font-extrabold text-[#04050c]"
                        style={{ background: w.accent }}
                      >
                        {w.n}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.26em] text-white/55">{w.kicker}</span>
                    </div>
                    <h3 className="font-display mt-5 text-3xl font-extrabold leading-tight text-white md:text-5xl">
                      {w.title}
                    </h3>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/72 md:text-base">{w.text}</p>

                    <div className="mt-7 flex flex-wrap gap-2">
                      {w.chips.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-[11px] font-semibold text-white/80"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {w.stats.map((s) => (
                      <div key={s.label} className="rounded-2xl border border-white/12 bg-[#04050c]/55 p-5">
                        <p className="font-display text-3xl font-extrabold md:text-4xl" style={{ color: w.accent }}>
                          {s.value}
                        </p>
                        <p className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                          {s.label}
                        </p>
                      </div>
                    ))}
                    <div className="col-span-2">
                      <Magnetic>
                        <Button href="#contact" variant="ghost" className="!py-3">
                          {w.cta} <ArrowIcon />
                        </Button>
                      </Magnetic>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
