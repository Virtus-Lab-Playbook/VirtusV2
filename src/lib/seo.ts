import type { Metadata } from "next";
import { site } from "@/content/site";

const LOCAL_SITE_URL =
  "http://localhost:3000";

function normalizeSiteUrl(
  value: string,
): URL {
  const trimmed = value
    .trim()
    .replace(/\/+$/, "");

  const withProtocol =
    /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

  return new URL(
    `${withProtocol}/`,
  );
}

export function getSiteUrl(): URL {
  const configuredUrl =
    process.env
      .VIRTUS_SITE_URL
      ?.trim();

  const vercelProductionUrl =
    process.env
      .VERCEL_PROJECT_PRODUCTION_URL
      ?.trim();

  if (configuredUrl) {
    try {
      return normalizeSiteUrl(
        configuredUrl,
      );
    } catch {
      console.warn(
        "Invalid VIRTUS_SITE_URL. Falling back to deployment/local URL.",
      );
    }
  }

  if (vercelProductionUrl) {
    try {
      return normalizeSiteUrl(
        vercelProductionUrl,
      );
    } catch {
      console.warn(
        "Invalid VERCEL_PROJECT_PRODUCTION_URL. Falling back to localhost.",
      );
    }
  }

  return new URL(
    LOCAL_SITE_URL,
  );
}

export function isIndexableDeployment(): boolean {
  const siteUrl =
    getSiteUrl();

  if (
    siteUrl.hostname ===
      "localhost" ||
    siteUrl.hostname ===
      "127.0.0.1"
  ) {
    return false;
  }

  if (
    process.env.VERCEL_ENV ===
      "preview" ||
    process.env.VERCEL_ENV ===
      "development"
  ) {
    return false;
  }

  return true;
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const siteUrl =
    getSiteUrl();

  const canonicalUrl =
    new URL(
      path,
      siteUrl,
    ).toString();

  const fullTitle =
    `${title} — ${site.name}`;

  const indexable =
    isIndexableDeployment();

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: fullTitle,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: site.name,
      images: [
        {
          url:
            "/opengraph-image",
          width: 1200,
          height: 630,
          alt:
            `${site.name} — ${site.tagline}`,
        },
      ],
    },
    twitter: {
      card:
        "summary_large_image",
      title: fullTitle,
      description,
      images: [
        "/opengraph-image",
      ],
    },
    robots: {
      index: indexable,
      follow: indexable,
    },
  };
}
