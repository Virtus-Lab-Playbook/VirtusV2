import { site } from "@/content/site";
import { Container, SectionHeader } from "./primitives";

export function Packages() {
  return (
    <section id="packages" className="scroll-mt-24 pt-24 pb-28 sm:pt-32 sm:pb-36">
      <Container>
        <SectionHeader
          title={site.packages.title}
          intro={site.packages.intro}
          depth="3100 m — approaching the floor"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {site.packages.tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-xl border p-7 sm:p-8 transition-all duration-200 ${
                tier.featured
                  ? "border-t-2 border-t-biolume border-shelf/90 bg-gradient-to-b from-deep/90 to-abyss-2 shadow-[0_20px_48px_-20px_rgba(49,224,190,0.18)]"
                  : "border-t-2 border-t-brass/80 border-shelf/70 bg-deep/30 hover:border-shelf hover:bg-deep/40"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-sans text-base font-semibold text-seaglass tracking-normal">
                  {tier.name}
                </h3>
                {tier.featured ? (
                  <span className="readout rounded-full border border-biolume/40 bg-biolume/10 px-2.5 py-0.5 text-[0.68rem] text-biolume font-medium">
                    most taken
                  </span>
                ) : null}
              </div>
              <p className="mt-4 font-display text-3xl sm:text-[2.2rem] leading-none text-seaglass tracking-tight">
                {tier.price}
              </p>
              <p className="mt-2 text-[0.88rem] text-tide/90 min-h-[2.5rem]">{tier.for}</p>
              <ul className="mt-6 flex flex-1 flex-col gap-3 border-t border-shelf-dim/80 pt-6 text-[0.88rem] text-tide">
                {tier.includes.map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-brass/80" />
                    <span className="leading-snug">{line}</span>
                  </li>
                ))}
              </ul>
              <a
                href={site.nav.action.href}
                className={`mt-8 inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-sm font-medium tracking-tight transition-all duration-200 active:scale-[0.98] ${
                  tier.featured
                    ? "bg-biolume text-abyss hover:bg-seaglass hover:shadow-[0_0_24px_-4px_var(--color-biolume)]"
                    : "border border-shelf bg-deep/20 text-seaglass hover:border-biolume hover:text-biolume hover:bg-deep/40"
                }`}
              >
                Build your brief
              </a>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center sm:text-left text-sm text-tide/70">
          Not sure which fits? Send a brief and we&rsquo;ll point you to the right one.
        </p>
      </Container>
    </section>
  );
}
