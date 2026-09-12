import { site } from "@/content/site";
import { Button, Container } from "./primitives";

export function FinalCta() {
  return (
    <section
      id="final-cta"
      className="scroll-mt-24 bg-seaglass py-28 text-abyss sm:py-40"
    >
      <Container>
        <div data-reveal className="final-cta-arrival max-w-[64rem]">
          <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-deep-2">
            {site.finalCta.eyebrow}
          </span>

          <span
            aria-hidden
            className="final-cta-arrival__rule mt-5 block h-px bg-deep-2/45"
          />

          <p className="final-cta-arrival__line mt-6 max-w-[14ch] font-display text-[clamp(3rem,7vw,7.2rem)] leading-[0.94] tracking-[-0.035em] text-abyss">
            {site.finalCta.line}
          </p>

          <p className="final-cta-arrival__subline mt-3 font-display text-[clamp(2.1rem,4vw,4.4rem)] italic leading-[1] text-deep-2">
            {site.finalCta.subline}
          </p>

          <div className="final-cta-arrival__action mt-10">
            <Button href={site.finalCta.action.href} variant="inverse">
              {site.finalCta.action.label}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
