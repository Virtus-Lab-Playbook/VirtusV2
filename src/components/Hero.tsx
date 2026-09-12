"use client";

import Link from "next/link";
import { useRef } from "react";
import { site } from "@/content/site";
import { useExperience } from "@/experience/ExperienceContext";
import { useExperienceMotion } from "@/experience/hooks/useExperienceMotion";
import { SECTION_DEPTHS } from "@/experience/experience-config";
import { Button, Container } from "./primitives";

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function Hero() {
  const { qualityConfig } = useExperience();
  const contentRef = useRef<HTMLDivElement>(null);

  useExperienceMotion(({ rawDepth }) => {
    const element = contentRef.current;
    if (!element) return;

    const departure = qualityConfig.isStatic
      ? 0
      : clamp01(rawDepth / Math.max(1, SECTION_DEPTHS.work * 0.72));

    element.style.opacity = String(1 - departure * 0.12);
    element.style.transform = `translate3d(0, ${departure * -12}px, 0)`;
  });

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-20 lg:pb-20"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-abyss via-abyss/86 to-transparent sm:via-abyss/64" />
      <div className="absolute inset-0 bg-gradient-to-t from-abyss via-transparent to-abyss/40" />

      <Container className="relative z-10 flex min-h-[72svh] items-center">
        <div
          ref={contentRef}
          className="max-w-[48rem] lg:max-w-[44rem]"
        >
          <div className="hero-rise hero-rise-1 mb-7 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="readout readout-caps text-tide">
              {site.hero.eyebrow}
            </span>
            <span aria-hidden className="hidden h-px w-8 bg-shelf sm:block" />
            <span className="inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-seaglass">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-tide"
              />
              {site.availability}
            </span>
          </div>

          <h1 className="hero-rise hero-rise-2 max-w-[12ch] text-display text-seaglass">
            {site.hero.headline}
          </h1>

          <p className="hero-rise hero-rise-3 mt-6 max-w-[50ch] text-base leading-relaxed text-tide sm:mt-7 sm:text-lg">
            {site.hero.body}
          </p>

          <div className="hero-rise hero-rise-4 mt-9 flex flex-wrap items-center gap-3.5 sm:mt-10">
            <Button href={site.hero.primary.href}>
              {site.hero.primary.label}
            </Button>
            <Button href={site.hero.secondary.href} variant="secondary">
              {site.hero.secondary.label}
            </Button>
          </div>

          <div className="hero-rise hero-rise-4 mt-10 border-t border-shelf/55 pt-5">
            <div className="flex flex-wrap gap-x-2 gap-y-2">
              {site.hero.disciplines.map((discipline, index) => {
                const service = site.services.pillars[index];

                return (
                  <Link
                    key={discipline}
                    href={`/services/${service.slug}`}
                    data-experience-signal="discipline"
                    data-experience-index={index}
                    aria-label={`Explore ${discipline}`}
                    className="hero-discipline readout readout-caps rounded-full border border-transparent px-3 py-2 text-tide/88 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide"
                  >
                    <span
                      aria-hidden
                      className="hero-discipline__dot"
                    />
                    {discipline}
                  </Link>
                );
              })}
            </div>
          </div>

          <a
            href="#work"
            className="hero-descent-cue mt-8 inline-flex items-center gap-3 text-tide transition-colors hover:text-seaglass"
          >
            <span className="readout readout-caps">
              Scroll to descend
            </span>

            <span
              aria-hidden
              className="hero-descent-cue__arrow"
            >
              ↓
            </span>
          </a>
        </div>
      </Container>
    </section>
  );
}
