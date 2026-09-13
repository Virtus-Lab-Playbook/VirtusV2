import { site } from "@/content/site";
import { getSiteUrl } from "@/lib/seo";

export function StructuredData() {
  const data = {
    "@context":
      "https://schema.org",
    "@type":
      "Organization",
    name: site.name,
    url:
      getSiteUrl().toString(),
    description:
      site.seo.description,
  };

  const json =
    JSON.stringify(data).replace(
      /</g,
      "\\u003c",
    );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: json,
      }}
    />
  );
}
