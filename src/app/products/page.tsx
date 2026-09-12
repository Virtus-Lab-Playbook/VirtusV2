import Link from "next/link";
import { site } from "@/content/site";
import {
  ProductRouteFooter,
  ProductRouteNav,
} from "@/components/ProductRouteChrome";
import { Container } from "@/components/primitives";
import { createPageMetadata } from "@/lib/seo";

export const metadata =
  createPageMetadata({
    title:
      "Digital Products",
    description:
      site.products.intro,
    path: "/products",
  });

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-seaglass text-abyss">
      <ProductRouteNav />

      <main>
        <section
          id="product-top"
          className="border-b border-deep-2/25 bg-seaglass pt-20 pb-16 sm:pt-28 sm:pb-20"
        >
          <Container>
            <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-deep-2">
              {site.products.eyebrow}
            </span>

            <h1 className="mt-4 max-w-[13ch] font-display text-[clamp(3.5rem,8vw,8rem)] leading-[0.9] tracking-[-0.04em] text-abyss">
              {site.products.title}
            </h1>

            <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-deep-2 sm:text-lg">
              {site.products.intro}
            </p>

            <p className="mt-5 max-w-[58ch] border-l border-deep-2 pl-5 text-sm leading-relaxed text-deep-2">
              {site.products.note}
            </p>
          </Container>
        </section>

        <section className="bg-seaglass py-14 sm:py-20">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[13rem_1fr] lg:gap-16">
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <span className="font-mono text-[0.68rem] font-medium uppercase tracking-[0.12em] text-deep-2/70">
                    Product families
                  </span>

                  <nav
                    aria-label="Product families"
                    className="mt-5 flex flex-col border-t border-deep-2/25"
                  >
                    {site.products.families.map(
                      (family, index) => (
                        <a
                          key={family.id}
                          href={`#${family.id}`}
                          className="product-family-index group flex items-center gap-3 border-b border-deep-2/25 py-3 text-sm text-deep-2 transition-colors hover:text-abyss"
                        >
                          <span className="font-mono text-[0.65rem] tabular-nums opacity-60">
                            {String(index + 1).padStart(
                              2,
                              "0",
                            )}
                          </span>

                          <span>
                            {family.name}
                          </span>

                          <span
                            aria-hidden
                            className="ml-auto opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                          >
                            →
                          </span>
                        </a>
                      ),
                    )}
                  </nav>
                </div>
              </aside>

              <div className="border-t border-deep-2/30">
                {site.products.families.map(
                  (family, index) => (
                    <article
                      key={family.id}
                      id={family.id}
                      className="product-family-section scroll-mt-24 border-b border-deep-2/30 py-12 sm:py-16"
                    >
                      <div className="grid gap-8 sm:grid-cols-[4rem_1fr] sm:gap-8">
                        <span className="product-family-section__number font-display text-3xl leading-none text-deep-2/65 sm:text-4xl">
                          {String(index + 1).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <span className="font-mono text-[0.66rem] font-medium uppercase tracking-[0.12em] text-deep-2/70">
                              Product family
                            </span>

                            <a
                              href="#product-top"
                              className="font-mono text-[0.64rem] font-medium uppercase tracking-[0.1em] text-deep-2/65 transition-colors hover:text-abyss"
                            >
                              Back to top ↑
                            </a>
                          </div>

                          <h2 className="product-family-section__title mt-4 max-w-[12ch] font-display text-[clamp(2.8rem,5vw,5.4rem)] leading-[0.92] tracking-[-0.035em] text-abyss">
                            {family.name}
                          </h2>

                          <p className="mt-5 max-w-[50ch] text-[1rem] leading-relaxed text-deep-2 sm:text-lg">
                            {family.desc}
                          </p>

                          <div className="mt-8 grid gap-px border border-deep-2/25 bg-deep-2/25 sm:grid-cols-2">
                            {family.includes.map(
                              (item, itemIndex) => (
                                <div
                                  key={item}
                                  className="product-family-feature flex min-h-20 items-center gap-4 bg-seaglass px-5 py-4"
                                >
                                  <span className="font-mono text-[0.64rem] tabular-nums text-deep-2/55">
                                    {String(
                                      itemIndex + 1,
                                    ).padStart(
                                      2,
                                      "0",
                                    )}
                                  </span>

                                  <span className="text-sm font-semibold text-abyss">
                                    {item}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>

                          <div
                            aria-hidden
                            className="product-family-diagram mt-10"
                          >
                            <span />
                            <span />
                            <span />
                            <span />
                          </div>
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>
            </div>
          </Container>
        </section>

        <section className="border-t border-deep-2/25 bg-abyss py-18 text-seaglass sm:py-24">
          <Container>
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <span className="readout readout-caps text-tide">
                  Virtus products
                </span>

                <p className="mt-4 max-w-[46rem] font-display text-[clamp(2.4rem,4.5vw,4.8rem)] leading-[0.95] tracking-[-0.03em] text-seaglass">
                  {site.products.title}
                </p>

                <p className="mt-5 max-w-[56ch] text-base leading-relaxed text-tide">
                  {site.products.note}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-shelf/80 px-6 py-3 text-sm font-semibold text-seaglass transition-colors hover:border-tide hover:bg-deep-2"
                >
                  Explore services
                </Link>

                <Link
                  href="/#brief"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-seaglass px-6 py-3 text-sm font-semibold text-abyss transition-all duration-200 hover:-translate-y-0.5 hover:bg-tide active:translate-y-0 active:scale-[0.98]"
                >
                  Build your brief
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <ProductRouteFooter />
    </div>
  );
}
