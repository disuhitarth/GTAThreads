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
      <img
        src="https://i.ibb.co/TDf1VqYB/GTA-LOGO.png"
        alt="GTA Threads Logo"
        className={cn("h-7 w-auto object-contain", className)}
      />
    );
  }
  return (
    <div className={cn("flex flex-col items-start leading-none", className)}>
      <img
        src="https://i.ibb.co/TDf1VqYB/GTA-LOGO.png"
        alt="GTA Threads Logo"
        className="h-10 sm:h-12 w-auto object-contain"
      />
      <span className="mt-1 font-script text-xs sm:text-sm leading-none text-bloom block">
        stitched with love
      </span>
    </div>
  );
}
