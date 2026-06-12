import { useEffect, useRef } from "react";
import gsap from "gsap";

const PETAL_COLORS = ["#F5B6C6", "#E48BA1", "#C8447A", "#F8D7A8", "#A8B89A"];

export function FlowerCursor() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const layer = layerRef.current;
    if (!layer) return;

    let last = 0;
    const spawn = (x: number, y: number) => {
      const now = performance.now();
      if (now - last < 55) return;
      last = now;

      const petal = document.createElement("span");
      const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      const size = 10 + Math.random() * 10;
      petal.style.cssText = `
        position:fixed; left:${x}px; top:${y}px; width:${size}px; height:${size}px;
        border-radius:60% 0 60% 0; background:${color}; pointer-events:none;
        will-change:transform,opacity; z-index:80; opacity:0.9;
        transform: translate(-50%,-50%) rotate(${Math.random() * 360}deg);
        box-shadow: 0 2px 6px rgba(200,68,122,0.18);
      `;
      layer.appendChild(petal);

      gsap.to(petal, {
        x: (Math.random() - 0.5) * 80,
        y: 80 + Math.random() * 50,
        rotation: `+=${(Math.random() - 0.5) * 240}`,
        opacity: 0,
        duration: 1.6 + Math.random() * 0.6,
        ease: "power2.out",
        onComplete: () => petal.remove(),
      });
    };

    const onMove = (e: MouseEvent) => spawn(e.clientX, e.clientY);
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      layer.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[80] hidden md:block"
    />
  );
}
