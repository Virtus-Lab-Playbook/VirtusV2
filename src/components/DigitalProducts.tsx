import Link from "next/link";
import { site } from "@/content/site";
import {
  Container,
  SectionHeader,
} from "./primitives";

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
          {site.products.families.map(
            (family, index) => (
              <Link
                key={family.id}
                href={`/products#${family.id}`}
                data-reveal
                aria-label={`Explore ${family.name}`}
                className="premium-product-family group relative block overflow-hidden border-b border-deep-2/45 py-9 outline-none md:odd:border-r md:odd:pr-10 md:even:pl-10"
              >
                <div className="mb-6 flex items-center justify-between gap-4">
                  <span className="premium-product-family__number font-mono text-xs font-medium tracking-[0.12em] text-deep-2">
                    {String(index + 1).padStart(
                      2,
                      "0",
                    )}
                  </span>

                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-deep-2">
                    Product family
                  </span>
                </div>

                <h3 className="premium-product-family__title font-display text-[clamp(1.8rem,3vw,3rem)] leading-[1] tracking-[-0.025em] text-abyss">
                  {family.name}
                </h3>

                <span className="premium-product-family__explore mt-4 inline-flex items-center gap-2 font-mono text-[0.7rem] font-medium uppercase tracking-[0.1em] text-deep-2">
                  Explore family

                  <span
                    aria-hidden
                    className="premium-product-family__arrow"
                  >
                    →
                  </span>
                </span>

                <p className="mt-4 max-w-[42ch] text-[0.95rem] leading-relaxed text-deep-2">
                  {family.desc}
                </p>

                <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-deep-2/25 pt-5">
                  {family.includes.map(
                    (item) => (
                      <span
                        key={item}
                        className="text-[0.8rem] font-medium text-abyss/80"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>
              </Link>
            ),
          )}
        </div>

        <div
          data-reveal
          className="mt-8 flex flex-col gap-5 border-l border-deep-2 pl-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="max-w-[58ch] text-sm leading-relaxed text-deep-2">
            {site.products.note}
          </p>

          <Link
            href="/products"
            className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-abyss"
          >
            View product families

            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
