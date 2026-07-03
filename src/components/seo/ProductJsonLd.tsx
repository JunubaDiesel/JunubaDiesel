import { siteConfig } from "@/config/site";
import type { Part } from "@/types/part";

export function ProductJsonLd({ part }: { part: Part }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: part.name,
    description: part.description,
    sku: part.erpId,
    image: part.images.map((image) =>
      image.startsWith("http") ? image : `${siteConfig.url}${image}`
    ),
    brand: {
      "@type": "Brand",
      name: siteConfig.displayName,
    },
    offers: {
      "@type": "Offer",
      availability:
        (part.stockQty ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      priceCurrency: "DOP",
      url: `${siteConfig.url}/parts/${part.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
