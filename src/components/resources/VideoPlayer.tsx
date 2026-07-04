"use client";

import Link from "next/link";
import { useState } from "react";
import type { Resource } from "@/types/resource";

interface VideoPlayerProps {
  resource: Resource;
}

function YouTubeEmbed({ resource }: { resource: Resource }) {
  if (!resource.youtubeId) return null;

  return (
    <div className="aspect-video overflow-hidden rounded-2xl border border-border">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${resource.youtubeId}`}
        title={resource.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  );
}

export function VideoPlayer({ resource }: VideoPlayerProps) {
  const [useYoutubeFallback, setUseYoutubeFallback] = useState(false);
  const hasHostedVideo = Boolean(resource.videoSrc) && !useYoutubeFallback;

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
            onError={() => {
              if (resource.youtubeId) setUseYoutubeFallback(true);
            }}
          >
            <source src={resource.videoSrc} type="video/mp4" />
            Su navegador no soporta reproducción de video.
          </video>
        </div>
      ) : resource.youtubeId ? (
        <YouTubeEmbed resource={resource} />
      ) : null}

      {useYoutubeFallback && resource.youtubeId && (
        <p className="mt-2 text-xs text-muted">
          Video local no disponible — reproduciendo desde YouTube.
        </p>
      )}

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
