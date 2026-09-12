import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { site } from "@/content/site";
import {
  ServiceRouteFooter,
  ServiceRouteNav,
} from "@/components/ServiceRouteChrome";
import { Container } from "@/components/primitives";
import {
  getNextService,
  getRelatedWork,
  getServiceBySlug,
  servicePillars,
} from "@/lib/services";

type ServicePageProps = {
  params: Promise<{
    service: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return servicePillars.map((service) => ({
    service: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { service: serviceSlug } =
    await params;

  const service =
    getServiceBySlug(serviceSlug);

  if (!service) {
    return {
      title: `Services — ${site.name}`,
    };
  }

  return {
    title: `${service.name} — Services — ${site.name}`,
    description: service.outcome,
  };
}

export default async function ServicePage({
  params,
}: ServicePageProps) {
  const { service: serviceSlug } =
    await params;

  const service =
    getServiceBySlug(serviceSlug);

  if (!service) {
    notFound();
  }

  const relatedWork =
    getRelatedWork(service);

  const nextService =
    getNextService(service.slug);

  return (
    <div className="min-h-screen bg-abyss text-seaglass">
      <ServiceRouteNav />

      <main>
        <section className="border-b border-shelf/55 bg-abyss pt-16 pb-14 sm:pt-24 sm:pb-18">
          <Container>
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-sm text-tide"
            >
              <Link
                href="/services"
                className="transition-colors hover:text-seaglass"
              >
                Services
              </Link>

              <span aria-hidden>/</span>

              <span className="text-seaglass">
                {service.name}
              </span>
            </nav>

            <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_19rem] lg:items-end lg:gap-16">
              <div>
                <span className="readout readout-caps text-tide">
                  Capability
                </span>

                <h1 className="mt-5 max-w-[11ch] font-display text-[clamp(3.8rem,8vw,8.5rem)] leading-[0.88] tracking-[-0.045em] text-seaglass">
                  {service.name}
                </h1>

                <p className="mt-7 max-w-[56ch] text-lg leading-relaxed text-tide sm:text-xl">
                  {service.outcome}
                </p>
              </div>

              <div className="border-t border-shelf/60 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                <span className="readout readout-caps text-tide/70">
                  Related work
                </span>

                <p className="mt-2 text-sm font-medium leading-relaxed text-seaglass">
                  {service.relatedWork}
                </p>

                <Link
                  href="/#brief"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-seaglass transition-colors hover:text-tide"
                >
                  Build your brief
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-abyss-2/96 py-16 sm:py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-20">
              <div>
                <span className="readout readout-caps text-tide">
                  Capabilities
                </span>
              </div>

              <div className="border-t border-shelf/60">
                {service.capabilities.map(
                  (capability, index) => (
                    <div
                      key={capability}
                      className="service-capability-row grid grid-cols-[3rem_1fr] gap-4 border-b border-shelf/60 py-5 sm:grid-cols-[4rem_1fr] sm:py-6"
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

        {relatedWork.length > 0 ? (
          <section className="border-y border-shelf/55 bg-abyss py-16 sm:py-24">
            <Container>
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="readout readout-caps text-tide">
                    Related work
                  </span>

                  <h2 className="mt-3 font-display text-[clamp(2.5rem,4.5vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-seaglass">
                    {service.relatedWork}
                  </h2>
                </div>

                <Link
                  href="/work"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-tide transition-colors hover:text-seaglass"
                >
                  View all work
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {relatedWork.map((project) => (
                  <Link
                    key={project.id}
                    href={`/work/${project.id}`}
                    className="service-related-work group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide"
                  >
                    <div className="service-related-work__media relative aspect-[4/3] overflow-hidden border border-shelf/60 bg-deep">
                      <Image
                        src={project.image}
                        alt={project.imageAlt}
                        fill
                        sizes="(max-width: 767px) 100vw, 50vw"
                        className="service-related-work__image object-cover"
                      />

                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-abyss/68 via-transparent to-transparent"
                      />

                      <span className="absolute left-4 top-4 border border-seaglass/20 bg-abyss/74 px-2.5 py-1.5 readout text-[0.62rem] uppercase tracking-[0.12em] text-seaglass backdrop-blur-md">
                        {project.kind}
                      </span>

                      <span className="service-related-work__action readout readout-caps text-seaglass">
                        View case study →
                      </span>
                    </div>

                    <div className="mt-4">
                      <h3 className="font-display text-[clamp(2rem,3vw,3rem)] leading-[0.95] tracking-[-0.025em] text-seaglass">
                        {project.name}
                      </h3>

                      <p className="mt-3 max-w-[48ch] text-[0.94rem] leading-relaxed text-tide">
                        {project.statement}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        ) : null}

        <section className="bg-deep-2/72 py-14 sm:py-18">
          <Container>
            <div className="grid gap-6 sm:grid-cols-[10rem_1fr] sm:gap-10">
              <span className="readout readout-caps text-tide">
                Studio model
              </span>

              <div>
                <p className="max-w-[60ch] text-lg leading-relaxed text-seaglass">
                  {site.services.closing}
                </p>

                <Link
                  href="/services"
                  className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-tide transition-colors hover:text-seaglass"
                >
                  Explore all services
                  <span
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          </Container>
        </section>

        <section className="bg-seaglass py-16 text-abyss sm:py-24">
          <Container>
            <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-deep-2">
              Next capability
            </span>

            <Link
              href={`/services/${nextService.slug}`}
              className="service-next group mt-6 grid gap-8 border-t border-deep-2/35 pt-8 md:grid-cols-[1fr_auto] md:items-end"
            >
              <div>
                <p className="font-display text-[clamp(3rem,6vw,6rem)] leading-[0.9] tracking-[-0.04em] text-abyss">
                  {nextService.name}
                </p>

                <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-deep-2">
                  {nextService.outcome}
                </p>
              </div>

              <span className="inline-flex items-center gap-2 text-sm font-semibold text-abyss">
                Explore service
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                >
                  →
                </span>
              </span>
            </Link>
          </Container>
        </section>
      </main>

      <ServiceRouteFooter />
    </div>
  );
}
