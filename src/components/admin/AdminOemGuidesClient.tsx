"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { categoryLabels, ui, vehicleLabels, type CategoryId, type VehicleId } from "@/config/site";
import { adminFetch } from "@/lib/admin-fetch";
import type { OemGuideEntry } from "@/types/oem-guide";

const vehicleIds: VehicleId[] = ["starex", "staria", "porter", "bongo"];
const categoryIds = Object.keys(categoryLabels) as CategoryId[];

export function AdminOemGuidesClient() {
  const [guides, setGuides] = useState<OemGuideEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [vehicleId, setVehicleId] = useState<VehicleId>("starex");
  const [categoryId, setCategoryId] = useState<CategoryId>("engine");
  const [oemNumber, setOemNumber] = useState("");
  const [name, setName] = useState("");
  const [sectionTitle, setSectionTitle] = useState("");

  const loadGuides = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/oem-guides");
      if (!res.ok) {
        setError("No autorizado");
        return;
      }
      setGuides(await res.json());
      setError(null);
    } catch {
      setError("Error al cargar guías OEM");
    }
  }, []);

  useEffect(() => {
    loadGuides();
  }, [loadGuides]);

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await adminFetch("/api/admin/oem-guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId,
          categoryId,
          sectionTitle: sectionTitle || undefined,
          oemNumber,
          name,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al guardar");
        return;
      }
      setOemNumber("");
      setName("");
      await loadGuides();
    } catch {
      setError("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (guideId: string, oem: string) => {
    if (!window.confirm(`¿Eliminar OEM ${oem}?`)) return;
    setSaving(true);
    try {
      const res = await adminFetch(
        `/api/admin/oem-guides?guideId=${encodeURIComponent(guideId)}&oem=${encodeURIComponent(oem)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        setError("Error al eliminar");
        return;
      }
      await loadGuides();
    } finally {
      setSaving(false);
    }
  };

  const handleCsvUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSaving(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await adminFetch("/api/admin/oem-guides", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error CSV");
        return;
      }
      await loadGuides();
    } catch {
      setError("Error CSV");
    } finally {
      setSaving(false);
      event.target.value = "";
    }
  };

  return (
    <div className="gradient-mesh min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="text-sm text-accent hover:underline">
          ← Administración
        </Link>
        <h1 className="mb-2 mt-4 text-3xl font-bold">Guías OEM</h1>
        <p className="mb-8 text-muted">
          Piezas frecuentes por vehículo en la página de inicio — enlazan a{" "}
          <Link href="/contact?vehicle=starex" className="text-accent hover:underline">
            /contact
          </Link>
        </p>

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <form onSubmit={handleAdd} className="glass-card mb-8 space-y-4 rounded-2xl p-6">
          <h2 className="text-lg font-bold">Añadir pieza OEM</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm">Vehículo</label>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value as VehicleId)}
                className="w-full rounded-xl border border-border bg-surface-light px-4 py-2.5 text-sm"
              >
                {vehicleIds.map((id) => (
                  <option key={id} value={id}>
                    {vehicleLabels[id]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm">Categoría</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value as CategoryId)}
                className="w-full rounded-xl border border-border bg-surface-light px-4 py-2.5 text-sm"
              >
                {categoryIds.map((id) => (
                  <option key={id} value={id}>
                    {categoryLabels[id]}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm">Título sección (opcional)</label>
              <input
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-light px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">OEM</label>
              <input
                required
                value={oemNumber}
                onChange={(e) => setOemNumber(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-light px-4 py-2.5 font-mono text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Nombre</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface-light px-4 py-2.5 text-sm"
              />
            </div>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Guardando…" : "Añadir"}
          </Button>
        </form>

        <div className="glass-card mb-8 rounded-2xl p-6">
          <h2 className="mb-3 text-lg font-bold">Importar CSV</h2>
          <p className="mb-3 text-sm text-muted">
            Columnas: vehicleId, categoryId, oemNumber, name
          </p>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleCsvUpload}
            className="text-sm text-muted file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
        </div>

        <div className="space-y-6">
          {guides.map((guide) => (
            <div key={guide.id} className="glass-card rounded-2xl p-6">
              <h3 className="font-bold">
                {vehicleLabels[guide.vehicleId]}
                {guide.variantId && (
                  <span className="ml-2 text-sm font-normal text-muted">{guide.variantId}</span>
                )}
              </h3>
              {guide.sections.map((section) => (
                <div key={section.categoryId + section.title} className="mt-4">
                  <p className="text-sm font-semibold text-accent">{section.title}</p>
                  <ul className="mt-2 space-y-2">
                    {section.parts.map((part) => (
                      <li
                        key={part.oemNumber}
                        className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                      >
                        <span>
                          <span className="font-mono text-accent">{part.oemNumber}</span> —{" "}
                          {part.name}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDelete(guide.id, part.oemNumber)}
                        >
                          {ui.remove}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
