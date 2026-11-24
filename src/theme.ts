export type Chapter = {
  id: string;
  label: string;
  index: string;
  target: string;
  accent: [number, number, number];
};

export const CHAPTERS: Chapter[] = [
  { id: "intro", label: "Intro", index: "01", target: "#home", accent: [61, 107, 255] },
  { id: "studio", label: "Studio", index: "02", target: "#about", accent: [40, 92, 240] },
  { id: "services", label: "Services", index: "03", target: "#services", accent: [255, 208, 0] },
  { id: "process", label: "Process", index: "04", target: "#process", accent: [34, 211, 238] },
  { id: "works", label: "Works", index: "05", target: "#works", accent: [255, 46, 136] },
  { id: "people", label: "People", index: "06", target: "#team", accent: [0, 229, 160] },
  { id: "contact", label: "Contact", index: "07", target: "#contact", accent: [255, 176, 32] },
];

/** Live accent read by the WebGL aurora every frame (0-1 range). */
export const shaderAccent = { r: 0.239, g: 0.42, b: 1 };

export function chapterById(id: string): Chapter {
  return CHAPTERS.find((c) => c.id === id) ?? CHAPTERS[0];
}
