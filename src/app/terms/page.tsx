import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Términos de servicio",
};

export default function TermsPage() {
  return (
    <div className="gradient-mesh pt-24 pb-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-3xl font-bold">Términos de servicio</h1>
        <div className="space-y-4 text-sm leading-relaxed text-muted">
          <p>
            {siteConfig.displayName} ofrece información de catálogo, stock y cotización de repuestos
            automotrices con fines comerciales en {siteConfig.country}.
          </p>
          <p>
            Los precios, disponibilidad y tiempos de entrega se confirman por teléfono, WhatsApp o
            correo electrico al momento de la consulta.
          </p>
          <p>
            Las piezas usadas pueden tener desgaste normal. Se recomienda verificar número OEM, VIN y
            compatibilidad antes de la instalación.
          </p>
          <p>
            El uso del sitio implica aceptar que la información publicada puede cambiar sin previo aviso
            según sincronización de inventario.
          </p>
        </div>
      </div>
    </div>
  );
}
