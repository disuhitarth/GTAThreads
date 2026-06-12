import { useEffect, useRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface Props extends ComponentPropsWithoutRef<"button"> {
  children: ReactNode;
  strength?: number;
}

export function MagneticButton({ children, strength = 0.35, className, ...rest }: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: "power3.out" });
    };
    const reset = () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", reset);
    };
  }, [strength]);

  return (
    <button ref={ref} className={cn("inline-flex will-change-transform", className)} {...rest}>
      {children}
    </button>
  );
}
