import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
};

export default function PrivacyPage() {
  return (
    <div className="gradient-mesh pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold">Política de privacidad</h1>
        <div className="space-y-4 text-sm leading-relaxed text-muted">
          <p>
            {siteConfig.displayName} recopila datos de contacto (nombre, teléfono, correo y mensaje)
            únicamente para responder consultas comerciales y cotizaciones.
          </p>
          <p>
            No vendemos ni compartimos datos personales con terceros, salvo obligación legal o
            proveedores necesarios para operar el sitio (hosting, correo, analítica).
          </p>
          <p>
            Puede solicitar corrección o eliminación de sus datos escribiendo a {siteConfig.email}.
          </p>
          <p>
            El sitio puede usar cookies técnicas y analíticas para mejorar rendimiento y experiencia
            de navegación.
          </p>
        </div>
      </div>
    </div>
  );
}
