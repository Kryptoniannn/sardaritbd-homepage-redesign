import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { IMG, TEAM } from "../data";
import { Reveal, ScrambleText, SectionTag, SplitWords, Tilt, spotMove } from "../ui";

export default function Team() {
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".team-card", sec);

      gsap.fromTo(
        cards,
        { y: 95, opacity: 0, rotateX: -16, scale: 0.92, transformPerspective: 1000 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 1.1,
          stagger: 0.09,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ".team-grid",
            start: "top 82%",
            once: true,
          },
        }
      );

    }, sec);

    // Opposing column parallax on desktop
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const cards = gsap.utils.toArray<HTMLElement>(".team-card", sec);
      cards.forEach((card, i) => {
        const col = i % 4;
        const shift = col % 2 === 1 ? -28 : 24;
        gsap.to(card, {
          y: shift,
          ease: "none",
          scrollTrigger: {
            trigger: sec.querySelector(".team-grid"),
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    });

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section id="team" ref={secRef} className="relative overflow-hidden bg-[#060815] py-24 md:py-36">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-55" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <SectionTag className="mb-7">Leadership &amp; Core Team</SectionTag>
            <h2 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              <SplitWords text="Our success is a [Result] of Our Amazing Team" />
            </h2>
          </div>
          <Reveal>
            <div className="rounded-[2rem] bg-white p-4 shadow-[0_0_65px_rgba(25,70,224,0.4)]">
              <img src={IMG.teamwork} alt="TeamWork" referrerPolicy="no-referrer" className="h-28 w-auto md:h-36" />
            </div>
          </Reveal>
        </div>

        <div className="team-grid mt-20 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {TEAM.map((m, i) => (
            <div key={m.name} className={`team-card ${i % 2 === 1 ? "lg:mt-10" : ""}`}>
              <Tilt max={8}>
                <div
                  onMouseMove={spotMove}
                  data-cursor="MEET"
                  className="spot group relative aspect-[4/5.1] overflow-hidden rounded-[1.85rem] p-1.5 shadow-[0_24px_70px_rgba(0,0,0,0.65)]"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[1.45rem] bg-[#0d1228]">
                    <img
                      src={m.img}
                      alt={m.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="h-full w-full object-cover object-top grayscale-[75%] transition-all duration-700 ease-out group-hover:scale-108 group-hover:grayscale-0"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04050c] via-[#04050c]/20 to-transparent" />
                    <div className="pointer-events-none absolute inset-0 bg-[#1946e0]/20 mix-blend-color opacity-60 transition-opacity duration-500 group-hover:opacity-0" />

                    {/* Index tag */}
                    <span className="glass absolute right-3.5 top-3.5 rounded-full px-2.5 py-1 font-display text-[11px] font-bold text-white/75">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Name & Role Plate */}
                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                      <p className="font-display text-lg font-extrabold leading-tight text-white md:text-xl">
                        {m.name}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="h-[2px] w-4 bg-[#ffd000] transition-all duration-500 group-hover:w-9" />
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#ffd000]">
                          <ScrambleText text={m.role} />
                        </p>
                      </div>
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
