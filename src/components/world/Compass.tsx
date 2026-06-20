type Scene = { id: string; label: string };

export function Compass({
  scenes,
  activeIndex,
  onSelect,
}: {
  scenes: Scene[];
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4">
      {scenes.map(({ id, label }, i) => {
        const active = i === activeIndex;
        return (
          <button
            key={id}
            onClick={() => onSelect(i)}
            className="group flex items-center gap-3 text-left"
            aria-label={`Go to ${label}`}
            aria-current={active ? "true" : undefined}
          >
            <span
              className={`block rounded-full transition-all duration-500 ${
                active
                  ? "size-3 bg-primary shadow-[0_0_16px_var(--color-primary)]"
                  : "size-1.5 bg-muted-foreground/50 group-hover:bg-foreground"
              }`}
            />
            <span
              className={`text-xs uppercase tracking-[0.25em] transition-all duration-500 ${
                active
                  ? "text-primary opacity-100"
                  : "opacity-0 group-hover:opacity-60 text-foreground"
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
