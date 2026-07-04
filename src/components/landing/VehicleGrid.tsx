"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FadeIn, Section } from "@/components/ui/Section";
import { siteConfig, ui, vehicleKeywords, vehicleLabels, type VehicleId } from "@/config/site";
import { vehicleImages } from "@/config/vehicles";
import { whatsappHref } from "@/lib/contact";
import { buildContactUrl } from "@/lib/contact-url";
import { getTopPartsForVehicle } from "@/lib/oem-guides-data";

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
        {vehicleIds.map((id, i) => {
          const topParts = getTopPartsForVehicle(id, 3);
          const contactUrl = buildContactUrl({ vehicle: id });
          const whatsappUrl = whatsappHref(
            siteConfig.phone,
            `Consulta repuesto para ${vehicleLabels[id]}`
          );

          return (
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
                  {topParts.length > 0 && (
                    <div className="mb-4 mt-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                        {ui.piezasFrecuentes}
                      </p>
                      <ul className="space-y-1 text-xs text-muted">
                        {topParts.map((part) => (
                          <li key={part.oemNumber}>
                            <Link
                              href={buildContactUrl({ vehicle: id, oem: part.oemNumber })}
                              className="font-mono text-accent/90 hover:underline"
                            >
                              {part.oemNumber} · {part.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      href={`/parts?vehicle=${id}`}
                      className="rounded-lg accent-gradient px-3 py-2 text-center text-xs font-semibold text-white"
                    >
                      {ui.viewStock}
                    </Link>
                    <Link
                      href={contactUrl}
                      className="rounded-lg border border-accent/40 px-3 py-2 text-center text-xs font-semibold text-accent transition-colors hover:bg-accent/10"
                    >
                      {ui.consultarRepuesto}
                    </Link>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-border px-3 py-2 text-center text-xs font-semibold text-muted transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      {ui.contactWhatsApp}
                    </a>
                  </div>
                </div>
              </motion.article>
            </FadeIn>
          );
        })}
      </div>
    </Section>
  );
}
