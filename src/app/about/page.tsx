import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conozca JUNUBA Corea Diesel, especialistas en repuestos comerciales en República Dominicana",
};

export default function AboutPage() {
  return (
    <div className="gradient-mesh pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent">Nosotros</p>
        <h1 className="mb-6 text-3xl font-bold md:text-4xl">JUNUBA Corea Diesel</h1>
        <div className="space-y-6 text-muted leading-relaxed">
          <p>
            {siteConfig.displayName} es una empresa especializada en repuestos nuevos y usados para
            vehículos comerciales Hyundai Starex, Hyundai Staria, Hyundai Porter y Kia Bongo en{" "}
            {siteConfig.country}.
          </p>
          <p>
            Combinamos stock local, experiencia técnica y acceso a proveedores en Corea del Sur para
            ofrecer motores, transmisiones, carrocería y piezas OEM con verificación de número de
            pieza y compatibilidad por VIN.
          </p>
          <p>
            Nuestro almacén en Santo Domingo permite confirmar disponibilidad, preparar pedidos y
            coordinar envíos a talleres, flotas y clientes finales en todo el país.
          </p>
        </div>
        <Link href="/contact" className="mt-10 inline-block font-semibold text-accent hover:underline">
          Contactar al equipo →
        </Link>
      </div>
    </div>
  );
}
