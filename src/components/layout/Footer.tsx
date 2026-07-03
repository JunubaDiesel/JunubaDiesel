import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { NavLink } from "@/components/layout/NavLink";
import { navLinks, siteConfig, ui } from "@/config/site";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo size={44} href="/" className="mb-4" />
            <p className="text-sm leading-relaxed text-muted">{siteConfig.description}</p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              {ui.footerQuickLinks}
            </h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <NavLink
                    href={link.href}
                    label={link.label}
                    external={"external" in link ? link.external : false}
                    className="text-sm text-muted transition-colors hover:text-accent"
                  />
                </li>
              ))}
              <li>
                <Link
                  href="/buscar"
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {ui.buscarRepuesto}
                </Link>
              </li>
              <li>
                <Link
                  href="/parts"
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {ui.partsInStock}
                </Link>
              </li>
              <li>
                <Link
                  href="/catalog"
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {ui.catalogOem}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              {ui.footerBusiness}
            </h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>Empresa: {ui.companyName}</li>
              <li>Representante: {siteConfig.ceo}</li>
              <li>Registro comercial: {siteConfig.businessNumber}</li>
              <li>
                Dirección:{" "}
                <a
                  href={siteConfig.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent"
                >
                  {siteConfig.address}
                </a>
                <span className="block text-xs">{siteConfig.country}</span>
              </li>
              <li>
                Teléfono:
                {siteConfig.phones.map((phone) => (
                  <span key={phone} className="block">
                    {phone}
                  </span>
                ))}
              </li>
              <li>Horario: {siteConfig.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {siteConfig.displayName}. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-xs text-muted">
            <Link href="/terms" className="hover:text-accent">
              {ui.footerTerms}
            </Link>
            <Link href="/privacy" className="hover:text-accent">
              {ui.footerPrivacy}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
