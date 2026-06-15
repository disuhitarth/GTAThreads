import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/env";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — GTA Threads" },
      {
        name: "description",
        content: "How GTA Threads collects, uses, and protects your personal information.",
      },
      { property: "og:title", content: "Privacy Policy — GTA Threads" },
      {
        property: "og:description",
        content: "How we handle your data.",
      },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <section className="bg-background px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-[800px]">
        <span className="font-script text-2xl text-bloom">your data, your trust</span>
        <h1 className="mt-2 font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
          Privacy <span className="italic text-bloom">policy.</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: June 2026</p>

        <div className="mt-12 space-y-8 text-base leading-relaxed text-foreground/85">
          <section>
            <h2 className="font-display text-2xl italic">1. Information we collect</h2>
            <p className="mt-3">
              When you place an order, sign up for our newsletter, or submit a custom order request,
              we collect the information you provide: your name, email address, shipping address,
              phone number, and payment details (processed securely through Shopify).
            </p>
            <p className="mt-3">
              We also automatically collect certain data when you visit our site, including your IP
              address, browser type, device information, and browsing behaviour through cookies and
              similar technologies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl italic">2. How we use your information</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>To process and fulfill your orders</li>
              <li>To communicate with you about your order</li>
              <li>To send marketing emails if you've opted in (via Klaviyo)</li>
              <li>To improve our website and customer experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl italic">3. Third-party services</h2>
            <p className="mt-3">
              We use the following third-party services that process your data:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Shopify</strong> — payment processing, order fulfillment, hosting
              </li>
              <li>
                <strong>Klaviyo</strong> — email marketing and newsletters
              </li>
              <li>
                <strong>Resend</strong> — transactional emails (custom order briefs)
              </li>
              <li>
                <strong>Netlify</strong> — website hosting
              </li>
              <li>
                <strong>Sentry</strong> — error monitoring
              </li>
              <li>
                <strong>Judge.me</strong> — product reviews
              </li>
              <li>
                <strong>Google Places API</strong> — displaying Google reviews
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl italic">4. Cookies</h2>
            <p className="mt-3">
              We use essential cookies for cart functionality and website operation. We also use
              analytics cookies (via Klaviyo and Sentry) to understand how our site is used. You can
              manage your cookie preferences through our cookie consent banner.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl italic">5. Your rights</h2>
            <p className="mt-3">
              Depending on your location, you may have the right to access, correct, delete, or port
              your personal data. You can opt out of marketing emails at any time by clicking the
              unsubscribe link in any email from us.
            </p>
            <p className="mt-3">
              To exercise your rights, contact us at{" "}
              <span className="text-bloom">hello@gtathreads.com</span>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl italic">6. Data security</h2>
            <p className="mt-3">
              We implement industry-standard security measures including HTTPS encryption, secure
              payment processing through Shopify (PCI DSS compliant), and restricted access to
              personal data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl italic">7. Contact</h2>
            <p className="mt-3">Questions about this policy? Reach out:</p>
            <p className="mt-2">
              Email: <span className="text-bloom">hello@gtathreads.com</span>
              <br />
              Studio: Toronto, ON, Canada
            </p>
          </section>
        </div>

        <div className="mt-16 border-t border-border pt-8 text-center">
          <Link
            to="/"
            className="inline-block rounded-full bg-foreground px-6 py-3 text-xs uppercase tracking-[0.22em] text-background hover:bg-bloom"
          >
            Back home
          </Link>
        </div>
      </div>
    </section>
  );
}
