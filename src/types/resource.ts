import type { VehicleId } from "@/config/site";

export type ResourceType = "video" | "article" | "tip" | "maintenance";
export type ResourceVehicle = VehicleId | "all";
export type ResourceSourceChannel = "delga2000ca";

export interface Resource {
  id: string;
  slug: string;
  type: ResourceType;
  title: string;
  description: string;
  vehicle: ResourceVehicle;
  url: string;
  youtubeId?: string;
  videoSrc?: string;
  posterSrc?: string;
  sourceChannel?: ResourceSourceChannel;
  sourceUrl?: string;
  thumbnail?: string;
  tags: string[];
  publishedAt: string;
  featured?: boolean;
}

export interface ResourceFilters {
  type?: ResourceType;
  vehicle?: ResourceVehicle;
  query?: string;
}
