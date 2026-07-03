import type { InventoryLookupResult, Part } from "@/types/part";
import { loadInventory } from "@/lib/erp/sync";
import { normalizeOemNumber } from "@/lib/erp/stock";

export function getInventory(): Part[] {
  return loadInventory();
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
