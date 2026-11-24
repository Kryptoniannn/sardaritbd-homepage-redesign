import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";
import type Lenis from "lenis";
import { gsap, ScrollTrigger } from "./gsapSetup";
import { cn } from "./utils/cn";
import { IMG } from "./data";

export const lenisRef: { current: Lenis | null } = { current: null };

export function goTo(href: string) {
  if (href.startsWith("http")) {
    window.open(href, "_blank", "noreferrer");
    return;
  }
  const el = document.querySelector(href);
  if (!el) return;
  if (lenisRef.current) {
    lenisRef.current.scrollTo(el as HTMLElement, { offset: -92, duration: 1.5 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}

export const EASE = [0.2, 0.7, 0.1, 1] as const;

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ------------------------------------------- Cuberto Liquid Velocity Cursor */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const rippleBoxRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const labelRef = useRef("");
  const [hover, setHover] = useState(false);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    setFine(isFine);
    if (!isFine) return;

    const pos = { x: -120, y: -120 };
    const target = { x: -120, y: -120 };
    const vel = { x: 0, y: 0 };
    let down = false;
    let activated = false;

    const move = (e: globalThis.MouseEvent) => {
      if (!activated) {
        activated = true;
        document.documentElement.classList.add("has-custom-cursor");
        pos.x = e.clientX;
        pos.y = e.clientY;
      }
      target.x = e.clientX;
      target.y = e.clientY;
      const t = (e.target as HTMLElement | null)?.closest?.("a,button,[data-cursor]") as HTMLElement | null;
      const nextLabel = t?.dataset?.cursor ?? "";
      labelRef.current = nextLabel;
      setHover(!!t);
      setLabel((prev) => (prev === nextLabel ? prev : nextLabel));
    };

    const onDown = (e: globalThis.MouseEvent) => {
      down = true;
      if (rippleBoxRef.current) {
        const rip = document.createElement("span");
        rip.className =
          "pointer-events-none fixed z-[198] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ffd000]";
        rip.style.left = `${e.clientX}px`;
        rip.style.top = `${e.clientY}px`;
        rippleBoxRef.current.appendChild(rip);
        gsap.to(rip, {
          scale: 7,
          opacity: 0,
          duration: 0.65,
          ease: "power2.out",
          onComplete: () => rip.remove(),
        });
      }
    };
    const onUp = () => {
      down = false;
    };

    let raf = 0;
    const loop = () => {
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      pos.x += dx * 0.2;
      pos.y += dy * 0.2;
      vel.x = dx;
      vel.y = dy;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      }
      if (ringRef.current && innerRef.current) {
        const hasLbl = !!labelRef.current;
        const speed = Math.min(Math.hypot(vel.x, vel.y) / 110, 0.55);
        const angle = (Math.atan2(vel.y, vel.x) * 180) / Math.PI;
        const stretch = hasLbl ? 1 : 1 + speed;
        const squash = hasLbl ? 1 : 1 - speed * 0.36;
        const press = down ? 0.82 : 1;
        ringRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${
          hasLbl ? 0 : angle
        }deg) scale(${stretch * press}, ${squash * press})`;
        innerRef.current.style.transform = `rotate(${hasLbl ? 0 : -angle}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  if (!fine) return null;
  const size = label ? 96 : hover ? 62 : 36;
  return (
    <>
      <div ref={rippleBoxRef} />
      <div ref={dotRef} className="pointer-events-none fixed left-0 top-0 z-[201] will-change-transform">
        <div
          className="h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd000] shadow-[0_0_14px_#ffd000] transition-opacity duration-200"
          style={{ opacity: label ? 0 : 1 }}
        />
      </div>
      <div ref={ringRef} className="pointer-events-none fixed left-0 top-0 z-[200] will-change-transform">
        <div
          ref={innerRef}
          style={{ width: size, height: size }}
          className={cn(
            "-translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] transition-[width,height,background-color,border-color] duration-300",
            label
              ? "border-[#ffd000]/80 bg-[#1946e0]/95 text-white shadow-[0_0_40px_rgba(25,70,224,0.8)] backdrop-blur-md"
              : hover
              ? "border-transparent bg-white/95 mix-blend-difference"
              : "border-white/50 bg-white/[0.03]"
          )}
        >
          {label}
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------- Top Laser Bar + Orbital Ring */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const circ = 2 * Math.PI * 20;
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (circleRef.current) circleRef.current.style.strokeDashoffset = `${circ * (1 - p)}`;
      if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`;
      setVisible(window.scrollY > 260);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div
        ref={barRef}
        style={{ transform: "scaleX(0)", background: "linear-gradient(90deg, rgba(61,107,255,0.25), var(--accent) 70%, rgba(255,255,255,0.85))" }}
        className="fixed left-0 right-0 top-0 z-[95] h-[2px] origin-left"
      />
      <button
        type="button"
        aria-label="Scroll to top"
        data-cursor="TOP"
        onClick={() => goTo("#home")}
        className={cn(
          "glass fixed bottom-6 right-6 z-[85] hidden h-14 w-14 items-center justify-center rounded-full transition-all duration-500 md:flex",
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
        )}
      >
        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="2" />
          <circle
            ref={circleRef}
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="#ffd000"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 20}
            strokeDashoffset={2 * Math.PI * 20}
          />
        </svg>
        <span ref={pctRef} className="font-display text-[10px] font-bold tabular-nums text-white/90">
          0%
        </span>
      </button>
    </>
  );
}

/* ------------------------------------------- GSAP Elastic Magnetic Wrapper */
export function Magnetic({
  children,
  strength = 0.38,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    gsap.to(el, { x, y, duration: 0.4, ease: "power3.out", overwrite: "auto" });
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)", overwrite: "auto" });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={cn("inline-block will-change-transform", className)}
    >
      {children}
    </div>
  );
}

/* ----------------------------------- Radial Cursor-Origin Liquid Button */
export function Button({
  children,
  href,
  variant = "primary",
  className,
  onClick,
  type,
}: {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost" | "light";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const flairRef = useRef<HTMLSpanElement>(null);

  const setCoords = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    if (!r.width || !r.height || !flairRef.current) return;
    flairRef.current.style.left = `${e.clientX - r.left}px`;
    flairRef.current.style.top = `${e.clientY - r.top}px`;
  };

  const base =
    "group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 text-sm font-semibold tracking-wide transition-all duration-300";
  const styles = {
    primary:
      "bg-[#1946e0] text-white shadow-[0_10px_40px_rgba(25,70,224,0.45)] hover:shadow-[0_12px_45px_rgba(255,208,0,0.4)]",
    ghost: "border border-white/25 bg-white/[0.03] text-white backdrop-blur-md hover:border-[#ffd000]/70",
    light: "bg-white text-[#04050c] shadow-[0_10px_40px_rgba(255,255,255,0.2)]",
  }[variant];

  const inner = (
    <>
      <span
        ref={flairRef}
        className="pointer-events-none absolute h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd000] transition-[width,height] duration-500 ease-out group-hover:h-[420px] group-hover:w-[420px]"
      />
      <span className="relative z-10 flex items-center gap-3 transition-colors duration-300 group-hover:text-[#04050c]">
        {children}
      </span>
    </>
  );

  const cls = cn(base, styles, className);

  if (href && href.startsWith("#")) {
    return (
      <a
        href={href}
        className={cls}
        onMouseEnter={setCoords}
        onMouseMove={setCoords}
        onClick={(e) => {
          e.preventDefault();
          goTo(href);
          onClick?.();
        }}
      >
        {inner}
      </a>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} onMouseEnter={setCoords} onMouseMove={setCoords} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} onMouseEnter={setCoords} onMouseMove={setCoords} className={cls}>
      {inner}
    </button>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

/* --------------------------------- Cybernetic Scramble Text on Hover/Mount */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#✦";
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const [out, setOut] = useState(text);
  const timerRef = useRef<number | null>(null);

  const trigger = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    let iter = 0;
    timerRef.current = window.setInterval(() => {
      setOut(
        text
          .split("")
          .map((ch, idx) => {
            if (ch === " ") return " ";
            if (idx < iter) return text[idx];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );
      iter += 0.55;
      if (iter >= text.length && timerRef.current) {
        window.clearInterval(timerRef.current);
        setOut(text);
      }
    }, 24);
  };

  useEffect(() => {
    setOut(text);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [text]);

  return (
    <span onMouseEnter={trigger} className={className}>
      {out}
    </span>
  );
}

/* --------------------- GSAP 3D Perspective SplitWords + ScrollTrigger */
export function SplitWords({
  text,
  className,
  highlightClassName,
  delay = 0,
  active,
  stagger = 0.045,
  chars = false,
}: {
  text: string;
  className?: string;
  highlightClassName?: string;
  delay?: number;
  active?: boolean;
  stagger?: number;
  chars?: boolean;
}) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const plain = text.replace(/\[|\]/g, "");
  const segments = text.split(/(\[[^\]]+\])/).filter(Boolean);
  const controlled = active !== undefined;

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const items = root.querySelectorAll(".sw-unit");
      if (!items.length) return;

      if (controlled) {
        if (!active) {
          gsap.set(items, {
            yPercent: 125,
            rotationX: -78,
            opacity: 0,
            transformPerspective: 900,
            transformOrigin: "50% 100% -20px",
          });
        } else {
          gsap.fromTo(
            items,
            {
              yPercent: 125,
              rotationX: -78,
              opacity: 0,
              transformPerspective: 900,
              transformOrigin: "50% 100% -20px",
            },
            {
              yPercent: 0,
              rotationX: 0,
              opacity: 1,
              duration: 0.85,
              delay,
              stagger: chars ? 0.01 : stagger,
              ease: "expo.out",
              overwrite: "auto",
            }
          );
        }
      } else {
        gsap.fromTo(
          items,
          {
            yPercent: 115,
            rotationX: -55,
            opacity: 0,
            transformPerspective: 900,
            transformOrigin: "50% 100% -14px",
          },
          {
            yPercent: 0,
            rotationX: 0,
            opacity: 1,
            duration: 0.9,
            delay,
            stagger: chars ? 0.01 : stagger,
            ease: "expo.out",
            scrollTrigger: {
              trigger: root,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    }, root);

    return () => ctx.revert();
  }, [active, controlled, delay, stagger, chars, text]);

  return (
    <span ref={rootRef} aria-label={plain} className={cn("block", className)}>
      <span aria-hidden="true">
        {segments.map((seg, si) => {
          const hl = seg.startsWith("[");
          const words = (hl ? seg.slice(1, -1) : seg).split(/\s+/).filter(Boolean);
          return words.map((w, wi) => (
            <span
              key={`${si}-${wi}`}
              className="inline-block overflow-hidden align-bottom py-[0.24em] -my-[0.24em] px-[0.08em] -mx-[0.04em]"
            >
              {chars ? (
                <span className="inline-block">
                  {w.split("").map((ch, ci) => (
                    <span
                      key={ci}
                      className={cn(
                        "sw-unit inline-block will-change-transform",
                        hl && "text-gradient",
                        hl && highlightClassName
                      )}
                    >
                      {ch}
                    </span>
                  ))}
                </span>
              ) : (
                <span
                  className={cn(
                    "sw-unit inline-block will-change-transform",
                    hl && "text-gradient",
                    hl && highlightClassName
                  )}
                >
                  {w}
                </span>
              )}
              {"\u00A0"}
            </span>
          ));
        })}
      </span>
    </span>
  );
}

/* ------------------------------------------- GSAP Blur + Lift Reveal */
export function Reveal({
  children,
  delay = 0,
  y = 44,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y, filter: "blur(10px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.05,
          delay,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* --------------------- GSAP Scrubbed Gold-Wave Editorial Text Reader */
export function ScrollText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const spans = el.querySelectorAll(".st-word");
      if (!spans.length) return;
      gsap.set(spans, { color: "rgba(238,241,255,0.18)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 84%",
          end: "bottom 42%",
          scrub: 0.6,
        },
      });
      spans.forEach((s, i) => {
        tl.to(s, { color: "#ffd000", duration: 0.35 }, i * 0.25).to(
          s,
          { color: "#eef1ff", duration: 0.5 },
          i * 0.25 + 0.32
        );
      });
    }, el);

    return () => ctx.revert();
  }, [text]);

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className="st-word mr-[0.28em] inline-block transition-colors duration-75">
          {w}
        </span>
      ))}
    </p>
  );
}

/* ------------------------------------------- GSAP Precision Counter */
export function Counter({ to, dec = 0, suffix = "" }: { to: number; dec?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const numEl = numRef.current;
    if (!el || !numEl) return;

    const obj = { val: 0 };
    const ctx = gsap.context(() => {
      gsap.to(obj, {
        val: to,
        duration: 2.3,
        ease: "power4.out",
        onUpdate: () => {
          numEl.textContent = obj.val.toFixed(dec);
        },
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, [to, dec]);

  return (
    <span ref={ref} className="tabular-nums">
      <span ref={numRef}>{(0).toFixed(dec)}</span>
      <span className="text-gradient">{suffix}</span>
    </span>
  );
}

/* ---------------------------------- Mechanical Odometer Digit Reels */
export function Odometer({ value, dec = 0, suffix = "" }: { value: number; dec?: number; suffix?: string }) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const text = value.toFixed(dec);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const strips = Array.from(root.querySelectorAll<HTMLElement>(".odo-strip"));
    if (!strips.length) return;

    const settle = () => {
      strips.forEach((strip) => {
        const digit = Number(strip.dataset.digit ?? 0);
        gsap.set(strip, { yPercent: -digit * 5 });
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      settle();
      return;
    }

    const ctx = gsap.context(() => {
      strips.forEach((strip, i) => {
        const digit = Number(strip.dataset.digit ?? 0);
        gsap.fromTo(
          strip,
          { yPercent: -(digit + 10) * 5 },
          {
            yPercent: -digit * 5,
            duration: 1.7 + i * 0.16,
            ease: "expo.out",
            scrollTrigger: { trigger: root, start: "top 88%", once: true },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [value, dec]);

  return (
    <span ref={rootRef} aria-label={`${text}${suffix}`} className="inline-flex items-end tabular-nums">
      {text.split("").map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} className="odo-col" aria-hidden="true">
            <span className="odo-strip" data-digit={ch}>
              {Array.from({ length: 20 }, (_, k) => (
                <span key={k} className="odo-item">
                  {k % 10}
                </span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} className="inline-block" aria-hidden="true">
            {ch}
          </span>
        )
      )}
      <span className="text-gradient" aria-hidden="true">
        {suffix}
      </span>
    </span>
  );
}

/* ------------------------ 3D Perspective Tilt + Specular Glare Sheen */
export function Tilt({
  children,
  className,
  max = 9,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const ry = (px - 0.5) * max * 2;
    const rx = -(py - 0.5) * max * 2;
    gsap.to(el, {
      rotateX: rx,
      rotateY: ry,
      transformPerspective: 1100,
      duration: 0.45,
      ease: "power3.out",
      overwrite: "auto",
    });
    if (glareRef.current) {
      glareRef.current.style.setProperty("--mx", `${px * 100}%`);
      glareRef.current.style.setProperty("--my", `${py * 100}%`);
      glareRef.current.style.opacity = "1";
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.9,
      ease: "elastic.out(1, 0.5)",
      overwrite: "auto",
    });
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transformStyle: "preserve-3d" }}
      className={cn("relative will-change-transform", className)}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          className="holo-glare pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 mix-blend-overlay transition-opacity duration-300"
        />
      )}
    </div>
  );
}

export function spotMove(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  if (!r.width || !r.height) return;
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

/* ------------------------------------------------------------ SectionTag */
export function SectionTag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Reveal y={16} className={className}>
      <span className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85">
        <span className="relative flex h-2 w-2">
          <span className="pulse-ring absolute inset-0 rounded-full" style={{ background: "var(--accent)" }} />
          <span className="relative h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />
        </span>
        {children}
      </span>
    </Reveal>
  );
}

/* --------------------- GSAP Scroll-Velocity Skew & Speed Marquee */
export function VelocityMarquee({
  items,
  base = 3.5,
  outline = false,
}: {
  items: string[];
  base?: number;
  outline?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let xPct = 0;
    let dir = 1;
    let skew = 0;
    let lastScroll = window.scrollY;
    let lastTime = performance.now();
    const sign = base < 0 ? -1 : 1;

    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const sy = window.scrollY;
      const v = (sy - lastScroll) / dt;
      lastScroll = sy;

      if (v < -40) dir = -1;
      else if (v > 40) dir = 1;

      const boost = Math.min(6, Math.abs(v) / 380);
      const targetSkew = Math.max(-10, Math.min(10, (v / 220) * sign));
      skew += (targetSkew - skew) * 0.14;

      xPct -= sign * dir * Math.abs(base) * dt * (1 + boost);
      const wrapped = (((xPct % 25) + 25) % 25) - 25;
      track.style.transform = `translate3d(${wrapped}%, 0, 0) skewX(${skew.toFixed(2)}deg)`;
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [base]);

  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span
            className={cn(
              "font-display px-6 text-4xl font-extrabold uppercase tracking-tight md:px-10 md:text-6xl",
              outline && "text-outline"
            )}
          >
            {t}
          </span>
          <span className="text-3xl opacity-80 md:text-5xl">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex w-fit will-change-transform">
        {row}
        {row}
        {row}
        {row}
      </div>
    </div>
  );
}

/* --------- Dennis Snellenberg Curved SVG Curtain Preloader + Failsafe */
const PRE_WORDS = [
  "Web Developers",
  "Graphics Designers",
  "Digital Marketers",
  "Code Poets",
  "1.5K+ Global Clients",
  "Sardar IT",
];

export function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [n, setN] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const finishedRef = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setN(100);

      const root = rootRef.current;
      const path = pathRef.current;
      if (!root) {
        onDone();
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          ScrollTrigger.refresh();
          onDone();
        },
      });

      if (path) {
        tl.set(path, { attr: { d: "M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z" } })
          .to(
            path,
            {
              attr: { d: "M 0 0 L 100 0 L 100 0 Q 50 34 0 0 Z" },
              duration: 0.65,
              ease: "power3.in",
            },
            0
          )
          .to(
            path,
            {
              attr: { d: "M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z" },
              duration: 0.45,
              ease: "power3.out",
            },
            0.65
          );
      }

      tl.to(".pre-inner", { y: -80, opacity: 0, duration: 0.5, ease: "power3.in" }, 0).to(
        root,
        { pointerEvents: "none", autoAlpha: 0, duration: 0.2 },
        0.95
      );
    };

    const start = Date.now();
    const totalMs = 1550;
    const iv = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min(1, elapsed / totalMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * 100));
      setWordIdx(Math.min(PRE_WORDS.length - 1, Math.floor(p * PRE_WORDS.length)));
      if (p >= 1) {
        window.clearInterval(iv);
        finish();
      }
    }, 32);

    const failsafe = window.setTimeout(finish, 2300);

    return () => {
      window.clearInterval(iv);
      window.clearTimeout(failsafe);
    };
  }, [onDone]);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden">
      {/* Curved SVG Curtain */}
      <svg
        className="pointer-events-none absolute inset-0 h-[125%] w-full"
        viewBox="0 0 100 125"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="curtainGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#04050c" />
            <stop offset="60%" stopColor="#080d24" />
            <stop offset="100%" stopColor="#0e1d5c" />
          </linearGradient>
        </defs>
        <path ref={pathRef} d="M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z" fill="url(#curtainGrad)" />
      </svg>

      <div className="pre-inner relative z-10 flex h-full w-full flex-col items-center justify-center px-6">
        <div className="aurora blob1 pointer-events-none absolute -left-20 top-0 h-[45vh] w-[45vw] rounded-full bg-[#1946e0]" />
        <div className="aurora blob2 pointer-events-none absolute -right-20 bottom-0 h-[35vh] w-[35vw] rounded-full bg-[#ffd000]/35" />
        <div className="grid-bg pointer-events-none absolute inset-0" />

        {/* Skip Intro Button */}
        <button
          type="button"
          onClick={() => {
            finishedRef.current = false;
            onDone();
          }}
          className="glass absolute right-6 top-6 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70 transition hover:text-[#ffd000] md:right-10 md:top-10"
        >
          Skip Intro ↗
        </button>

        {/* Sardar IT Official White Logo Emblem */}
        <div className="glass-bright relative overflow-hidden rounded-3xl px-9 py-6 shadow-[0_0_130px_rgba(25,70,224,0.7)]">
          <img src={IMG.logoWhite} alt="Sardar IT" referrerPolicy="no-referrer" className="h-12 w-auto md:h-16" />
          <div
            style={{ transform: `translateX(${n * 3.2 - 120}%) skewX(-18deg)` }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-[#ffd000]/45 to-transparent"
          />
        </div>

        {/* Rapid Cycling Capability Word */}
        <div className="mt-7 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.32em] text-[#ffd000]">
          <span className="h-2 w-2 rounded-full bg-[#ffd000]" />
          <span>{PRE_WORDS[wordIdx]}</span>
        </div>

        <p className="mt-3 text-xs uppercase tracking-[0.32em] text-white/50">
          Let&apos;s work with your dream, together.
        </p>

        {/* Bottom Architectural Telemetry */}
        <div className="absolute bottom-10 left-6 right-6 flex items-end justify-between md:left-12 md:right-12">
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-[0.3em] text-white/45">Dhaka, Bangladesh · Global</p>
            <span className="font-display text-7xl font-extrabold leading-none tabular-nums text-white md:text-9xl">
              {String(n).padStart(3, "0")}
              <span className="text-3xl text-[#ffd000] md:text-5xl">%</span>
            </span>
          </div>
          <span className="mb-2 hidden text-xs uppercase tracking-[0.3em] text-white/50 sm:block">
            Initializing WebGL &amp; Motion Engine
          </span>
        </div>

        <div className="absolute bottom-0 left-0 h-1.5 w-full bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#1946e0] via-[#5d84ff] to-[#ffd000] transition-[width] duration-75"
            style={{ width: `${n}%` }}
          />
        </div>
      </div>
    </div>
  );
}
