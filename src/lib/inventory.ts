import type { InventoryLookupResult, Part } from "@/types/part";
import { loadInventory } from "@/lib/erp/sync";
import { normalizeOemNumber } from "@/lib/erp/stock";
import { loadInventoryFromBlob } from "@/lib/storage/persist";

const CACHE_TTL_MS = 60_000;
let cachedInventory: Part[] | null = null;
let cachedAt = 0;

export function invalidateInventoryCache(): void {
  cachedInventory = null;
  cachedAt = 0;
}

export async function getInventoryAsync(): Promise<Part[]> {
  if (cachedInventory && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedInventory;
  }

  const fromBlob = await loadInventoryFromBlob();
  if (fromBlob?.length) {
    cachedInventory = fromBlob;
    cachedAt = Date.now();
    return fromBlob;
  }

  const local = loadInventory();
  cachedInventory = local;
  cachedAt = Date.now();
  return local;
}

/** Sync read — local file or seed (build/tests). Runtime pages should use getInventoryAsync. */
export function getInventory(): Part[] {
  return cachedInventory ?? loadInventory();
}

export async function getInventoryStatsAsync() {
  const inventory = await getInventoryAsync();
  const inStock = inventory.filter((p) => (p.stockQty ?? 0) > 0);
  return {
    totalProducts: inventory.length,
    inStockCount: inStock.length,
    vehicleCount: 4,
  };
}

export function getInventoryStats() {
  const inventory = getInventory();
  const inStock = inventory.filter((p) => (p.stockQty ?? 0) > 0);
  return {
    totalProducts: inventory.length,
    inStockCount: inStock.length,
    vehicleCount: 4,
  };
}

export async function lookupByOemAsync(oem: string): Promise<InventoryLookupResult> {
  const normalized = normalizeOemNumber(oem);
  if (!normalized) {
    return { found: false, products: [], totalStock: 0 };
  }

  const products = (await getInventoryAsync()).filter((part) =>
    part.oemNumbers?.some((value) => normalizeOemNumber(value) === normalized)
  );

  const totalStock = products.reduce((sum, part) => sum + (part.stockQty ?? 0), 0);

  return {
    found: products.length > 0,
    products,
    totalStock,
  };
}

export function lookupByOem(oem: string): InventoryLookupResult {
  const normalized = normalizeOemNumber(oem);
  if (!normalized) {
    return { found: false, products: [], totalStock: 0 };
  }

  const products = getInventory().filter((part) =>
    part.oemNumbers?.some((value) => normalizeOemNumber(value) === normalized)
  );

  const totalStock = products.reduce((sum, part) => sum + (part.stockQty ?? 0), 0);

  return {
    found: products.length > 0,
    products,
    totalStock,
  };
}

export function lookupByErpId(erpId: string): InventoryLookupResult {
  const products = getInventory().filter((part) => part.erpId === erpId);
  const totalStock = products.reduce((sum, part) => sum + (part.stockQty ?? 0), 0);

  return {
    found: products.length > 0,
    products,
    totalStock,
  };
}
