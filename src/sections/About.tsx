import { useEffect, useRef } from "react";
import { gsap } from "../gsapSetup";
import { IMG, MARQUEE } from "../data";
import ParallaxImg from "../ParallaxImg";
import { Counter, Reveal, ScrollText, SectionTag, SplitWords, VelocityMarquee } from "../ui";

export function Strip() {
  return (
    <div className="relative z-10 overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none mb-4 opacity-20">
        <VelocityMarquee items={MARQUEE} base={2} outline />
      </div>
      <div className="relative">
        <div className="-mx-4 -rotate-[1.8deg] border-y border-white/15 bg-gradient-to-r from-[#0e2478] via-[#1946e0] to-[#0e2478] py-4 text-white shadow-[0_0_90px_rgba(25,70,224,0.55)]">
          <VelocityMarquee items={MARQUEE.map((m) => `${m} ➺`)} base={4.2} />
        </div>
        <div className="-mx-4 mt-[-1rem] rotate-[1.5deg] border-y border-[#ffd000]/35 bg-[#080c1d]/95 py-4 text-[#ffd000] backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.65)]">
          <VelocityMarquee items={[...MARQUEE].reverse().map((m) => `${m} ➺`)} base={-4.2} />
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const secRef = useRef<HTMLElement>(null);
  const portalWrapRef = useRef<HTMLDivElement>(null);
  const portalBoxRef = useRef<HTMLDivElement>(null);
  const portalImgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    const wrap = portalWrapRef.current;
    const box = portalBoxRef.current;
    const img = portalImgRef.current;
    if (!sec || !wrap || !box || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Scrubbed window-to-cinema clip-path expansion
      gsap.fromTo(
        box,
        { clipPath: "inset(10% 14% 10% 14% round 44px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 28px)",
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top 85%",
            end: "center 48%",
            scrub: 0.7,
          },
        }
      );

      gsap.fromTo(
        img,
        { scale: 1.28 },
        {
          scale: 1.02,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        }
      );
    }, sec);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={secRef} className="relative py-24 md:py-36">
      <div className="aurora blob2 pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-[#1946e0]/55" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Heading Row */}
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
          <div className="max-w-4xl">
            <SectionTag className="mb-7">Who We Are</SectionTag>
            <h2 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              <SplitWords text="We Offer The [GREATEST SERVICES] To Expand Your Business!" />
            </h2>
          </div>
          <Reveal className="hidden md:block">
            <div className="glass-bright relative flex h-24 w-24 items-center justify-center rounded-full p-5 shadow-[0_0_55px_rgba(61,107,255,0.35)]">
              <img src={IMG.shape} alt="" referrerPolicy="no-referrer" className="spin-slow h-full w-full object-contain brightness-125" />
            </div>
          </Reveal>
        </div>

        {/* Editorial Split Grid */}
        <div className="mt-18 grid items-center gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div className="relative">
            <ParallaxImg
              src={IMG.office2}
              alt="Sardar IT team workspace"
              cursor="STUDIO"
              className="aspect-[3/3.9] w-full"
            />
            <div className="glass-bright absolute -bottom-5 right-4 rounded-2xl px-6 py-4 shadow-2xl md:-right-8">
              <p className="font-display text-4xl font-extrabold">
                <Counter to={30} suffix="+" />
              </p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/65">Dedicated Family Members</p>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-10">
            <ScrollText
              className="font-display text-2xl font-semibold leading-[1.38] md:text-[1.95rem]"
              text="Welcome to SardarIT, your go-to destination for top-notch freelancing services. We understand the dynamic nature of the modern workforce, and we’re here to bridge the gap between talented freelancers and businesses seeking exceptional skills. Our mission is to empower freelancers to showcase their expertise and connect with clients worldwide. Simultaneously, we aim to simplify the hiring process for businesses, ensuring they find the right freelancers to meet their project needs efficiently."
            />

            <div className="flex flex-wrap items-center gap-6 border-t border-white/10 pt-8">
              <div className="relative h-24 w-24 shrink-0">
                <div className="absolute inset-0 rounded-full bg-white shadow-[0_0_40px_rgba(25,70,224,0.45)]" />
                <img src={IMG.ring} alt="" referrerPolicy="no-referrer" className="spin-rev absolute inset-0 h-full w-full" />
              </div>
              <div className="max-w-md">
                <p className="font-display text-lg font-bold text-white">Vetted Global Excellence</p>
                <p className="mt-1 text-sm text-white/60">
                  Connecting world-class Bangladeshi Web Developers, Designers, Marketers &amp; Code Poets with
                  ambitious companies worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* GSAP Scrubbed Expanding Cinema Portal */}
        <div ref={portalWrapRef} className="mt-20 md:mt-28">
          <div
            ref={portalBoxRef}
            data-cursor="EXPAND"
            className="relative aspect-[16/9] w-full overflow-hidden rounded-[28px] border border-white/15 shadow-[0_30px_110px_rgba(0,0,0,0.75)] md:aspect-[21/9]"
          >
            <img
              ref={portalImgRef}
              src={IMG.office3}
              alt="Inside Sardar IT headquarters"
              referrerPolicy="no-referrer"
              loading="lazy"
              className="h-full w-full object-cover will-change-transform"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04050c] via-[#04050c]/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-4 md:bottom-8 md:left-8 md:right-8">
              <div>
                <span className="rounded-full bg-[#ffd000] px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#04050c]">
                  Mirpur, Dhaka — Global Delivery
                </span>
                <p className="font-display mt-3 text-2xl font-extrabold text-white md:text-4xl">
                  Bridging Top-Tier Talent &amp; Worldwide Businesses
                </p>
              </div>
              <div className="glass hidden rounded-2xl px-5 py-3 text-right sm:block">
                <p className="text-[10px] uppercase tracking-[0.24em] text-white/55">Client Satisfaction</p>
                <p className="font-display text-2xl font-extrabold text-[#ffd000]">100%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
