import catalogData from "@/data/partsouq-vehicles.json";
import type { CategoryId, VehicleId } from "@/config/site";
import type {
  PartsouqCatalogData,
  PartsouqCategory,
  PartsouqVariant,
} from "@/types/partsouq";

const data = catalogData as unknown as PartsouqCatalogData;

export function getAllVariants(): PartsouqVariant[] {
  return data.variants;
}

export function getVariantsByVehicle(vehicleId: VehicleId): PartsouqVariant[] {
  return data.variants.filter((v) => v.vehicleId === vehicleId);
}

export function getVariantById(id: string): PartsouqVariant | undefined {
  return data.variants.find((v) => v.id === id);
}

export function getAllCategories(): PartsouqCategory[] {
  return data.categories;
}

export function getCategoryById(id: CategoryId): PartsouqCategory | undefined {
  return data.categories.find((c) => c.id === id);
}

export interface PartsouqUrlParams {
  catalogCode: string;
  vid?: string;
  cid?: string;
  cname?: string;
  ssd?: string;
  q?: string;
  locale?: string;
}

const BASE = "https://partsouq.com";

export function buildPartsouqVehicleUrl(params: PartsouqUrlParams): string {
  const locale = params.locale ?? "en";
  const search = new URLSearchParams();
  search.set("c", params.catalogCode);
  if (params.vid) search.set("vid", params.vid);
  if (params.cid) search.set("cid", params.cid);
  if (params.cname) search.set("cname", params.cname);
  if (params.ssd) search.set("ssd", params.ssd);
  if (params.q) search.set("q", params.q);
  return `${BASE}/${locale}/catalog/genuine/vehicle?${search.toString()}`;
}

export function buildPartsouqSearchUrl(partNumber: string, locale = "en"): string {
  const search = new URLSearchParams({ q: partNumber });
  return `${BASE}/${locale}/search/?${search.toString()}`;
}

export function buildCatalogUrl(
  variant: PartsouqVariant,
  category: PartsouqCategory,
  query?: string
): string {
  return buildPartsouqVehicleUrl({
    catalogCode: variant.catalogCode,
    vid: variant.vid,
    cid: category.cid,
    cname: category.cname,
    ssd: variant.ssd,
    q: query,
  });
}

export function buildBrandCatalogUrl(brand: "HYUNDAI" | "KIA", locale = "en"): string {
  const code = brand === "HYUNDAI" ? "HYUNDAI202404" : "KIA202404";
  return buildPartsouqVehicleUrl({ catalogCode: code, locale });
}
