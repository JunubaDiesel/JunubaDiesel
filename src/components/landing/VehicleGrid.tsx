"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FadeIn, Section } from "@/components/ui/Section";
import { ui, vehicleKeywords, vehicleLabels, type VehicleId } from "@/config/site";
import { vehicleImages } from "@/config/vehicles";

const vehicleIds: VehicleId[] = ["starex", "staria", "porter", "bongo"];

const gradients: Record<VehicleId, string> = {
  starex: "from-blue-500/20 to-transparent",
  staria: "from-purple-500/20 to-transparent",
  porter: "from-orange-500/20 to-transparent",
  bongo: "from-green-500/20 to-transparent",
};

export function VehicleGrid() {
  return (
    <Section
      id="vehicles"
      subtitle="Línea de vehículos"
      title="Vehículos que atendemos"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {vehicleIds.map((id, i) => (
          <FadeIn key={id} delay={i * 0.1}>
            <motion.article
              whileHover={{ y: -6 }}
              className="group glass-card overflow-hidden rounded-2xl"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={vehicleImages[id].card}
                  alt={vehicleImages[id].alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${gradients[id]} to-background/80`} />
                <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white md:text-2xl">
                  {vehicleLabels[id]}
                </h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {vehicleKeywords[id].map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-surface-light px-2.5 py-1 text-xs text-muted"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={`/parts?vehicle=${id}`}
                    className="rounded-lg accent-gradient px-3 py-2 text-center text-xs font-semibold text-white"
                  >
                    {ui.viewStock}
                  </Link>
                  <Link
                    href={`/catalog?vehicle=${id}`}
                    className="rounded-lg border border-accent/40 px-3 py-2 text-center text-xs font-semibold text-accent transition-colors hover:bg-accent/10"
                  >
                    {ui.diagramaOem}
                  </Link>
                </div>
              </div>
            </motion.article>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
