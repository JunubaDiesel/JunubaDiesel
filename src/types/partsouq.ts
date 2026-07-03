import type { CategoryId, VehicleId } from "@/config/site";

export interface PartsouqVariant {
  id: string;
  vehicleId: VehicleId;
  label: string;
  catalogCode: string;
  brand: "HYUNDAI" | "KIA";
  vid?: string;
  ssd?: string;
  yearRange: string;
  engineCode?: string;
}

export interface PartsouqCategory {
  id: CategoryId;
  cid?: string;
  cname: string;
  label: string;
}

export interface PartsouqCatalogData {
  variants: PartsouqVariant[];
  categories: PartsouqCategory[];
}
