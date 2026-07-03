import ExcelJS from "exceljs";
import { invenSheetConfig } from "@/config/inven-mapping";
import { mapInvenRowToPart } from "@/lib/erp/inven-map";
import { loadInventory } from "@/lib/erp/sync";
import {
  indexExisting,
  upsertPartInMaps,
  writeInventoryProducts,
} from "@/lib/erp/sync-utils";
import type { Part, SyncResult } from "@/types/part";

export async function syncInventoryFromStockExcel(buffer: Buffer): Promise<SyncResult> {
  const syncedAt = new Date().toISOString();
  const errors: string[] = [];
  let added = 0;
  let updated = 0;
  let matchedByOem = 0;
  let skipped = 0;

  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
  } catch (error) {
    return {
      syncedAt,
      format: "stock",
      added: 0,
      updated: 0,
      total: 0,
      errors: [
        `Error al leer Excel: ${error instanceof Error ? error.message : "desconocido"}`,
      ],
    };
  }

  const worksheet = workbook.getWorksheet(invenSheetConfig.sheetName);
  if (!worksheet) {
    return {
      syncedAt,
      format: "stock",
      added: 0,
      updated: 0,
      total: 0,
      errors: [`Hoja no encontrada: ${invenSheetConfig.sheetName}`],
    };
  }

  const existingInventory = loadInventory();
  const indices = indexExisting(existingInventory);
  const nextByErpId = new Map<string, Part>(indices.byErpId);
  const sheetsProcessed: Record<string, number> = { [invenSheetConfig.sheetName]: 0 };

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber < invenSheetConfig.dataStartRow) return;

    const rowValues = row.values as unknown[];
    const { part, skip, error } = mapInvenRowToPart(rowNumber, rowValues);

    if (skip) {
      skipped += 1;
      return;
    }
    if (error) {
      errors.push(error);
      return;
    }
    if (!part) return;

    const result = upsertPartInMaps(nextByErpId, indices, part);
    sheetsProcessed[invenSheetConfig.sheetName]! += 1;

    if (result.added) added += 1;
    else updated += 1;
    if (result.matchedByOem) matchedByOem += 1;
  });

  const products = Array.from(nextByErpId.values());

  if (sheetsProcessed[invenSheetConfig.sheetName] === 0) {
    errors.push("No se encontraron productos en la hoja de stock.");
  } else {
    writeInventoryProducts(products, syncedAt, "stock");
  }

  return {
    syncedAt,
    format: "stock",
    added,
    updated,
    matchedByOem,
    skipped,
    total: products.length,
    errors,
    sheetsProcessed,
  };
}
