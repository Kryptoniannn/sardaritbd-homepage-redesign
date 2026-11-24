import { IMG } from "../data";
import ParallaxImg from "../ParallaxImg";
import { ArrowIcon, Button, Counter, Magnetic, Reveal, ScrollText, SectionTag, SplitWords } from "../ui";

const TRACKS = ["Web Development", "UI/UX Design", "Graphics & Branding", "Digital Marketing", "Job Placement"];

export default function Learning() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="aurora blob2 pointer-events-none absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-[#1946e0]/45" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <SectionTag className="mb-7">Sardar IT Academy</SectionTag>
            <h2 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl lg:text-7xl">
              <SplitWords text="Our Very Own [LEARNING] Platform" />
            </h2>
          </div>
          <Reveal>
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white p-4 shadow-[0_0_50px_rgba(255,208,0,0.35)]">
              <img src={IMG.shape} alt="" referrerPolicy="no-referrer" className="spin-rev h-full w-full object-contain" />
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          {/* Left Portrait Collage */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <ParallaxImg
              src={IMG.learn1}
              alt="Sardar IT Learning Platform community"
              cursor="ACADEMY"
              className="aspect-[3/4] w-full"
              speed={9}
            />
            <div className="glass-bright absolute -bottom-6 -right-3 rounded-2xl px-6 py-4 shadow-2xl md:-right-8">
              <p className="font-display text-4xl font-extrabold">
                <Counter to={200} suffix="+" />
              </p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/70">Students · Since Aug 2023</p>
            </div>
            <div className="absolute -left-6 -top-6 hidden h-28 w-28 rounded-full bg-white shadow-xl md:block">
              <img src={IMG.ring} alt="" referrerPolicy="no-referrer" className="spin-slow h-full w-full" />
            </div>
          </div>

          {/* Right Gold-Wave Copy + Studio Frame */}
          <div className="space-y-9">
            <ScrollText
              className="font-display text-xl font-medium leading-[1.52] md:text-2xl"
              text="Sardar IT is an innovative learning platform. Since the beginning of our journey in August 2023, more than 200 students have become part of a vibrant community! Our learners are dedicated to developing top-tier skills to secure sought-after job placement opportunities—excellence is non-negotiable. Join their learning revolution to acquire new skills, boost your knowledge, and secure limitless possibilities for success. Enroll in Sardar IT today and embark on your exciting learning adventure!"
            />

            <Reveal className="flex flex-wrap gap-2.5">
              {TRACKS.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold text-white/80"
                >
                  ✦ {t}
                </span>
              ))}
            </Reveal>

            <div className="flex flex-wrap items-center gap-5">
              <Magnetic>
                <Button href="#contact">
                  Enroll in Sardar IT <ArrowIcon />
                </Button>
              </Magnetic>
            </div>

            <ParallaxImg
              src={IMG.learn2}
              alt="Sardar IT classroom training session"
              cursor="JOIN"
              className="aspect-[16/9] w-full"
              speed={10}
              delay={0.18}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
