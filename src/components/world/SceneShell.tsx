import { useEffect, useState, type ReactNode } from "react";

export function Fireflies({ count = 18 }: { count?: number }) {
  // Client-only render to avoid SSR hydration mismatch from Math.random()
  const [flies, setFlies] = useState<
    Array<{
      left: number;
      top: number;
      dx: number;
      dy: number;
      duration: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    setFlies(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        top: 40 + Math.random() * 60,
        dx: (Math.random() - 0.5) * 200,
        dy: -120 - Math.random() * 200,
        duration: 6 + Math.random() * 10,
        delay: Math.random() * 8,
      }))
    );
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {flies.map((f, i) => (
        <span
          key={i}
          className="firefly"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            ["--dx" as string]: `${f.dx}px`,
            ["--dy" as string]: `${f.dy}px`,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function GodRays() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen opacity-50">
      <div
        className="absolute -top-20 left-1/4 h-[140%] w-[40%] rotate-[8deg] animate-shimmer"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.95 0.12 95 / 0.35), transparent 70%)",
          filter: "blur(30px)",
        }}
      />
      <div
        className="absolute -top-20 right-1/4 h-[140%] w-[30%] -rotate-[10deg] animate-shimmer"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.9 0.14 180 / 0.3), transparent 70%)",
          filter: "blur(40px)",
          animationDelay: "1.5s",
        }}
      />
    </div>
  );
}

export function SceneBackdrop({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover animate-scene-zoom"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
    </>
  );
}

export function Discoverable({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 400 + delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={`${className} ${visible ? "animate-panel-rise" : "opacity-0"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function SceneShell({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) {
  return (
    <section
      id={id}
      className="scene absolute inset-0 overflow-hidden vignette"
    >
      {children}
    </section>
  );
}
