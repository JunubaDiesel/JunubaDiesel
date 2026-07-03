import type { CategoryId, ConditionId, VehicleId } from "@/config/site";

export const excelInventoryImageDir = "public/images/inventory";

export interface ExcelSheetConfig {
  /** Exact sheet name in JUNUBA INFORMAR PIEZAS.xlsx */
  sheetName: string;
  erpIdPrefix: string;
  category: CategoryId;
  condition: ConditionId;
  dataStartRow: number;
  /** 1-based column indices */
  cols: {
    no?: number;
    oem?: number;
    name: number;
    vehicle?: number;
    engineOrSpec?: number;
    year?: number;
    priceLab?: number;
    priceClient?: number;
  };
  hasOem: boolean;
}

export const excelSheetConfigs: ExcelSheetConfig[] = [
  {
    sheetName: "워터 펌프",
    erpIdPrefix: "WP",
    category: "other",
    condition: "used",
    dataStartRow: 2,
    cols: { no: 1, oem: 4, vehicle: 5, name: 6 },
    hasOem: true,
  },
  {
    sheetName: "인젝터",
    erpIdPrefix: "INJ",
    category: "engine",
    condition: "used",
    dataStartRow: 3,
    cols: { no: 2, name: 4, oem: 5, vehicle: 6, year: 7, priceLab: 8, priceClient: 9 },
    hasOem: true,
  },
  {
    sheetName: "엔진부품",
    erpIdPrefix: "ENG",
    category: "engine",
    condition: "used",
    dataStartRow: 2,
    cols: { no: 1, name: 4, engineOrSpec: 5, vehicle: 6 },
    hasOem: false,
  },
  {
    sheetName: "하체부품",
    erpIdPrefix: "CHS",
    category: "other",
    condition: "used",
    dataStartRow: 2,
    cols: { no: 1, name: 4, engineOrSpec: 5, vehicle: 6 },
    hasOem: false,
  },
];

const vehiclePatterns: { pattern: RegExp; vehicle: VehicleId }[] = [
  { pattern: /BONGO|BONGO3/i, vehicle: "bongo" },
  { pattern: /STARIA/i, vehicle: "staria" },
  { pattern: /PORTER|PORTER2|PORTER\s*II/i, vehicle: "porter" },
  { pattern: /STAREX|GRAND\s*STAREX|H-?1|H100|H-?100/i, vehicle: "starex" },
];

export function mapVehicleFromExcelText(raw: string | undefined): VehicleId {
  if (!raw?.trim()) return "starex";
  const text = raw.replace(/\n/g, " ");
  for (const { pattern, vehicle } of vehiclePatterns) {
    if (pattern.test(text)) return vehicle;
  }
  return "starex";
}

export function cellText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "object" && value !== null && "text" in value) {
    return String((value as { text: string }).text).trim();
  }
  if (typeof value === "number") return String(value);
  return String(value).trim();
}

export function parsePrice(value: unknown): number | undefined {
  const text = cellText(value).replace(/[^\d.]/g, "");
  if (!text) return undefined;
  const num = Number.parseFloat(text);
  return Number.isNaN(num) ? undefined : num;
}

export function defaultConditionForCategory(category: CategoryId): ConditionId {
  return category === "engine" ? "used" : "used";
}
