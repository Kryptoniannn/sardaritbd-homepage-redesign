import { useEffect, useRef, useState } from "react";
import { gsap } from "./gsapSetup";
import { CONTACT, IMG, MARQUEE, NAV } from "./data";
import { CHAPTERS } from "./theme";
import { ArrowIcon, goTo } from "./ui";

export default function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    if (boxRef.current) {
      gsap.fromTo(
        boxRef.current,
        { y: 24, scale: 0.95, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.42, ease: "expo.out" }
      );
    }
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const actions = [
    ...CHAPTERS.map((c) => ({
      group: "Jump to Chapter",
      label: `${c.index} · ${c.label}`,
      hint: "Section",
      run: () => {
        onClose();
        goTo(c.target);
      },
    })),
    ...MARQUEE.map((s) => ({
      group: "Services",
      label: s,
      hint: "Request Quote",
      run: () => {
        onClose();
        goTo("#contact");
      },
    })),
    {
      group: "Quick Actions",
      label: `Copy Phone (${CONTACT.phone})`,
      hint: copied === "phone" ? "Copied ✓" : "Copy",
      run: () => {
        navigator.clipboard?.writeText(CONTACT.phone).catch(() => {});
        setCopied("phone");
        window.setTimeout(() => setCopied(""), 1800);
      },
    },
    {
      group: "Quick Actions",
      label: `Copy Email (${CONTACT.email})`,
      hint: copied === "email" ? "Copied ✓" : "Copy",
      run: () => {
        navigator.clipboard?.writeText(CONTACT.email).catch(() => {});
        setCopied("email");
        window.setTimeout(() => setCopied(""), 1800);
      },
    },
    {
      group: "Quick Actions",
      label: "View Pricing Plans",
      hint: "External ↗",
      run: () => {
        onClose();
        window.open(NAV[3].href, "_blank", "noreferrer");
      },
    },
  ];

  const q = query.trim().toLowerCase();
  const filtered = q
    ? actions.filter(
        (a) => a.label.toLowerCase().includes(q) || a.group.toLowerCase().includes(q)
      )
    : actions;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[240] flex items-start justify-center bg-[#03040a]/80 px-4 pt-[12vh] backdrop-blur-xl"
    >
      <div
        ref={boxRef}
        onClick={(e) => e.stopPropagation()}
        className="glass-bright w-full max-w-xl overflow-hidden rounded-3xl shadow-[0_40px_140px_rgba(0,0,0,0.85)]"
      >
        <div className="flex items-center gap-3 border-b border-white/12 px-5 py-4">
          <div className="rounded-xl bg-white px-2.5 py-1">
            <img src={IMG.logo} alt="Sardar IT" referrerPolicy="no-referrer" className="h-4 w-auto" />
          </div>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to chapter, service, or contact action…"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
          />
          <button
            type="button"
            onClick={onClose}
            className="font-mono-hud rounded-lg border border-white/15 px-2 py-1 text-[10px] text-white/60 hover:text-white"
          >
            ESC
          </button>
        </div>

        <div className="max-h-[54vh] overflow-y-auto p-3">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-white/50">No matching commands.</p>
          ) : (
            <ul className="space-y-1">
              {filtered.map((a, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={a.run}
                    className="group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left transition hover:bg-white/10"
                  >
                    <div>
                      <span className="font-mono-hud block text-[9px] uppercase tracking-[0.25em] text-white/40">
                        {a.group}
                      </span>
                      <span className="font-display text-sm font-semibold text-white group-hover:text-[#ffd000]">
                        {a.label}
                      </span>
                    </div>
                    <span className="flex items-center gap-2 text-[11px] font-semibold text-white/50 group-hover:text-[#ffd000]">
                      {a.hint}
                      <ArrowIcon className="h-3.5 w-3.5" />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
