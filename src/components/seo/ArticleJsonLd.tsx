import { siteConfig } from "@/config/site";
import type { Resource } from "@/types/resource";

function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${siteConfig.url}${path}`;
}

export function ArticleJsonLd({ resource }: { resource: Resource }) {
  const url = `${siteConfig.url}/recursos/${resource.slug}`;

  const schema =
    resource.type === "video" && (resource.videoSrc || resource.youtubeId)
      ? {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: resource.title,
          description: resource.description,
          uploadDate: resource.publishedAt,
          contentUrl: resource.videoSrc ? absoluteUrl(resource.videoSrc) : undefined,
          embedUrl: resource.youtubeId
            ? `https://www.youtube-nocookie.com/embed/${resource.youtubeId}`
            : undefined,
          thumbnailUrl: resource.posterSrc
            ? absoluteUrl(resource.posterSrc)
            : resource.youtubeId
              ? `https://img.youtube.com/vi/${resource.youtubeId}/hqdefault.jpg`
              : undefined,
          url,
        }
      : {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: resource.title,
          description: resource.description,
          datePublished: resource.publishedAt,
          author: {
            "@type": "Organization",
            name: siteConfig.displayName,
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.displayName,
            logo: {
              "@type": "ImageObject",
              url: `${siteConfig.url}${siteConfig.logoSrc}`,
            },
          },
          url,
          mainEntityOfPage: url,
        };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
