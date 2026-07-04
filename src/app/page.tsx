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
import { getInventoryStatsAsync } from "@/lib/inventory";
import { getFeaturedPartsAsync, getPartsWithPhotosAsync } from "@/lib/parts";
import { getFeaturedResourcesAsync } from "@/lib/resources";

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

export default async function HomePage() {
  const stats = await getInventoryStatsAsync();
  const featured = await getFeaturedPartsAsync();
  const photoParts = await getPartsWithPhotosAsync(8);
  const featuredResources = await getFeaturedResourcesAsync(6);

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
