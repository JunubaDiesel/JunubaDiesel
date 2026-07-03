"use client";

import { FadeIn, Section } from "@/components/ui/Section";
import { siteConfig } from "@/config/site";

const highlights = [
  {
    title: "Especialistas comerciales",
    description:
      "Más de 1.000 repuestos para Hyundai Starex, Staria, Porter y Kia Bongo en República Dominicana.",
  },
  {
    title: "Suministro Corea → RD",
    description:
      "Red de proveedores en Corea del Sur y almacén local en Santo Domingo para entrega rápida.",
  },
  {
    title: "Nuevo y usado",
    description:
      "Motores, transmisiones, carrocería y piezas OEM con verificación de número de pieza y VIN.",
  },
  {
    title: "Atención directa",
    description:
      "Cotización por teléfono, WhatsApp o correo con confirmación de stock en tiempo real.",
  },
];

export function AboutJunuba() {
  return (
    <Section id="about" subtitle="Nosotros" title="JUNUBA Corea Diesel">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <FadeIn>
          <p className="mb-6 text-lg leading-relaxed text-muted">
            {siteConfig.displayName} es su socio de confianza en repuestos para vehículos
            comerciales en {siteConfig.country}. Combinamos experiencia técnica, stock local y
            acceso a piezas desde Corea para talleres, flotas y propietarios particulares.
          </p>
          <p className="leading-relaxed text-muted">
            Nuestro almacén en La Guayiga permite confirmar disponibilidad, preparar pedidos y
            coordinar envíos a todo el país con el respaldo de un equipo especializado en
            Starex, Staria, Porter y Bongo.
          </p>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2">
          {highlights.map((item, index) => (
            <FadeIn key={item.title} delay={index * 0.08}>
              <div className="glass-card h-full rounded-2xl p-5">
                <h3 className="mb-2 font-bold text-accent">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{item.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}
