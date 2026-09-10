import { site } from "@/content/site";
import { Button, Container } from "./primitives";
import { Contour } from "./Contour";
import { BabScene } from "./BabScene";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-shelf-dim bg-abyss py-24 sm:py-36">
      <BabScene />
      {/* mantle: keeps the glow alive at the edges, protects the line */}
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_30%_110%,transparent_0%,var(--color-abyss)_78%)]" />
      <div className="absolute inset-x-0 bottom-0 opacity-40">
        <Contour />
      </div>
      <Container className="relative">
        <div className="mb-8 flex items-center gap-4">
          <span aria-hidden className="block h-px w-10 bg-biolume" />
          <span className="readout">3780 m — the floor</span>
        </div>
        <p className="max-w-[16ch] font-display text-[clamp(2.5rem,1.5rem+4.2vw,4.4rem)] leading-[1.03] tracking-[-0.02em] text-seaglass">
          {site.finalCta.line}
        </p>
        <div className="mt-10">
          <Button href={site.finalCta.action.href}>
            {site.finalCta.action.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
