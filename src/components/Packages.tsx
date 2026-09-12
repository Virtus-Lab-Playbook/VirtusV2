import { site } from "@/content/site";
import { Container, SectionHeader } from "./primitives";

export function Engagements() {
  return (
    <section
      id="engagements"
      className="scroll-mt-24 bg-shelf pt-20 pb-12 text-seaglass sm:pt-24 sm:pb-14"
    >
      <Container>
        <SectionHeader
          title={site.engagements.title}
          intro={site.engagements.intro}
          eyebrow="Engagement models"
          data-reveal
        />

        <div className="grid border-y border-seaglass/25 md:grid-cols-3 md:divide-x md:divide-seaglass/25">
          {site.engagements.models.map((model, index) => (
            <article
              key={model.name}
              data-reveal
              data-experience-signal="package"
              data-experience-index={index}
              className="premium-engagement group relative flex flex-col overflow-hidden border-b border-seaglass/25 py-8 last:border-b-0 md:border-b-0 md:px-7 md:first:pl-0 md:last:pr-0"
            >
              <span
                aria-hidden
                className="premium-engagement__wash"
              />

              <span className="font-mono text-xs tracking-[0.12em] text-seaglass/70">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="mt-5 font-display text-3xl leading-none text-seaglass sm:text-[2.4rem]">
                {model.name}
              </h3>

              <p className="mt-4 min-h-[3.25rem] max-w-[28ch] text-[0.95rem] leading-relaxed text-seaglass/88">
                {model.summary}
              </p>

              <div className="mt-7 flex-1 border-t border-seaglass/20 pt-5">
                <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-seaglass/65">
                  Good for
                </span>
                <ul className="mt-4 space-y-2.5 text-sm text-seaglass/90">
                  {model.goodFor.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-[0.65rem] h-px w-3 shrink-0 bg-seaglass/65"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={site.nav.action.href}
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-seaglass"
              >
                {site.nav.action.label}
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
            </article>
          ))}
        </div>

        <p
          data-reveal
          className="mt-7 max-w-[62ch] text-sm leading-relaxed text-seaglass/78"
        >
          {site.engagements.note}
        </p>
      </Container>
    </section>
  );
}
