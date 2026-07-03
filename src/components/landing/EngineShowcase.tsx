"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { StockBadge } from "@/components/parts/StockBadge";
import { FadeIn, Section } from "@/components/ui/Section";
import { conditionLabels, ui, vehicleLabels } from "@/config/site";
import type { Part } from "@/types/part";

interface EngineShowcaseProps {
  featured: Part[];
}

export function EngineShowcase({ featured }: EngineShowcaseProps) {

  return (
    <Section
      id="engines"
      subtitle="Motores destacados"
      title="Motores usados · Producto principal"
      dark
    >
      <p className="-mt-8 mb-12 max-w-2xl text-muted">
        Disponemos de motores representativos como D4CB, D4BH, J3 y G4KD.
        Consulte compatibilidad por VIN antes de comprar.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {featured.map((part, i) => (
          <FadeIn key={part.id} delay={i * 0.1}>
            <Link href={`/parts/${part.slug}`}>
              <motion.article
                whileHover={{ y: -4 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-light sm:flex-row"
              >
                <div className="relative h-52 w-full shrink-0 sm:h-auto sm:w-52">
                  <Image
                    src={part.images[0]}
                    alt={part.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-6">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <StockBadge stockQty={part.stockQty} stockStatus={part.stockStatus} />
                    <Badge variant={part.condition}>{conditionLabels[part.condition]}</Badge>
                    <Badge variant="vehicle">{vehicleLabels[part.vehicle]}</Badge>
                  </div>
                  <h3 className="mb-2 text-xl font-bold group-hover:text-accent">
                    {part.name}
                  </h3>
                  {part.yearRange && (
                    <p className="mb-3 text-sm text-muted">{ui.year}: {part.yearRange}</p>
                  )}
                  <p className="line-clamp-2 text-sm text-muted">{part.description}</p>
                  <span className="mt-4 text-sm font-semibold text-accent">
                    {ui.viewDetails} · {ui.requestQuote} →
                  </span>
                </div>
              </motion.article>
            </Link>
          </FadeIn>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/parts?category=engine"
          className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
        >
          {ui.allEngines}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </Section>
  );
}
