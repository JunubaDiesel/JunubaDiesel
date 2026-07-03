import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getInventory } from "@/lib/inventory";
import { getAllResourceSlugs, loadResources } from "@/lib/resources";

export default function sitemap(): MetadataRoute.Sitemap {
  const inventory = getInventory();
  const resources = loadResources();
  const staticPages = [
    "",
    "/buscar",
    "/catalog",
    "/parts",
    "/recursos",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "/parts" ? ("daily" as const) : ("weekly" as const),
      priority: path === "" ? 1 : path === "/parts" || path === "/buscar" ? 0.9 : 0.7,
    })),
    ...inventory.map((part) => ({
      url: `${siteConfig.url}/parts/${part.slug}`,
      lastModified: part.erpUpdatedAt ? new Date(part.erpUpdatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getAllResourceSlugs().map((slug) => {
      const resource = resources.find((item) => item.slug === slug);
      return {
        url: `${siteConfig.url}/recursos/${slug}`,
        lastModified: resource ? new Date(resource.publishedAt) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    }),
  ];
}
