import { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
  type: "star" | "circle" | "ring";
}

export function MagicalWandCursor() {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wandRef = useRef<HTMLDivElement>(null);
  
  // Track coordinates and physics in refs to avoid re-renders
  const mouseRef = useRef({ x: 0, y: 0 });
  const wandPhysicsRef = useRef({
    x: 0,
    y: 0,
    angle: -35,
    targetAngle: -35,
    vx: 0,
    vy: 0,
  });

  const particlesRef = useRef<Particle[]>([]);

  // Check if we are on a desktop device (pointer: fine)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Detect clickable element hovers
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.getAttribute("role") === "button" ||
        target.classList.contains("discoverable") ||
        target.classList.contains("compass-connector") ||
        target.classList.contains("scene-node");

      setIsHovered(!!isClickable);
    };

    // Click burst magic spell!
    const handleClick = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Burst of stars
      for (let i = 0; i < 24; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1, // slight upward bias
          size: 4 + Math.random() * 6,
          alpha: 1,
          color: i % 2 === 0 ? "oklch(0.85 0.2 160)" : "oklch(0.82 0.18 75)", // green or gold
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
          life: 0,
          maxLife: 30 + Math.random() * 30,
          type: Math.random() > 0.4 ? "star" : "circle",
        });
      }

      // Add a magical expanding ring
      particlesRef.current.push({
        x,
        y,
        vx: 0,
        vy: 0,
        size: 5,
        alpha: 1,
        color: "oklch(0.88 0.22 165)", // mint glow
        rotation: 0,
        rotationSpeed: 0,
        life: 0,
        maxLife: 25,
        type: "ring",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("click", handleClick);

    // Canvas sizing
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
    };
  }, [isFinePointer, isVisible]);

  // Main animation loop (Wand follow, tilt, Canvas particles)
  useEffect(() => {
    if (!isFinePointer) return;

    let animationFrameId: number;

    const drawStar = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number,
      color: string,
      alpha: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.fill();
    };

    const updateLoop = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const wandElement = wandRef.current;

      // 1. Update wand position with inertia (lerp)
      const physics = wandPhysicsRef.current;
      const mouse = mouseRef.current;

      // Store previous position to compute velocity
      const prevX = physics.x;
      const prevY = physics.y;

      // Lerp position for natural dragging weight
      physics.x = physics.x + (mouse.x - physics.x) * 0.15;
      physics.y = physics.y + (mouse.y - physics.y) * 0.15;

      // Calculate velocity
      physics.vx = physics.x - prevX;
      physics.vy = physics.y - prevY;

      // 2. Dynamic tilting based on movement velocity
      // Default rest angle is -35 degrees (pointing up-left)
      const restAngle = -35;
      // Tilt handles movement: moving right makes the handle swing left (counterclockwise), etc.
      const targetTilt = restAngle + physics.vx * 0.45 + physics.vy * 0.15;
      // Smoothly rotate
      physics.angle = physics.angle + (targetTilt - physics.angle) * 0.12;

      // Clamp angle so it doesn't spin wildly
      const maxTiltOffset = 25;
      physics.angle = Math.max(
        restAngle - maxTiltOffset,
        Math.min(restAngle + maxTiltOffset, physics.angle)
      );

      // Update wand DOM element
      if (wandElement) {
        if (isVisible) {
          wandElement.style.transform = `translate3d(${physics.x}px, ${physics.y}px, 0) rotate(${physics.angle}deg)`;
          wandElement.style.opacity = "1";
        } else {
          wandElement.style.opacity = "0";
        }
      }

      // 3. Spawning particles at the wand's tip
      // Since the wand transforms around (0,0) and the tip is at (0,0),
      // the tip coordinates are exactly physics.x, physics.y!
      if (isVisible) {
        const speed = Math.sqrt(physics.vx * physics.vx + physics.vy * physics.vy);
        const spawnCount = isHovered ? 3 : speed > 1.5 ? 2 : Math.random() < 0.15 ? 1 : 0;

        for (let i = 0; i < spawnCount; i++) {
          particlesRef.current.push({
            x: physics.x + (Math.random() - 0.5) * 4,
            y: physics.y + (Math.random() - 0.5) * 4,
            vx: (Math.random() - 0.5) * 1 - physics.vx * 0.1, // slightly blow opposite to motion direction
            vy: (Math.random() - 0.5) * 1 - 0.2, // slight upward float
            size: isHovered ? 3 + Math.random() * 4 : 1.5 + Math.random() * 3,
            alpha: 1,
            color: Math.random() > 0.4 ? "oklch(0.85 0.2 160)" : "oklch(0.82 0.18 75)", // magic green or gold
            rotation: Math.random() * Math.PI,
            rotationSpeed: (Math.random() - 0.5) * 0.05,
            life: 0,
            maxLife: isHovered ? 40 + Math.random() * 30 : 25 + Math.random() * 20,
            type: Math.random() > 0.5 ? "star" : "circle",
          });
        }
      }

      // 4. Update and Draw Particles on Canvas
      if (canvas && ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update list
        const activeParticles: Particle[] = [];

        for (let p of particlesRef.current) {
          p.life++;

          // Physics update
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;

          // Drag and gravity
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.vy += 0.03; // gravity

          // Calculate size and opacity percentage
          const progress = p.life / p.maxLife;
          p.alpha = 1 - progress;

          if (p.life < p.maxLife) {
            activeParticles.push(p);

            // Draw
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);

            if (p.type === "star") {
              drawStar(ctx, 0, 0, 4, p.size, p.size / 3.5, p.color, p.alpha);
            } else if (p.type === "circle") {
              ctx.beginPath();
              ctx.arc(0, 0, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
              ctx.fillStyle = p.color;
              ctx.globalAlpha = p.alpha;
              ctx.shadowColor = p.color;
              ctx.shadowBlur = p.size * 2;
              ctx.fill();
            } else if (p.type === "ring") {
              const currentRadius = p.size + progress * 50;
              ctx.beginPath();
              ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
              ctx.strokeStyle = p.color;
              ctx.lineWidth = 2 * (1 - progress);
              ctx.globalAlpha = p.alpha;
              ctx.shadowColor = p.color;
              ctx.shadowBlur = 10;
              ctx.stroke();
            }

            ctx.restore();
          }
        }

        particlesRef.current = activeParticles;
      }

      animationFrameId = requestAnimationFrame(updateLoop);
    };

    animationFrameId = requestAnimationFrame(updateLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isFinePointer, isVisible, isHovered]);

  if (!isFinePointer) return null;

  return (
    <>
      {/* High-performance Overlay Canvas for particles */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[999999]"
        style={{ mixBlendMode: "screen" }}
      />

      {/* The Magical Twig Wand element */}
      <div
        ref={wandRef}
        className="pointer-events-none fixed top-0 left-0 z-[1000000] will-change-transform transition-opacity duration-300"
        style={{
          width: "80px",
          height: "80px",
          // The center of rotation is the top-left (0,0) of the wand element,
          // which is the wand's glowing tip!
          transformOrigin: "0% 0%",
          opacity: 0,
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          style={{
            overflow: "visible",
            filter: "drop-shadow(2px 5px 4px rgba(0, 0, 0, 0.45))",
          }}
        >
          <defs>
            {/* Rich woody bark gradient */}
            <linearGradient id="woodGrip" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4e342e" /> {/* bark dark brown */}
              <stop offset="35%" stopColor="#5c4033" />
              <stop offset="75%" stopColor="#3b2314" />
              <stop offset="100%" stopColor="#1d0d04" />
            </linearGradient>

            {/* Glowing magic tip filter */}
            <filter id="magicGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Realistic Twisted Twig Wand Stick */}
          {/* Points from handle (bottom-right: ~50,50) to the tip (top-left: ~2,2) */}
          
          {/* Outer thick bark layer / organic body */}
          <path
            d="M 52 52 
               C 46 44, 48 40, 42 36 
               C 36 32, 38 28, 32 23 
               C 27 19, 29 15, 22 11 
               C 17 8, 16 6, 11 5
               C 7 4, 5 3, 2 2"
            fill="none"
            stroke="url(#woodGrip)"
            strokeWidth={isHovered ? "5.5" : "4.5"}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: "stroke-width 0.2s ease" }}
          />

          {/* Knobby Nodes (Elder Wand style) */}
          {/* Elder wand has prominent hollow balls or bumps along the length */}
          <circle cx="48" cy="48" r="4.5" fill="#3b2314" stroke="#221107" strokeWidth="1" />
          <circle cx="37" cy="31" r="3.8" fill="#4a2f1b" stroke="#2c170a" strokeWidth="1" />
          <circle cx="26" cy="18" r="3" fill="#5c3a21" stroke="#372010" strokeWidth="1" />
          <circle cx="15" cy="7.5" r="2.2" fill="#6d472c" stroke="#422917" strokeWidth="1" />

          {/* Inner highlight (rough wood grain fiber overlay) */}
          <path
            d="M 50 50 
               C 45 43, 47 39, 41 35 
               C 35 31, 37 27, 31 22 
               C 26 18, 28 14, 21 10
               C 16 7, 15 5, 10 4"
            fill="none"
            stroke="#8d6e63"
            strokeWidth="0.8"
            opacity="0.6"
            strokeDasharray="4 8"
          />

          {/* Handle Grip wrap details at base */}
          <path d="M 46 49 C 48 47, 50 49, 52 47" stroke="#271207" strokeWidth="1.2" fill="none" />
          <path d="M 49 52 C 51 50, 53 52, 55 50" stroke="#1d0d04" strokeWidth="1.2" fill="none" />

          {/* Magical Glowing Tip */}
          {/* Active hover states cause the tip to double in glow and shift color slightly */}
          <circle
            cx="2"
            cy="2"
            r={isHovered ? "7" : "4.5"}
            fill={isHovered ? "#ffffff" : "oklch(0.95 0.18 95)"}
            filter="url(#magicGlow)"
            className="animate-pulse"
            style={{
              transition: "r 0.2s ease, fill 0.2s ease",
              boxShadow: "0 0 15px currentColor",
            }}
          />
          <circle
            cx="2"
            cy="2"
            r={isHovered ? "3" : "1.8"}
            fill="#ffffff"
            style={{ transition: "r 0.2s ease" }}
          />
        </svg>
      </div>
    </>
  );
}
