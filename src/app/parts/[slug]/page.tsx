import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PartGallery } from "@/components/parts/PartGallery";
import { PartCard } from "@/components/parts/PartCard";
import { StockBadge } from "@/components/parts/StockBadge";
import { ProductJsonLd } from "@/components/seo/ProductJsonLd";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  categoryLabels,
  conditionLabels,
  siteConfig,
  ui,
  vehicleLabels,
} from "@/config/site";
import { getFeaturedParts, getPartBySlug, getRelatedParts } from "@/lib/parts";
import { telHref, whatsappHref } from "@/lib/contact";

export const revalidate = 3600;

interface PartDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getFeaturedParts()
    .slice(0, 100)
    .map((part) => ({ slug: part.slug }));
}

export async function generateMetadata({ params }: PartDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const part = getPartBySlug(slug);
  if (!part) return { title: ui.partsNotFound };

  return {
    title: part.name,
    description: part.description,
    alternates: {
      canonical: `${siteConfig.url}/parts/${part.slug}`,
    },
    openGraph: {
      title: part.name,
      description: part.description,
      url: `${siteConfig.url}/parts/${part.slug}`,
      type: "website",
      images: part.images[0]
        ? [{ url: part.images[0].startsWith("http") ? part.images[0] : `${siteConfig.url}${part.images[0]}`, alt: part.name }]
        : [{ url: siteConfig.logoSrc, alt: siteConfig.logoAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: part.name,
      description: part.description,
      images: part.images[0]
        ? [part.images[0].startsWith("http") ? part.images[0] : `${siteConfig.url}${part.images[0]}`]
        : [siteConfig.logoSrc],
    },
  };
}

export default async function PartDetailPage({ params }: PartDetailPageProps) {
  const { slug } = await params;
  const part = getPartBySlug(slug);

  if (!part) notFound();

  const related = getRelatedParts(part);

  return (
    <div className="gradient-mesh pt-24 pb-20">
      <ProductJsonLd part={part} />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="mb-8 text-sm text-muted">
          <Link href="/" className="hover:text-accent">
            {ui.home}
          </Link>
          <span className="mx-2">/</span>
          <Link href="/parts" className="hover:text-accent">
            {ui.parts}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{part.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2">
          <PartGallery images={part.images} name={part.name} />

          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <StockBadge stockQty={part.stockQty} stockStatus={part.stockStatus} />
              <Badge variant={part.condition}>{conditionLabels[part.condition]}</Badge>
              <Badge variant="vehicle">{vehicleLabels[part.vehicle]}</Badge>
              <Badge variant="default">{categoryLabels[part.category]}</Badge>
            </div>

            <h1 className="mb-4 text-3xl font-bold md:text-4xl">{part.name}</h1>

            {part.yearRange && (
              <p className="mb-4 text-muted">{ui.year}: {part.yearRange}</p>
            )}

            <p className="mb-8 leading-relaxed text-muted">{part.description}</p>

            <div className="mb-8 rounded-2xl border border-border bg-surface-light p-6">
              <h2 className="mb-4 text-lg font-semibold">{ui.specs}</h2>
              <dl className="space-y-3">
                {Object.entries(part.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-4 border-b border-border/50 pb-3 last:border-0">
                    <dt className="text-sm text-muted">{key}</dt>
                    <dd className="text-sm font-medium text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {part.oemNumbers && part.oemNumbers.length > 0 && (
              <div className="mb-8">
                <p className="mb-3 text-sm font-semibold text-muted">Números OEM</p>
                <div className="flex flex-wrap gap-2">
                  {part.oemNumbers.map((oem) => (
                    <Badge key={oem} variant="default">
                      {oem}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="sticky bottom-4 rounded-2xl border border-accent/30 bg-surface/95 p-6 backdrop-blur-xl">
              <p className="mb-4 text-sm text-muted">{ui.quoteNote}</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href={telHref(siteConfig.phone)} className="flex-1">
                  {ui.requestQuote} · {siteConfig.phone}
                </Button>
                <Button
                  href={whatsappHref(
                    siteConfig.phone,
                    `Hola, consulto sobre: ${part.name}${part.erpId ? ` (${part.erpId})` : ""}. ¿Tienen en stock?`
                  )}
                  external
                  variant="secondary"
                  className="flex-1"
                >
                  {ui.contactWhatsApp}
                </Button>
                <Button href={siteConfig.instagram} external variant="outline" className="flex-1">
                  Instagram DM
                </Button>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 text-2xl font-bold">{ui.relatedParts}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <PartCard key={item.id} part={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
