import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "wordmark" | "mono";
}

function Daisy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <g fill="currentColor">
        <ellipse cx="12" cy="4.5" rx="2" ry="3.2" />
        <ellipse cx="12" cy="19.5" rx="2" ry="3.2" />
        <ellipse cx="4.5" cy="12" rx="3.2" ry="2" />
        <ellipse cx="19.5" cy="12" rx="3.2" ry="2" />
        <ellipse cx="6.8" cy="6.8" rx="2.6" ry="1.8" transform="rotate(-45 6.8 6.8)" />
        <ellipse cx="17.2" cy="6.8" rx="2.6" ry="1.8" transform="rotate(45 17.2 6.8)" />
        <ellipse cx="6.8" cy="17.2" rx="2.6" ry="1.8" transform="rotate(45 6.8 17.2)" />
        <ellipse cx="17.2" cy="17.2" rx="2.6" ry="1.8" transform="rotate(-45 17.2 17.2)" />
      </g>
      <circle cx="12" cy="12" r="2.6" fill="#E8B547" />
    </svg>
  );
}

export function Logo({ className, variant = "wordmark" }: LogoProps) {
  if (variant === "mono") {
    return (
      <div className={cn("flex items-center gap-1.5 font-display text-2xl leading-none", className)}>
        <span className="italic font-semibold">G</span>
        <Daisy className="h-5 w-5 text-rose" />
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col leading-none", className)}>
      <span className="flex items-center gap-1.5 font-display text-xl tracking-tight sm:text-[26px]">
        <span className="italic font-medium">GTA</span>
        <Daisy className="h-4 w-4 text-rose animate-spin-slow" />
        <span className="font-medium">Threads</span>
      </span>
      <span className="mt-1 hidden font-script text-base leading-none text-bloom sm:inline">
        stitched with love
      </span>
    </div>
  );
}
