"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PartGalleryProps {
  images: string[];
  name: string;
}

export function PartGallery({ images, name }: PartGalleryProps) {
  const [active, setActive] = useState(0);
  const gallery = images.length > 0 ? images : ["/images/vehicles/hero-van.jpg"];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-surface-light">
        <Image
          src={gallery[active]}
          alt={`${name} - imagen ${active + 1}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-3">
          {gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative h-20 w-20 overflow-hidden rounded-lg border-2 transition-colors",
                active === i ? "border-accent" : "border-border hover:border-accent/50"
              )}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
