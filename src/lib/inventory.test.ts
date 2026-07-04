import { describe, expect, it } from "vitest";
import { getInventory, lookupByOem, getInventoryStats } from "@/lib/inventory";

const inventory = getInventory();
const withOem = inventory.find((part) => part.oemNumbers && part.oemNumbers.length > 0);

describe("lookupByOem", () => {
  it("finds parts when OEM exists in inventory", () => {
    expect(withOem?.oemNumbers?.[0]).toBeTruthy();
    const oem = withOem!.oemNumbers![0];
    const result = lookupByOem(oem);
    expect(result.found).toBe(true);
    expect(result.products.length).toBeGreaterThan(0);
  });

  it("returns empty result for unknown OEM", () => {
    const result = lookupByOem("00000-00000");
    expect(result.found).toBe(false);
    expect(result.products).toHaveLength(0);
    expect(result.totalStock).toBe(0);
  });
});

describe("getInventoryStats", () => {
  it("returns non-zero counts", () => {
    const stats = getInventoryStats();
    expect(stats.totalProducts).toBeGreaterThan(0);
    expect(stats.inStockCount).toBeGreaterThanOrEqual(0);
    expect(stats.vehicleCount).toBe(4);
  });
});
