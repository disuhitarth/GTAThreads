import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { TrustStrip } from "@/components/TrustStrip";
import { Occasions } from "@/components/sections/Occasions";
import { FeaturedProducts, productsQueryOptions } from "@/components/sections/FeaturedProducts";
import { GiftFinder } from "@/components/sections/GiftFinder";
import { BestsellersCarousel } from "@/components/sections/BestsellersCarousel";
import { GiftWrapStrip } from "@/components/GiftWrapStrip";
import { BrandStory } from "@/components/sections/BrandStory";
import { Lookbook } from "@/components/sections/Lookbook";
import { Reviews } from "@/components/sections/Reviews";
import { JournalTeaser } from "@/components/sections/JournalTeaser";
import { InstagramStrip } from "@/components/sections/InstagramStrip";
import { Newsletter } from "@/components/sections/Newsletter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hand-Embroidered Gifts in Toronto — GTA Threads" },
      {
        name: "description",
        content:
          "Custom embroidered sweatshirts, tees, totes and baby pieces for every occasion. Hand-stitched in Toronto, shipped worldwide.",
      },
      {
        property: "og:title",
        content: "Hand-Embroidered Gifts in Toronto — GTA Threads",
      },
      {
        property: "og:description",
        content:
          "Custom embroidered gifts from a small Toronto studio — for Valentine's, Mother's Day, baby, Christmas and every day in between.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(productsQueryOptions(12));
  },
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <Marquee />
      <TrustStrip />
      <Occasions />
      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <FeaturedProducts />
      </Suspense>
      <GiftFinder />
      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <BestsellersCarousel />
      </Suspense>
      <GiftWrapStrip />
      <BrandStory />
      <Lookbook />
      <Reviews />
      <JournalTeaser />
      <InstagramStrip />
      <Newsletter />
    </>
  );
}
