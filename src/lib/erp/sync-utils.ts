import fs from "fs";
import path from "path";
import { inventoryPaths } from "@/config/erp-mapping";
import { isOemLikeCode } from "@/config/inven-mapping";
import type { InventoryMeta, Part } from "@/types/part";
import { normalizeOemNumber } from "@/lib/erp/stock";
import { blobKeys } from "@/lib/storage/keys";
import { isBlobStorageEnabled, writeBlobJson } from "@/lib/storage/blob-json";

export function ensureDataDir(): string {
  const dir = path.join(process.cwd(), inventoryPaths.dataDir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function inventoryFilePath(): string {
  return path.join(process.cwd(), inventoryPaths.inventoryFile);
}

export function metaFilePath(): string {
  return path.join(process.cwd(), inventoryPaths.metaFile);
}

export interface InventoryIndices {
  byErpId: Map<string, Part>;
  bySlug: Map<string, Part>;
  byOemNormalized: Map<string, Part>;
}

export function indexExisting(products: Part[]): InventoryIndices {
  const byErpId = new Map<string, Part>();
  const bySlug = new Map<string, Part>();
  const byOemNormalized = new Map<string, Part>();

  for (const part of products) {
    if (part.erpId) byErpId.set(part.erpId, part);
    bySlug.set(part.slug, part);
    registerOemKeys(part, byOemNormalized, part);
  }

  return { byErpId, bySlug, byOemNormalized };
}

function registerOemKeys(
  part: Part,
  byOemNormalized: Map<string, Part>,
  owner: Part
): void {
  for (const key of collectOemKeys(part)) {
    byOemNormalized.set(key, owner);
  }
}

export function collectOemKeys(part: Part): string[] {
  const keys = new Set<string>();
  for (const oem of part.oemNumbers ?? []) {
    const norm = normalizeOemNumber(oem);
    if (norm) keys.add(norm);
  }
  if (part.erpId) {
    const norm = normalizeOemNumber(part.erpId);
    if (norm && isOemLikeCode(part.erpId)) keys.add(norm);
  }
  return Array.from(keys);
}

export function findExistingPart(
  incoming: Part,
  indices: InventoryIndices
): { existing?: Part; matchedByOem?: boolean } {
  if (incoming.erpId) {
    const byId = indices.byErpId.get(incoming.erpId);
    if (byId) return { existing: byId };
  }

  for (const key of collectOemKeys(incoming)) {
    const byOem = indices.byOemNormalized.get(key);
    if (byOem) return { existing: byOem, matchedByOem: true };
  }

  const bySlug = indices.bySlug.get(incoming.slug);
  if (bySlug && bySlug.erpId !== incoming.erpId) {
    return { existing: bySlug };
  }

  return {};
}

export function mergePartUpsert(incoming: Part, existing: Part): Part {
  const incomingHasInventoryImage = incoming.images.some((img) =>
    img.startsWith("/images/inventory/")
  );
  const existingHasInventoryImage = existing.images.some((img) =>
    img.startsWith("/images/inventory/")
  );

  const mergedOem = new Set<string>();
  for (const oem of [...(existing.oemNumbers ?? []), ...(incoming.oemNumbers ?? [])]) {
    const norm = normalizeOemNumber(oem);
    if (norm) mergedOem.add(norm);
  }
  if (incoming.erpId && incoming.erpId !== existing.erpId) {
    const norm = normalizeOemNumber(incoming.erpId);
    if (norm) mergedOem.add(norm);
  }

  return {
    ...existing,
    ...incoming,
    id: existing.id,
    slug: existing.slug,
    erpId: existing.erpId ?? incoming.erpId,
    specs: { ...existing.specs, ...incoming.specs },
    oemNumbers: Array.from(mergedOem),
    images: incomingHasInventoryImage
      ? incoming.images
      : existingHasInventoryImage
        ? existing.images
        : incoming.images.length
          ? incoming.images
          : existing.images,
    featured: existing.featured || incoming.featured,
  };
}

export interface UpsertResult {
  added: boolean;
  updated: boolean;
  matchedByOem: boolean;
  part: Part;
}

export function upsertPartInMaps(
  nextByErpId: Map<string, Part>,
  indices: InventoryIndices,
  incoming: Part
): UpsertResult {
  const { existing, matchedByOem } = findExistingPart(incoming, indices);

  let merged: Part;
  if (existing) {
    merged = mergePartUpsert(incoming, existing);
    if (existing.erpId && existing.erpId !== merged.erpId) {
      nextByErpId.delete(existing.erpId);
    }
  } else {
    const slugConflict = indices.bySlug.get(incoming.slug);
    merged =
      slugConflict && slugConflict.erpId !== incoming.erpId
        ? {
            ...incoming,
            slug: `${incoming.slug}-${incoming.erpId!.toLowerCase().replace(/[^a-z0-9-]/g, "-")}`,
          }
        : incoming;
  }

  const canonicalErpId = merged.erpId!;
  nextByErpId.set(canonicalErpId, merged);

  if (existing?.erpId && existing.erpId !== canonicalErpId) {
    indices.byErpId.delete(existing.erpId);
  }
  indices.byErpId.set(canonicalErpId, merged);
  indices.bySlug.set(merged.slug, merged);
  for (const key of collectOemKeys(merged)) {
    indices.byOemNormalized.set(key, merged);
  }

  return {
    added: !existing,
    updated: !!existing,
    matchedByOem: !!matchedByOem,
    part: merged,
  };
}

export async function writeInventoryProductsAsync(
  products: Part[],
  syncedAt: string,
  source: InventoryMeta["source"]
): Promise<void> {
  const sorted = [...products].sort((a, b) => a.name.localeCompare(b.name, "es"));
  const meta: InventoryMeta = {
    syncedAt,
    source,
    totalProducts: sorted.length,
    inStockCount: sorted.filter((p) => (p.stockQty ?? 0) > 0).length,
  };

  try {
    ensureDataDir();
    fs.writeFileSync(inventoryFilePath(), JSON.stringify(sorted, null, 2), "utf-8");
    fs.writeFileSync(metaFilePath(), JSON.stringify(meta, null, 2), "utf-8");
  } catch {
    // Read-only filesystem (e.g. Vercel serverless)
  }

  if (isBlobStorageEnabled()) {
    await writeBlobJson(blobKeys.inventory, sorted);
    await writeBlobJson(blobKeys.inventoryMeta, meta);
  }
}

export function writeInventoryProducts(
  products: Part[],
  syncedAt: string,
  source: InventoryMeta["source"]
): void {
  const sorted = [...products].sort((a, b) => a.name.localeCompare(b.name, "es"));
  ensureDataDir();
  fs.writeFileSync(inventoryFilePath(), JSON.stringify(sorted, null, 2), "utf-8");
  fs.writeFileSync(
    metaFilePath(),
    JSON.stringify(
      {
        syncedAt,
        source,
        totalProducts: sorted.length,
        inStockCount: sorted.filter((p) => (p.stockQty ?? 0) > 0).length,
      },
      null,
      2
    ),
    "utf-8"
  );
}
