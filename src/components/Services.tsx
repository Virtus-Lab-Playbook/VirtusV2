import Link from "next/link";
import { site } from "@/content/site";
import {
  Container,
  SectionHeader,
} from "./primitives";

export function Services() {
  return (
    <section
      id="services"
      className="services-portal-section scroll-mt-24 bg-transparent pt-16 pb-24 sm:pt-20 sm:pb-32"
    >
      <Container>
        <SectionHeader
          title={
            site.services.title
          }
          intro={
            site.services.intro
          }
          eyebrow="Capabilities"
          data-reveal
        />

        <div className="services-portal-layout">
          <div className="services-portal-list border-t border-shelf/60">
            {site.services.pillars.map(
              (
                pillar,
                index,
              ) => (
                <Link
                  key={
                    pillar.id
                  }
                  href={`/services/${pillar.slug}`}
                  data-reveal
                  data-experience-signal="service"
                  data-experience-index={
                    index
                  }
                  aria-label={`Explore ${pillar.name}`}
                  className="premium-service-row group relative grid gap-5 overflow-hidden border-b border-shelf/60 py-9 outline-none sm:grid-cols-[4.5rem_13rem_1fr] sm:gap-8 sm:py-10"
                >
                  <span
                    aria-hidden
                    className="premium-service-row__edge"
                  />

                  <span className="premium-service-row__index readout pt-1 text-tide">
                    {String(
                      index +
                        1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <h3 className="premium-service-row__title font-sans text-xl font-semibold text-seaglass sm:text-2xl">
                    {
                      pillar.name
                    }
                  </h3>

                  <div>
                    <p className="max-w-[46ch] text-[1rem] leading-relaxed text-seaglass/92">
                      {
                        pillar.outcome
                      }
                    </p>

                    <div className="mt-5 flex max-w-[48rem] flex-wrap gap-x-4 gap-y-2">
                      {pillar.capabilities.map(
                        (
                          capability,
                        ) => (
                          <span
                            key={
                              capability
                            }
                            className="premium-service-row__capability text-[0.8rem] text-tide"
                          >
                            {
                              capability
                            }
                          </span>
                        ),
                      )}
                    </div>

                    <div className="premium-service-row__related mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="readout readout-caps text-tide/70">
                        Related
                      </span>

                      <span className="text-sm font-medium text-seaglass">
                        {
                          pillar.relatedWork
                        }
                      </span>

                      <span
                        aria-hidden
                        className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-tide"
                      >
                        Explore
                        <span className="transition-transform duration-300 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              ),
            )}
          </div>

          <aside
            aria-hidden="true"
            className="service-command-portal hidden lg:block"
          >
            <div className="service-command-portal__frame">
              <div className="service-command-portal__readout">
                <span className="readout readout-caps text-tide">
                  Command Hub
                </span>

                <span className="readout text-[0.58rem] uppercase tracking-[0.12em] text-tide/65">
                  Live capability map
                </span>
              </div>

              <span className="service-command-portal__cross service-command-portal__cross--a" />
              <span className="service-command-portal__cross service-command-portal__cross--b" />

              <div className="service-command-portal__footer">
                <span className="readout text-[0.58rem] uppercase tracking-[0.12em] text-tide/60">
                  Hover a capability
                </span>

                <span className="h-px flex-1 bg-shelf/55" />

                <span className="readout text-[0.58rem] text-seaglass/70">
                  1700 m
                </span>
              </div>
            </div>
          </aside>
        </div>

        <div
          data-reveal
          className="mt-9 flex flex-col gap-5 border-l border-tide pl-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="max-w-[55ch] text-base leading-relaxed text-seaglass">
            {
              site.services
                .closing
            }
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-seaglass transition-colors hover:text-tide"
            >
              View all services

              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>

            <a
              href={
                site.nav.action
                  .href
              }
              className="group inline-flex items-center gap-2 text-sm font-semibold text-tide transition-colors hover:text-seaglass"
            >
              {
                site.nav.action
                  .label
              }

              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
