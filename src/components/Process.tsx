import { site } from "@/content/site";
import { Container, SectionHeader } from "./primitives";

export function Process() {
  return (
    <section
      id="process"
      className="scroll-mt-24 bg-abyss-2/96 py-24 sm:py-32"
    >
      <Container>
        <SectionHeader
          title={site.process.title}
          intro={site.process.intro}
          eyebrow="Process"
          data-reveal
        />

        <ol className="border-t border-shelf/60">
          {site.process.steps.map((step, index) => (
            <li
              key={step.name}
              data-reveal
              data-experience-signal="process"
              data-experience-index={index}
              tabIndex={0}
              className="premium-process-row group relative grid grid-cols-[3.5rem_1fr] gap-5 border-b border-shelf/60 py-8 outline-none sm:grid-cols-[5rem_13rem_1fr] sm:gap-8 sm:py-9"
            >
              <span
                aria-hidden
                className="premium-process-row__progress"
              />

              <div>
                <span className="premium-process-row__number font-display text-2xl leading-none text-tide sm:text-3xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="readout mt-2 block text-[0.62rem] uppercase tracking-[0.12em] text-tide/70">
                  Phase
                </span>
              </div>

              <h3 className="premium-process-row__title font-sans text-xl font-semibold text-seaglass sm:text-2xl">
                {step.name}
              </h3>

              <p className="premium-process-row__copy max-w-[52ch] text-[0.95rem] leading-relaxed text-tide">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
