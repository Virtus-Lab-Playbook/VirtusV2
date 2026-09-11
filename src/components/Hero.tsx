import { site } from "@/content/site";
import { Button } from "./primitives";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[92vh] items-center overflow-hidden"
    >
      {/* grading mantle — scene reads through, text stays legible */}
      <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/70 to-transparent sm:via-abyss/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-abyss/30" />

      <div className="relative z-10 mx-auto w-full max-w-[74rem] px-5 py-28 sm:px-8 lg:pl-[calc(var(--rail-w)+2rem)] lg:pr-10">
        <div className="max-w-[46rem]">
          <div className="hero-rise hero-rise-1 mb-8 inline-flex items-center gap-3 rounded-full border border-shelf bg-deep/50 px-4 py-1.5 backdrop-blur-sm">
            <span aria-hidden className="block h-px w-6 bg-brass" />
            <span className="font-display text-base italic text-brass">
              {site.tagline}
            </span>
          </div>

          <h1 className="hero-rise hero-rise-2 text-display">
            {site.hero.headline}
          </h1>

          <p className="hero-rise hero-rise-3 mt-7 max-w-[52ch] text-lg leading-relaxed text-tide">
            {site.hero.body}
          </p>

          <div className="hero-rise hero-rise-4 mt-10 flex flex-wrap items-center gap-3">
            <Button href={site.hero.primary.href}>{site.hero.primary.label}</Button>
            <Button href={site.hero.secondary.href} variant="secondary">
              {site.hero.secondary.label}
            </Button>
          </div>
        </div>
      </div>

      {/* HUD — the sonar station placard */}
      <div className="absolute bottom-6 right-6 hidden items-end gap-6 sm:flex">
        <span className="readout pb-0.5">{site.hero.coords}</span>
        <span className="flex flex-col items-center gap-1.5">
          <span aria-hidden className="h-2 w-2 rounded-full bg-biolume shadow-[0_0_12px_1px_var(--color-biolume)]" />
          <span className="readout-caps readout text-biolume">live</span>
        </span>
      </div>
    </section>
  );
}
