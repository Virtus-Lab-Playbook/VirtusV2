import { site } from "@/content/site";
import { Container, SectionHeader } from "./primitives";

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 pt-20 pb-28 sm:pt-28 sm:pb-36">
      <Container>
        <SectionHeader
          title={site.services.title}
          intro={site.services.intro}
          depth="0210 m — continental shelf"
        />
        {/* structured capability matrix */}
        <div className="grid grid-cols-1 border-t border-shelf-dim/80 sm:grid-cols-2">
          {site.services.pillars.map((p, idx) => (
            <div
              key={p.id}
              className="group relative border-b border-shelf-dim/80 py-9 transition-all duration-200 hover:bg-deep/30 sm:odd:border-r sm:odd:pr-12 sm:even:pl-12"
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 h-px w-0 bg-biolume transition-all duration-400 group-hover:w-full"
              />
              <div className="mb-3 flex items-center justify-between">
                <span className="readout text-biolume/80">P-0{idx + 1}</span>
                <span className="readout text-tide/50 text-[0.68rem] tracking-wider">
                  STUDIO PRACTICE
                </span>
              </div>
              <h3 className="text-h3 font-sans font-semibold text-seaglass transition-colors duration-200 group-hover:text-biolume">
                {p.name}
              </h3>
              <p className="mt-3 max-w-[42ch] text-[0.95rem] leading-relaxed text-tide">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
