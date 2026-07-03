import {
  cellText,
  defaultConditionForCategory,
  mapVehicleFromExcelText,
  parsePrice,
  type ExcelSheetConfig,
} from "@/config/excel-mapping";
import type { Part } from "@/types/part";
import { computeStockStatus, parseOemNumbers } from "@/lib/erp/stock";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getCell(rowValues: unknown[], col: number): unknown {
  return rowValues[col] ?? rowValues[col - 1];
}

export function mapExcelRowToPart(
  sheetConfig: ExcelSheetConfig,
  sheetName: string,
  rowNumber: number,
  rowValues: unknown[],
  existing?: Part
): { part?: Part; error?: string } {
  const { cols } = sheetConfig;
  const name = cellText(getCell(rowValues, cols.name)).replace(/\n/g, " ");
  if (!name || name.toUpperCase().includes("JUNUBA COREA")) {
    return { error: undefined };
  }

  const noRaw = cols.no ? cellText(getCell(rowValues, cols.no)) : String(rowNumber);
  const rowIndex = Number.parseInt(noRaw, 10) || rowNumber;
  const erpId = `${sheetConfig.erpIdPrefix}-${rowIndex}`;

  const oemRaw = cols.oem ? cellText(getCell(rowValues, cols.oem)) : "";
  const oemNumbers = sheetConfig.hasOem ? parseOemNumbers(oemRaw.replace(/\n/g, ",")) : [];

  const vehicleRaw = cols.vehicle ? cellText(getCell(rowValues, cols.vehicle)) : "";
  const engineOrSpec = cols.engineOrSpec
    ? cellText(getCell(rowValues, cols.engineOrSpec))
    : "";
  const yearRange = cols.year ? cellText(getCell(rowValues, cols.year)) : undefined;

  const priceLab = cols.priceLab ? parsePrice(getCell(rowValues, cols.priceLab)) : undefined;
  const priceClient = cols.priceClient
    ? parsePrice(getCell(rowValues, cols.priceClient))
    : undefined;

  const slug = existing?.slug ?? slugify(`${name}-${erpId}`);
  const vehicle = mapVehicleFromExcelText(vehicleRaw || engineOrSpec);

  const specs: Record<string, string> = {
    Hoja: sheetName,
  };
  if (engineOrSpec) specs["Referencia"] = engineOrSpec.replace(/\n/g, ", ");
  if (vehicleRaw) specs["Vehículo"] = vehicleRaw.replace(/\n/g, ", ");
  if (yearRange) specs["Año"] = yearRange;

  const description = [name, vehicleRaw && `Compatible: ${vehicleRaw.replace(/\n/g, ", ")}`]
    .filter(Boolean)
    .join(". ");

  const part: Part = {
    id: existing?.id ?? erpId,
    slug,
    name,
    vehicle,
    condition: sheetConfig.condition ?? defaultConditionForCategory(sheetConfig.category),
    category: sheetConfig.category,
    yearRange: yearRange || existing?.yearRange,
    description: description || name,
    specs: { ...(existing?.specs ?? {}), ...specs },
    images: existing?.images?.length ? existing.images : ["/images/vehicles/starex.jpg"],
    featured: sheetConfig.category === "engine" || existing?.featured,
    erpId,
    oemNumbers,
    stockQty: 1,
    stockStatus: computeStockStatus(1),
    erpUpdatedAt: new Date().toISOString(),
    excelSheet: sheetName,
    excelRow: rowNumber,
    priceLab,
    priceClient,
  };

  return { part };
}

export { mergePartUpsert as mergePartWithExcel } from "@/lib/erp/sync-utils";

export function hasInventoryImage(part: Part): boolean {
  return part.images.some((img) => img.startsWith("/images/inventory/"));
}
