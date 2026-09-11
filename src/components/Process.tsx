import { site } from "@/content/site";
import { Container, SectionHeader } from "./primitives";

export function Process() {
  return (
    <section id="process" className="scroll-mt-24 pt-16 pb-24 sm:pt-20 sm:pb-32">
      <Container>
        <SectionHeader
          title={site.process.title}
          intro={site.process.intro}
          depth="1200 m — the descent"
          data-reveal
        />
        <div className="relative border-t border-shelf-dim/80">
          <ol className="divide-y divide-shelf-dim/80">
            {site.process.steps.map((step, i) => (
              <li
                key={step.name}
                data-experience-signal="process"
                data-experience-index={i}
                className="group relative grid grid-cols-[2.5rem_1fr] gap-6 py-8 transition-all duration-200 hover:bg-deep/25 sm:grid-cols-[4.5rem_1fr] sm:gap-10 sm:py-9"
              >
                <div className="flex flex-col items-start pt-0.5">
                  <span className="font-display text-2xl sm:text-3xl font-normal leading-none text-brass transition-transform duration-200 group-hover:-translate-y-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="readout mt-2 text-[0.62rem] text-tide/75 tracking-wider">
                    PHASE
                  </span>
                </div>
                <div>
                  <h3 className="text-h3 font-sans font-semibold text-seaglass transition-colors duration-200 group-hover:text-biolume">
                    {step.name}
                  </h3>
                  <p className="mt-2.5 max-w-[54ch] text-[0.95rem] leading-relaxed text-tide">
                    {step.desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
