import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";
import {
  ServiceRouteFooter,
  ServiceRouteNav,
} from "@/components/ServiceRouteChrome";
import { Container } from "@/components/primitives";

export const metadata: Metadata = {
  title: `Services — ${site.name}`,
  description: site.services.intro,
};

export default function ServicesIndexPage() {
  return (
    <div className="min-h-screen bg-abyss text-seaglass">
      <ServiceRouteNav />

      <main>
        <section className="border-b border-shelf/55 bg-abyss pt-20 pb-16 sm:pt-28 sm:pb-20">
          <Container>
            <span className="readout readout-caps text-tide">
              Capabilities
            </span>

            <h1 className="mt-4 max-w-[11ch] font-display text-[clamp(3.5rem,8vw,8rem)] leading-[0.9] tracking-[-0.04em] text-seaglass">
              {site.services.title}
            </h1>

            <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-tide sm:text-lg">
              {site.services.intro}
            </p>
          </Container>
        </section>

        <section className="bg-abyss-2/96 py-14 sm:py-20">
          <Container>
            <div className="border-t border-shelf/60">
              {site.services.pillars.map(
                (service, index) => (
                  <Link
                    key={service.id}
                    href={`/services/${service.slug}`}
                    className="service-index-row group relative grid gap-5 overflow-hidden border-b border-shelf/60 py-8 outline-none sm:grid-cols-[4rem_15rem_1fr_auto] sm:gap-8 sm:py-10"
                  >
                    <span
                      aria-hidden
                      className="service-index-row__edge"
                    />

                    <span className="service-index-row__index readout pt-1 text-tide">
                      {String(index + 1).padStart(
                        2,
                        "0",
                      )}
                    </span>

                    <h2 className="service-index-row__title font-display text-[clamp(2rem,3.2vw,3.4rem)] leading-[0.95] tracking-[-0.025em] text-seaglass">
                      {service.name}
                    </h2>

                    <div>
                      <p className="max-w-[48ch] text-[0.98rem] leading-relaxed text-seaglass/90">
                        {service.outcome}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                        {service.capabilities
                          .slice(0, 4)
                          .map((capability) => (
                            <span
                              key={capability}
                              className="text-[0.78rem] text-tide"
                            >
                              {capability}
                            </span>
                          ))}
                      </div>
                    </div>

                    <span className="service-index-row__arrow self-end text-lg text-tide">
                      →
                    </span>
                  </Link>
                ),
              )}
            </div>
          </Container>
        </section>

        <section className="border-t border-shelf/55 bg-abyss py-18 sm:py-24">
          <Container>
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <span className="readout readout-caps text-tide">
                  Coordinated studio
                </span>

                <p className="mt-4 max-w-[42rem] font-display text-[clamp(2.3rem,4vw,4.5rem)] leading-[0.96] tracking-[-0.03em] text-seaglass">
                  {site.services.closing}
                </p>
              </div>

              <Link
                href="/#brief"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-seaglass px-6 py-3 text-sm font-semibold text-abyss transition-all duration-200 hover:-translate-y-0.5 hover:bg-tide active:translate-y-0 active:scale-[0.98]"
              >
                Build your brief
              </Link>
            </div>
          </Container>
        </section>
      </main>

      <ServiceRouteFooter />
    </div>
  );
}
