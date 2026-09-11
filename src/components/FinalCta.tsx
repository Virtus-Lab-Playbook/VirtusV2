import { site } from "@/content/site";
import { Button, Container } from "./primitives";
import { Contour } from "./Contour";

export function FinalCta() {
  return (
    <section id="final-cta" className="relative overflow-hidden border-t border-shelf-dim/80 pt-32 pb-36 sm:pt-44 sm:pb-48">
      {/* mantle: protects text readability while letting the global 3D seafloor and resting Core read through */}
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_25%_100%,transparent_0%,var(--color-abyss)_80%)]" />
      <div className="absolute inset-x-0 bottom-0 opacity-35">
        <Contour />
      </div>
      <Container className="relative z-10">
        <div data-reveal>
          <div className="mb-7 flex items-center gap-4">
          <span aria-hidden className="block h-px w-10 bg-biolume" />
          <span className="readout inline-flex items-center gap-2 text-tide/90">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-biolume shadow-[0_0_8px_1px_var(--color-biolume)]"
            />
            3780 m — the floor
          </span>
        </div>
        <p className="max-w-[16ch] font-display text-[clamp(2.5rem,1.5rem+4.2vw,4.5rem)] leading-[1.03] tracking-[-0.025em] text-seaglass">
          {site.finalCta.line}
        </p>
        <div className="mt-10">
          <Button href={site.finalCta.action.href}>
            {site.finalCta.action.label}
          </Button>
        </div>
        </div>
      </Container>
    </section>
  );
}
