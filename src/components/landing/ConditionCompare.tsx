"use client";

import { FadeIn, Section } from "@/components/ui/Section";

const comparisons = [
  {
    type: "new" as const,
    title: "Repuestos nuevos",
    color: "border-trust/40 bg-trust/5",
    accent: "text-blue-400",
    items: [
      "Piezas originales, OEM o reacondicionadas",
      "Garantía disponible según producto",
      "Ideal para talleres y flotas",
      "Uso prolongado y mayor confianza",
    ],
  },
  {
    type: "used" as const,
    title: "Repuestos usados",
    color: "border-accent/40 bg-accent/5",
    accent: "text-orange-400",
    items: [
      "Precio competitivo y excelente relación valor",
      "Inspección básica antes del desmontaje",
      "Motores, transmisiones, carrocería y más",
      "Verificación de VIN y número de pieza obligatoria",
    ],
  },
];

export function ConditionCompare() {
  return (
    <Section
      id="specs"
      subtitle="Nuevo vs usado"
      title="Repuestos nuevos y usados"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {comparisons.map((item, i) => (
          <FadeIn key={item.type} delay={i * 0.15}>
            <div className={`rounded-2xl border p-8 ${item.color}`}>
              <h3 className={`mb-6 text-2xl font-bold ${item.accent}`}>{item.title}</h3>
              <ul className="space-y-4">
                {item.items.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-muted">
                    <svg
                      className={`mt-0.5 h-5 w-5 shrink-0 ${item.accent}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
