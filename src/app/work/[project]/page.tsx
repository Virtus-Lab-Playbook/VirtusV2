import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import {
  WorkRouteFooter,
  WorkRouteNav,
} from "@/components/WorkRouteChrome";
import { Container } from "@/components/primitives";
import {
  getNextWorkProject,
  getWorkProject,
  workProjects,
} from "@/lib/work";

type ProjectPageProps = {
  params: Promise<{
    project: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return workProjects.map((project) => ({
    project: project.id,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { project: projectId } = await params;
  const project = getWorkProject(projectId);

  if (!project) {
    return {
      title: `Work — ${site.name}`,
    };
  }

  return {
    title: `${project.name} — Work — ${site.name}`,
    description: project.statement,
  };
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { project: projectId } = await params;

  const project = getWorkProject(projectId);

  if (!project) {
    notFound();
  }

  const nextProject =
    getNextWorkProject(project.id);

  return (
    <div className="min-h-screen bg-abyss text-seaglass">
      <WorkRouteNav />

      <main>
        <section className="border-b border-shelf/55 bg-abyss pt-16 pb-12 sm:pt-24 sm:pb-16">
          <Container>
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-sm text-tide"
            >
              <Link
                href="/work"
                className="transition-colors hover:text-seaglass"
              >
                Work
              </Link>
              <span aria-hidden>/</span>
              <span className="text-seaglass">
                {project.name}
              </span>
            </nav>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-end lg:gap-16">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="readout readout-caps text-tide">
                    {project.pillar}
                  </span>

                  <span
                    aria-hidden
                    className="h-px w-8 bg-shelf"
                  />

                  <span className="readout readout-caps text-seaglass/72">
                    {project.kind}
                  </span>
                </div>

                <h1 className="mt-5 max-w-[12ch] font-display text-[clamp(3.8rem,8vw,8.5rem)] leading-[0.88] tracking-[-0.045em] text-seaglass">
                  {project.name}
                </h1>

                <p className="mt-7 max-w-[58ch] text-lg leading-relaxed text-tide sm:text-xl">
                  {project.statement}
                </p>
              </div>

              <div className="border-t border-shelf/60 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                <span className="readout readout-caps text-tide/70">
                  Project type
                </span>
                <p className="mt-2 text-sm font-medium text-seaglass">
                  {project.kind}
                </p>

                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-seaglass transition-colors hover:text-tide"
                  >
                    Visit live site
                    <span aria-hidden>↗</span>
                  </a>
                ) : null}
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-abyss-2/96 py-8 sm:py-12">
          <Container>
            <div className="case-study-hero__media relative aspect-[16/9] overflow-hidden border border-shelf/60 bg-deep">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1180px"
                className="case-study-hero__image object-cover"
              />

              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-abyss/35 via-transparent to-transparent"
              />

              <span className="absolute bottom-4 right-4 border border-seaglass/16 bg-abyss/72 px-2.5 py-1.5 readout text-[0.6rem] text-seaglass/72 backdrop-blur-md">
                {project.visualCredit}
              </span>
            </div>
          </Container>
        </section>

        <section className="bg-abyss py-16 sm:py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-20">
              <div>
                <span className="readout readout-caps text-tide">
                  Capabilities
                </span>
              </div>

              <div className="border-t border-shelf/60">
                {project.capabilities.map(
                  (capability, index) => (
                    <div
                      key={capability}
                      className="grid grid-cols-[3rem_1fr] gap-4 border-b border-shelf/60 py-5 sm:grid-cols-[4rem_1fr] sm:py-6"
                    >
                      <span className="readout text-tide/70">
                        {String(index + 1).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <p className="text-lg font-medium text-seaglass sm:text-xl">
                        {capability}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </Container>
        </section>

        <section className="border-y border-shelf/55 bg-deep-2/72 py-12 sm:py-16">
          <Container>
            <div className="grid gap-5 sm:grid-cols-[10rem_1fr] sm:gap-10">
              <span className="readout readout-caps text-tide">
                Disclosure
              </span>

              <p className="max-w-[62ch] text-base leading-relaxed text-seaglass/88">
                {site.work.note}
              </p>
            </div>
          </Container>
        </section>

        <section className="bg-seaglass py-16 text-abyss sm:py-24">
          <Container>
            <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-deep-2">
              Next project
            </span>

            <Link
              href={`/work/${nextProject.id}`}
              className="case-study-next group mt-6 grid gap-8 border-t border-deep-2/35 pt-8 md:grid-cols-[1fr_20rem] md:items-end"
            >
              <div>
                <p className="font-display text-[clamp(3rem,6vw,6rem)] leading-[0.9] tracking-[-0.04em] text-abyss">
                  {nextProject.name}
                </p>

                <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-deep-2">
                  {nextProject.statement}
                </p>

                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-abyss">
                  View next case study
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </span>
              </div>

              <div className="case-study-next__media relative aspect-[4/3] overflow-hidden border border-deep-2/30">
                <Image
                  src={nextProject.image}
                  alt={nextProject.imageAlt}
                  fill
                  sizes="20rem"
                  className="case-study-next__image object-cover"
                />
              </div>
            </Link>
          </Container>
        </section>
      </main>

      <WorkRouteFooter />
    </div>
  );
}
