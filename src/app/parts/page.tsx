import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PartsGrid } from "@/components/parts/PartsGrid";
import { PageRoleBanner } from "@/components/ui/PageRoleBanner";
import { ui } from "@/config/site";
import { parseSearchOptionsFromParams, searchParts } from "@/lib/parts";

export const metadata: Metadata = {
  title: ui.partsInStock,
  description: "Repuestos en stock JUNUBA para Hyundai Starex, Staria, Porter y Kia Bongo",
};

interface PartsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PartsPage({ searchParams }: PartsPageProps) {
  const params = await searchParams;
  const options = parseSearchOptionsFromParams(params);
  const result = searchParts(options);

  return (
    <div className="gradient-mesh pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            {ui.stockJUNUBA}
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {ui.partsInStock}
          </h1>
          <PageRoleBanner>{ui.partsBanner}</PageRoleBanner>
          <p className="max-w-2xl text-muted">
            Busque por nombre, OEM, vehículo, estado y categoría. Los precios varían según stock;
            solicite cotización en la página de detalle.
          </p>
        </div>

        <Suspense fallback={<div className="text-muted">{result.total} repuestos...</div>}>
          <PartsGrid
            parts={result.parts}
            total={result.total}
            page={result.page}
            totalPages={result.totalPages}
          />
        </Suspense>

        <p className="mt-10 text-center text-sm text-muted">
          {ui.noOemCode}{" "}
          <Link href="/catalog" className="font-semibold text-accent hover:underline">
            {ui.verDiagramaOem} →
          </Link>
        </p>
      </div>
    </div>
  );
}
