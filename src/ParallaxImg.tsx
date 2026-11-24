import { useEffect, useRef } from "react";
import { gsap, safeRefresh } from "./gsapSetup";
import { cn } from "./utils/cn";

export default function ParallaxImg({
  src,
  alt = "",
  className,
  imgClassName,
  speed = 11,
  delay = 0,
  cursor,
}: {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  speed?: number;
  delay?: number;
  cursor?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const img = imgRef.current;
    const curtain = curtainRef.current;
    if (!wrap || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Curtain wipe + clip-path reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top 88%",
          once: true,
        },
      });

      tl.fromTo(
        wrap,
        { clipPath: "inset(100% 0% 0% 0% round 28px)" },
        { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.25, delay, ease: "expo.out" },
        0
      ).fromTo(
        img,
        { scale: 1.32, filter: "brightness(0.65)" },
        { scale: 1 + (speed * 2) / 100, filter: "brightness(1)", duration: 1.45, delay, ease: "expo.out" },
        0
      );

      if (curtain) {
        tl.fromTo(
          curtain,
          { yPercent: 0 },
          { yPercent: -102, duration: 1.15, delay: delay + 0.08, ease: "expo.inOut" },
          0
        );
      }

      // Scrubbed inner parallax
      gsap.fromTo(
        img,
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, wrap);

    return () => ctx.revert();
  }, [speed, delay]);

  return (
    <div
      ref={wrapRef}
      data-cursor={cursor}
      className={cn("group relative overflow-hidden rounded-[28px] bg-[#090d20] will-change-transform", className)}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => safeRefresh(180)}
        className={cn(
          "h-full w-full object-cover transition-[filter] duration-700 group-hover:saturate-125 will-change-transform",
          imgClassName
        )}
      />
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#ffd000] via-[#1946e0] to-[#04050c]"
      />
      <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/15 transition-colors duration-500 group-hover:ring-[#ffd000]/40" />
    </div>
  );
}
