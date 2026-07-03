import type { CategoryId, ConditionId, VehicleId } from "@/config/site";

export type StockStatus = "in_stock" | "low" | "out_of_stock";

export interface Part {
  id: string;
  slug: string;
  name: string;
  vehicle: VehicleId;
  condition: ConditionId;
  category: CategoryId;
  yearRange?: string;
  description: string;
  specs: Record<string, string>;
  images: string[];
  featured?: boolean;
  erpId?: string;
  oemNumbers?: string[];
  stockQty?: number;
  stockStatus?: StockStatus;
  warehouse?: string;
  erpUpdatedAt?: string;
  excelSheet?: string;
  excelRow?: number;
  priceLab?: number;
  priceClient?: number;
}

export interface ErpProduct extends Part {
  erpId: string;
  oemNumbers: string[];
  stockQty: number;
  stockStatus: StockStatus;
}

export interface InventoryMeta {
  syncedAt: string | null;
  source: "erp" | "seed" | "excel" | "stock";
  totalProducts: number;
  inStockCount: number;
}

export interface SyncResult {
  syncedAt: string;
  added: number;
  updated: number;
  total: number;
  errors: string[];
  format?: "stock" | "catalog";
  matchedByOem?: number;
  skipped?: number;
  imagesExtracted?: number;
  sheetsProcessed?: Record<string, number>;
}

export interface InventoryLookupResult {
  found: boolean;
  products: Part[];
  totalStock: number;
}
