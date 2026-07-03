import Link from "next/link";
import type { Resource } from "@/types/resource";

interface VideoPlayerProps {
  resource: Resource;
}

export function VideoPlayer({ resource }: VideoPlayerProps) {
  const hasHostedVideo = Boolean(resource.videoSrc);

  return (
    <div className="mt-8">
      {hasHostedVideo ? (
        <div className="aspect-video overflow-hidden rounded-2xl border border-border bg-black">
          <video
            controls
            playsInline
            preload="metadata"
            poster={resource.posterSrc}
            className="h-full w-full"
          >
            <source src={resource.videoSrc} type="video/mp4" />
            Su navegador no soporta reproducción de video.
          </video>
        </div>
      ) : resource.youtubeId ? (
        <div className="aspect-video overflow-hidden rounded-2xl border border-border">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${resource.youtubeId}`}
            title={resource.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      ) : null}

      {resource.sourceUrl && (
        <p className="mt-3 text-sm text-muted">
          Fuente:{" "}
          <Link
            href={resource.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent hover:underline"
          >
            Ver en YouTube (@delga2000ca)
          </Link>
        </p>
      )}
    </div>
  );
}
