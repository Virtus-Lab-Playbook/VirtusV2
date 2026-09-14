import { site } from "@/content/site";

export const servicePillars =
  site.services.pillars;

export type ServicePillar =
  (typeof servicePillars)[number];

export function getServiceBySlug(
  slug: string,
): ServicePillar | undefined {
  return servicePillars.find(
    (service) => service.slug === slug,
  );
}

export function getNextService(
  slug: string,
): ServicePillar {
  const index = servicePillars.findIndex(
    (service) => service.slug === slug,
  );

  if (index < 0) {
    return servicePillars[0];
  }

  return servicePillars[
    (index + 1) % servicePillars.length
  ];
}

export function getRelatedWork(
  service: ServicePillar,
) {
  return site.work.projects.filter(
    (project) =>
      project.pillar === service.name,
  );
}
