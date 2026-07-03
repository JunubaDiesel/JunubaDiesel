/**
 * Enrich empty Delga resource descriptions from title/tags for SEO snippets.
 * Run: npx tsx scripts/enrich-resource-descriptions.mts
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const RESOURCES_PATH = path.join(process.cwd(), "src/data/resources.json");

interface ResourceRow {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  sourceChannel?: string;
  type?: string;
}

const resources = JSON.parse(readFileSync(RESOURCES_PATH, "utf8")) as ResourceRow[];

let updated = 0;
for (const resource of resources) {
  if (resource.description?.trim()) continue;

  const channel = resource.sourceChannel ?? "delga2000ca";
  const tags = (resource.tags ?? []).filter((t) => t !== "video" && t !== channel);
  const tagLine = tags.length > 0 ? ` Temas: ${tags.join(", ")}.` : "";

  resource.description =
    resource.type === "video"
      ? `Video de mantenimiento automotriz de @${channel}, curado por JUNUBA Corea Diesel para talleres y propietarios de vehículos comerciales.${tagLine}`
      : `Guía de mantenimiento JUNUBA — ${resource.title}.${tagLine}`;

  updated += 1;
}

writeFileSync(RESOURCES_PATH, `${JSON.stringify(resources, null, 2)}\n`, "utf8");
console.log(`Updated ${updated} resource descriptions in ${RESOURCES_PATH}`);
