import { site } from "@/content/site";
import { Container, SectionHeader } from "./primitives";

export function Process() {
  return (
    <section id="process" className="scroll-mt-24 py-24 sm:py-32">
      <Container>
        <SectionHeader
          title={site.process.title}
          intro={site.process.intro}
          depth="1200 m — the descent"
        />
        <ol className="border-t border-shelf-dim">
          {site.process.steps.map((step, i) => (
            <li
              key={step.name}
              className="group grid grid-cols-[2.5rem_1fr] gap-5 border-b border-shelf-dim py-8 transition-colors duration-300 hover:bg-deep/40 sm:grid-cols-[4rem_1fr] sm:gap-8"
            >
              <span className="font-display text-2xl leading-none text-brass transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-3xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-h3 font-sans font-semibold tracking-normal">
                  {step.name}
                </h3>
                <p className="mt-2 max-w-[52ch] text-tide">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
