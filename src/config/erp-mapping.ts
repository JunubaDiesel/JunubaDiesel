import type { CategoryId, ConditionId, VehicleId } from "@/config/site";

/** YUHAN ERP CSV column names → internal field keys */
export const erpCsvColumns = {
  erpId: "ITEM_CD",
  oemNumber: "OEM_NO",
  name: "ITEM_NM",
  stockQty: "QTY",
  vehicle: "CAR_MODEL",
  condition: "COND",
  category: "CATEGORY",
  yearRange: "YEAR_RANGE",
  description: "DESCRIPTION",
  warehouse: "WAREHOUSE",
  slug: "SLUG",
  featured: "FEATURED",
} as const;

export const erpVehicleMap: Record<string, VehicleId> = {
  STAREX: "starex",
  "GRAND STAREX": "starex",
  "HYUNDAI STAREX": "starex",
  STARIA: "staria",
  "HYUNDAI STARIA": "staria",
  PORTER: "porter",
  "HYUNDAI PORTER": "porter",
  "PORTER II": "porter",
  BONGO: "bongo",
  "KIA BONGO": "bongo",
  "BONGO III": "bongo",
};

export const erpCategoryMap: Record<string, CategoryId> = {
  ENGINE: "engine",
  MOTOR: "engine",
  TRANSMISSION: "transmission",
  TRANSMISION: "transmission",
  BODY: "exterior",
  EXTERIOR: "exterior",
  CARROCERIA: "exterior",
  ELECTRICAL: "electrical",
  ELECTRICO: "electrical",
  CHASSIS: "other",
  OTHER: "other",
  OTROS: "other",
};

export const erpConditionMap: Record<string, ConditionId> = {
  N: "new",
  NEW: "new",
  NUEVO: "new",
  U: "used",
  USED: "used",
  USADO: "used",
};

export const LOW_STOCK_THRESHOLD = 2;

export const inventoryPaths = {
  dataDir: "data",
  inventoryFile: "data/inventory.json",
  metaFile: "data/inventory-meta.json",
} as const;

export const csvTemplateHeaders = [
  erpCsvColumns.erpId,
  erpCsvColumns.oemNumber,
  erpCsvColumns.name,
  erpCsvColumns.stockQty,
  erpCsvColumns.vehicle,
  erpCsvColumns.condition,
  erpCsvColumns.category,
  erpCsvColumns.yearRange,
  erpCsvColumns.description,
  erpCsvColumns.warehouse,
  erpCsvColumns.slug,
  erpCsvColumns.featured,
];
