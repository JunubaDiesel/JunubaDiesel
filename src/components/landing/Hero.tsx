"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { siteConfig, ui } from "@/config/site";
import { siteHeroImage } from "@/config/vehicles";

interface HeroStats {
  totalProducts: number;
  inStockCount: number;
  vehicleCount: number;
}

interface HeroProps {
  stats: HeroStats;
}

export function Hero({ stats }: HeroProps) {
  return (
    <section className="relative min-h-screen overflow-hidden gradient-mesh pt-16">
      <div className="absolute inset-0 opacity-25">
        <Image
          src={siteHeroImage}
          alt="Vehículos comerciales Hyundai y Kia"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <span className="mb-6 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            {ui.commercialParts} · {siteConfig.instagramHandle}
          </span>

          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-gradient">Hyundai Starex · Staria</span>
            <br />
            <span className="text-gradient">Hyundai Porter · Kia Bongo</span>
            <br />
            <span className="bg-gradient-to-r from-accent to-orange-400 bg-clip-text text-transparent">
              Repuestos nuevos y usados
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted md:text-xl">
            {siteConfig.description} Confirmamos stock y enviamos a todo el país con rapidez.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
            <Button href="/parts" size="lg">
              {ui.viewParts}
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
            <Button href="/catalog" variant="secondary" size="lg">
              {ui.diagramaOem}
            </Button>
            <Button href="/recursos" variant="outline" size="lg">
              {ui.guiasVideos}
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 grid w-full max-w-3xl grid-cols-3 gap-4 md:gap-8"
        >
          {[
            { value: `${stats.totalProducts}+`, label: "Repuestos" },
            { value: `${stats.inStockCount}`, label: "En stock" },
            { value: `${stats.vehicleCount}`, label: "Vehículos" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-4 md:p-6">
              <p className="text-2xl font-bold text-accent md:text-3xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
