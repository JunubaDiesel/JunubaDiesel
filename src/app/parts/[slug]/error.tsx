"use client";

import { Button } from "@/components/ui/Button";
import { ui } from "@/config/site";

export default function PartDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="gradient-mesh flex min-h-[60vh] items-center justify-center px-4 pt-24 pb-20">
      <div className="glass-card max-w-md rounded-2xl p-8 text-center">
        <h2 className="mb-3 text-2xl font-bold">Error al cargar el repuesto</h2>
        <p className="mb-6 text-muted">
          No pudimos mostrar este producto. Intente de nuevo o vuelva al catálogo.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset}>Reintentar</Button>
          <Button href="/parts" variant="secondary">
            {ui.viewCatalog}
          </Button>
        </div>
      </div>
    </div>
  );
}
