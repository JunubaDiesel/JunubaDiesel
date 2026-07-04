import { describe, expect, it } from "vitest";
import { getInventory } from "@/lib/inventory";
import { getPartBySlug, searchParts } from "@/lib/parts";

const inventory = getInventory();
const sample = inventory[0];

describe("getPartBySlug", () => {
  it("returns a part for known slug from loaded inventory", () => {
    expect(sample).toBeDefined();
    const part = getPartBySlug(sample.slug);
    expect(part?.slug).toBe(sample.slug);
  });

  it("returns undefined for unknown slug", () => {
    expect(getPartBySlug("nonexistent-slug-xyz")).toBeUndefined();
  });
});

describe("searchParts", () => {
  it("filters by query text from sample part name", () => {
    expect(sample).toBeDefined();
    const token = sample.name.split(/\s+/)[0];
    const result = searchParts({ query: token, pageSize: 10 });
    expect(result.total).toBeGreaterThan(0);
  });

  it("filters by vehicle", () => {
    const vehicle = sample.vehicle;
    const result = searchParts({ vehicle, pageSize: 50 });
    expect(result.parts.every((part) => part.vehicle === vehicle)).toBe(true);
  });
});
