import type {
  MetadataRoute,
} from "next";
import {
  servicePillars,
} from "@/lib/services";
import {
  workProjects,
} from "@/lib/work";
import {
  getSiteUrl,
} from "@/lib/seo";

type SitemapEntry = {
  path: string;
  changeFrequency:
    | "weekly"
    | "monthly";
  priority: number;
};

export default function sitemap():
  MetadataRoute.Sitemap {
  const siteUrl =
    getSiteUrl();

  const lastModified =
    new Date();

  const staticRoutes:
    SitemapEntry[] = [
      {
        path: "/",
        changeFrequency:
          "weekly",
        priority: 1,
      },
      {
        path: "/work",
        changeFrequency:
          "monthly",
        priority: 0.9,
      },
      {
        path: "/services",
        changeFrequency:
          "monthly",
        priority: 0.9,
      },
      {
        path: "/products",
        changeFrequency:
          "monthly",
        priority: 0.8,
      },
    ];

  const projectRoutes:
    SitemapEntry[] =
      workProjects.map(
        (project) => ({
          path:
            `/work/${project.id}`,
          changeFrequency:
            "monthly",
          priority: 0.7,
        }),
      );

  const serviceRoutes:
    SitemapEntry[] =
      servicePillars.map(
        (service) => ({
          path:
            `/services/${service.slug}`,
          changeFrequency:
            "monthly",
          priority: 0.8,
        }),
      );

  return [
    ...staticRoutes,
    ...projectRoutes,
    ...serviceRoutes,
  ].map((route) => ({
    url:
      new URL(
        route.path,
        siteUrl,
      ).toString(),
    lastModified,
    changeFrequency:
      route.changeFrequency,
    priority:
      route.priority,
  }));
}
