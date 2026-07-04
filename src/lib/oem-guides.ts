import fs from "fs";
import path from "path";
import type { CategoryId, VehicleId } from "@/config/site";
import type { OemGuideEntry, OemGuidePart } from "@/types/oem-guide";
import type { OemGuidesData } from "@/types/oem-guide";
import {
  getAllGuideVehicleIdsFromGuides,
  getGuideByVehicleFromGuides,
  loadOemGuidesFromSeed,
  removeGuidePartFromGuides,
  upsertGuidePartInGuides,
} from "@/lib/oem-guides-data";
import { loadOemGuidesFromBlob, persistOemGuidesSnapshot } from "@/lib/storage/persist";

const GUIDES_FILE = path.join(process.cwd(), "data", "oem-guides.json");

function readGuidesFile(): OemGuideEntry[] | null {
  if (!fs.existsSync(GUIDES_FILE)) return null;
  try {
    const data = JSON.parse(fs.readFileSync(GUIDES_FILE, "utf-8")) as OemGuidesData;
    return data.guides;
  } catch {
    return null;
  }
}

export function loadOemGuides(): OemGuideEntry[] {
  return readGuidesFile() ?? loadOemGuidesFromSeed();
}

export async function loadOemGuidesAsync(): Promise<OemGuideEntry[]> {
  const fromBlob = await loadOemGuidesFromBlob();
  if (fromBlob?.length) return fromBlob;
  return loadOemGuides();
}

export function writeOemGuides(guides: OemGuideEntry[]): void {
  const dir = path.dirname(GUIDES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(GUIDES_FILE, JSON.stringify({ guides }, null, 2), "utf-8");
}

async function persistOemGuides(guides: OemGuideEntry[]): Promise<void> {
  try {
    writeOemGuides(guides);
  } catch {
    // Vercel read-only filesystem
  }
  await persistOemGuidesSnapshot(guides);
}

export function getGuideByVehicle(
  vehicleId: VehicleId,
  variantId?: string
): OemGuideEntry | undefined {
  return getGuideByVehicleFromGuides(loadOemGuides(), vehicleId, variantId);
}

export async function getGuideByVehicleAsync(
  vehicleId: VehicleId,
  variantId?: string
): Promise<OemGuideEntry | undefined> {
  const guides = await loadOemGuidesAsync();
  return getGuideByVehicleFromGuides(guides, vehicleId, variantId);
}

export function getAllGuideVehicleIds(): VehicleId[] {
  return getAllGuideVehicleIdsFromGuides(loadOemGuides());
}

export async function upsertGuidePart(params: {
  vehicleId: VehicleId;
  variantId?: string;
  categoryId: CategoryId;
  sectionTitle?: string;
  part: OemGuidePart;
}): Promise<OemGuideEntry> {
  const guides = await loadOemGuidesAsync();
  upsertGuidePartInGuides(guides, params);
  await persistOemGuides(guides);
  return getGuideByVehicleFromGuides(guides, params.vehicleId, params.variantId)!;
}

export async function removeGuidePart(guideId: string, oemNumber: string): Promise<boolean> {
  const guides = await loadOemGuidesAsync();
  const removed = removeGuidePartFromGuides(guides, guideId, oemNumber);
  if (removed) await persistOemGuides(guides);
  return removed;
}

export async function replaceOemGuides(guides: OemGuideEntry[]): Promise<void> {
  await persistOemGuides(guides);
}

export { getTopPartsForVehicle } from "@/lib/oem-guides-data";
