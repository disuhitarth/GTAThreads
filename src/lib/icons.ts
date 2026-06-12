// Central mapping: slug → AI-generated embroidery icon.
// Add new entries as new categories/occasions are introduced.

import tees from "@/assets/icons/tees.png";
import hoodies from "@/assets/icons/hoodies.png";
import headwear from "@/assets/icons/headwear.png";
import accessories from "@/assets/icons/accessories.png";
import kidsBaby from "@/assets/icons/kids-baby.png";
import matching from "@/assets/icons/matching-sets.png";
import newArrivals from "@/assets/icons/new-arrivals.png";
import bestsellers from "@/assets/icons/bestsellers.png";
import sale from "@/assets/icons/sale.png";
import valentines from "@/assets/icons/valentines.png";
import mothersDay from "@/assets/icons/mothers-day.png";
import fathersDay from "@/assets/icons/fathers-day.png";
import baby from "@/assets/icons/baby.png";
import christmas from "@/assets/icons/christmas.png";
import birthdays from "@/assets/icons/birthdays.png";
import grandparents from "@/assets/icons/grandparents.png";
import pets from "@/assets/icons/pets.png";
import halloween from "@/assets/icons/halloween.png";
import wedding from "@/assets/icons/wedding.png";
import custom from "@/assets/icons/custom.png";
import placeholder from "@/assets/icons/product-placeholder.jpg";

export const ICON: Record<string, string> = {
  // Categories
  tees,
  hoodies,
  headwear,
  accessories,
  "kids-baby": kidsBaby,
  "matching-sets": matching,
  "new-arrivals": newArrivals,
  bestsellers,
  sale,
  // Occasions / recipients
  valentines,
  "mothers-day": mothersDay,
  "fathers-day": fathersDay,
  baby,
  christmas,
  birthdays,
  grandparents,
  couples: matching,
  pets,
  halloween,
  wedding,
  "nurse-scrubs": custom,
  auntie: custom,
  autumn: custom,
  jesus: custom,
  "custom-embroidery": custom,
};

export const PRODUCT_PLACEHOLDER = placeholder;

export function getIcon(slug: string): string {
  return ICON[slug] ?? custom;
}
