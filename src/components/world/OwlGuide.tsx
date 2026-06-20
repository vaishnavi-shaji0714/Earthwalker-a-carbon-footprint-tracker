import { useState } from "react";
import owlSrc from "@/assets/owl-guide.png";

const SUGGESTIONS = [
  {
    q: "Your transport emissions rose 12% this week.",
    a: "Try cycling on Thursdays — you'd save about 3.2 kg CO₂e and unlock the Wind Walker flower.",
  },
  {
    q: "The forest noticed your plant-based meals.",
    a: "Three new saplings appeared near the river. Keep going — at 5 meals, a deer family arrives.",
  },
  {
    q: "Want a greener route home?",
    a: "The 38 bus departs in 6 minutes. It would save 1.8 kg CO₂e versus driving tonight.",
  },
];

export function OwlGuide() {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const tip = SUGGESTIONS[idx];

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Talk to Lumen, your guide"
        className="fixed bottom-8 right-8 z-50 size-24 rounded-full animate-float-soft hover:scale-110 transition-transform duration-500"
      >
        <span
          className="absolute inset-0 rounded-full animate-pulse-glow"
          style={{ background: "radial-gradient(circle, oklch(0.85 0.2 200 / 0.5), transparent 70%)" }}
        />
        <img
          src={owlSrc}
          alt="Lumen the owl"
          className="relative h-full w-full object-contain drop-shadow-[0_0_24px_oklch(0.85_0.2_200_/_0.8)]"
        />
      </button>

      {open && (
        <div className="fixed bottom-36 right-8 z-50 w-[22rem] glass-panel p-6 animate-panel-rise">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs uppercase tracking-[0.2em] text-primary">Lumen · your guide</span>
          </div>
          <p className="font-display text-xl leading-snug text-foreground mb-2">{tip.q}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{tip.a}</p>
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => setIdx((i) => (i + 1) % SUGGESTIONS.length)}
              className="flex-1 rounded-full bg-primary/90 hover:bg-primary text-primary-foreground text-sm py-2 transition-colors"
            >
              Tell me more
            </button>
            <button
              onClick={() => setOpen(false)}
              className="px-4 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      )}
    </>
  );
}
