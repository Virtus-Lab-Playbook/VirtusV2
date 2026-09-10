import { site } from "@/content/site";
import { Container, SectionHeader } from "./primitives";

export function Packages() {
  return (
    <section id="packages" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionHeader
          title={site.packages.title}
          intro={site.packages.intro}
          depth="3100 m — approaching the floor"
        />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {site.packages.tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-lg border border-t-2 p-7 transition-all duration-300 hover:-translate-y-1 ${
                tier.featured
                  ? "border-t-biolume bg-deep shadow-[0_18px_50px_-22px_var(--color-biolume)]"
                  : "border-t-brass bg-transparent hover:border-shelf"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-sans text-base font-semibold tracking-normal">
                  {tier.name}
                </h3>
                {tier.featured ? (
                  <span className="readout rounded-full border border-biolume/40 bg-biolume/10 px-2.5 py-1 text-biolume">
                    most taken
                  </span>
                ) : null}
              </div>
              <p className="mt-4 font-display text-[1.75rem] leading-none text-seaglass">
                {tier.price}
              </p>
              <p className="mt-2 text-sm text-tide">{tier.for}</p>
              <ul className="mt-6 flex flex-1 flex-col gap-2.5 border-t border-shelf-dim pt-5 text-sm text-tide">
                {tier.includes.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-brass" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <a
                href={site.nav.action.href}
                className={`mt-7 inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm transition-all duration-300 ${
                  tier.featured
                    ? "bg-biolume font-medium text-abyss hover:bg-seaglass hover:shadow-[0_0_24px_-6px_var(--color-biolume)]"
                    : "border border-shelf text-seaglass hover:border-biolume hover:text-biolume"
                }`}
              >
                Build your brief
              </a>
            </div>
          ))}
        </div>
        <p className="mt-7 text-sm text-tide/70">
          Not sure which fits? Send a brief and we&rsquo;ll point you to the right one.
        </p>
      </Container>
    </section>
  );
}
