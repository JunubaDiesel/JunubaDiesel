import { siteConfig } from "@/config/site";

export function LocalBusinessJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AutoPartsStore",
    name: `${siteConfig.displayName} Corea Diesel`,
    url: siteConfig.url,
    image: `${siteConfig.url}${siteConfig.logoSrc}`,
    telephone: [...siteConfig.phones],
    email: [...siteConfig.emails],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressCountry: "DO",
    },
    areaServed: "DO",
    openingHours: "Mo-Fr 08:30-17:30, Sa 08:30-13:30",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.displayName,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/buscar?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
