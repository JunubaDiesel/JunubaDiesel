import {
  invenConditionMap,
  invenSheetConfig,
  invenSkipGroups,
  mapCategoryFromInvenKeyword,
} from "@/config/inven-mapping";
import { cellText, mapVehicleFromExcelText, parsePrice } from "@/config/excel-mapping";
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

export function shouldSkipInvenRow(group1: string): boolean {
  const key = group1.trim().toUpperCase();
  return invenSkipGroups.has(key);
}

export function mapInvenRowToPart(
  rowNumber: number,
  rowValues: unknown[],
  existing?: Part
): { part?: Part; skip?: boolean; error?: string } {
  const { cols } = invenSheetConfig;
  const group1 = cellText(getCell(rowValues, cols.group1));
  if (shouldSkipInvenRow(group1)) {
    return { skip: true };
  }

  const itemCode = cellText(getCell(rowValues, cols.itemCode));
  const name = cellText(getCell(rowValues, cols.name)).replace(/\n/g, " ");
  if (!itemCode) {
    return { error: `fila ${rowNumber}: falta 품목코드` };
  }
  if (!name) {
    return { error: `fila ${rowNumber} (${itemCode}): falta 품목명` };
  }

  const brand = cellText(getCell(rowValues, cols.brand));
  const application = cellText(getCell(rowValues, cols.application));
  const searchKeyword = cellText(getCell(rowValues, cols.searchKeyword));
  const safetyStockRaw = getCell(rowValues, cols.safetyStock);
  const stockRaw = getCell(rowValues, cols.stockQty);
  const stockQty =
    stockRaw === null || stockRaw === undefined || stockRaw === ""
      ? 0
      : Number.parseInt(String(stockRaw), 10);
  if (Number.isNaN(stockQty)) {
    return { error: `fila ${rowNumber} (${itemCode}): 재고수량 inválido` };
  }

  const priceLab = parsePrice(getCell(rowValues, cols.priceLab));
  const priceClient = parsePrice(getCell(rowValues, cols.priceClient));
  const condition =
    invenConditionMap[group1.trim().toUpperCase()] ?? existing?.condition ?? "used";
  const vehicle = mapVehicleFromExcelText(application);
  const category = mapCategoryFromInvenKeyword(searchKeyword || name);
  const erpId = itemCode;
  const oemNumbers = parseOemNumbers(itemCode);
  const slug = existing?.slug ?? slugify(`${name}-${erpId}`);

  const specs: Record<string, string> = {
    Hoja: invenSheetConfig.sheetName,
  };
  if (brand) specs["Marca"] = brand;
  if (application) specs["Vehículo"] = application.replace(/\n/g, ", ");
  if (searchKeyword) specs["Referencia"] = searchKeyword;
  if (safetyStockRaw !== null && safetyStockRaw !== undefined && safetyStockRaw !== "") {
    specs["Stock mínimo"] = String(safetyStockRaw);
  }

  const description = [name, application && `Compatible: ${application.replace(/\n/g, ", ")}`]
    .filter(Boolean)
    .join(". ");

  const part: Part = {
    id: existing?.id ?? erpId,
    slug,
    name,
    vehicle,
    condition,
    category,
    description: description || name,
    specs: { ...(existing?.specs ?? {}), ...specs },
    images: existing?.images?.length
      ? existing.images
      : [`/images/vehicles/${vehicle}.jpg`],
    featured: existing?.featured,
    erpId,
    oemNumbers,
    stockQty,
    stockStatus: computeStockStatus(stockQty),
    erpUpdatedAt: new Date().toISOString(),
    excelSheet: invenSheetConfig.sheetName,
    excelRow: rowNumber,
    priceLab,
    priceClient,
  };

  return { part };
}
