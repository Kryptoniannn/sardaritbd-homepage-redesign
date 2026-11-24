import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { IMG } from "../data";
import { ArrowIcon, Button, Magnetic } from "../ui";

/**
 * Pinned "text mask zoom" portal — a giant word acts as a window onto the
 * studio photograph, then the camera flies through the letter until the
 * footage fills the screen and the tagline rises in.
 */
export default function MaskZoom() {
  const secRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    const word = wordRef.current;
    const img = imgRef.current;
    const copy = copyRef.current;
    if (!sec || !word || !img || !copy) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(img, { opacity: 1 });
      gsap.set(word, { opacity: 0 });
      gsap.set(copy, { opacity: 1, y: 0 });
      return;
    }

    const mm = gsap.matchMedia();

    const build = (endScale: number, distance: string) => {
      gsap.set(img, { opacity: 0, scale: 1.3 });
      gsap.set(copy, { opacity: 0, y: 60 });
      gsap.set(word, { scale: 1, opacity: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: distance,
          pin: stageRef.current,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(hintRef.current, { opacity: 0, duration: 0.12 }, 0)
        .to(word, { scale: endScale, ease: "power2.in", duration: 1 }, 0)
        .to(img, { opacity: 1, scale: 1, ease: "power2.out", duration: 0.55 }, 0.45)
        .to(word, { opacity: 0, duration: 0.22 }, 0.72)
        .to(copy, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, 0.78);
    };

    mm.add("(min-width: 1024px)", () => build(13, "+=220%"));
    mm.add("(max-width: 1023px)", () => build(7.5, "+=150%"));

    return () => mm.revert();
  }, []);

  return (
    <section ref={secRef} className="relative bg-[#04050c]">
      <div ref={stageRef} className="relative h-screen w-full overflow-hidden">
        {/* Footage behind the word */}
        <img
          ref={imgRef}
          src={IMG.proc2}
          alt="Sardar IT team building client projects"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04050c] via-[#04050c]/35 to-[#04050c]/70" />

        {/* Giant masked word */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h2
            ref={wordRef}
            style={{ ["--mask-img" as string]: `url(${IMG.proc2})` }}
            className="mask-word font-display select-none text-[26vw] font-extrabold leading-none tracking-tighter md:text-[20vw]"
          >
            DREAM
          </h2>
        </div>

        {/* Scroll hint before the flight */}
        <div
          ref={hintRef}
          className="absolute inset-x-0 bottom-14 z-10 flex flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.34em] text-white/55"
        >
          Keep scrolling
          <span className="h-8 w-px bg-gradient-to-b from-[#ffd000] to-transparent" />
        </div>

        {/* Tagline that lands after the flight */}
        <div
          ref={copyRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <span className="rounded-full bg-[#ffd000] px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#04050c]">
            Since 2021 · Dhaka, Bangladesh
          </span>
          <p className="font-display mt-6 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Let&apos;s work with your dream, together.
          </p>
          <p className="mt-5 max-w-xl text-base text-white/75 md:text-lg">
            From a single PC in a bedroom to a family of 30+ builders serving 1.5k+ clients across the world.
          </p>
          <div className="mt-9">
            <Magnetic>
              <Button href="#contact" variant="light">
                Start Your Project <ArrowIcon />
              </Button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
