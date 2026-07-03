import { LOW_STOCK_THRESHOLD } from "@/config/erp-mapping";
import type { StockStatus } from "@/types/part";

export function computeStockStatus(stockQty: number): StockStatus {
  if (stockQty <= 0) return "out_of_stock";
  if (stockQty <= LOW_STOCK_THRESHOLD) return "low";
  return "in_stock";
}

export function normalizeOemNumber(value: string): string {
  return value.replace(/[\s-]/g, "").toUpperCase();
}

export function parseOemNumbers(raw: string | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,;|/]/)
    .map((part) => normalizeOemNumber(part.trim()))
    .filter(Boolean);
}
