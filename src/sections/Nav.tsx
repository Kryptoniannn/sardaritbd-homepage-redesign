import { useEffect, useRef, useState } from "react";
import { gsap } from "../gsapSetup";
import { CONTACT, IMG, NAV } from "../data";
import { ArrowIcon, Button, Magnetic, ScrambleText, goTo } from "../ui";

const SPY_IDS = ["home", "about", "services", "works", "contact"];

export default function Nav({ ready }: { ready: boolean }) {
  const headerRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [bdTime, setBdTime] = useState("");

  // Live Dhaka GMT+6 clock
  useEffect(() => {
    const updateClock = () => {
      try {
        const str = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Dhaka",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }).format(new Date());
        setBdTime(str);
      } catch {
        setBdTime("GMT+6");
      }
    };
    updateClock();
    const iv = window.setInterval(updateClock, 20000);
    return () => window.clearInterval(iv);
  }, []);

  // Entrance + smart hide/reveal on scroll + scroll spy
  useEffect(() => {
    const hdr = headerRef.current;
    if (!hdr) return;
    if (!ready) {
      gsap.set(hdr, { y: -110, opacity: 0 });
      return;
    }
    gsap.to(hdr, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out" });

    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (!open) {
        if (y > lastY + 12 && y > 260) {
          gsap.to(hdr, { y: -110, duration: 0.45, ease: "power3.out", overwrite: "auto" });
        } else if (y < lastY - 8 || y <= 260) {
          gsap.to(hdr, { y: 0, duration: 0.45, ease: "power3.out", overwrite: "auto" });
        }
      }
      lastY = y;

      // Active section spy
      const mid = y + window.innerHeight * 0.35;
      for (let i = SPY_IDS.length - 1; i >= 0; i--) {
        const sec = document.getElementById(SPY_IDS[i]);
        if (sec && sec.offsetTop <= mid) {
          setActive(`#${SPY_IDS[i]}`);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ready, open]);

  // Mobile fullscreen curtain animation
  useEffect(() => {
    const dr = drawerRef.current;
    if (!dr) return;
    if (open) {
      gsap.set(dr, { display: "flex" });
      gsap.fromTo(
        dr,
        { clipPath: "circle(0% at 92% 5%)" },
        { clipPath: "circle(150% at 92% 5%)", duration: 0.75, ease: "expo.inOut" }
      );
      gsap.fromTo(
        dr.querySelectorAll(".nav-m-item"),
        { y: 55, opacity: 0, rotateX: -35 },
        { y: 0, opacity: 1, rotateX: 0, stagger: 0.07, delay: 0.25, duration: 0.7, ease: "expo.out" }
      );
    } else {
      gsap.to(dr, {
        clipPath: "circle(0% at 92% 5%)",
        duration: 0.55,
        ease: "expo.inOut",
        onComplete: () => {
          gsap.set(dr, { display: "none" });
        },
      });
    }
  }, [open]);

  const go = (href: string) => {
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noreferrer");
      return;
    }
    setOpen(false);
    window.setTimeout(() => goTo(href), open ? 320 : 0);
  };

  return (
    <>
      <header ref={headerRef} className="fixed left-0 right-0 top-0 z-[85] flex justify-center px-4 pt-4">
        <nav
          className={`flex w-full max-w-7xl items-center justify-between rounded-full py-2 pl-2.5 pr-2.5 transition-all duration-500 ${
            scrolled
              ? "glass shadow-[0_16px_60px_rgba(0,0,0,0.65)]"
              : "border border-white/10 bg-[#04050c]/45 backdrop-blur-md"
          }`}
        >
          <div className="flex items-center gap-3">
            <Magnetic strength={0.2}>
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  go("#home");
                }}
                className="block rounded-full bg-white px-4 py-2 shadow-[0_0_35px_rgba(25,70,224,0.45)] transition-transform hover:scale-[1.03]"
                aria-label="Sardar IT home"
              >
                <img src={IMG.logo} alt="Sardar IT" referrerPolicy="no-referrer" className="h-7 w-auto md:h-8" />
              </a>
            </Magnetic>

            {bdTime && (
              <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium text-white/70 xl:flex">
                <span className="relative flex h-2 w-2">
                  <span className="pulse-ring absolute inset-0 rounded-full bg-emerald-400" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span>Dhaka · {bdTime}</span>
              </div>
            )}
          </div>

          <ul className="hidden items-center gap-1 lg:flex">
            {[
              { label: "Home", href: "#home" },
              { label: "About Us", href: "#about" },
              { label: "Services", href: "#services" },
              { label: "Works", href: "#works" },
              { label: "Pricing", href: "https://sardaritbd.com/pricing/" },
            ].map((l) => {
              const isAct = active === l.href;
              return (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(l.href);
                    }}
                    className={`relative block rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      isAct
                        ? "bg-white/12 text-[#ffd000] shadow-[inset_0_0_0_1px_rgba(255,208,0,0.35)]"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    <ScrambleText text={l.label} />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${CONTACT.phone}`}
              className="hidden px-3 text-sm font-medium text-white/70 transition hover:text-[#ffd000] 2xl:block"
            >
              {CONTACT.phone}
            </a>
            <div className="hidden sm:block">
              <Magnetic strength={0.28}>
                <Button href="#contact" className="!px-6 !py-3">
                  Contact Us <ArrowIcon />
                </Button>
              </Magnetic>
            </div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle Menu"
              className="relative flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full border border-white/15 bg-white/10 lg:hidden"
            >
              <span className={`h-[2px] w-5 rounded bg-white transition-all ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`h-[2px] w-5 rounded bg-white transition-all ${open ? "opacity-0" : ""}`} />
              <span className={`h-[2px] w-5 rounded bg-white transition-all ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>
      </header>

      <div
        ref={drawerRef}
        style={{ display: "none", clipPath: "circle(0% at 92% 5%)" }}
        className="fixed inset-0 z-[80] flex-col justify-center bg-[#060816] px-8"
      >
        <div className="aurora blob1 pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#1946e0]" />
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <ul className="relative space-y-4">
          {NAV.map((l, i) => (
            <li key={l.label} className="nav-m-item">
              <a
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.href);
                }}
                className="font-display inline-flex items-baseline gap-4 text-5xl font-extrabold text-white transition hover:text-[#ffd000]"
              >
                <span className="text-sm font-semibold text-[#ffd000]">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="relative mt-12 text-sm text-white/55">
          {CONTACT.email} · {CONTACT.phone}
        </p>
      </div>
    </>
  );
}
