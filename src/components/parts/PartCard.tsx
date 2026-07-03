import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { StockBadge } from "@/components/parts/StockBadge";
import {
  categoryLabels,
  conditionLabels,
  ui,
  vehicleLabels,
} from "@/config/site";
import type { Part } from "@/types/part";

interface PartCardProps {
  part: Part;
}

export function PartCard({ part }: PartCardProps) {
  return (
    <Link href={`/parts/${part.slug}`} className="group block">
      <article className="glass-card overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-accent/30">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={part.images[0]}
            alt={part.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            <StockBadge stockQty={part.stockQty} stockStatus={part.stockStatus} />
            <Badge variant={part.condition}>{conditionLabels[part.condition]}</Badge>
            <Badge variant="vehicle">{vehicleLabels[part.vehicle]}</Badge>
            <Badge variant="default">{categoryLabels[part.category]}</Badge>
          </div>
          <h3 className="mb-2 line-clamp-2 text-lg font-bold group-hover:text-accent">
            {part.name}
          </h3>
          {part.yearRange && (
            <p className="mb-3 text-sm text-muted">{ui.year}: {part.yearRange}</p>
          )}
          <p className="line-clamp-2 text-sm text-muted">{part.description}</p>
          <span className="mt-4 inline-block text-sm font-semibold text-accent">
            {ui.viewDetails} →
          </span>
        </div>
      </article>
    </Link>
  );
}
