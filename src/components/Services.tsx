import { site } from "@/content/site";
import { Container, SectionHeader } from "./primitives";

export function Services() {
  return (
    <section id="services" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionHeader
          title={site.services.title}
          intro={site.services.intro}
          depth="0210 m — continental shelf"
        />
        {/* hairline grid, no cards */}
        <div className="grid grid-cols-1 border-t border-shelf-dim sm:grid-cols-2">
          {site.services.pillars.map((p) => (
            <div
              key={p.id}
              className="group relative border-b border-shelf-dim py-8 transition-colors duration-300 hover:bg-deep/40 sm:odd:border-r sm:odd:pr-10 sm:even:pl-10"
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 h-px w-0 bg-biolume transition-all duration-500 group-hover:w-full"
              />
              <h3 className="text-h3 font-sans font-semibold tracking-normal">
                {p.name}
              </h3>
              <p className="mt-2.5 max-w-[42ch] text-tide">{p.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
