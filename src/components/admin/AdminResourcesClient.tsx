"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ui, vehicleLabels, type VehicleId } from "@/config/site";
import { adminFetch } from "@/lib/admin-fetch";
import { resourceTypeLabels } from "@/lib/resource-labels";
import type { Resource, ResourceType, ResourceVehicle } from "@/types/resource";

const emptyForm = (): Omit<Resource, "slug"> & { slug?: string } => ({
  id: "",
  type: "tip",
  title: "",
  description: "",
  vehicle: "all",
  url: "",
  youtubeId: "",
  videoSrc: "",
  posterSrc: "",
  sourceUrl: "",
  tags: [],
  publishedAt: new Date().toISOString(),
  featured: false,
});

export function AdminResourcesClient() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadResources = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/resources");
      if (!res.ok) {
        setError("No autorizado");
        return;
      }
      setResources(await res.json());
      setError(null);
    } catch {
      setError("Error al cargar recursos");
    }
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const resetForm = () => {
    setForm(emptyForm());
    setEditingId(null);
    setTagsInput("");
  };

  const handleEdit = (resource: Resource) => {
    setEditingId(resource.id);
    setForm({ ...resource });
    setTagsInput(resource.tags.join(", "));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      tags: tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      youtubeId: form.youtubeId?.trim() || undefined,
    };

    try {
      const res = await adminFetch("/api/admin/resources", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al guardar");
        return;
      }
      resetForm();
      await loadResources();
    } catch {
      setError("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar este recurso?")) return;
    setSaving(true);
    try {
      const res = await adminFetch(`/api/admin/resources?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("Error al eliminar");
        return;
      }
      if (editingId === id) resetForm();
      await loadResources();
    } catch {
      setError("Error al eliminar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="gradient-mesh min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/admin" className="text-sm text-accent hover:underline">
          ← Administración
        </Link>
        <h1 className="mb-2 mt-4 text-3xl font-bold">Recursos</h1>
        <p className="mb-8 text-muted">
          Guías, videos y artículos visibles en{" "}
          <Link href="/recursos" className="text-accent hover:underline">
            /recursos
          </Link>
        </p>

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <form onSubmit={handleSubmit} className="glass-card mb-10 rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-bold">
            {editingId ? "Editar recurso" : "Nuevo recurso"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm">Título</label>
              <input
                required
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                className="w-full rounded-xl border border-border bg-surface-light px-4 py-2.5 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm">Descripción</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                className="w-full rounded-xl border border-border bg-surface-light px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Tipo</label>
              <select
                value={form.type}
                onChange={(event) =>
                  setForm({ ...form, type: event.target.value as ResourceType })
                }
                className="w-full rounded-xl border border-border bg-surface-light px-4 py-2.5 text-sm"
              >
                {(Object.keys(resourceTypeLabels) as ResourceType[]).map((type) => (
                  <option key={type} value={type}>
                    {resourceTypeLabels[type]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm">Vehículo</label>
              <select
                value={form.vehicle}
                onChange={(event) =>
                  setForm({ ...form, vehicle: event.target.value as ResourceVehicle })
                }
                className="w-full rounded-xl border border-border bg-surface-light px-4 py-2.5 text-sm"
              >
                <option value="all">General</option>
                {(Object.keys(vehicleLabels) as VehicleId[]).map((id) => (
                  <option key={id} value={id}>
                    {vehicleLabels[id]}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm">URL</label>
              <input
                required
                value={form.url}
                onChange={(event) => setForm({ ...form, url: event.target.value })}
                placeholder="https://youtube.com/... o /recursos/slug"
                className="w-full rounded-xl border border-border bg-surface-light px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">YouTube ID (opcional)</label>
              <input
                value={form.youtubeId ?? ""}
                onChange={(event) => setForm({ ...form, youtubeId: event.target.value })}
                placeholder="dQw4w9WgXcQ"
                className="w-full rounded-xl border border-border bg-surface-light px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Video URL (opcional)</label>
              <input
                value={form.videoSrc ?? ""}
                onChange={(event) => setForm({ ...form, videoSrc: event.target.value })}
                placeholder="/videos/delga/xxx.mp4 o Blob URL"
                className="w-full rounded-xl border border-border bg-surface-light px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Poster URL (opcional)</label>
              <input
                value={form.posterSrc ?? ""}
                onChange={(event) => setForm({ ...form, posterSrc: event.target.value })}
                placeholder="/videos/delga/xxx.jpg"
                className="w-full rounded-xl border border-border bg-surface-light px-4 py-2.5 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm">Fuente YouTube (opcional)</label>
              <input
                value={form.sourceUrl ?? ""}
                onChange={(event) => setForm({ ...form, sourceUrl: event.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-xl border border-border bg-surface-light px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Tags (coma)</label>
              <input
                value={tagsInput}
                onChange={(event) => setTagsInput(event.target.value)}
                className="w-full rounded-xl border border-border bg-surface-light px-4 py-2.5 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                id="featured"
                type="checkbox"
                checked={form.featured ?? false}
                onChange={(event) => setForm({ ...form, featured: event.target.checked })}
              />
              <label htmlFor="featured" className="text-sm">
                Destacado en landing
              </label>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button type="submit" disabled={saving}>
              {editingId ? "Actualizar" : "Crear"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            )}
          </div>
        </form>

        <div className="space-y-3">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface-light p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold">{resource.title}</p>
                <p className="text-xs text-muted">
                  {resourceTypeLabels[resource.type]} · {resource.slug}
                  {resource.featured && " · Destacado"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => handleEdit(resource)}>
                  Editar
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => handleDelete(resource.id)}
                >
                  {ui.remove}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
