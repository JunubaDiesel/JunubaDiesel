import type { VehicleId } from "@/config/site";

export interface VehicleImageSet {
  card: string;
  hero: string;
  alt: string;
}

export const vehicleImages: Record<VehicleId, VehicleImageSet> = {
  starex: {
    card: "/images/vehicles/starex.jpg",
    hero: "/images/vehicles/starex.jpg",
    alt: "Hyundai Starex",
  },
  staria: {
    card: "/images/vehicles/staria.jpg",
    hero: "/images/vehicles/staria.jpg",
    alt: "Hyundai Staria",
  },
  porter: {
    card: "/images/vehicles/porter.jpg",
    hero: "/images/vehicles/porter.jpg",
    alt: "Hyundai Porter",
  },
  bongo: {
    card: "/images/vehicles/bongo.jpg",
    hero: "/images/vehicles/bongo.jpg",
    alt: "Kia Bongo",
  },
};

export const siteHeroImage = "/images/vehicles/hero-van.jpg";

export const instagramFeedImages = [
  vehicleImages.starex.card,
  vehicleImages.staria.card,
  vehicleImages.porter.card,
  vehicleImages.bongo.card,
  "/images/vehicles/hero-van.jpg",
  vehicleImages.starex.card,
];

export function getVehicleImage(vehicle: VehicleId): string {
  return vehicleImages[vehicle].card;
}
