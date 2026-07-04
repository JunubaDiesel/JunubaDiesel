import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig, ui } from "@/config/site";
import { telHref } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Solicite cotización de repuestos para Starex, Staria, Porter y Bongo",
};

interface ContactPageProps {
  searchParams: Promise<{
    vehicle?: string;
    category?: string;
    oem?: string;
    message?: string;
  }>;
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;

  return (
    <div className="gradient-mesh pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">
            Contacto
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">Cotización y consulta de stock</h1>
          <p className="mt-4 max-w-2xl text-muted">
            Complete el formulario o contáctenos directamente. Respondemos lo antes posible en horario
            comercial.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <ContactForm
            prefill={{
              vehicle: params.vehicle,
              category: params.category,
              oem: params.oem,
              message: params.message,
            }}
          />

          <aside className="glass-card space-y-4 rounded-2xl p-6 text-sm text-muted">
            <h2 className="text-lg font-bold text-foreground">Información directa</h2>
            <p>
              Teléfono:
              {siteConfig.phones.map((phone) => (
                <span key={phone} className="block">
                  <a href={telHref(phone)} className="text-accent hover:underline">
                    {phone}
                    {phone === siteConfig.officePhone ? " (Oficina)" : ""}
                  </a>
                </span>
              ))}
            </p>
            <p>
              Correo:
              {siteConfig.emails.map((address) => (
                <span key={address} className="block">
                  <a href={`mailto:${address}`} className="text-accent hover:underline">
                    {address}
                  </a>
                </span>
              ))}
            </p>
            <p>Horario: {siteConfig.hours}</p>
            <p>Dirección: {siteConfig.address}</p>
            <a href={siteConfig.whatsapp} className="inline-block font-semibold text-accent hover:underline">
              {ui.contactWhatsApp} →
            </a>
          </aside>
        </div>
      </div>
    </div>
  );
}
