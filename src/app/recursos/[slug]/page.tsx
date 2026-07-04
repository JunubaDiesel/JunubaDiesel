import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleJsonLd } from "@/components/seo/ArticleJsonLd";
import { VideoPlayer } from "@/components/resources/VideoPlayer";
import { Button } from "@/components/ui/Button";
import { siteConfig, ui, vehicleLabels } from "@/config/site";
import { getAllResourceSlugs, getResourceBySlugAsync } from "@/lib/resources";
import { resourceTypeLabels } from "@/lib/resource-labels";

interface RecursoDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllResourceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: RecursoDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResourceBySlugAsync(slug);
  if (!resource) return { title: "Recurso no encontrado" };

  return {
    title: resource.title,
    description: resource.description,
    openGraph: {
      title: resource.title,
      description: resource.description,
      url: `${siteConfig.url}/recursos/${resource.slug}`,
      images: resource.posterSrc
        ? [{ url: resource.posterSrc.startsWith("http") ? resource.posterSrc : `${siteConfig.url}${resource.posterSrc}` }]
        : undefined,
    },
  };
}

export default async function RecursoDetailPage({ params }: RecursoDetailPageProps) {
  const { slug } = await params;
  const resource = await getResourceBySlugAsync(slug);
  if (!resource) notFound();

  const vehicleLabel =
    resource.vehicle === "all" ? "Todos los vehículos" : vehicleLabels[resource.vehicle];
  const isExternalArticle =
    resource.type === "article" && resource.url.startsWith("http") && !resource.youtubeId;
  const hasVideo = Boolean(resource.videoSrc || resource.youtubeId);

  return (
    <>
      <ArticleJsonLd resource={resource} />
      <div className="gradient-mesh pt-24 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link href="/recursos" className="text-sm text-accent hover:underline">
            ← Volver a recursos
          </Link>

          <div className="mb-6 mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {resourceTypeLabels[resource.type]}
            </span>
            <span className="rounded-full bg-surface-light px-3 py-1 text-xs text-muted">
              {vehicleLabel}
            </span>
            {resource.sourceChannel === "delga2000ca" && (
              <span className="rounded-full bg-surface-light px-3 py-1 text-xs text-muted">
                @delga2000ca
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{resource.title}</h1>
          <p className="mt-4 text-muted">{resource.description}</p>

          {hasVideo && <VideoPlayer resource={resource} />}

          <div className="mt-8 flex flex-wrap gap-2">
            {resource.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-surface-light px-3 py-1 text-xs text-muted">
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            {isExternalArticle ? (
              <Button href={resource.url} external>
                Leer artículo completo
              </Button>
            ) : !hasVideo ? (
              <Button
                href={resource.url.startsWith("http") ? resource.url : `/recursos/${resource.slug}`}
                external={resource.url.startsWith("http")}
              >
                Ver recurso
              </Button>
            ) : null}
            <Button href="/parts" variant="outline">
              {ui.viewParts}
            </Button>
            <Button href="/contact" variant="secondary">
              {ui.consultarRepuesto}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
