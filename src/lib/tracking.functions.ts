import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * STUB — shipment tracking lookup.
 *
 * Wire your provider here (AfterShip, Shippo, EasyPost, 17track, etc.).
 * The CareChat already mentions tracking; once this returns real data,
 * surface it from src/routes/api/chat.ts as a tool the model can call.
 *
 * Required env vars (add to .env):
 *   TRACKING_API_KEY
 *   TRACKING_API_BASE_URL
 */
export const lookupTracking = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z
      .object({
        trackingNumber: z.string().min(4),
        carrier: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.TRACKING_API_KEY;
    if (!apiKey) {
      return {
        ok: false as const,
        error:
          "Tracking API not configured. Set TRACKING_API_KEY in .env, then implement the fetch in src/lib/tracking.functions.ts.",
      };
    }
    // TODO: call provider, normalize the response to the shape below.
    return {
      ok: true as const,
      trackingNumber: data.trackingNumber,
      carrier: data.carrier ?? "unknown",
      status: "in_transit" as
        | "pending"
        | "in_transit"
        | "out_for_delivery"
        | "delivered"
        | "exception",
      estimatedDelivery: null as string | null,
      events: [] as Array<{ at: string; location: string; message: string }>,
    };
  });
