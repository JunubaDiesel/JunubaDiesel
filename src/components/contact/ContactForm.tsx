"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { categoryLabels, ui, type CategoryId } from "@/config/site";
import { useToast } from "@/context/ToastContext";
import {
  buildContactMessageFromOems,
  openExternalUrl,
  resolveContactVehicleLabel,
} from "@/lib/contact-url";

export interface ContactFormPrefill {
  vehicle?: string;
  category?: string;
  oem?: string;
  message?: string;
}

interface ContactFormProps {
  prefill?: ContactFormPrefill;
}

export function ContactForm({ prefill }: ContactFormProps) {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const initialVehicle = useMemo(
    () => resolveContactVehicleLabel(prefill?.vehicle),
    [prefill?.vehicle]
  );

  const initialMessage = useMemo(() => {
    if (prefill?.message) return prefill.message;
    const oems = prefill?.oem
      ?.split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    if (oems?.length) {
      return buildContactMessageFromOems(oems, prefill?.category);
    }
    if (prefill?.category) {
      const label = categoryLabels[prefill.category as CategoryId] ?? prefill.category;
      return `Consulta sobre categoría: ${label}`;
    }
    return "";
  }, [prefill?.category, prefill?.message, prefill?.oem]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      email: String(formData.get("email") ?? ""),
      vehicle: String(formData.get("vehicle") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        showToast(data.error ?? ui.contactError);
        return;
      }
      if (data.fallback === "whatsapp" && data.url) {
        if (!openExternalUrl(data.url)) {
          showToast(ui.popupBlocked);
        } else {
          showToast("Redirigido a WhatsApp — envíe su consulta allí.");
        }
        event.currentTarget.reset();
        return;
      }
      showToast(ui.contactSuccess);
      event.currentTarget.reset();
    } catch {
      showToast(ui.contactError);
    } finally {
      setSubmitting(false);
    }
  };

  const formKey = `${prefill?.vehicle ?? ""}-${prefill?.category ?? ""}-${prefill?.oem ?? ""}`;

  return (
    <form
      key={formKey}
      onSubmit={handleSubmit}
      className="glass-card space-y-4 rounded-2xl p-6"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-2 block font-medium">Nombre</span>
          <input name="name" required className="w-full rounded-lg border border-border bg-background px-4 py-2.5" />
        </label>
        <label className="block text-sm">
          <span className="mb-2 block font-medium">Teléfono</span>
          <input name="phone" required className="w-full rounded-lg border border-border bg-background px-4 py-2.5" />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-2 block font-medium">Correo</span>
        <input
          name="email"
          type="email"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block font-medium">Vehículo / Año</span>
        <input
          name="vehicle"
          defaultValue={initialVehicle}
          placeholder="Ej: Starex 2013"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block font-medium">Mensaje</span>
        <textarea
          name="message"
          required
          rows={5}
          defaultValue={initialMessage}
          placeholder="Indique repuesto, OEM o VIN"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
      </label>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Enviando..." : ui.contactSubmit}
      </Button>
    </form>
  );
}
