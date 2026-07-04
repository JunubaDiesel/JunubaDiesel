import fs from "fs";
import { parse } from "csv-parse/sync";
import partsSeed from "@/data/parts.json";
import type { InventoryMeta, Part, SyncResult } from "@/types/part";
import { mapCsvRowToPart, mergePartWithExisting } from "@/lib/erp/map";
import { computeStockStatus } from "@/lib/erp/stock";
import {
  indexExisting,
  inventoryFilePath,
  metaFilePath,
  writeInventoryProductsAsync,
} from "@/lib/erp/sync-utils";

function enrichSeedPart(part: Part): Part {
  const stockQty = part.stockQty ?? 1;
  return {
    ...part,
    erpId: part.erpId ?? `JNB-${part.id.padStart(3, "0")}`,
    oemNumbers: part.oemNumbers ?? [],
    stockQty,
    stockStatus: part.stockStatus ?? computeStockStatus(stockQty),
    erpUpdatedAt: part.erpUpdatedAt ?? new Date().toISOString(),
  };
}

export function getSeedInventory(): Part[] {
  return (partsSeed as unknown as Part[]).map(enrichSeedPart);
}

export function readInventoryFile(): Part[] | null {
  const filePath = inventoryFilePath();
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as Part[];
  } catch {
    return null;
  }
}

export function loadInventory(): Part[] {
  return readInventoryFile() ?? getSeedInventory();
}

export function readInventoryMeta(): InventoryMeta {
  const inventory = loadInventory();
  const metaPath = metaFilePath();
  let syncedAt: string | null = null;
  let source: InventoryMeta["source"] = readInventoryFile() ? "erp" : "seed";

  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as InventoryMeta;
      syncedAt = meta.syncedAt;
      source = meta.source;
    } catch {
      // ignore invalid meta
    }
  }

  const inStockCount = inventory.filter((p) => (p.stockQty ?? 0) > 0).length;

  return {
    syncedAt,
    source,
    totalProducts: inventory.length,
    inStockCount,
  };
}

export async function syncInventoryFromCsv(csvContent: string): Promise<SyncResult> {
  const syncedAt = new Date().toISOString();
  const errors: string[] = [];
  let added = 0;
  let updated = 0;

  let rows: Record<string, string>[];
  try {
    rows = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    }) as Record<string, string>[];
  } catch (error) {
    return {
      syncedAt,
      added: 0,
      updated: 0,
      total: 0,
      errors: [`Error al parsear CSV: ${error instanceof Error ? error.message : "desconocido"}`],
    };
  }

  const existingInventory = loadInventory();
  const { byErpId, bySlug } = indexExisting(existingInventory);
  const nextByErpId = new Map(byErpId);

  for (const row of rows) {
    const erpId = row.ITEM_CD?.trim() ?? row.item_cd?.trim();
    const existing = erpId ? byErpId.get(erpId) : undefined;
    const { part, error } = mapCsvRowToPart(row, existing);

    if (error || !part) {
      errors.push(error ?? "Error desconocido en fila");
      continue;
    }

    const slugConflict = bySlug.get(part.slug);
    const merged = existing
      ? mergePartWithExisting(part, existing)
      : slugConflict && slugConflict.erpId !== part.erpId
        ? { ...part, slug: `${part.slug}-${part.erpId!.toLowerCase()}` }
        : part;

    if (existing) updated += 1;
    else added += 1;

    nextByErpId.set(merged.erpId!, merged);
    bySlug.set(merged.slug, merged);
  }

  const products = Array.from(nextByErpId.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "es")
  );

  await writeInventoryProductsAsync(products, syncedAt, "erp");

  return {
    syncedAt,
    added,
    updated,
    total: products.length,
    errors,
  };
}
