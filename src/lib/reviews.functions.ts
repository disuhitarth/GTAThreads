import { createServerFn } from "@tanstack/react-start";

export type Review = {
  author: string;
  rating: number;
  text: string;
  relativeTime: string;
  source: "Google" | "Etsy";
  avatarUrl?: string;
};

/**
 * Fetch Google reviews via the Places API (New).
 * Requires GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in project secrets.
 * Returns null when not configured so the UI can fall back to curated reviews.
 */
export const fetchGoogleReviews = createServerFn({ method: "GET" }).handler(
  async (): Promise<Review[] | null> => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;
    if (!apiKey || !placeId) return null;

    try {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?fields=reviews,rating,userRatingCount`,
        {
          headers: {
            "X-Goog-Api-Key": apiKey,
            "X-Goog-FieldMask": "reviews,rating,userRatingCount",
          },
        },
      );
      if (!res.ok) return null;
      const json = (await res.json()) as {
        reviews?: Array<{
          authorAttribution?: { displayName?: string; photoUri?: string };
          rating?: number;
          text?: { text?: string };
          relativePublishTimeDescription?: string;
        }>;
      };
      if (!json.reviews) return null;
      return json.reviews.slice(0, 6).map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google customer",
        avatarUrl: r.authorAttribution?.photoUri,
        rating: r.rating ?? 5,
        text: r.text?.text ?? "",
        relativeTime: r.relativePublishTimeDescription ?? "recently",
        source: "Google" as const,
      }));
    } catch {
      return null;
    }
  },
);
