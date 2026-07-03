import {
  erpCategoryMap,
  erpConditionMap,
  erpCsvColumns,
  erpVehicleMap,
} from "@/config/erp-mapping";
import type { CategoryId, ConditionId, VehicleId } from "@/config/site";
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

function mapVehicle(raw: string | undefined): VehicleId {
  if (!raw?.trim()) return "starex";
  const key = raw.trim().toUpperCase();
  return erpVehicleMap[key] ?? "starex";
}

function mapCategory(raw: string | undefined): CategoryId {
  if (!raw?.trim()) return "other";
  const key = raw.trim().toUpperCase();
  return erpCategoryMap[key] ?? "other";
}

function mapCondition(raw: string | undefined): ConditionId {
  if (!raw?.trim()) return "used";
  const key = raw.trim().toUpperCase();
  return erpConditionMap[key] ?? "used";
}

function getField(row: Record<string, string>, key: string): string | undefined {
  const direct = row[key]?.trim();
  if (direct) return direct;

  const lowerKey = key.toLowerCase();
  const match = Object.entries(row).find(
    ([column]) => column.trim().toLowerCase() === lowerKey
  );
  return match?.[1]?.trim();
}

export function mapCsvRowToPart(
  row: Record<string, string>,
  existing?: Part
): { part?: Part; error?: string } {
  const erpId = getField(row, erpCsvColumns.erpId);
  const name = getField(row, erpCsvColumns.name);

  if (!erpId) return { error: "Fila sin ITEM_CD (erpId)" };
  if (!name) return { error: `Fila ${erpId}: falta ITEM_NM (name)` };

  const stockRaw = getField(row, erpCsvColumns.stockQty);
  const stockQty = stockRaw ? Number.parseInt(stockRaw, 10) : 0;
  if (Number.isNaN(stockQty)) {
    return { error: `Fila ${erpId}: QTY inválido (${stockRaw})` };
  }

  const oemRaw = getField(row, erpCsvColumns.oemNumber);
  const oemNumbers = parseOemNumbers(oemRaw ?? "");
  const slug =
    getField(row, erpCsvColumns.slug) ||
    existing?.slug ||
    slugify(`${name}-${erpId}`);
  const featuredRaw = getField(row, erpCsvColumns.featured);
  const featured =
    featuredRaw !== undefined
      ? ["Y", "YES", "1", "TRUE", "S", "SI"].includes(featuredRaw.toUpperCase())
      : existing?.featured;

  const part: Part = {
    id: existing?.id ?? erpId,
    slug,
    name,
    vehicle: mapVehicle(getField(row, erpCsvColumns.vehicle)),
    condition: mapCondition(getField(row, erpCsvColumns.condition)),
    category: mapCategory(getField(row, erpCsvColumns.category)),
    yearRange: getField(row, erpCsvColumns.yearRange) ?? existing?.yearRange,
    description:
      getField(row, erpCsvColumns.description) ??
      existing?.description ??
      name,
    specs: existing?.specs ?? {},
    images: existing?.images?.length
      ? existing.images
      : ["/images/vehicles/starex.jpg"],
    featured,
    erpId,
    oemNumbers,
    stockQty,
    stockStatus: computeStockStatus(stockQty),
    warehouse: getField(row, erpCsvColumns.warehouse),
    erpUpdatedAt: new Date().toISOString(),
  };

  return { part };
}

export { mergePartUpsert as mergePartWithExisting } from "@/lib/erp/sync-utils";
