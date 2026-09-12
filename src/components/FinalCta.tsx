import { site } from "@/content/site";
import {
  Button,
  Container,
} from "./primitives";

export function FinalCta() {
  return (
    <section
      id="final-cta"
      className="final-docking-section scroll-mt-24 bg-transparent py-28 text-abyss sm:py-40"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-center lg:gap-16">
          <div
            data-reveal
            className="final-cta-arrival max-w-[64rem]"
          >
            <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-deep-2">
              {
                site.finalCta
                  .eyebrow
              }
            </span>

            <span
              aria-hidden
              className="final-cta-arrival__rule mt-5 block h-px bg-deep-2/45"
            />

            <p className="final-cta-arrival__line mt-6 max-w-[14ch] font-display text-[clamp(3rem,7vw,7.2rem)] leading-[0.94] tracking-[-0.035em] text-abyss">
              {
                site.finalCta
                  .line
              }
            </p>

            <p className="final-cta-arrival__subline mt-3 font-display text-[clamp(2.1rem,4vw,4.4rem)] italic leading-[1] text-deep-2">
              {
                site.finalCta
                  .subline
              }
            </p>

            <div className="final-cta-arrival__action mt-10">
              <Button
                href={
                  site.finalCta
                    .action
                    .href
                }
                variant="inverse"
              >
                {
                  site.finalCta
                    .action
                    .label
                }
              </Button>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="final-docking-window hidden lg:block"
          >
            <span className="readout readout-caps text-seaglass">
              Floor calibration
            </span>

            <div className="final-docking-window__dial">
              <span />
              <span />
              <span />
            </div>

            <div className="mt-auto flex items-center gap-3">
              <span className="h-px flex-1 bg-tide/45" />

              <span className="readout text-[0.62rem] text-seaglass">
                3800 m
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
