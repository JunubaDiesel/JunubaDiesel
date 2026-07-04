import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import { pretendard } from "@/lib/fonts";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.displayName} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.displayName}`,
  },
  description: siteConfig.description,
  keywords: [
    "JUNUBA",
    "repuestos Hyundai Starex",
    "repuestos Hyundai Staria",
    "repuestos Hyundai Porter",
    "repuestos Kia Bongo",
    "motor usado",
    "repuestos comerciales",
  ],
  openGraph: {
    title: `${siteConfig.displayName} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.displayName,
    locale: "es_ES",
    type: "website",
    images: [{ url: siteConfig.logoSrc, alt: siteConfig.logoAlt }],
  },
  icons: {
    icon: siteConfig.logoSrc,
    apple: siteConfig.logoSrc,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={pretendard.variable}>
      <head>
        <LocalBusinessJsonLd />
      </head>
      <body className={`${pretendard.className} min-h-screen antialiased`}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
