import fs from "fs";
import { inventoryFilePath, metaFilePath } from "@/lib/erp/sync-utils";
import { blobKeys } from "@/lib/storage/keys";
import { isBlobStorageEnabled, readBlobJson, writeBlobJson } from "@/lib/storage/blob-json";
import type { InventoryMeta, Part } from "@/types/part";
import type { OemGuidesData } from "@/types/oem-guide";
import type { Resource } from "@/types/resource";

export async function persistInventorySnapshot(): Promise<boolean> {
  if (!isBlobStorageEnabled()) return false;

  const inventoryPath = inventoryFilePath();
  if (!fs.existsSync(inventoryPath)) return false;

  const products = JSON.parse(fs.readFileSync(inventoryPath, "utf-8")) as Part[];
  await writeBlobJson(blobKeys.inventory, products);

  const metaPath = metaFilePath();
  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as InventoryMeta;
    await writeBlobJson(blobKeys.inventoryMeta, meta);
  }

  return true;
}

export async function loadInventoryFromBlob(): Promise<Part[] | null> {
  return readBlobJson<Part[]>(blobKeys.inventory);
}

export async function loadInventoryMetaFromBlob(): Promise<InventoryMeta | null> {
  return readBlobJson<InventoryMeta>(blobKeys.inventoryMeta);
}

export async function persistResourcesSnapshot(resources: Resource[]): Promise<boolean> {
  if (!isBlobStorageEnabled()) return false;
  await writeBlobJson(blobKeys.resources, resources);
  return true;
}

export async function loadResourcesFromBlob(): Promise<Resource[] | null> {
  return readBlobJson<Resource[]>(blobKeys.resources);
}

export async function persistOemGuidesSnapshot(guides: OemGuidesData["guides"]): Promise<boolean> {
  if (!isBlobStorageEnabled()) return false;
  await writeBlobJson(blobKeys.oemGuides, { guides });
  return true;
}

export async function loadOemGuidesFromBlob(): Promise<OemGuidesData["guides"] | null> {
  const data = await readBlobJson<OemGuidesData>(blobKeys.oemGuides);
  return data?.guides ?? null;
}
