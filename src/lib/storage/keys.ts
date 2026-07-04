export const blobKeys = {
  inventory: "junuba/inventory.json",
  inventoryMeta: "junuba/inventory-meta.json",
  resources: "junuba/resources.json",
  oemGuides: "junuba/oem-guides.json",
} as const;

export function inventoryImageKey(slug: string, filename: string): string {
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, "-");
  return `junuba/inventory-images/${safeSlug}/${filename}`;
}
