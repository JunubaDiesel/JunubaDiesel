/**
 * Seed oem-guides.json from inventory/parts seed data
 * Run: npx tsx scripts/seed-oem-guides.mts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import partsSeed from "../src/data/parts.json";
import type { CategoryId, VehicleId } from "../src/config/site.ts";
import type { OemGuideEntry, OemGuidesData } from "../src/types/oem-guide.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "src/data/oem-guides.json");

interface SeedPart {
  vehicle: VehicleId;
  category: CategoryId;
  name: string;
  oemNumbers?: string[];
}

const parts = partsSeed as SeedPart[];
const byVehicle = new Map<VehicleId, SeedPart[]>();

for (const part of parts) {
  if (!part.oemNumbers?.length) continue;
  const list = byVehicle.get(part.vehicle) ?? [];
  list.push(part);
  byVehicle.set(part.vehicle, list);
}

const guides: OemGuideEntry[] = [];

for (const [vehicleId, vehicleParts] of byVehicle) {
  const byCategory = new Map<CategoryId, SeedPart[]>();
  for (const part of vehicleParts) {
    const list = byCategory.get(part.category) ?? [];
    list.push(part);
    byCategory.set(part.category, list);
  }

  const sections = [...byCategory.entries()].map(([categoryId, catParts]) => ({
    categoryId,
    title: `Piezas frecuentes — ${categoryId}`,
    parts: catParts.slice(0, 5).flatMap((p) =>
      (p.oemNumbers ?? []).slice(0, 1).map((oemNumber) => ({
        oemNumber,
        name: p.name,
      }))
    ),
  }));

  guides.push({
    id: `guide-${vehicleId}-seed`,
    vehicleId,
    sections: sections.filter((s) => s.parts.length > 0),
  });
}

const payload: OemGuidesData = { guides };
fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
console.log(`Wrote ${guides.length} guides to ${OUT}`);
