import { head, put } from "@vercel/blob";

export function isBlobStorageEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function token(): string {
  const value = process.env.BLOB_READ_WRITE_TOKEN;
  if (!value) throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  return value;
}

export async function readBlobJson<T>(pathname: string): Promise<T | null> {
  if (!isBlobStorageEnabled()) return null;

  try {
    const meta = await head(pathname, { token: token() });
    const response = await fetch(meta.url, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function writeBlobJson(pathname: string, data: unknown): Promise<string | null> {
  if (!isBlobStorageEnabled()) return null;

  const blob = await put(pathname, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    token: token(),
    contentType: "application/json",
    allowOverwrite: true,
  });

  return blob.url;
}
