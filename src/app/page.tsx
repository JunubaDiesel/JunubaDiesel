import type { Metadata } from "next";
import { AboutJunuba } from "@/components/landing/AboutJunuba";
import { ConditionCompare } from "@/components/landing/ConditionCompare";
import { ContactCTA } from "@/components/landing/ContactCTA";
import { EngineShowcase } from "@/components/landing/EngineShowcase";
import { Hero } from "@/components/landing/Hero";
import { InstagramCTA } from "@/components/landing/InstagramCTA";
import { PartsPhotoShowcase } from "@/components/landing/PartsPhotoShowcase";
import { VehicleGrid } from "@/components/landing/VehicleGrid";
import { WhyJunuba } from "@/components/landing/WhyJunuba";
import { ResourcesShowcase } from "@/components/resources/ResourcesSection";
import { siteConfig } from "@/config/site";
import { getInventoryStats } from "@/lib/inventory";
import { getFeaturedParts, getPartsWithPhotos } from "@/lib/parts";
import { getFeaturedResources } from "@/lib/resources";

export const metadata: Metadata = {
  title: `${siteConfig.displayName} | Repuestos comerciales en República Dominicana`,
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.displayName} Corea Diesel`,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: siteConfig.logoSrc, alt: siteConfig.logoAlt }],
  },
};

export default function HomePage() {
  const stats = getInventoryStats();
  const featured = getFeaturedParts();
  const photoParts = getPartsWithPhotos(8);
  const featuredResources = getFeaturedResources(6);

  return (
    <>
      <Hero stats={stats} />
      <VehicleGrid />
      <EngineShowcase featured={featured} />
      <PartsPhotoShowcase parts={photoParts} />
      <AboutJunuba />
      <ConditionCompare />
      <WhyJunuba />
      <ResourcesShowcase resources={featuredResources} />
      <InstagramCTA />
      <ContactCTA />
    </>
  );
}
