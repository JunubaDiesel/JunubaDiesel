import fs from "fs";
import path from "path";
import resourcesSeed from "@/data/resources.json";
import { resourceTypeLabels } from "@/lib/resource-labels";
import { loadResourcesFromBlob, persistResourcesSnapshot } from "@/lib/storage/persist";
import type { Resource, ResourceFilters, ResourceType } from "@/types/resource";
import type { VehicleId } from "@/config/site";

const RESOURCES_FILE = path.join(process.cwd(), "data", "resources.json");

export { resourceTypeLabels };

function readResourcesFile(): Resource[] | null {
  if (!fs.existsSync(RESOURCES_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(RESOURCES_FILE, "utf-8")) as Resource[];
  } catch {
    return null;
  }
}

export function loadResources(): Resource[] {
  return readResourcesFile() ?? (resourcesSeed as Resource[]);
}

export async function loadResourcesAsync(): Promise<Resource[]> {
  const fromBlob = await loadResourcesFromBlob();
  if (fromBlob?.length) return fromBlob;
  return loadResources();
}

export function writeResources(resources: Resource[]): void {
  const dir = path.dirname(RESOURCES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(RESOURCES_FILE, JSON.stringify(resources, null, 2), "utf-8");
}

export async function writeResourcesAsync(resources: Resource[]): Promise<void> {
  try {
    writeResources(resources);
  } catch {
    // Vercel read-only filesystem — Blob is the source of truth in production
  }
  await persistResourcesSnapshot(resources);
}

export function getResourceBySlug(slug: string): Resource | undefined {
  return loadResources().find((resource) => resource.slug === slug);
}

export async function getResourceBySlugAsync(slug: string): Promise<Resource | undefined> {
  const resources = await loadResourcesAsync();
  return resources.find((resource) => resource.slug === slug);
}

export function getAllResourceSlugs(): string[] {
  return loadResources().map((resource) => resource.slug);
}

export async function getAllResourceSlugsAsync(): Promise<string[]> {
  const resources = await loadResourcesAsync();
  return resources.map((resource) => resource.slug);
}

export function getFeaturedResources(limit = 6): Resource[] {
  return loadResources()
    .filter((resource) => resource.featured)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

export async function getFeaturedResourcesAsync(limit = 6): Promise<Resource[]> {
  const resources = await loadResourcesAsync();
  return resources
    .filter((resource) => resource.featured)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

export function filterResources(filters: ResourceFilters = {}): Resource[] {
  return filterResourcesList(loadResources(), filters);
}

export async function filterResourcesAsync(filters: ResourceFilters = {}): Promise<Resource[]> {
  const resources = await loadResourcesAsync();
  return filterResourcesList(resources, filters);
}

function filterResourcesList(resources: Resource[], filters: ResourceFilters = {}): Resource[] {
  const query = filters.query?.trim().toLowerCase();

  return resources
    .filter((resource) => {
      if (filters.type && resource.type !== filters.type) return false;
      if (filters.vehicle === "all" && resource.vehicle !== "all") return false;
      if (
        filters.vehicle &&
        filters.vehicle !== "all" &&
        resource.vehicle !== filters.vehicle &&
        resource.vehicle !== "all"
      ) {
        return false;
      }
      if (!query) return true;
      const haystack = [resource.title, resource.description, ...resource.tags].join(" ").toLowerCase();
      return haystack.includes(query);
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function searchResources(query: string, vehicle?: VehicleId, limit = 5) {
  const resources = filterResources({ query, vehicle: vehicle ?? undefined });
  return {
    total: resources.length,
    resources: resources.slice(0, limit).map((resource) => ({
      title: resource.title,
      slug: resource.slug,
      type: resource.type,
      url: `/recursos/${resource.slug}`,
      vehicle: resource.vehicle,
    })),
  };
}

export function slugifyResource(title: string, id?: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return id ? `${base}-${id.slice(-4)}` : base;
}

export function parseResourceFilters(
  params: Record<string, string | string[] | undefined>
): ResourceFilters {
  const get = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value : undefined;
  };

  return {
    type: get("type") as ResourceType | undefined,
    vehicle: get("vehicle") as ResourceFilters["vehicle"],
    query: get("q"),
  };
}

export function getResourceTypeLabel(type: ResourceType): string {
  return resourceTypeLabels[type] ?? type;
}
