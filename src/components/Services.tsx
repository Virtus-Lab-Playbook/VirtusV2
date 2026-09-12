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
      className="scroll-mt-24 bg-abyss-2/96 pt-16 pb-24 sm:pt-20 sm:pb-32"
    >
      <Container>
        <SectionHeader
          title={site.services.title}
          intro={site.services.intro}
          eyebrow="Capabilities"
          data-reveal
        />

        <div className="border-t border-shelf/60">
          {site.services.pillars.map(
            (pillar, index) => (
              <Link
                key={pillar.id}
                href={`/services/${pillar.slug}`}
                data-reveal
                data-experience-signal="service"
                data-experience-index={index}
                aria-label={`Explore ${pillar.name}`}
                className="premium-service-row group relative grid gap-5 overflow-hidden border-b border-shelf/60 py-9 outline-none sm:grid-cols-[4.5rem_13rem_1fr] sm:gap-8 sm:py-10 lg:grid-cols-[5rem_17rem_1fr_auto]"
              >
                <span
                  aria-hidden
                  className="premium-service-row__edge"
                />

                <span className="premium-service-row__index readout pt-1 text-tide">
                  {String(index + 1).padStart(
                    2,
                    "0",
                  )}
                </span>

                <h3 className="premium-service-row__title font-sans text-xl font-semibold text-seaglass sm:text-2xl">
                  {pillar.name}
                </h3>

                <div>
                  <p className="max-w-[46ch] text-[1rem] leading-relaxed text-seaglass/92">
                    {pillar.outcome}
                  </p>

                  <div className="mt-5 flex max-w-[48rem] flex-wrap gap-x-4 gap-y-2">
                    {pillar.capabilities.map(
                      (capability) => (
                        <span
                          key={capability}
                          className="premium-service-row__capability text-[0.8rem] text-tide"
                        >
                          {capability}
                        </span>
                      ),
                    )}
                  </div>
                </div>

                <div className="premium-service-row__related self-end pt-1 lg:text-right">
                  <span className="readout readout-caps text-tide/70">
                    Related work
                  </span>

                  <p className="mt-1 text-sm font-medium text-seaglass">
                    {pillar.relatedWork}
                  </p>

                  <span
                    aria-hidden
                    className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-tide"
                  >
                    Explore service
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ),
          )}
        </div>

        <div
          data-reveal
          className="mt-9 flex flex-col gap-5 border-l border-tide pl-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="max-w-[55ch] text-base leading-relaxed text-seaglass">
            {site.services.closing}
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
              href={site.nav.action.href}
              className="group inline-flex items-center gap-2 text-sm font-semibold text-tide transition-colors hover:text-seaglass"
            >
              {site.nav.action.label}
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
