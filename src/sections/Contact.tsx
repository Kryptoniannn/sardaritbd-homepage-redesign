import { useRef, useState, type FormEvent, type MouseEvent } from "react";
import { gsap } from "../gsapSetup";
import { CONTACT, IMG, MARQUEE, NAV } from "../data";
import {
  ArrowIcon,
  Button,
  Magnetic,
  Reveal,
  SectionTag,
  SplitWords,
  VelocityMarquee,
  goTo,
  spotMove,
} from "../ui";

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="group relative block">
      <input
        {...rest}
        placeholder=" "
        className="peer w-full border-0 border-b border-white/20 bg-transparent pb-3.5 pt-6 text-base text-white outline-none transition-colors md:text-lg"
      />
      <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-[#1946e0] to-[#ffd000] transition-transform duration-500 ease-out peer-focus:scale-x-100" />
      <span className="pointer-events-none absolute left-0 top-6 origin-left text-base text-white/45 transition-all duration-300 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-[#ffd000] peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-75 md:text-lg">
        {label}
      </span>
    </label>
  );
}

export function ContactSection() {
  const [sent, setSent] = useState(false);
  const [picked, setPicked] = useState<string>("Web Design and Development");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-36">
      <div className="aurora blob1 pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#1946e0]/55" />
      <div className="aurora blob2 pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#ffd000]/20" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionTag className="mb-7">Let&apos;s Talk</SectionTag>
        <h2 className="font-display text-5xl font-extrabold leading-[1.01] tracking-tight sm:text-7xl lg:text-[7rem]">
          <SplitWords text="Request A Free" chars />
          <SplitWords
            text="[Consultation]"
            highlightClassName="font-serif-ed italic font-normal text-[1.08em]"
            chars
            delay={0.18}
          />
        </h2>

        <div className="mt-18 grid gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20">
          {/* Interactive Consultation Card */}
          <Reveal>
            <div
              onMouseMove={spotMove}
              className="spot relative min-h-[30rem] overflow-hidden rounded-[2.2rem] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.65)] md:p-12"
            >
              {!sent ? (
                <form onSubmit={submit} className="relative z-10 space-y-7">
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-[#ffd000]">
                      Select Service Interest
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {MARQUEE.map((s) => {
                        const active = picked === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setPicked(s)}
                            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                              active
                                ? "bg-[#ffd000] text-[#04050c] shadow-[0_0_25px_rgba(255,208,0,0.45)]"
                                : "border border-white/15 bg-white/[0.04] text-white/75 hover:border-white/35"
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Field label="Your full name" name="name" required />
                    <Field label="Email address" name="email" type="email" required />
                  </div>
                  <Field label="Phone / WhatsApp (optional)" name="phone" type="tel" />
                  <Field label="Tell us about your dream project" name="message" required />

                  <div className="pt-4">
                    <Magnetic>
                      <Button type="submit" variant="light">
                        Submit Now <ArrowIcon />
                      </Button>
                    </Magnetic>
                  </div>
                </form>
              ) : (
                <div className="relative z-10 flex min-h-[24rem] flex-col items-center justify-center text-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#ffd000] bg-[#ffd000]/10 shadow-[0_0_50px_rgba(255,208,0,0.4)]">
                    <svg viewBox="0 0 52 52" className="h-12 w-12" fill="none">
                      <path
                        d="M14 27l8 8 16-17"
                        stroke="#ffd000"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="font-display mt-6 text-3xl font-extrabold text-white">Consultation Requested!</h3>
                  <p className="mt-2 max-w-sm text-white/65">
                    Thank you! Our Sardar IT team in Dhaka has received your inquiry regarding{" "}
                    <span className="font-semibold text-[#ffd000]">{picked}</span> and will respond shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-[#ffd000] underline underline-offset-4"
                  >
                    Send another message
                  </button>
                </div>
              )}
            </div>
          </Reveal>

          {/* Right Official Info & Tagline */}
          <div className="flex flex-col justify-between gap-10">
            <Reveal delay={0.1}>
              <p className="font-display text-3xl font-extrabold leading-snug md:text-4xl">
                Grow Your Business and Build Your Website With Us.
              </p>
              <p className="mt-5 text-base leading-relaxed text-white/65">
                We work with a passion for taking challenges and creating new ones in the Freelancing sector.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <ul className="space-y-5">
                {[
                  { k: "Call", v: CONTACT.phone, h: `tel:${CONTACT.phone}` },
                  { k: "Email", v: CONTACT.email, h: `mailto:${CONTACT.email}` },
                  { k: "HQ Address", v: CONTACT.address, h: undefined },
                  { k: "Open Hours", v: CONTACT.hours, h: undefined },
                ].map((item) => (
                  <li
                    key={item.k}
                    className="group flex flex-col gap-1 border-b border-white/10 pb-5 sm:flex-row sm:items-start sm:gap-5"
                  >
                    <span className="w-28 shrink-0 pt-1 text-xs font-bold uppercase tracking-[0.22em] text-[#ffd000]">
                      {item.k}
                    </span>
                    {item.h ? (
                      <a href={item.h} className="text-lg font-medium text-white/85 transition hover:text-[#ffd000]">
                        {item.v}
                      </a>
                    ) : (
                      <span className="text-lg text-white/80">{item.v}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Interactive Cursor-Proximity Monumental Wordmark */
function ProximityWordmark() {
  const rowRef = useRef<HTMLDivElement>(null);
  const chars = "SARDAR IT".split("");

  const onMove = (e: MouseEvent) => {
    const row = rowRef.current;
    if (!row) return;
    const spans = row.querySelectorAll<HTMLElement>(".wm-ch");
    spans.forEach((sp) => {
      const r = sp.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(e.clientX - cx, e.clientY - cy);
      const t = Math.max(0, 1 - d / 260);
      gsap.to(sp, {
        y: -t * 28,
        scale: 1 + t * 0.18,
        color: t > 0.35 ? "#ffd000" : "transparent",
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });
    });
  };

  const onLeave = () => {
    const row = rowRef.current;
    if (!row) return;
    gsap.to(row.querySelectorAll(".wm-ch"), {
      y: 0,
      scale: 1,
      color: "#03040a",
      duration: 0.7,
      ease: "elastic.out(1, 0.45)",
      overwrite: "auto",
    });
  };

  return (
    <div
      ref={rowRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="SARDAR IT"
      className="font-display select-none overflow-hidden whitespace-nowrap py-6 text-center text-[15.5vw] font-extrabold leading-[0.84] tracking-tighter"
    >
      {chars.map((ch, idx) => (
        <span
          key={idx}
          className="wm-ch inline-block text-outline-solid transition-[text-shadow] duration-300 will-change-transform"
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </div>
  );
}

export function Footer() {
  const [subbed, setSubbed] = useState(false);

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#03040a] pt-16">
      <div className="py-8">
        <VelocityMarquee items={["Contact us now", "Let's work with your dream, together"]} base={3.2} outline />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_1.2fr_1fr]">
        <div>
          <div className="glass-bright inline-block rounded-2xl px-5 py-3 shadow-[0_0_50px_rgba(25,70,224,0.45)]">
            <img src={IMG.logoWhite} alt="Sardar IT" referrerPolicy="no-referrer" className="h-9 w-auto" />
          </div>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/65">
            We work with a passion for taking challenges and creating new ones in the Freelancing sector.
          </p>
          <div className="mt-8">
            <Magnetic>
              <Button href="#contact">
                Contact us now <ArrowIcon />
              </Button>
            </Magnetic>
          </div>
        </div>

        <div>
          <h4 className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-[#ffd000]">Quick Links</h4>
          <ul className="space-y-3">
            {[
              ...NAV.slice(0, 3),
              { label: "Reviews", href: "#works" },
              { label: "Pricing", href: "https://sardaritbd.com/pricing/" },
            ].map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    if (l.href.startsWith("#")) {
                      e.preventDefault();
                      goTo(l.href);
                    }
                  }}
                  {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="group inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
                >
                  <span className="h-px w-0 bg-[#ffd000] transition-all duration-300 group-hover:w-4" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-[#ffd000]">Newsletter</h4>
          <p className="mb-5 text-sm text-white/65">Subscribe our newsletter to get our latest update &amp; news.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubbed(true);
            }}
            className="glass flex items-center rounded-full p-1.5 pl-5"
          >
            <input
              type="email"
              required
              placeholder={subbed ? "Subscribed ✓" : "Your email address"}
              disabled={subbed}
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />
            <button
              type="submit"
              className="rounded-full bg-[#ffd000] px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-[#04050c] transition hover:bg-white"
            >
              Submit
            </button>
          </form>

          <div className="mt-8 flex gap-3">
            {[
              {
                n: "Facebook",
                h: CONTACT.fb,
                p: "M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5z",
              },
              {
                n: "LinkedIn",
                h: CONTACT.li,
                p: "M4 9h4v11H4zM6 3.5a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4zM10 9h3.8v1.6c.6-1 1.9-1.9 3.8-1.9 3.6 0 4.4 2.3 4.4 5.3V20h-4v-5.4c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V20h-4z",
              },
              {
                n: "Instagram",
                h: CONTACT.ig,
                p: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm5 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.3 6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z",
              },
            ].map((s) => (
              <Magnetic key={s.n} strength={0.45}>
                <a
                  href={s.h}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.n}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:border-[#ffd000] hover:bg-[#ffd000] hover:text-[#04050c]"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d={s.p} />
                  </svg>
                </a>
              </Magnetic>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-[#ffd000]">Official Info</h4>
          <ul className="space-y-4 text-sm text-white/75">
            <li>
              <a href={`mailto:${CONTACT.email}`} className="transition hover:text-[#ffd000]">
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={`tel:${CONTACT.phone}`} className="transition hover:text-[#ffd000]">
                {CONTACT.phone}
              </a>
            </li>
            <li>{CONTACT.address}</li>
            <li>
              <span className="font-semibold text-white">Open Hours:</span>
              <br />
              {CONTACT.hours}
            </li>
          </ul>
        </div>
      </div>

      {/* Interactive Cursor-Proximity Monumental Wordmark */}
      <ProximityWordmark />

      <div className="relative border-t border-white/10 px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-white/55 md:flex-row">
          <p>© Copyright 2026 Sardar IT - All Rights Reserved</p>
          <button
            type="button"
            onClick={() => goTo("#home")}
            className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-xs font-bold uppercase tracking-widest transition hover:border-[#ffd000] hover:text-[#ffd000]"
          >
            Back to top <span className="-rotate-45">→</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
