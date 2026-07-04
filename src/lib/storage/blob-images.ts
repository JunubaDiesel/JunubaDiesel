import { put } from "@vercel/blob";
import { inventoryImageKey } from "@/lib/storage/keys";
import { isBlobStorageEnabled } from "@/lib/storage/blob-json";

export async function uploadInventoryImage(
  slug: string,
  buffer: Buffer,
  ext: string
): Promise<string | null> {
  if (!isBlobStorageEnabled()) return null;

  const filename = `1.${ext.replace(/^\./, "")}`;
  const pathname = inventoryImageKey(slug, filename);
  const blob = await put(pathname, buffer, {
    access: "public",
    addRandomSuffix: false,
    token: process.env.BLOB_READ_WRITE_TOKEN!,
    contentType: ext === "png" ? "image/png" : ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png",
    allowOverwrite: true,
  });

  return blob.url;
}
