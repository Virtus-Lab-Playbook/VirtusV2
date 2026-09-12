import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import {
  WorkRouteFooter,
  WorkRouteNav,
} from "@/components/WorkRouteChrome";
import { Container } from "@/components/primitives";

export const metadata: Metadata = {
  title: `Work — ${site.name}`,
  description: site.work.intro,
};

export default function WorkIndexPage() {
  return (
    <div className="min-h-screen bg-abyss text-seaglass">
      <WorkRouteNav />

      <main>
        <section className="border-b border-shelf/55 bg-abyss pt-20 pb-16 sm:pt-28 sm:pb-20">
          <Container>
            <span className="readout readout-caps text-tide">
              Portfolio index
            </span>

            <h1 className="mt-4 max-w-[12ch] font-display text-[clamp(3.5rem,8vw,8rem)] leading-[0.9] tracking-[-0.04em] text-seaglass">
              {site.work.title}
            </h1>

            <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-tide sm:text-lg">
              {site.work.intro}
            </p>

            <p className="mt-4 max-w-[66ch] text-sm leading-relaxed text-tide/70">
              {site.work.note}
            </p>
          </Container>
        </section>

        <section className="bg-abyss-2/96 py-16 sm:py-24">
          <Container>
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:gap-x-10 lg:gap-y-18">
              {site.work.projects.map(
                (project, index) => (
                  <article
                    key={project.id}
                    className="work-index-card group"
                  >
                    <Link
                      href={`/work/${project.id}`}
                      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide"
                    >
                      <div className="work-index-card__media relative aspect-[4/3] overflow-hidden border border-shelf/60 bg-deep">
                        <Image
                          src={project.image}
                          alt={project.imageAlt}
                          fill
                          sizes="(max-width: 767px) 100vw, 50vw"
                          className="work-index-card__image object-cover"
                        />

                        <div
                          aria-hidden
                          className="absolute inset-0 bg-gradient-to-t from-abyss/68 via-transparent to-transparent"
                        />

                        <div className="absolute left-4 top-4 border border-seaglass/20 bg-abyss/74 px-2.5 py-1.5 backdrop-blur-md">
                          <span className="readout text-[0.62rem] uppercase tracking-[0.12em] text-seaglass">
                            {project.kind}
                          </span>
                        </div>

                        <div className="work-index-card__action">
                          <span className="readout readout-caps text-seaglass">
                            View case study →
                          </span>
                        </div>

                        <span className="absolute bottom-3 right-3 readout text-[0.58rem] text-seaglass/70">
                          {project.visualCredit}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-4 border-t border-shelf/55 pt-4 sm:grid-cols-[3rem_1fr]">
                        <span className="readout text-tide">
                          {String(index + 1).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <div>
                          <p className="readout readout-caps text-tide/80">
                            {project.pillar}
                          </p>

                          <h2 className="mt-2 font-display text-[clamp(2rem,3.2vw,3.3rem)] leading-[0.95] tracking-[-0.025em] text-seaglass">
                            {project.name}
                          </h2>

                          <p className="mt-3 max-w-[48ch] text-[0.95rem] leading-relaxed text-tide">
                            {project.statement}
                          </p>
                        </div>
                      </div>
                    </Link>

                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-tide transition-colors hover:text-seaglass"
                      >
                        Visit live site
                        <span aria-hidden>↗</span>
                      </a>
                    ) : null}
                  </article>
                ),
              )}
            </div>
          </Container>
        </section>

        <section className="border-t border-shelf/55 bg-abyss py-20 sm:py-28">
          <Container>
            <div className="max-w-[52rem]">
              <span className="readout readout-caps text-tide">
                Start a project
              </span>

              <p className="mt-4 font-display text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] tracking-[-0.03em] text-seaglass">
                Have something worth building?
              </p>

              <Link
                href="/#brief"
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-seaglass px-6 py-3 text-sm font-semibold text-abyss transition-all duration-200 hover:-translate-y-0.5 hover:bg-tide active:translate-y-0 active:scale-[0.98]"
              >
                Build your brief
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <WorkRouteFooter />
    </div>
  );
}
