import { site } from "@/content/site";
import { Container, GoldRule } from "./primitives";

export function WhyUs() {
  return (
    <section id="why-us" className="scroll-mt-24 pt-24 pb-28 sm:pt-32 sm:pb-36">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[22rem_1fr] lg:gap-16">
          {/* Left: Editorial Thesis */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="mb-5 flex items-center gap-4">
              <GoldRule />
              <span className="readout inline-flex items-center gap-2 text-tide/90">
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-brass shadow-[0_0_8px_1px_rgba(200,162,74,0.4)]"
                />
                2400 m — abyssal
              </span>
            </div>
            <h2 className="text-h2 text-seaglass">{site.why.title}</h2>
          </div>

          {/* Right: Operational Principle Rows */}
          <div className="border-t border-shelf-dim/80">
            <div className="divide-y divide-shelf-dim/80">
              {site.why.points.map((point, idx) => (
                <div
                  key={point.name}
                  className="group py-8 transition-all duration-200 hover:bg-deep/20 sm:py-9"
                >
                  <div className="flex items-baseline gap-4 sm:gap-6">
                    <span className="readout shrink-0 text-brass/90 text-sm font-semibold">
                      0{idx + 1}
                    </span>
                    <div>
                      <h3 className="font-sans text-lg font-semibold text-seaglass transition-colors duration-200 group-hover:text-brass">
                        {point.name}
                      </h3>
                      <p className="mt-2.5 max-w-[50ch] text-[0.95rem] leading-relaxed text-tide">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
