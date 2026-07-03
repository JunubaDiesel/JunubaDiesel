import type { Metadata } from "next";
import Link from "next/link";
import { CatalogLayout } from "@/components/catalog/CatalogLayout";
import { PageRoleBanner } from "@/components/ui/PageRoleBanner";
import { ui } from "@/config/site";

export const metadata: Metadata = {
  title: ui.catalogOem,
  description: ui.catalogOemDesc,
};

export default function CatalogPage() {
  return (
    <div className="gradient-mesh pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
              Partsouq
            </p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{ui.catalogOem}</h1>
            <PageRoleBanner>{ui.catalogBanner}</PageRoleBanner>
            <p className="max-w-2xl text-muted">{ui.catalogOemDesc}</p>
          </div>
          <Link
            href="/parts"
            className="shrink-0 rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {ui.stockJUNUBA} →
          </Link>
        </div>

        <CatalogLayout />
      </div>
    </div>
  );
}
