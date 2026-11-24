import { useEffect, useState } from "react";
import { CHAPTERS, chapterById } from "./theme";
import { goTo } from "./ui";

export default function ChapterRail({ chapter }: { chapter: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  const activeIdx = Math.max(
    0,
    CHAPTERS.findIndex((c) => c.id === chapter)
  );
  const active = chapterById(chapter);

  return (
    <nav
      aria-label="Page chapters"
      className={`group/rail fixed left-3 top-1/2 z-[75] hidden -translate-y-1/2 flex-col gap-1 transition-all duration-700 hover:bg-[#04050c]/70 hover:backdrop-blur-md 2xl:flex ${
        ready ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
      }`}
    >
      <span className="mb-3 pl-1 text-[9px] font-bold uppercase tracking-[0.3em] text-white/0 transition-colors duration-300 group-hover/rail:text-white/40">
        Chapters
      </span>

      <div className="relative flex flex-col gap-1">
        <span className="absolute bottom-2 left-[7px] top-2 w-px bg-white/12" />
        <span
          className="absolute left-[6px] w-[3px] rounded-full transition-all duration-500 ease-out"
          style={{
            top: `${activeIdx * 38 + 8}px`,
            height: "18px",
            background: `rgb(${active.accent.join(" ")})`,
            boxShadow: `0 0 14px rgb(${active.accent.join(" ")} / 0.9)`,
          }}
        />

        {CHAPTERS.map((c) => {
          const isActive = c.id === chapter;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => goTo(c.target)}
              data-cursor={c.label.toUpperCase()}
              aria-current={isActive ? "true" : undefined}
              className="group relative flex h-[34px] items-center gap-3 pl-6 pr-2 text-left"
            >
              <span
                className="absolute left-[4px] h-[7px] w-[7px] rounded-full border transition-all duration-300"
                style={{
                  borderColor: isActive ? `rgb(${c.accent.join(" ")})` : "rgba(255,255,255,0.35)",
                  background: isActive ? `rgb(${c.accent.join(" ")})` : "transparent",
                }}
              />
              <span
                className={`whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.22em] transition-all duration-300 ${
                  isActive
                    ? "translate-x-0 text-white opacity-100"
                    : "-translate-x-2 text-white/45 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                }`}
              >
                <span className="mr-1.5 text-white/35">{c.index}</span>
                {c.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
