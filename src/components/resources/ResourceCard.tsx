import Link from "next/link";
import Image from "next/image";
import { resourceTypeLabels } from "@/lib/resource-labels";
import { vehicleLabels } from "@/config/site";
import type { Resource } from "@/types/resource";

interface ResourceCardProps {
  resource: Resource;
}

function getThumbnail(resource: Resource): string | null {
  if (resource.posterSrc) {
    return resource.posterSrc.startsWith("http")
      ? resource.posterSrc
      : resource.posterSrc;
  }
  if (resource.youtubeId) {
    return `https://img.youtube.com/vi/${resource.youtubeId}/mqdefault.jpg`;
  }
  return null;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const vehicleLabel =
    resource.vehicle === "all" ? "Todos" : vehicleLabels[resource.vehicle];
  const thumbnail = getThumbnail(resource);
  const isRemoteThumbnail = thumbnail?.startsWith("http") ?? false;

  return (
    <Link href={`/recursos/${resource.slug}`} className="group block">
      <article className="glass-card h-full overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:border-accent/30">
        {thumbnail ? (
          <div className="relative aspect-video bg-surface-light">
            {isRemoteThumbnail ? (
              <Image
                src={thumbnail}
                alt={resource.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized={thumbnail.includes("blob.vercel-storage.com")}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbnail} alt={resource.title} className="h-full w-full object-cover" />
            )}
            {resource.type === "video" && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-4xl text-white">
                ▶
              </span>
            )}
          </div>
        ) : null}
        <div className="p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
              {resourceTypeLabels[resource.type]}
            </span>
            <span className="rounded-full bg-surface-light px-2.5 py-1 text-xs text-muted">
              {vehicleLabel}
            </span>
            {resource.sourceChannel === "delga2000ca" && (
              <span className="rounded-full bg-surface-light px-2.5 py-1 text-xs text-muted">
                Delga
              </span>
            )}
          </div>
          <h3 className="mb-2 text-lg font-bold group-hover:text-accent">{resource.title}</h3>
          <p className="line-clamp-3 text-sm text-muted">{resource.description}</p>
        </div>
      </article>
    </Link>
  );
}
