import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * STUB — newsletter signup. Pick a provider and implement the fetch.
 *   Klaviyo  https://developers.klaviyo.com/en/reference/subscribe_profiles
 *   Mailchimp https://mailchimp.com/developer/marketing/api/list-members/
 *   Resend Audiences https://resend.com/docs/api-reference/audiences/contacts
 */
export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ email: z.string().email() }).parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
    if (!apiKey) {
      // Dev fallback: pretend success so the UI keeps working offline.
      console.warn(
        "[newsletter] No provider configured. Email captured locally only:",
        data.email,
      );
      return { ok: true as const, provider: "none" as const };
    }
    // TODO: POST to provider here.
    return { ok: true as const, provider: "klaviyo" as const };
  });
