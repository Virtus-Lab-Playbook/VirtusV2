import { site } from "@/content/site";

export const workProjects = site.work.projects;

export type WorkProject = (typeof workProjects)[number];

export function getWorkProject(
  projectId: string,
): WorkProject | undefined {
  return workProjects.find(
    (project) => project.id === projectId,
  );
}

export function getNextWorkProject(
  projectId: string,
): WorkProject {
  const index = workProjects.findIndex(
    (project) => project.id === projectId,
  );

  if (index < 0) {
    return workProjects[0];
  }

  return workProjects[(index + 1) % workProjects.length];
}
