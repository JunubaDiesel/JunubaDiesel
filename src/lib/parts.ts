import type { CategoryId, ConditionId, VehicleId } from "@/config/site";
import type { Part } from "@/types/part";
import { hasInventoryImage } from "@/lib/erp/excel-map";
import { getInventory, getInventoryAsync } from "@/lib/inventory";

function sortByStock(parts: Part[]): Part[] {
  return [...parts].sort((a, b) => {
    const aInStock = (a.stockQty ?? 0) > 0 ? 1 : 0;
    const bInStock = (b.stockQty ?? 0) > 0 ? 1 : 0;
    if (aInStock !== bInStock) return bInStock - aInStock;
    const aImg = hasInventoryImage(a) ? 1 : 0;
    const bImg = hasInventoryImage(b) ? 1 : 0;
    if (aImg !== bImg) return bImg - aImg;
    return a.name.localeCompare(b.name, "es");
  });
}

export function getAllParts(): Part[] {
  return sortByStock(getInventory());
}

export function getPartBySlug(slug: string): Part | undefined {
  return getInventory().find((part) => part.slug === slug);
}

export function getFeaturedParts(): Part[] {
  const inventory = getInventory();
  const withExcelImage = inventory.filter(
    (part) => hasInventoryImage(part) && part.category === "engine"
  );
  const featured = inventory.filter((part) => part.featured);
  const seen = new Set<string>();
  const combined: Part[] = [];

  for (const part of [...withExcelImage, ...featured]) {
    if (seen.has(part.id)) continue;
    seen.add(part.id);
    combined.push(part);
  }

  return sortByStock(combined).slice(0, 8);
}

export function getPartsWithPhotos(limit = 8): Part[] {
  return sortByStock(getInventory().filter(hasInventoryImage)).slice(0, limit);
}

export function getRelatedParts(part: Part, limit = 4): Part[] {
  return getInventory()
    .filter((p) => p.vehicle === part.vehicle && p.id !== part.id)
    .slice(0, limit);
}

export interface PartFilters {
  vehicle?: VehicleId;
  condition?: ConditionId;
  category?: CategoryId;
}

export const PARTS_PAGE_SIZE = 24;

export interface PartSearchOptions extends PartFilters {
  query?: string;
  page?: number;
  pageSize?: number;
}

export interface PartSearchResult {
  parts: Part[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function matchesQuery(part: Part, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  const haystack = [
    part.name,
    part.description,
    part.erpId,
    part.yearRange,
    ...Object.values(part.specs),
    ...(part.oemNumbers ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalized);
}

export function searchParts(options: PartSearchOptions = {}): PartSearchResult {
  const pageSize = options.pageSize ?? PARTS_PAGE_SIZE;
  const page = Math.max(1, options.page ?? 1);
  const filtered = filterParts(options).filter((part) =>
    options.query ? matchesQuery(part, options.query) : true
  );
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    parts: filtered.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export function parseSearchOptionsFromParams(
  params: Record<string, string | string[] | undefined>
): PartSearchOptions {
  const get = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value : undefined;
  };

  const pageRaw = get("page");
  const page = pageRaw ? Number.parseInt(pageRaw, 10) : 1;

  return {
    ...parseFiltersFromSearchParams(params),
    query: get("q"),
    page: Number.isNaN(page) ? 1 : page,
  };
}

export function buildPartsQuery(options: PartSearchOptions): string {
  const params = new URLSearchParams();
  if (options.vehicle) params.set("vehicle", options.vehicle);
  if (options.condition) params.set("condition", options.condition);
  if (options.category) params.set("category", options.category);
  if (options.query) params.set("q", options.query);
  if (options.page && options.page > 1) params.set("page", String(options.page));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function filterParts(filters: PartFilters, inventory = getInventory()): Part[] {
  const filtered = inventory.filter((part) => {
    if (filters.vehicle && part.vehicle !== filters.vehicle) return false;
    if (filters.condition && part.condition !== filters.condition) return false;
    if (filters.category && part.category !== filters.category) return false;
    return true;
  });
  return sortByStock(filtered);
}

export async function searchPartsAsync(options: PartSearchOptions = {}): Promise<PartSearchResult> {
  const inventory = await getInventoryAsync();
  const pageSize = options.pageSize ?? PARTS_PAGE_SIZE;
  const page = Math.max(1, options.page ?? 1);
  const filtered = filterParts(options, inventory).filter((part) =>
    options.query ? matchesQuery(part, options.query) : true
  );
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    parts: filtered.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function getFeaturedPartsAsync(): Promise<Part[]> {
  const inventory = await getInventoryAsync();
  const withExcelImage = inventory.filter(
    (part) => hasInventoryImage(part) && part.category === "engine"
  );
  const featured = inventory.filter((part) => part.featured);
  const seen = new Set<string>();
  const combined: Part[] = [];

  for (const part of [...withExcelImage, ...featured]) {
    if (seen.has(part.id)) continue;
    seen.add(part.id);
    combined.push(part);
  }

  return sortByStock(combined).slice(0, 8);
}

export async function getPartsWithPhotosAsync(limit = 8): Promise<Part[]> {
  const inventory = await getInventoryAsync();
  return sortByStock(inventory.filter(hasInventoryImage)).slice(0, limit);
}

export async function getPartBySlugAsync(slug: string): Promise<Part | undefined> {
  const inventory = await getInventoryAsync();
  return inventory.find((part) => part.slug === slug);
}

export function getAllSlugs(): string[] {
  return getInventory().map((part) => part.slug);
}

export function parseFiltersFromSearchParams(
  params: Record<string, string | string[] | undefined>
): PartFilters {
  const get = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value : undefined;
  };

  const vehicle = get("vehicle") as VehicleId | undefined;
  const condition = get("condition") as ConditionId | undefined;
  const category = get("category") as CategoryId | undefined;

  return { vehicle, condition, category };
}

export function buildFilterQuery(filters: PartFilters): string {
  const params = new URLSearchParams();
  if (filters.vehicle) params.set("vehicle", filters.vehicle);
  if (filters.condition) params.set("condition", filters.condition);
  if (filters.category) params.set("category", filters.category);
  const query = params.toString();
  return query ? `?${query}` : "";
}
