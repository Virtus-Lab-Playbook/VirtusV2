import type {
  MetadataRoute,
} from "next";
import {
  getSiteUrl,
  isIndexableDeployment,
} from "@/lib/seo";

export default function robots():
  MetadataRoute.Robots {
  const siteUrl =
    getSiteUrl();

  const sitemapUrl =
    new URL(
      "/sitemap.xml",
      siteUrl,
    ).toString();

  if (
    !isIndexableDeployment()
  ) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap:
        sitemapUrl,
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
      ],
    },
    sitemap:
      sitemapUrl,
    host:
      siteUrl.origin,
  };
}
