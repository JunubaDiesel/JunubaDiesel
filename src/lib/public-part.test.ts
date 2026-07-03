import { describe, expect, it } from "vitest";
import type { Part } from "@/types/part";
import { toPublicLookupResult, toPublicPart } from "@/lib/public-part";

const samplePart: Part = {
  id: "p1",
  slug: "motor-starex",
  name: "Motor Starex",
  description: "Motor usado",
  vehicle: "starex",
  condition: "used",
  category: "engine",
  stockQty: 2,
  stockStatus: "in_stock",
  oemNumbers: ["12345-67890"],
  images: ["/images/test.jpg"],
  specs: {},
  priceLab: 999,
  priceClient: 1200,
  warehouse: "A1",
};

describe("toPublicPart", () => {
  it("strips sensitive pricing and warehouse fields", () => {
    const pub = toPublicPart(samplePart);
    expect(pub.name).toBe("Motor Starex");
    expect(pub.stockQty).toBe(2);
    expect(pub).not.toHaveProperty("priceLab");
    expect(pub).not.toHaveProperty("priceClient");
    expect(pub).not.toHaveProperty("warehouse");
  });
});

describe("toPublicLookupResult", () => {
  it("maps products through public DTO", () => {
    const result = toPublicLookupResult({
      found: true,
      totalStock: 2,
      products: [samplePart],
    });
    expect(result.found).toBe(true);
    expect(result.products[0]).not.toHaveProperty("priceLab");
  });
});
