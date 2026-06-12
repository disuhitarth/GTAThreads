import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";

interface Props {
  slug: string;
  className?: string;
  /**
   * Accessible label for the icon.
   *  - Pass a descriptive string for standalone/decorative-but-meaningful icons.
   *  - Pass `""` only when the icon sits directly next to a text label that
   *    already names it (decorative duplicate) — screen readers will skip it.
   *  - Omit to derive a sensible default like "Hoodies icon" from the slug.
   */
  alt?: string;
}

function slugToLabel(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Renders the AI-generated embroidery icon for a category/occasion slug.
 */
export function CategoryIcon({ slug, className, alt }: Props) {
  const src = getIcon(slug);
  const resolvedAlt = alt === undefined ? `${slugToLabel(slug)} category icon` : alt;
  return (
    <img
      src={src}
      alt={resolvedAlt}
      loading="lazy"
      width={512}
      height={512}
      className={cn("object-contain", className)}
    />
  );
}
