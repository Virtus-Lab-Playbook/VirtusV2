import { site } from "@/content/site";
import { Container, SectionHeader } from "./primitives";

export function WhyUs() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeader title={site.why.title} depth="2400 m — abyssal" />
        <div className="grid grid-cols-1 border-t border-shelf-dim sm:grid-cols-2">
          {site.why.points.map((point) => (
            <div
              key={point.name}
              className="group relative border-b border-shelf-dim py-8 transition-colors duration-300 hover:bg-deep/40 sm:odd:border-r sm:odd:pr-10 sm:even:pl-10"
            >
              <span
                aria-hidden
                className="absolute left-0 top-0 h-px w-0 bg-brass transition-all duration-500 group-hover:w-full"
              />
              <h3 className="font-sans text-base font-semibold tracking-normal">
                {point.name}
              </h3>
              <p className="mt-2 max-w-[44ch] text-tide">{point.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
