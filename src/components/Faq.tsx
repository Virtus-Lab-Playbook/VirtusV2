import { site } from "@/content/site";
import { Container, SectionHeader } from "./primitives";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 pt-20 pb-24 sm:pt-28 sm:pb-32">
      <Container>
        <SectionHeader title={site.faq.title} depth="3600 m — near floor" />
        <div className="border-t border-shelf-dim/80">
          {site.faq.items.map((item) => (
            <details
              key={item.q}
              className="group border-b border-shelf-dim/80 py-5 transition-colors duration-200 hover:bg-deep/20 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-2 py-1 text-[1.04rem] font-medium text-seaglass transition-colors duration-200 hover:text-biolume focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-biolume">
                <span>{item.q}</span>
                <span
                  aria-hidden
                  className="relative h-3 w-3 shrink-0 text-brass/90 transition-transform duration-200"
                >
                  <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-current" />
                  <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-200 group-open:rotate-90 group-open:opacity-0" />
                </span>
              </summary>
              <p className="mt-3.5 max-w-[62ch] px-2 text-[0.95rem] leading-relaxed text-tide">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
