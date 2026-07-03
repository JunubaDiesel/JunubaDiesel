import type { InventoryLookupResult, Part } from "@/types/part";

export interface PublicPart {
  slug: string;
  name: string;
  erpId?: string;
  vehicle: Part["vehicle"];
  condition: Part["condition"];
  category: Part["category"];
  stockQty: number;
  stockStatus?: Part["stockStatus"];
  oemNumbers: string[];
  images: string[];
  yearRange?: string;
}

export function toPublicPart(part: Part): PublicPart {
  return {
    slug: part.slug,
    name: part.name,
    erpId: part.erpId,
    vehicle: part.vehicle,
    condition: part.condition,
    category: part.category,
    stockQty: part.stockQty ?? 0,
    stockStatus: part.stockStatus,
    oemNumbers: part.oemNumbers ?? [],
    images: part.images.slice(0, 1),
    yearRange: part.yearRange,
  };
}

export function toPublicLookupResult(result: InventoryLookupResult) {
  return {
    found: result.found,
    totalStock: result.totalStock,
    products: result.products.map(toPublicPart),
  };
}
