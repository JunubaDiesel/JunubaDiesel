"use client";

import { Button } from "@/components/ui/Button";
import { ui } from "@/config/site";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">
        <div className="gradient-mesh flex min-h-screen items-center justify-center px-4">
          <div className="glass-card max-w-md rounded-2xl p-8 text-center">
            <h2 className="mb-3 text-2xl font-bold">Error inesperado</h2>
            <p className="mb-2 text-muted">
              Ocurrió un problema al cargar la página. Puede reintentar o volver al inicio.
            </p>
            {process.env.NODE_ENV === "development" && (
              <p className="mb-4 text-xs text-red-400">{error.message}</p>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={reset}>Reintentar</Button>
              <Button href="/" variant="secondary">
                {ui.backHome}
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
