import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import forestSrc from "@/assets/scene-forest.jpg";
import treeSrc from "@/assets/scene-tree.jpg";
import riverSrc from "@/assets/scene-river.jpg";
import mountainSrc from "@/assets/scene-mountain.jpg";
import gardenSrc from "@/assets/scene-garden.jpg";
import observatorySrc from "@/assets/scene-observatory.jpg";
import turtleSrc from "@/assets/scene-turtle.jpg";
import {
  SceneShell,
  SceneBackdrop,
  Fireflies,
  GodRays,
  Discoverable,
} from "@/components/world/SceneShell";
import { OwlGuide } from "@/components/world/OwlGuide";
import { Compass } from "@/components/world/Compass";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Earthwalker — Walk into a living world." },
      {
        name: "description",
        content:
          "An open-world environmental adventure where you walk deeper into a living forest and your sustainability habits shape the ecosystem.",
      },
    ],
  }),
  component: World,
});

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

const SCENES = [
  { id: "forest", label: "Valley" },
  { id: "tree", label: "Carbon Tree" },
  { id: "river", label: "River of Impact" },
  { id: "mountain", label: "Future Summit" },
  { id: "garden", label: "Garden" },
  { id: "observatory", label: "Observatory" },
  { id: "turtle", label: "Wise Turtle" },
];

const TRANSITION_MS = 2200;

function World() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [walking, setWalking] = useState(false);

  const goTo = (next: number) => {
    if (walking || next === index || next < 0 || next >= SCENES.length) return;
    setPrevIndex(index);
    setWalking(true);
    // Swap underlying scene right at the start of the walk so the new
    // scene is already "growing" behind the walker as they cross.
    window.setTimeout(() => setIndex(next), 350);
    window.setTimeout(() => {
      setWalking(false);
      setPrevIndex(null);
    }, TRANSITION_MS);
  };

  const walkForward = () => goTo(index + 1);
  const walkBack = () => goTo(index - 1);

  return (
    <div className="world bg-black">
      {/* Active scene */}
      <div
        key={`scene-${index}`}
        className="absolute inset-0 animate-scene-push-in"
      >
        <SceneRenderer index={index} />
      </div>

      {/* Previous scene fading out underneath the walk */}
      {prevIndex !== null && (
        <div
          key={`prev-${prevIndex}`}
          className="absolute inset-0 animate-scene-push-out pointer-events-none"
        >
          <SceneRenderer index={prevIndex} />
        </div>
      )}

      {/* Soft warm haze during transition */}
      {walking && (
        <div
          className="pointer-events-none absolute inset-0 z-30 mix-blend-screen opacity-60"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, oklch(0.95 0.14 95 / 0.3), transparent 60%)",
          }}
        />
      )}

      {/* Persistent UI overlays */}
      <Compass scenes={SCENES} activeIndex={index} onSelect={goTo} />
      <OwlGuide />
      <ChapterFrame index={index} total={SCENES.length} />
      <WalkControls
        index={index}
        total={SCENES.length}
        walking={walking}
        onForward={walkForward}
        onBack={walkBack}
      />

    </div>
  );
}

function ChapterFrame({ index, total }: { index: number; total: number }) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 glass-panel px-5 py-2 flex items-center gap-3">
      <span className="text-xs uppercase tracking-[0.3em] text-white/70">
        Chapter {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <span className="size-1 rounded-full bg-primary/70" />
      <span className="text-xs text-primary uppercase tracking-[0.25em]">
        {SCENES[index].label}
      </span>
    </div>
  );
}

function WalkControls({
  index,
  total,
  walking,
  onForward,
  onBack,
}: {
  index: number;
  total: number;
  walking: boolean;
  onForward: () => void;
  onBack: () => void;
}) {
  const atEnd = index >= total - 1;
  const atStart = index <= 0;
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
      <button
        onClick={onBack}
        disabled={atStart || walking}
        aria-label="Walk back"
        className="glass-panel px-4 py-3 text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        ← Back
      </button>
      <button
        onClick={onForward}
        disabled={atEnd || walking}
        aria-label="Walk deeper into the world"
        className="glass-panel px-7 py-3 text-primary glow-text hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-display text-lg"
      >
        {walking ? "Walking…" : atEnd ? "End of the path" : "Walk forward →"}
      </button>
    </div>
  );
}

function SceneRenderer({ index }: { index: number }) {
  switch (SCENES[index].id) {
    case "forest":
      return <ForestScene />;
    case "tree":
      return <TreeScene />;
    case "river":
      return <RiverScene />;
    case "mountain":
      return <MountainScene />;
    case "garden":
      return <GardenScene />;
    case "observatory":
      return <ObservatoryScene />;
    case "turtle":
      return <TurtleScene />;
    default:
      return null;
  }
}

/* ---------- 1. FOREST / HOME ---------- */
function ForestScene() {
  const now = useClock();
  const time = now
    ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "—";
  const day = now
    ? now.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" })
    : "";

  return (
    <SceneShell id="forest">
      <SceneBackdrop src={forestSrc} alt="Enchanted forest valley with crystal river" />
      <GodRays />
      <Fireflies count={22} />

      <Discoverable className="absolute top-20 left-10 md:left-24 max-w-xl">
        <h1 className="font-display text-5xl md:text-7xl text-white glow-text leading-[1.05]">
          Explore. Discover.<br />Heal the Earth.
        </h1>
        <p className="mt-5 text-base md:text-lg text-white/80 max-w-md">
          Step into the valley. Every walk forward reveals a new chapter of your impact.
        </p>
      </Discoverable>

      <Discoverable delay={300} className="absolute bottom-32 left-10 md:left-24">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Today's Impact</p>
        <p className="mt-3 font-display text-7xl md:text-8xl text-primary glow-text leading-none">
          2.4 <span className="text-2xl text-white/70 font-sans align-top">kg CO₂e</span>
        </p>
        <p className="mt-3 text-sm text-primary/90">↑ 18% better than yesterday</p>
      </Discoverable>

      <Discoverable delay={500} className="absolute top-20 right-10 md:right-16">
        <div className="glass-panel px-5 py-3 flex items-center gap-4">
          <span className="text-2xl">☀</span>
          <div className="text-right">
            <p className="text-sm text-white/70">24°C</p>
            <p className="font-display text-xl text-white leading-none">{time}</p>
            <p className="text-xs text-white/60 mt-0.5">{day}</p>
          </div>
        </div>
      </Discoverable>

      <Discoverable delay={800} className="absolute bottom-32 right-10 md:right-16 w-[300px]">
        <div className="glass-panel p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/90 mb-2">🌿 Today's Quest</p>
          <p className="font-display text-xl text-white leading-tight">Use public transport or carpool</p>
          <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-0 bg-gradient-to-r from-primary to-accent rounded-full" />
          </div>
          <div className="mt-2 flex justify-between text-xs text-white/60">
            <span>0 / 1</span>
            <span className="text-primary">Reward · 25 🌱</span>
          </div>
        </div>
      </Discoverable>
    </SceneShell>
  );
}

/* ---------- 2. CARBON TREE ---------- */
function TreeScene() {
  const categories = [
    { label: "Transport", value: 40, color: "oklch(0.78 0.16 200)" },
    { label: "Home", value: 25, color: "oklch(0.82 0.18 150)" },
    { label: "Food", value: 20, color: "oklch(0.82 0.18 95)" },
    { label: "Shopping", value: 10, color: "oklch(0.78 0.16 320)" },
    { label: "Waste", value: 5, color: "oklch(0.78 0.16 30)" },
  ];
  return (
    <SceneShell id="tree">
      <SceneBackdrop src={treeSrc} alt="Ancient glowing tree of life" />
      <Fireflies count={16} />

      <Discoverable className="absolute top-20 left-10 md:left-24 max-w-md">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/90">Chapter Two</p>
        <h2 className="mt-3 font-display text-5xl md:text-6xl text-white glow-text">The Carbon Footprint Tree</h2>
        <p className="mt-4 text-white/75 leading-relaxed">
          The ancient tree at the heart of the valley grows with every kind choice and withers
          with every careless one. Today, its leaves shimmer.
        </p>
      </Discoverable>

      <Discoverable delay={400} className="absolute top-24 right-10 md:right-16 w-[320px]">
        <div className="glass-panel p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-white/60">Your Footprint</p>
          <p className="text-xs text-white/40">This Month</p>
          <div className="my-5 flex items-end gap-3">
            <p className="font-display text-6xl text-primary glow-text leading-none">620</p>
            <p className="text-sm text-white/70 mb-2">kg CO₂e</p>
          </div>
          <p className="text-xs text-primary mb-5">↑ 18% better than last month</p>
          <div className="space-y-3">
            {categories.map((c) => (
              <div key={c.label}>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>{c.label}</span>
                  <span>{c.value}%</span>
                </div>
                <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${c.value}%`, background: c.color, boxShadow: `0 0 12px ${c.color}` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Discoverable>
    </SceneShell>
  );
}

/* ---------- 3. RIVER OF IMPACT ---------- */
function RiverScene() {
  const orbs = [
    { label: "Used Public Transport", value: "−2 kg CO₂e", icon: "🚆" },
    { label: "Recycled Waste", value: "−1 kg CO₂e", icon: "♻" },
    { label: "Plant-Based Meal", value: "−1.5 kg CO₂e", icon: "🥗" },
    { label: "Walked to Work", value: "−0.8 kg CO₂e", icon: "👣" },
  ];
  return (
    <SceneShell id="river">
      <SceneBackdrop src={riverSrc} alt="Crystal river carrying memory orbs" />
      <Fireflies count={14} />

      <Discoverable className="absolute top-20 left-10 md:left-24 max-w-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-secondary">Chapter Three</p>
        <h2 className="mt-3 font-display text-5xl md:text-6xl text-white glow-text">River of Impact</h2>
        <p className="mt-4 text-white/75 leading-relaxed">
          Your actions flow downstream as glowing memory orbs. Reach out to remember each one.
        </p>
      </Discoverable>

      <div className="absolute bottom-28 left-0 right-0 px-10 md:px-24">
        <div className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {orbs.map((o, i) => (
            <Discoverable key={o.label} delay={200 + i * 150} className="shrink-0">
              <div className="glass-panel p-5 w-56 hover:scale-105 transition-transform duration-500 cursor-pointer">
                <div
                  className="size-14 rounded-full flex items-center justify-center text-2xl mb-3 animate-pulse-glow"
                  style={{ background: "radial-gradient(circle, oklch(0.85 0.2 200 / 0.4), transparent 70%)" }}
                >
                  {o.icon}
                </div>
                <p className="text-sm text-white/90">{o.label}</p>
                <p className="font-display text-xl text-primary mt-1">{o.value}</p>
              </div>
            </Discoverable>
          ))}
        </div>
      </div>
    </SceneShell>
  );
}

/* ---------- 4. FUTURE SUMMIT ---------- */
function MountainScene() {
  const [side, setSide] = useState<"now" | "future">("future");
  return (
    <SceneShell id="mountain">
      <SceneBackdrop src={mountainSrc} alt="Split view of two possible futures" />

      <Discoverable className="absolute top-20 left-1/2 -translate-x-1/2 text-center max-w-2xl">
        <p className="text-xs uppercase tracking-[0.3em] text-ember">Chapter Four</p>
        <h2 className="mt-3 font-display text-5xl md:text-6xl text-white glow-text">Future Simulator Summit</h2>
        <p className="mt-4 text-white/75">Climb to see the future. Your choices shape tomorrow.</p>
      </Discoverable>

      <Discoverable delay={400} className="absolute top-1/3 left-10 md:left-16 max-w-xs">
        <div className="glass-panel p-5" style={{ borderColor: "oklch(0.7 0.2 30 / 0.4)" }}>
          <p className="text-xs uppercase tracking-[0.25em]" style={{ color: "oklch(0.85 0.2 40)" }}>
            If nothing changes
          </p>
          <p className="font-display text-2xl text-white mt-2">+2.7°C by 2050</p>
          <p className="text-sm text-white/60 mt-2">Drought, displacement, lost coastlines.</p>
        </div>
      </Discoverable>

      <Discoverable delay={400} className="absolute top-1/3 right-10 md:right-16 max-w-xs">
        <div className="glass-panel p-5" style={{ borderColor: "oklch(0.82 0.18 150 / 0.4)" }}>
          <p className="text-xs uppercase tracking-[0.25em] text-primary">If you act now</p>
          <p className="font-display text-2xl text-white mt-2">+1.5°C, stabilized</p>
          <p className="text-sm text-white/60 mt-2">Restored forests, clean grids, thriving life.</p>
        </div>
      </Discoverable>

      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 glass-panel px-2 py-2 flex gap-1">
        <button
          onClick={() => setSide("now")}
          className={`px-5 py-2 rounded-full text-sm transition-all ${
            side === "now" ? "bg-white/10 text-white" : "text-white/50"
          }`}
        >
          If nothing changes
        </button>
        <button
          onClick={() => setSide("future")}
          className={`px-5 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
            side === "future" ? "bg-primary text-primary-foreground" : "text-white/50"
          }`}
        >
          If you act now →
        </button>
      </div>
    </SceneShell>
  );
}

/* ---------- 5. ACHIEVEMENT GARDEN ---------- */
function GardenScene() {
  const blooms = [
    { name: "Wind Walker", desc: "Cycled 50 km", color: "oklch(0.78 0.16 200)" },
    { name: "Sunflower Saver", desc: "30 days plant meals", color: "oklch(0.85 0.2 80)" },
    { name: "Aurora Recycler", desc: "100 items recycled", color: "oklch(0.78 0.16 320)" },
    { name: "Emerald Heart", desc: "Reduced footprint 25%", color: "oklch(0.82 0.18 150)" },
  ];
  return (
    <SceneShell id="garden">
      <SceneBackdrop src={gardenSrc} alt="Crystal garden of achievements" />
      <Fireflies count={20} />

      <Discoverable className="absolute top-20 left-10 md:left-24 max-w-md">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Chapter Five</p>
        <h2 className="mt-3 font-display text-5xl md:text-6xl text-white glow-text">Achievement Garden</h2>
        <p className="mt-4 text-white/75">Each habit blooms into a rare species. Tend them well.</p>
      </Discoverable>

      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 grid grid-cols-2 md:grid-cols-4 gap-5 px-6">
        {blooms.map((b, i) => (
          <Discoverable key={b.name} delay={200 + i * 150}>
            <div className="glass-panel p-5 w-44 text-center hover:-translate-y-2 transition-transform duration-500">
              <div
                className="mx-auto size-16 rounded-full mb-3 animate-pulse-glow"
                style={{
                  background: `radial-gradient(circle, ${b.color}, transparent 70%)`,
                }}
              />
              <p className="font-display text-lg text-white">{b.name}</p>
              <p className="text-xs text-white/60 mt-1">{b.desc}</p>
            </div>
          </Discoverable>
        ))}
      </div>
    </SceneShell>
  );
}

/* ---------- 6. COMMUNITY OBSERVATORY ---------- */
function ObservatoryScene() {
  const stats = [
    { label: "Trees Planted", value: "12,456,789", icon: "🌳" },
    { label: "CO₂e Reduced", value: "8,765,432 kg", icon: "💚" },
    { label: "Active Earthwalkers", value: "1,248,532", icon: "🚶" },
    { label: "Countries Involved", value: "142", icon: "🌍" },
  ];
  return (
    <SceneShell id="observatory">
      <SceneBackdrop src={observatorySrc} alt="Holographic Earth observatory" />

      <Discoverable className="absolute top-20 left-10 md:left-24 max-w-md">
        <p className="text-xs uppercase tracking-[0.3em] text-secondary">Chapter Six</p>
        <h2 className="mt-3 font-display text-5xl md:text-6xl text-white glow-text">Community Observatory</h2>
        <p className="mt-4 text-white/75">See how the world is healing — together.</p>
      </Discoverable>

      <Discoverable delay={500} className="absolute top-24 right-10 md:right-16 w-[300px]">
        <div className="glass-panel p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-white/60 mb-5">Together we've</p>
          <div className="space-y-5">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                  {s.icon}
                </div>
                <div>
                  <p className="text-xs text-white/60">{s.label}</p>
                  <p className="font-display text-xl text-white">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Discoverable>

      <Discoverable delay={1000} className="absolute bottom-28 left-1/2 -translate-x-1/2">
        <div className="glass-panel px-8 py-4">
          <span className="font-display text-xl text-primary glow-text">I will take action 🌱</span>
        </div>
      </Discoverable>
    </SceneShell>
  );
}

/* ---------- 7. WISE TURTLE (settings hidden in nature) ---------- */
function TurtleScene() {
  const [open, setOpen] = useState<null | "profile" | "preferences" | "privacy">(null);

  const ASK = [
    { id: "profile" as const, label: "Who am I?", icon: "🪞", title: "Your profile" },
    { id: "preferences" as const, label: "Set my journey", icon: "🌾", title: "Your preferences" },
    { id: "privacy" as const, label: "Open the magical book", icon: "📖", title: "Privacy & data" },
  ];

  return (
    <SceneShell id="turtle">
      <SceneBackdrop src={turtleSrc} alt="A wise turtle resting on a mossy rock by a calm lake" />
      <Fireflies count={12} />

      <Discoverable className="absolute top-20 left-10 md:left-24 max-w-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">Final Chapter</p>
        <h2 className="mt-3 font-display text-5xl md:text-6xl text-white glow-text">
          The Wise Turtle
        </h2>
        <p className="mt-4 text-white/80 leading-relaxed">
          By the lake at the edge of the world, an old turtle keeps your name, your wishes,
          and a magical book of your private things. Approach gently — and ask.
        </p>
      </Discoverable>

      <Discoverable delay={500} className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-wrap gap-4 justify-center">
        {ASK.map((q) => (
          <button
            key={q.id}
            onClick={() => setOpen(q.id)}
            className="glass-panel px-5 py-4 text-left hover:scale-105 transition-all duration-500 w-56"
          >
            <p className="text-2xl">{q.icon}</p>
            <p className="font-display text-lg text-white mt-2">{q.label}</p>
            <p className="text-xs text-white/60 mt-1">Talk to the turtle</p>
          </button>
        ))}
      </Discoverable>

      {open && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-panel-rise"
          onClick={() => setOpen(null)}
        >
          <div
            className="glass-panel max-w-md w-full p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-primary">The turtle speaks</p>
            <h3 className="mt-2 font-display text-3xl text-white">
              {ASK.find((a) => a.id === open)?.title}
            </h3>
            <TurtleBookContent which={open} />
            <button
              onClick={() => setOpen(null)}
              className="mt-6 text-sm text-white/70 hover:text-white"
            >
              ← Bow and step away
            </button>
          </div>
        </div>
      )}
    </SceneShell>
  );
}

function TurtleBookContent({
  which,
}: {
  which: "profile" | "preferences" | "privacy";
}) {
  if (which === "profile") {
    return (
      <div className="mt-5 space-y-4">
        <Field label="Name" value="Mira Forest" />
        <Field label="Walking since" value="March 2024" />
        <Field label="Footprint goal" value="under 500 kg / month" />
      </div>
    );
  }
  if (which === "preferences") {
    return (
      <div className="mt-5 space-y-3 text-white/85 text-sm">
        <Toggle label="Dawn or dusk lighting" hint="Cycle the world's sky" />
        <Toggle label="Show wildlife" hint="Butterflies, deer, fireflies" />
        <Toggle label="Whisper notifications" hint="The owl will speak softly" />
      </div>
    );
  }
  return (
    <div className="mt-5 space-y-3 text-white/85 text-sm">
      <p className="italic text-white/70">
        “Your story is yours. The book only opens when you allow it.”
      </p>
      <Toggle label="Anonymous community stats" hint="Share footprint trends only" defaultOn />
      <Toggle label="Encrypted journal" hint="Memories locked to your key" defaultOn />
      <Toggle label="Download my data" hint="A scroll of everything we know" />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-2">
      <span className="text-xs uppercase tracking-[0.2em] text-white/50">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

function Toggle({
  label,
  hint,
  defaultOn = false,
}: {
  label: string;
  hint: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className="flex items-center justify-between w-full text-left py-2"
    >
      <span>
        <span className="block text-white">{label}</span>
        <span className="block text-xs text-white/55">{hint}</span>
      </span>
      <span
        className={`relative h-6 w-11 rounded-full transition-colors ${
          on ? "bg-primary" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white transition-all ${
            on ? "left-[1.4rem]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
