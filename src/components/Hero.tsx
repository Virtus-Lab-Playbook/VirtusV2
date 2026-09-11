import { site } from "@/content/site";
import { Button } from "./primitives";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[92vh] sm:min-h-[96vh] items-center overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28 lg:pt-16 lg:pb-16"
    >
      {/* grading mantle — scene reads through, text stays strictly legible */}
      <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/75 to-transparent sm:via-abyss/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-abyss/30" />

      <div className="relative z-10 mx-auto w-full max-w-[74rem] px-5 sm:px-8 lg:pl-[calc(var(--rail-w)+2rem)] lg:pr-10">
        <div className="max-w-[46rem] lg:max-w-[44rem]">
          <div className="hero-rise hero-rise-1 mb-7 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-biolume/30 bg-biolume/10 px-3 py-1 text-[0.72rem] tracking-wider text-biolume uppercase font-medium backdrop-blur-md shadow-sm">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-biolume shadow-[0_0_8px_1px_var(--color-biolume)] animate-pulse"
              />
              <span>{site.availability}</span>
            </div>

            <div className="inline-flex items-center gap-2.5 rounded-full border border-shelf/80 bg-deep/60 px-3.5 py-1 backdrop-blur-md shadow-sm">
              <span aria-hidden className="block h-px w-4 bg-brass" />
              <span className="font-display text-xs sm:text-sm italic text-brass tracking-wide">
                {site.tagline}
              </span>
            </div>
          </div>

          <h1 className="hero-rise hero-rise-2 text-display text-seaglass">
            {site.hero.headline}
          </h1>

          <p className="hero-rise hero-rise-3 mt-6 sm:mt-7 max-w-[46ch] text-base sm:text-lg leading-relaxed text-tide/90">
            {site.hero.body}
          </p>

          <div className="hero-rise hero-rise-4 mt-9 sm:mt-10 flex flex-wrap items-center gap-3.5">
            <Button href={site.hero.primary.href}>{site.hero.primary.label}</Button>
            <Button href={site.hero.secondary.href} variant="secondary">
              {site.hero.secondary.label}
            </Button>
          </div>
        </div>
      </div>

      {/* HUD — the sonar station telemetry placard */}
      <div className="absolute bottom-6 right-6 hidden items-center gap-5 sm:flex rounded-full border border-shelf-dim/70 bg-abyss-2/75 px-4 py-1.5 backdrop-blur-sm">
        <span className="readout text-tide/80">{site.hero.coords}</span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="h-2 w-2 rounded-full bg-biolume shadow-[0_0_10px_2px_var(--color-biolume)] animate-pulse" />
          <span className="readout-caps readout text-biolume text-[0.66rem]">live</span>
        </span>
      </div>
    </section>
  );
}
