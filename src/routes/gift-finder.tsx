import { createFileRoute } from "@tanstack/react-router";
import { GiftFinder } from "@/components/sections/GiftFinder";

export const Route = createFileRoute("/gift-finder")({
  head: () => ({
    meta: [
      { title: "Gift finder — GTA Threads" },
      {
        name: "description",
        content:
          "Answer three little questions and we'll find the embroidered gift they'll actually keep.",
      },
      { property: "og:title", content: "Gift finder — GTA Threads" },
      {
        property: "og:description",
        content: "Three questions to the perfect stitched gift.",
      },
      { property: "og:url", content: "/gift-finder" },
    ],
    links: [{ rel: "canonical", href: "/gift-finder" }],
  }),
  component: GiftFinderPage,
});

function GiftFinderPage() {
  return (
    <div className="pt-24">
      <GiftFinder />
    </div>
  );
}
