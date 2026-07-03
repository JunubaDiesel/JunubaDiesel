"use client";

import { FadeIn, Section } from "@/components/ui/Section";

const features = [
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: "Stock inmediato",
    description: "Confirmamos disponibilidad por teléfono, WhatsApp o Instagram DM.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
    title: "Envío nacional",
    description: "Paquetería para piezas pequeñas; carga express o recogida para piezas grandes.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Asesoría experta",
    description: "Compatibilidad por vehículo, año y número de pieza con precisión.",
  },
  {
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Precio justo",
    description: "Opciones nuevas y usadas adaptadas a su presupuesto.",
  },
];

export function WhyJunuba() {
  return (
    <Section
      subtitle="Por qué JUNUBA"
      title="Razones para elegirnos"
      dark
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, i) => (
          <FadeIn key={feature.title} delay={i * 0.1}>
            <div className="glass-card group h-full rounded-2xl p-6 transition-colors hover:border-accent/30">
              <div className="mb-4 inline-flex rounded-xl bg-accent/10 p-3 text-accent transition-colors group-hover:bg-accent/20">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{feature.description}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
