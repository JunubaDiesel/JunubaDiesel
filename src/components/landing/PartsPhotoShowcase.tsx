import Link from "next/link";
import Image from "next/image";
import { FadeIn, Section } from "@/components/ui/Section";
import { StockBadge } from "@/components/parts/StockBadge";
import { ui, vehicleLabels } from "@/config/site";
import type { Part } from "@/types/part";

interface PartsPhotoShowcaseProps {
  parts: Part[];
}

export function PartsPhotoShowcase({ parts }: PartsPhotoShowcaseProps) {
  if (parts.length === 0) return null;

  return (
    <Section
      id="photos"
      subtitle={ui.partsWithPhotos}
      title="Stock con fotografía real"
      dark
    >
      <p className="-mt-8 mb-10 max-w-2xl text-muted">{ui.partsWithPhotosDesc}</p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {parts.map((part, i) => (
          <FadeIn key={part.id} delay={i * 0.08}>
            <Link href={`/parts/${part.slug}`} className="group block">
              <article className="glass-card overflow-hidden rounded-2xl transition-all hover:-translate-y-1 hover:border-accent/30">
                <div className="relative aspect-square overflow-hidden bg-surface-light">
                  <Image
                    src={part.images[0]}
                    alt={part.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <StockBadge
                    stockQty={part.stockQty}
                    stockStatus={part.stockStatus}
                    className="mb-2"
                  />
                  <p className="mb-1 text-xs text-muted">{vehicleLabels[part.vehicle]}</p>
                  <h3 className="line-clamp-2 text-sm font-bold group-hover:text-accent">
                    {part.name}
                  </h3>
                </div>
              </article>
            </Link>
          </FadeIn>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/parts"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
        >
          {ui.viewCatalog} →
        </Link>
      </div>
    </Section>
  );
}
