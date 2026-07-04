import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import {
  excelInventoryImageDir,
  excelSheetConfigs,
  cellText,
  type ExcelSheetConfig,
} from "@/config/excel-mapping";
import { invenSheetConfig } from "@/config/inven-mapping";
import { mapExcelRowToPart } from "@/lib/erp/excel-map";
import { syncInventoryFromStockExcel } from "@/lib/erp/inven-sync";
import { loadInventory } from "@/lib/erp/sync";
import {
  indexExisting,
  upsertPartInMaps,
  writeInventoryProductsAsync,
} from "@/lib/erp/sync-utils";
import type { Part, SyncResult } from "@/types/part";

export type ExcelFormat = "stock" | "catalog" | "unknown";

import { uploadInventoryImage } from "@/lib/storage/blob-images";

function inventoryImagesRoot(): string {
  return path.join(process.cwd(), excelInventoryImageDir);
}

function clearInventoryImages(): void {
  const root = inventoryImagesRoot();
  if (fs.existsSync(root)) {
    fs.rmSync(root, { recursive: true, force: true });
  }
  fs.mkdirSync(root, { recursive: true });
}

async function savePartImage(slug: string, buffer: Buffer, ext: string): Promise<string> {
  const blobUrl = await uploadInventoryImage(slug, buffer, ext);
  if (blobUrl) return blobUrl;

  const safeSlug = slug.replace(/[^a-z0-9-]/gi, "-");
  const dir = path.join(inventoryImagesRoot(), safeSlug);
  fs.mkdirSync(dir, { recursive: true });
  const filename = `1.${ext.replace(/^\./, "")}`;
  fs.writeFileSync(path.join(dir, filename), buffer);
  return `/images/inventory/${safeSlug}/${filename}`;
}

function buildRowImageMap(
  worksheet: ExcelJS.Worksheet,
  workbook: ExcelJS.Workbook
): Map<number, { buffer: Buffer; ext: string }> {
  const map = new Map<number, { buffer: Buffer; ext: string }>();

  for (const imgMeta of worksheet.getImages()) {
    const imageId =
      typeof imgMeta.imageId === "number"
        ? imgMeta.imageId
        : Number.parseInt(String(imgMeta.imageId), 10);
    if (Number.isNaN(imageId)) continue;

    const image = workbook.getImage(imageId);
    if (!image?.buffer) continue;

    const tl = imgMeta.range.tl as { row?: number; nativeRow?: number };
    const anchorRow = Math.floor(tl.row ?? tl.nativeRow ?? 0);
    const excelRow = anchorRow + 1;

    const ext = image.extension ?? "png";
    map.set(excelRow, { buffer: Buffer.from(image.buffer), ext });
  }

  return map;
}

export function detectExcelFormat(workbook: ExcelJS.Workbook): ExcelFormat {
  const stockSheet = workbook.getWorksheet(invenSheetConfig.sheetName);
  if (stockSheet) {
    const headerRow = stockSheet.getRow(invenSheetConfig.headerRow);
    const headers = (headerRow.values as unknown[]).map((value) => cellText(value));
    if (headers.some((header) => header.includes("품목코드"))) {
      return "stock";
    }
  }

  for (const config of excelSheetConfigs) {
    if (workbook.getWorksheet(config.sheetName)) {
      return "catalog";
    }
  }

  return "unknown";
}

async function parseSheet(
  worksheet: ExcelJS.Worksheet,
  sheetConfig: ExcelSheetConfig,
  rowImages: Map<number, { buffer: Buffer; ext: string }>,
  existingByErpId: Map<string, Part>,
  errors: string[]
): Promise<{ parts: Part[]; count: number }> {
  const parts: Part[] = [];
  let count = 0;

  for (let rowNumber = sheetConfig.dataStartRow; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    if (!row.hasValues) continue;

    const rowValues = row.values as unknown[];
    const existing = existingByErpId.get(
      `${sheetConfig.erpIdPrefix}-${Number.parseInt(String(rowValues[sheetConfig.cols.no ?? 1] ?? rowNumber), 10) || rowNumber}`
    );

    const { part, error } = mapExcelRowToPart(
      sheetConfig,
      sheetConfig.sheetName,
      rowNumber,
      rowValues,
      existing
    );

    if (error) {
      errors.push(`${sheetConfig.sheetName} fila ${rowNumber}: ${error}`);
      continue;
    }
    if (!part) continue;

    const imageData = rowImages.get(rowNumber);
    if (imageData) {
      try {
        const imagePath = await savePartImage(part.slug, imageData.buffer, imageData.ext);
        part.images = [imagePath];
        part.featured = true;
      } catch (err) {
        errors.push(
          `${sheetConfig.sheetName} fila ${rowNumber}: error imagen — ${err instanceof Error ? err.message : "desconocido"}`
        );
      }
    }

    parts.push(part);
    count += 1;
  }

  return { parts, count };
}

export async function syncInventoryFromCatalogExcel(buffer: Buffer): Promise<SyncResult> {
  const syncedAt = new Date().toISOString();
  const errors: string[] = [];
  const sheetsProcessed: Record<string, number> = {};
  let imagesExtracted = 0;
  let added = 0;
  let updated = 0;
  let matchedByOem = 0;

  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
  } catch (error) {
    return {
      syncedAt,
      format: "catalog",
      added: 0,
      updated: 0,
      total: 0,
      errors: [
        `Error al leer Excel: ${error instanceof Error ? error.message : "desconocido"}`,
      ],
    };
  }

  clearInventoryImages();

  const existingInventory = loadInventory();
  const indices = indexExisting(existingInventory);
  const nextByErpId = new Map<string, Part>(indices.byErpId);

  for (const sheetConfig of excelSheetConfigs) {
    const worksheet = workbook.getWorksheet(sheetConfig.sheetName);
    if (!worksheet) {
      errors.push(`Hoja no encontrada: ${sheetConfig.sheetName}`);
      continue;
    }

    const rowImages = buildRowImageMap(worksheet, workbook);
    imagesExtracted += rowImages.size;

    const { parts, count } = await parseSheet(
      worksheet,
      sheetConfig,
      rowImages,
      indices.byErpId,
      errors
    );
    sheetsProcessed[sheetConfig.sheetName] = count;

    for (const part of parts) {
      const result = upsertPartInMaps(nextByErpId, indices, part);
      if (result.added) added += 1;
      else updated += 1;
      if (result.matchedByOem) matchedByOem += 1;
    }
  }

  const products = Array.from(nextByErpId.values());

  if (products.length === 0 || Object.values(sheetsProcessed).every((count) => count === 0)) {
    errors.push("No se encontraron productos en las hojas configuradas.");
  } else {
    await writeInventoryProductsAsync(products, syncedAt, "excel");
  }

  return {
    syncedAt,
    format: "catalog",
    added,
    updated,
    matchedByOem,
    total: products.length,
    errors,
    imagesExtracted,
    sheetsProcessed,
  };
}

export async function syncInventoryFromExcel(buffer: Buffer): Promise<SyncResult> {
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
  } catch (error) {
    return {
      syncedAt: new Date().toISOString(),
      added: 0,
      updated: 0,
      total: 0,
      errors: [
        `Error al leer Excel: ${error instanceof Error ? error.message : "desconocido"}`,
      ],
    };
  }

  const format = detectExcelFormat(workbook);

  if (format === "stock") {
    return syncInventoryFromStockExcel(buffer);
  }

  if (format === "catalog") {
    return syncInventoryFromCatalogExcel(buffer);
  }

  return {
    syncedAt: new Date().toISOString(),
    added: 0,
    updated: 0,
    total: 0,
    errors: [
      "Formato Excel no reconocido. Use JUNUBA INFORMAR PIEZAS (catálogo) o 재고현황 (stock).",
    ],
  };
}
