import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/shopify";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("resolves Tailwind conflicts", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });
});

describe("formatPrice", () => {
  it("formats CAD amount", () => {
    const result = formatPrice("29.99", "CAD");
    expect(result).toContain("$");
    expect(result).not.toContain(".");
  });

  it("handles numeric input", () => {
    const result = formatPrice(100, "CAD");
    expect(result).toContain("$");
  });

  it("formats USD", () => {
    const result = formatPrice("49.99", "USD");
    expect(result).toContain("$");
  });
});
