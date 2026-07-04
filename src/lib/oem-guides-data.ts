import guidesSeed from "@/data/oem-guides.json";
import type { CategoryId, VehicleId } from "@/config/site";
import type { OemGuideEntry, OemGuidePart, OemGuidesData } from "@/types/oem-guide";

/** Client-safe read from bundled seed JSON (no Node fs). */
export function loadOemGuidesFromSeed(): OemGuideEntry[] {
  return (guidesSeed as OemGuidesData).guides;
}

export function getGuideByVehicleFromGuides(
  guides: OemGuideEntry[],
  vehicleId: VehicleId,
  variantId?: string
): OemGuideEntry | undefined {
  const matching = guides.filter((g) => g.vehicleId === vehicleId);
  if (variantId) {
    const exact = matching.find((g) => g.variantId === variantId);
    if (exact) return exact;
  }
  return matching[0];
}

export function getGuideByVehicle(
  vehicleId: VehicleId,
  variantId?: string
): OemGuideEntry | undefined {
  return getGuideByVehicleFromGuides(loadOemGuidesFromSeed(), vehicleId, variantId);
}

export function getTopPartsForVehicle(vehicleId: VehicleId, limit = 3): OemGuidePart[] {
  const guide = getGuideByVehicle(vehicleId);
  if (!guide) return [];
  const parts: OemGuidePart[] = [];
  for (const section of guide.sections) {
    for (const part of section.parts) {
      parts.push(part);
      if (parts.length >= limit) return parts;
    }
  }
  return parts;
}

export function getAllGuideVehicleIdsFromGuides(guides: OemGuideEntry[]): VehicleId[] {
  return [...new Set(guides.map((g) => g.vehicleId))];
}

export function upsertGuidePartInGuides(
  guides: OemGuideEntry[],
  params: {
    vehicleId: VehicleId;
    variantId?: string;
    categoryId: CategoryId;
    sectionTitle?: string;
    part: OemGuidePart;
  }
): OemGuideEntry {
  let guide = guides.find(
    (g) =>
      g.vehicleId === params.vehicleId &&
      (params.variantId ? g.variantId === params.variantId : !g.variantId)
  );

  if (!guide) {
    guide = {
      id: `guide-${params.vehicleId}-${params.variantId ?? "default"}`,
      vehicleId: params.vehicleId,
      variantId: params.variantId,
      sections: [],
    };
    guides.push(guide);
  }

  let section = guide.sections.find((s) => s.categoryId === params.categoryId);
  if (!section) {
    section = {
      categoryId: params.categoryId,
      title: params.sectionTitle ?? params.categoryId,
      parts: [],
    };
    guide.sections.push(section);
  }

  const existingIndex = section.parts.findIndex((p) => p.oemNumber === params.part.oemNumber);
  if (existingIndex >= 0) {
    section.parts[existingIndex] = { ...section.parts[existingIndex], ...params.part };
  } else {
    section.parts.push(params.part);
  }

  return guide;
}

export function removeGuidePartFromGuides(
  guides: OemGuideEntry[],
  guideId: string,
  oemNumber: string
): boolean {
  const guide = guides.find((g) => g.id === guideId);
  if (!guide) return false;

  for (const section of guide.sections) {
    const before = section.parts.length;
    section.parts = section.parts.filter((p) => p.oemNumber !== oemNumber);
    if (section.parts.length < before) return true;
  }
  return false;
}
