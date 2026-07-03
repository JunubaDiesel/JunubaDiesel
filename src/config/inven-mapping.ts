import type { CategoryId, ConditionId } from "@/config/site";

export interface InvenSheetConfig {
  sheetName: string;
  headerRow: number;
  dataStartRow: number;
  cols: {
    group1: number;
    brand: number;
    itemCode: number;
    name: number;
    application: number;
    searchKeyword: number;
    safetyStock: number;
    stockQty: number;
    priceLab: number;
    priceClient: number;
  };
}

export const invenSheetConfig: InvenSheetConfig = {
  sheetName: "재고현황",
  headerRow: 2,
  dataStartRow: 3,
  cols: {
    group1: 1,
    brand: 2,
    itemCode: 3,
    name: 4,
    application: 5,
    searchKeyword: 6,
    safetyStock: 7,
    stockQty: 8,
    priceLab: 9,
    priceClient: 10,
  },
};

export const invenConditionMap: Record<string, ConditionId> = {
  NUEVO: "new",
  USADO: "used",
};

export const invenSkipGroups = new Set(["SERVICIO"]);

export const invenCategoryKeywords: { pattern: RegExp; category: CategoryId }[] = [
  { pattern: /인젝터|injector|inyector/i, category: "engine" },
  { pattern: /워터\s*펌프|water\s*pump|bomba\s*de\s*agua/i, category: "other" },
  { pattern: /베어링|bearing|rodamiento/i, category: "engine" },
  { pattern: /미션|transmission|transmisi/i, category: "transmission" },
  { pattern: /엔진\s*오일|aceite\s*de\s*motor/i, category: "other" },
  { pattern: /퓨즈|fusible/i, category: "electrical" },
  { pattern: /플러그|bujia|bujía|spark/i, category: "engine" },
  { pattern: /리데너|retenedor|retenedora|retén/i, category: "engine" },
  { pattern: /센서|sensor/i, category: "electrical" },
  { pattern: /밸브|valvula|válvula/i, category: "engine" },
  { pattern: /브레이크|freno|pastilla/i, category: "other" },
  { pattern: /서스펜|suspension|muelle|amortiguador/i, category: "other" },
];

/** Hyundai/Kia-style part numbers and common ERP codes */
export function isOemLikeCode(code: string): boolean {
  const trimmed = code.trim();
  if (!trimmed) return false;
  if (/^\d{5}-\d{5}/.test(trimmed)) return true;
  if (/^0[KkA-Za-z]\d/.test(trimmed)) return true;
  if (/^\d{3}-\d{3}/.test(trimmed)) return true;
  if (/^\d{8,}$/.test(trimmed.replace(/-/g, ""))) return true;
  return false;
}

export function mapCategoryFromInvenKeyword(keyword: string): CategoryId {
  if (!keyword.trim()) return "other";
  for (const { pattern, category } of invenCategoryKeywords) {
    if (pattern.test(keyword)) return category;
  }
  return "other";
}
