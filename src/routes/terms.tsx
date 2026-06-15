import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — GTA Threads" },
      {
        name: "description",
        content:
          "Terms and conditions for using GTA Threads and purchasing custom embroidered products.",
      },
      { property: "og:title", content: "Terms of Service — GTA Threads" },
      {
        property: "og:description",
        content: "Our terms and conditions.",
      },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <section className="bg-background px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
      <div className="mx-auto max-w-[800px]">
        <span className="font-script text-2xl text-bloom">the fine print</span>
        <h1 className="mt-2 font-display text-5xl leading-[1.02] tracking-tight sm:text-7xl">
          Terms of <span className="italic text-bloom">service.</span>
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">Last updated: June 2026</p>

        <div className="mt-12 space-y-8 text-base leading-relaxed text-foreground/85">
          <section>
            <h2 className="font-display text-2xl italic">1. General</h2>
            <p className="mt-3">
              These terms govern your use of the GTA Threads website and the purchase of products
              from our studio. By placing an order, you agree to these terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl italic">2. Orders & Payment</h2>
            <p className="mt-3">
              All prices are listed in CAD and include applicable taxes. Payment is processed
              securely through Shopify Payments. Your order is confirmed when you receive an order
              confirmation email from Shopify.
            </p>
            <p className="mt-3">
              Custom orders require a deposit before work begins. Final price may vary based on
              design complexity, stitch count, and materials.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl italic">3. Production & Shipping</h2>
            <p className="mt-3">
              Standard production time is 5–7 business days. Rush orders (48-hour turnaround) are
              available for an additional fee. Shipping times vary by destination — see our
              <Link
                to="/shipping-returns"
                className="text-bloom underline-offset-4 hover:underline"
              >
                {" "}
                shipping page
              </Link>
              for details.
            </p>
            <p className="mt-3">
              We ship from Toronto, ON. Delivery estimates are not guaranteed and GTA Threads is not
              responsible for carrier delays.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl italic">4. Returns & Refunds</h2>
            <p className="mt-3">
              Non-personalised items may be returned within 30 days of delivery in original
              condition for a full refund. Personalised/custom items are final sale — we send a
              digital proof for approval before stitching.
            </p>
            <p className="mt-3">
              If your order arrives damaged, contact us within 7 days at
              <span className="text-bloom"> hello@gtathreads.com</span> with photos and we will
              replace the piece at no charge.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl italic">5. Intellectual Property</h2>
            <p className="mt-3">
              All designs, product images, and content on this site are the property of GTA Threads.
              Our embroidery designs are original and may not be reproduced without permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl italic">6. Limitation of Liability</h2>
            <p className="mt-3">
              GTA Threads is not liable for incidental or consequential damages arising from the use
              of our products or website. Our total liability is limited to the purchase price of
              the product in question.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl italic">7. Changes</h2>
            <p className="mt-3">
              We reserve the right to update these terms at any time. Changes take effect
              immediately upon posting. Continued use of the site constitutes acceptance of the
              updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl italic">8. Contact</h2>
            <p className="mt-3">
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
