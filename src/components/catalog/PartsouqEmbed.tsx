"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ui } from "@/config/site";
import type { PartsouqCategory, PartsouqVariant } from "@/types/partsouq";
import { useToast } from "@/context/ToastContext";
import { buildCatalogUrl } from "@/lib/partsouq";

interface PartsouqEmbedProps {
  variant: PartsouqVariant;
  category: PartsouqCategory;
}

export function PartsouqEmbed({ variant, category }: PartsouqEmbedProps) {
  const url = buildCatalogUrl(variant, category);
  const { showToast } = useToast();
  const [showFallback, setShowFallback] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setShowFallback(false);
    setLoaded(false);
    const timer = setTimeout(() => setShowFallback(true), 5000);
    return () => clearTimeout(timer);
  }, [url]);

  const copyLink = useCallback(async () => {
    await navigator.clipboard.writeText(url);
    showToast(ui.linkCopied);
  }, [url, showToast]);

  const displayFallback = showFallback && !loaded;

  return (
    <div className="flex h-full min-h-[480px] flex-col overflow-hidden rounded-2xl border border-border bg-surface-light">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{variant.label}</p>
          <p className="text-xs text-muted">{category.label}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button href={url} external variant="outline" size="sm">
            {ui.openPartsouq}
          </Button>
          <Button type="button" onClick={copyLink} variant="ghost" size="sm">
            {ui.copyLink}
          </Button>
        </div>
      </div>

      <div className="relative min-h-[420px] flex-1">
        <iframe
          key={url}
          src={url}
          title="Partsouq OEM Catalog"
          className="absolute inset-0 h-full w-full bg-white"
          onLoad={() => setLoaded(true)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
        {!loaded && !displayFallback && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/80">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
        )}
        {displayFallback && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface/95 p-8 text-center">
            <svg className="h-12 w-12 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            <p className="max-w-sm text-sm text-muted">{ui.iframeBlocked}</p>
            <Button href={url} external size="md">
              {ui.openPartsouq}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
