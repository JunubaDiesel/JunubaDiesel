import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
};

export default function AdminHomePage() {
  return (
    <div className="gradient-mesh min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold">Administración JUNUBA</h1>
        <p className="mb-10 text-muted">Gestione inventario y contenido del sitio web.</p>

        <div className="grid gap-4">
          <Link
            href="/admin/sync"
            className="glass-card rounded-2xl p-6 transition hover:border-accent/30"
          >
            <h2 className="text-xl font-bold">Sincronización ERP</h2>
            <p className="mt-2 text-sm text-muted">
              Subir CSV o Excel para actualizar el catálogo de repuestos.
            </p>
          </Link>
          <Link
            href="/admin/resources"
            className="glass-card rounded-2xl p-6 transition hover:border-accent/30"
          >
            <h2 className="text-xl font-bold">Recursos</h2>
            <p className="mt-2 text-sm text-muted">
              Gestionar guías, videos de YouTube y artículos en /recursos.
            </p>
          </Link>
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold">Sincronizar videos Delga</h2>
            <p className="mt-2 text-sm text-muted">
              Descargue los últimos 20 videos de @delga2000ca, aplique el logo JUNUBA y
              actualice /recursos desde la terminal del proyecto.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-surface-light p-4 text-xs text-muted">
              {`npm run sync:videos:dry   # vista previa
npm run sync:videos       # descargar + logo + actualizar JSON

# Requisitos: yt-dlp (pip install yt-dlp) y FFmpeg
# Opcional: BLOB_READ_WRITE_TOKEN para subir a Vercel Blob`}
            </pre>
            <p className="mt-3 text-xs text-muted">
              Ver documentación en{" "}
              <code className="rounded bg-surface-light px-1">docs/video-sync.md</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
