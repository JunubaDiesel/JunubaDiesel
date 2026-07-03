import type { Metadata } from "next";
import { SearchHub } from "@/components/search/SearchHub";
import { ui } from "@/config/site";
import type { VehicleId } from "@/config/site";
import { searchParts } from "@/lib/parts";

export const metadata: Metadata = {
  title: ui.buscarRepuesto,
  description: "Busque repuestos en stock JUNUBA o consulte diagramas OEM en un solo lugar.",
};

interface BuscarPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BuscarPage({ searchParams }: BuscarPageProps) {
  const params = await searchParams;
  const get = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value : "";
  };

  const tab = get("tab") === "diagrama" ? "diagrama" : "stock";
  const query = get("q");
  const oem = get("oem");
  const searchText = oem || query;
  const vehicle = (get("vehicle") as VehicleId) || undefined;

  const result = searchParts({
    query: searchText,
    vehicle,
    pageSize: 6,
    page: 1,
  });

  return (
    <div className="gradient-mesh pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            JUNUBA
          </p>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{ui.buscarRepuesto}</h1>
          <p className="mt-4 max-w-2xl text-muted">
            Un solo lugar para verificar stock en almacén o consultar números OEM en diagramas.
          </p>
        </div>

        <SearchHub
          initialParts={result.parts}
          initialTotal={result.total}
          initialQuery={query}
          initialOem={oem}
          initialTab={tab}
          initialVehicle={vehicle}
        />
      </div>
    </div>
  );
}
