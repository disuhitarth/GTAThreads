import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function FloralRing({ className }: Props) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={cn("animate-spin-slow", className)}
      aria-hidden
    >
      <defs>
        <g id="petal">
          <ellipse cx="0" cy="-140" rx="14" ry="28" fill="#E48BA1" opacity="0.9" />
          <ellipse cx="0" cy="-150" rx="6" ry="14" fill="#F5B6C6" />
        </g>
        <g id="daisy">
          <g>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((r) => (
              <ellipse
                key={r}
                cx="0"
                cy="-12"
                rx="4"
                ry="8"
                fill="#FFF6E5"
                transform={`rotate(${r})`}
              />
            ))}
            <circle r="3.5" fill="#E8B547" />
          </g>
        </g>
      </defs>
      <g transform="translate(200 200)">
        {Array.from({ length: 12 }).map((_, i) => (
          <use key={i} href="#petal" transform={`rotate(${i * 30})`} />
        ))}
        {[0, 60, 120, 180, 240, 300].map((r, i) => (
          <use
            key={r}
            href="#daisy"
            transform={`rotate(${r + 15}) translate(0 -110) scale(${i % 2 ? 1.3 : 1})`}
          />
        ))}
        <circle r="98" fill="none" stroke="#C8447A" strokeWidth="1" strokeDasharray="3 6" opacity="0.6" />
      </g>
    </svg>
  );
}
