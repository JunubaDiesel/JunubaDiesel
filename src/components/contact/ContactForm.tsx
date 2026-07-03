"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { siteConfig, ui } from "@/config/site";
import { useToast } from "@/context/ToastContext";

export function ContactForm() {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

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
        window.open(data.url, "_blank", "noopener,noreferrer");
        showToast("Redirigido a WhatsApp — envíe su consulta allí.");
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

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-4 rounded-2xl p-6">
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
          defaultValue={siteConfig.email.includes("@") ? "" : ""}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block font-medium">Vehículo / Año</span>
        <input name="vehicle" placeholder="Ej: Starex 2013" className="w-full rounded-lg border border-border bg-background px-4 py-2.5" />
      </label>
      <label className="block text-sm">
        <span className="mb-2 block font-medium">Mensaje</span>
        <textarea
          name="message"
          required
          rows={5}
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
