"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { useExperience } from "@/experience/ExperienceContext";
import { Container, GoldRule } from "./primitives";

const WORK_START_DEPTH = 1600;
const WORK_NEXT_SECTION_DEPTH = 2400;

/**
 * Finish horizontal travel before the sticky stage releases.
 * The remaining pinned distance becomes a short visual hold on the final project.
 */
const TRACK_COMPLETE_BEFORE_RELEASE = 0.9;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

type WorkMetrics = {
  travel: number;
  trackEndDepth: number;
};

const initialMetrics: WorkMetrics = {
  travel: 0,
  trackEndDepth: 2080,
};

export function Work() {
  const { rawDepth } = useExperience();

  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [metrics, setMetrics] = useState<WorkMetrics>(initialMetrics);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!section || !sticky || !viewport || !track) return;

    const measure = () => {
      const cards = Array.from(
        track.querySelectorAll<HTMLElement>("[data-work-card]"),
      );

      const lastCard = cards.at(-1);

      /*
       * Do not use scrollWidth - clientWidth here.
       *
       * We want the final project to reach the same lead position as the first
       * project, not merely become fully contained at the right edge.
       */
      const nextTravel = lastCard
        ? Math.max(0, lastCard.offsetLeft)
        : Math.max(0, track.scrollWidth - viewport.clientWidth);

      /*
       * The global depth system maps 1600 -> 2400 between #work and #why-us.
       *
       * A sticky child stops being pinned before the section itself ends:
       *
       * sticky scroll distance = sectionHeight - stickyHeight
       *
       * Convert that physical release point back into the same depth interval,
       * then complete the horizontal rail slightly before release so the final
       * project receives a brief dwell.
       */
      const sectionHeight = Math.max(1, section.offsetHeight);
      const stickyHeight = Math.min(
        sectionHeight,
        Math.max(1, sticky.offsetHeight),
      );

      const pinnedFraction = clamp01(
        (sectionHeight - stickyHeight) / sectionHeight,
      );

      const releaseDepth =
        WORK_START_DEPTH +
        (WORK_NEXT_SECTION_DEPTH - WORK_START_DEPTH) * pinnedFraction;

      const nextTrackEndDepth =
        WORK_START_DEPTH +
        (releaseDepth - WORK_START_DEPTH) *
          TRACK_COMPLETE_BEFORE_RELEASE;

      setMetrics((current) => {
        if (
          Math.abs(current.travel - nextTravel) < 0.5 &&
          Math.abs(current.trackEndDepth - nextTrackEndDepth) < 0.5
        ) {
          return current;
        }

        return {
          travel: nextTravel,
          trackEndDepth: nextTrackEndDepth,
        };
      });
    };

    measure();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(measure);

    observer.observe(section);
    observer.observe(sticky);
    observer.observe(viewport);
    observer.observe(track);

    return () => {
      observer.disconnect();
    };
  }, []);

  const depthSpan = Math.max(
    1,
    metrics.trackEndDepth - WORK_START_DEPTH,
  );

  const progress = clamp01(
    (rawDepth - WORK_START_DEPTH) / depthSpan,
  );

  const translateX = metrics.travel * progress;
  const projectCount = site.work.projects.length;

  const activeIndex = Math.min(
    projectCount - 1,
    Math.max(0, Math.round(progress * (projectCount - 1))),
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-labelledby="work-title"
      className="work-showcase relative scroll-mt-24"
    >
      <div ref={stickyRef} className="work-showcase__sticky">
        <Container className="flex h-full min-h-0 flex-col pt-16 pb-6 sm:pt-20 sm:pb-8">
          <header
            data-reveal
            className="flex shrink-0 items-end justify-between gap-8"
          >
            <div className="max-w-[48rem]">
              <div className="mb-3 flex items-center gap-4">
                <GoldRule />
                <span className="readout inline-flex items-center gap-2 text-tide/90">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full bg-biolume shadow-[0_0_8px_1px_var(--color-biolume)]"
                  />
                  1600 m — bathypelagic
                </span>
              </div>

              <h2
                id="work-title"
                className="font-display text-[clamp(2.7rem,5.4vw,5.4rem)] leading-[0.92] tracking-[-0.035em] text-seaglass"
              >
                {site.work.title}
              </h2>

              <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-tide sm:text-base">
                {site.work.intro}
              </p>
            </div>

            <div
              className="hidden shrink-0 items-baseline gap-2 pb-1 md:flex"
              aria-label={`Project ${activeIndex + 1} of ${projectCount}`}
            >
              <span className="font-mono text-2xl font-semibold tabular-nums text-biolume">
                {formatIndex(activeIndex)}
              </span>
              <span className="readout text-tide/55">/</span>
              <span className="readout tabular-nums text-tide/75">
                {String(projectCount).padStart(2, "0")}
              </span>
            </div>
          </header>

          <div
            ref={viewportRef}
            className="work-showcase__viewport mt-6 min-h-0 flex-1 sm:mt-7"
          >
            <div
              ref={trackRef}
              className="work-showcase__track"
              style={{
                transform: `translate3d(${-translateX}px, 0, 0)`,
              }}
            >
              {site.work.projects.map((project, index) => (
                <article
                  key={project.id}
                  data-work-card
                  data-experience-signal="work"
                  data-experience-index={index}
                  className="work-showcase__card group"
                >
                  <div className="work-showcase__media">
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes="(max-width: 767px) 86vw, (max-width: 1279px) 68vw, 52rem"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                    />

                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-abyss/60 via-transparent to-transparent"
                    />

                    <div className="absolute bottom-3 right-3 rounded-full border border-seaglass/15 bg-abyss/75 px-2.5 py-1 backdrop-blur-sm">
                      <span className="readout text-[0.6rem] uppercase tracking-[0.12em] text-tide/80">
                        {project.visualCredit}
                      </span>
                    </div>
                  </div>

                  <div className="work-showcase__meta mt-4 grid gap-3 border-t border-shelf-dim/80 pt-3.5 sm:grid-cols-[1fr_auto] sm:items-start">
                    <div>
                      <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
                        <span className="readout text-[0.66rem] uppercase tracking-[0.12em] text-biolume">
                          {formatIndex(index)}
                        </span>
                        <span
                          aria-hidden
                          className="h-1 w-1 rounded-full bg-brass"
                        />
                        <span className="readout text-[0.66rem] uppercase tracking-[0.12em] text-tide/75">
                          {project.kind}
                        </span>
                      </div>

                      <h3 className="font-display text-[clamp(1.55rem,2.5vw,2.65rem)] leading-[0.98] tracking-[-0.025em] text-seaglass transition-colors duration-200 group-hover:text-biolume">
                        {project.name}
                      </h3>

                      <p className="mt-1.5 text-sm font-medium text-brass/90">
                        {project.pillar}
                      </p>

                      <p className="mt-2 max-w-[58ch] text-[0.84rem] leading-relaxed text-tide">
                        {project.desc}
                      </p>
                    </div>

                    <span className="readout tabular-nums text-tide/65">
                      {project.depth}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
