"use client";

import { Button } from "@/components/ui/Button";
import { FadeIn, Section } from "@/components/ui/Section";
import { siteConfig, ui } from "@/config/site";
import { telHref } from "@/lib/contact";

export function ContactCTA() {
  return (
    <Section
      id="contact"
      subtitle="Contacto"
      title="Cotización y consulta de stock"
      dark
    >
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface-light to-surface p-8 md:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-trust/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-6 text-lg text-muted">
                Indíquenos el repuesto, vehículo, año y VIN para confirmar stock
                y precio lo antes posible.
              </p>
              <ul className="space-y-3 text-sm text-muted">
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <span>
                    {siteConfig.phones.map((phone) => (
                      <span key={phone} className="block">
                        <a href={telHref(phone)} className="hover:text-accent">
                          {phone}
                          {phone === siteConfig.officePhone ? " · Oficina" : ""}
                        </a>
                      </span>
                    ))}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-trust/10 text-trust">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span>
                    {siteConfig.emails.map((address) => (
                      <span key={address} className="block">
                        <a href={`mailto:${address}`} className="hover:text-accent">
                          {address}
                        </a>
                      </span>
                    ))}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-trust/10 text-trust">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  {siteConfig.hours}
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span>
                    <span className="block">{siteConfig.address}</span>
                    <span className="block text-xs">{siteConfig.country}</span>
                    <a
                      href={siteConfig.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs font-medium text-accent hover:underline"
                    >
                      {ui.viewOnGoogleMaps} →
                    </a>
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col justify-center gap-4">
              <Button href={telHref(siteConfig.phone)} size="lg">
                Llamar · {siteConfig.phone}
              </Button>
              <Button href={siteConfig.whatsapp} external variant="secondary" size="lg">
                {ui.contactWhatsApp}
              </Button>
              <Button href={`mailto:${siteConfig.email}`} external variant="outline" size="lg">
                {siteConfig.emails[0]}
              </Button>
              <Button href={`mailto:${siteConfig.emails[1]}`} external variant="outline" size="lg">
                {siteConfig.emails[1]}
              </Button>
              <Button href={siteConfig.instagram} external variant="outline" size="lg">
                Instagram DM
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>
    </Section>
  );
}
