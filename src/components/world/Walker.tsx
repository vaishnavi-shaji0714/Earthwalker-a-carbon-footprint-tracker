/**
 * Animated walking silhouette of the Earthwalker.
 * Pure SVG so it's crisp, themeable, and never blocks render.
 * Used as both the persistent companion (idle walk-in-place at lower right)
 * and the transition actor (crosses the screen when the user "walks forward").
 */
export function Walker({
  size = 96,
  glow = true,
  className = "",
}: {
  size?: number;
  glow?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`walker pointer-events-none select-none ${className}`}
      style={{ width: size, height: size * 1.4 }}
    >
      <div className="walker-bob h-full w-full">
        <svg
          viewBox="0 0 60 90"
          width="100%"
          height="100%"
          aria-hidden="true"
          style={{
            filter: glow
              ? "drop-shadow(0 0 14px oklch(0.85 0.2 165 / 0.55)) drop-shadow(0 6px 10px rgba(0,0,0,0.6))"
              : "drop-shadow(0 6px 10px rgba(0,0,0,0.5))",
          }}
        >
          {/* head */}
          <circle cx="30" cy="12" r="7" fill="oklch(0.18 0.04 180)" />
          {/* torso */}
          <path
            d="M22 20 Q30 18 38 20 L36 48 Q30 50 24 48 Z"
            fill="oklch(0.22 0.06 180)"
          />
          {/* backpack hint (leaf) */}
          <path
            d="M37 24 Q44 26 42 36 Q36 34 36 28 Z"
            fill="oklch(0.55 0.18 150)"
            opacity="0.85"
          />
          {/* arms */}
          <rect className="arm-a" x="19" y="22" width="4" height="22" rx="2" fill="oklch(0.2 0.05 180)" />
          <rect className="arm-b" x="37" y="22" width="4" height="22" rx="2" fill="oklch(0.2 0.05 180)" />
          {/* legs */}
          <rect className="leg-a" x="25" y="48" width="5" height="28" rx="2.5" fill="oklch(0.15 0.04 180)" />
          <rect className="leg-b" x="31" y="48" width="5" height="28" rx="2.5" fill="oklch(0.15 0.04 180)" />
          {/* tiny firefly companion above shoulder */}
          <circle cx="44" cy="14" r="1.6" fill="oklch(0.95 0.18 95)">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </div>
  );
}
