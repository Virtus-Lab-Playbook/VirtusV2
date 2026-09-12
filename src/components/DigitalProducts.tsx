import { site } from "@/content/site";
import { Container, SectionHeader } from "./primitives";

export function DigitalProducts() {
  return (
    <section
      id="products"
      className="scroll-mt-24 bg-seaglass py-24 text-abyss sm:py-32"
    >
      <Container>
        <SectionHeader
          title={site.products.title}
          intro={site.products.intro}
          eyebrow={site.products.eyebrow}
          light
          data-reveal
        />

        <div className="grid border-t border-deep-2/45 md:grid-cols-2">
          {site.products.families.map((family, index) => (
            <article
              key={family.id}
              data-reveal
              tabIndex={0}
              className="premium-product-family group relative overflow-hidden border-b border-deep-2/45 py-9 outline-none md:odd:border-r md:odd:pr-10 md:even:pl-10"
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <span className="premium-product-family__number font-mono text-xs font-medium tracking-[0.12em] text-deep-2">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-deep-2">
                  Product family
                </span>
              </div>

              <h3 className="premium-product-family__title font-display text-[clamp(1.8rem,3vw,3rem)] leading-[1] tracking-[-0.025em] text-abyss">
                {family.name}
              </h3>

              <span
                aria-hidden
                className="premium-product-family__arrow mt-4 inline-block font-mono text-sm text-deep-2"
              >
                ↗
              </span>

              <p className="mt-4 max-w-[42ch] text-[0.95rem] leading-relaxed text-deep-2">
                {family.desc}
              </p>

              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-deep-2/25 pt-5">
                {family.includes.map((item) => (
                  <span
                    key={item}
                    className="text-[0.8rem] font-medium text-abyss/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        <p
          data-reveal
          className="mt-8 max-w-[58ch] border-l border-deep-2 pl-5 text-sm leading-relaxed text-deep-2"
        >
          {site.products.note}
        </p>
      </Container>
    </section>
  );
}
