import { categoryLabels, vehicleLabels, type CategoryId, type VehicleId } from "@/config/site";

export interface ContactPrefillParams {
  vehicle?: VehicleId | string;
  category?: CategoryId | string;
  oem?: string | string[];
  message?: string;
}

export function buildContactUrl(params: ContactPrefillParams): string {
  const search = new URLSearchParams();
  if (params.vehicle) search.set("vehicle", params.vehicle);
  if (params.category) search.set("category", params.category);
  if (params.oem) {
    const oems = Array.isArray(params.oem) ? params.oem : [params.oem];
    const joined = oems.map((v) => v.trim()).filter(Boolean).join(",");
    if (joined) search.set("oem", joined);
  }
  if (params.message) search.set("message", params.message);
  const qs = search.toString();
  return qs ? `/contact?${qs}` : "/contact";
}

export function buildContactMessageFromOems(oems: string[], category?: string): string {
  const parts: string[] = [];
  if (oems.length > 0) {
    parts.push(`Consulta sobre: ${oems.join(", ")}`);
  }
  if (category) {
    const label = categoryLabels[category as CategoryId] ?? category;
    parts.push(`Categoría: ${label}`);
  }
  return parts.join("\n");
}

export function resolveContactVehicleLabel(vehicle?: string): string {
  if (!vehicle) return "";
  return vehicleLabels[vehicle as VehicleId] ?? vehicle;
}

export function openExternalUrl(url: string): boolean {
  const win = window.open(url, "_blank", "noopener,noreferrer");
  return win !== null;
}
