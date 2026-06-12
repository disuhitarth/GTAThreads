interface Props {
  flip?: boolean;
  color?: string;
  className?: string;
}

export function WaveDivider({ flip, color = "currentColor", className }: Props) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      className={className}
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
      aria-hidden
    >
      <path
        d="M0,60 C240,10 480,90 720,50 C960,10 1200,80 1440,40 L1440,90 L0,90 Z"
        fill={color}
      />
    </svg>
  );
}
