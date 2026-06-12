import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: ReactNode;
  y?: number;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li";
}

export function RevealOnScroll({ children, y = 30, delay = 0, className, as = "div" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = as as any;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.from(el, {
      y,
      opacity: 0,
      duration: 0.9,
      delay,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [y, delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
