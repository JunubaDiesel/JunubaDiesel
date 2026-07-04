"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminInsights } from "@/components/admin/AdminInsights";
import { Button } from "@/components/ui/Button";
import { ui } from "@/config/site";
import { adminFetch } from "@/lib/admin-fetch";
import type { SyncResult } from "@/types/part";

interface InventoryMetaResponse {
  syncedAt: string | null;
  source: "erp" | "seed" | "excel" | "stock";
  totalProducts: number;
  inStockCount: number;
}

export function AdminSyncClient() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<InventoryMetaResponse | null>(null);

  const loadMeta = useCallback(async () => {
    try {
      const res = await adminFetch("/api/inventory/stats");
      if (res.ok) setMeta(await res.json());
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadMeta();
  }, [loadMeta]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await adminFetch("/api/sync/inventory", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? ui.syncError);
        return;
      }
      setResult(data as SyncResult);
      await loadMeta();
    } catch {
      setError(ui.syncError);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="gradient-mesh min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold">{ui.erpSyncTitle}</h1>
        <p className="mb-8 text-muted">{ui.erpSyncDesc}</p>

        {meta && (
          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-4">
              <p className="text-2xl font-bold text-accent">{meta.totalProducts}</p>
              <p className="text-sm text-muted">{ui.syncedProducts}</p>
            </div>
            <div className="glass-card rounded-2xl p-4">
              <p className="text-2xl font-bold text-accent">{meta.inStockCount}</p>
              <p className="text-sm text-muted">{ui.inStockProducts}</p>
            </div>
          </div>
        )}

        {meta?.syncedAt && (
          <p className="mb-6 text-sm text-muted">
            {ui.lastSync}: {new Date(meta.syncedAt).toLocaleString("es-ES")}
            {meta.source === "excel" && " · Excel Ventas"}
            {meta.source === "stock" && " · Excel Stock (재고현황)"}
          </p>
        )}

        <div className="space-y-6">
          <AdminInsights />
          <div className="glass-card space-y-6 rounded-2xl p-6">
            <div>
              <a
                href="/templates/inventory-template.csv"
                download
                className="text-sm font-semibold text-accent hover:underline"
              >
                {ui.downloadTemplate}
              </a>
              <p className="mt-2 text-sm text-muted">
                {ui.uploadExcelHint} También puede subir el Excel de stock (재고현황).
                El orden no importa: los duplicados se actualizan y los nuevos se añaden.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                CSV YUHAN ERP, Excel Ventas o Excel Stock (.xlsx)
              </label>
              <input
                type="file"
                accept=".csv,text/csv,.xlsx,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </div>

            <Button
              type="button"
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? "Sincronizando…" : ui.uploadCsv}
            </Button>

            {error && <p className="text-sm text-red-400">{error}</p>}

            {result && (
              <div className="rounded-xl border border-border bg-surface-light p-4 text-sm">
                <p className="font-semibold text-emerald-300">{ui.syncSuccess}</p>
                {result.format && (
                  <p className="mt-1 text-muted">
                    Formato: {result.format === "stock" ? "Stock (재고현황)" : "Catálogo Ventas"}
                  </p>
                )}
                <p className="mt-2 text-muted">
                  Total: {result.total} · Nuevos: {result.added} · Actualizados:{" "}
                  {result.updated}
                </p>
                {result.matchedByOem !== undefined && result.matchedByOem > 0 && (
                  <p className="mt-1 text-muted">
                    Fusionados por OEM: {result.matchedByOem}
                  </p>
                )}
                {result.skipped !== undefined && result.skipped > 0 && (
                  <p className="mt-1 text-muted">Omitidos (SERVICIO): {result.skipped}</p>
                )}
                {result.imagesExtracted !== undefined && (
                  <p className="mt-1 text-muted">
                    {ui.imagesExtracted}: {result.imagesExtracted}
                  </p>
                )}
                {result.sheetsProcessed && (
                  <ul className="mt-2 space-y-1 text-muted">
                    {Object.entries(result.sheetsProcessed).map(([sheet, count]) => (
                      <li key={sheet}>
                        {ui.sheetsProcessed}: {sheet} — {count}
                      </li>
                    ))}
                  </ul>
                )}
                {result.errors.length > 0 && (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-red-300">
                    {result.errors.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
