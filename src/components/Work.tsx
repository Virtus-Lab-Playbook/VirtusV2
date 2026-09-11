"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { useExperience } from "@/experience/ExperienceContext";
import { Container, GoldRule } from "./primitives";

const WORK_START_DEPTH = 1600;
const WORK_NEXT_SECTION_DEPTH = 2400;

/**
 * Choreography:
 *
 * - small global opening hold so Project 01 is readable before movement begins
 * - each project has a local dwell before/after its transition
 * - small final hold so Project 05 settles before sticky release
 *
 * All timing is scroll-distance based, not time based.
 * Therefore:
 * - no delayed catch-up after scrolling stops
 * - reverse scroll naturally reverses the animation
 */
const OPENING_HOLD = 0.045;
const FINAL_HOLD = 0.06;
const SEGMENT_TRANSITION_START = 0.1;
const SEGMENT_TRANSITION_END = 0.9;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number): number {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

/**
 * Converts 0..1 pinned scroll progress into a continuous project position:
 *
 * 0.0 = Project 01 aligned
 * 1.0 = Project 02 aligned
 * 2.0 = Project 03 aligned
 * ...
 *
 * Each integer position is a deliberate visual resting point.
 */
function getProjectPosition(
  pinnedProgress: number,
  projectCount: number,
): number {
  if (projectCount <= 1) return 0;

  if (pinnedProgress <= OPENING_HOLD) {
    return 0;
  }

  if (pinnedProgress >= 1 - FINAL_HOLD) {
    return projectCount - 1;
  }

  const motionProgress = clamp01(
    (pinnedProgress - OPENING_HOLD) /
      (1 - OPENING_HOLD - FINAL_HOLD),
  );

  const transitionCount = projectCount - 1;
  const scaled = motionProgress * transitionCount;

  const segment = Math.min(
    transitionCount - 1,
    Math.floor(scaled),
  );

  const localProgress = scaled - segment;

  const transitionProgress = clamp01(
    (localProgress - SEGMENT_TRANSITION_START) /
      (SEGMENT_TRANSITION_END - SEGMENT_TRANSITION_START),
  );

  return segment + smoothstep(transitionProgress);
}

type WorkMetrics = {
  cardOffsets: number[];
  releaseDepth: number;
};

const initialMetrics: WorkMetrics = {
  cardOffsets: [],
  releaseDepth: 2250,
};

export function Work() {
  const { rawDepth } = useExperience();

  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [metrics, setMetrics] =
    useState<WorkMetrics>(initialMetrics);

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

      const nextOffsets = cards.map((card) =>
        Math.max(0, card.offsetLeft),
      );

      const sectionHeight = Math.max(1, section.offsetHeight);
      const stickyHeight = Math.min(
        sectionHeight,
        Math.max(1, sticky.offsetHeight),
      );

      /**
       * sticky scroll distance:
       *
       * sectionHeight - stickyHeight
       *
       * Convert that real physical release position back into the same
       * 1600 -> 2400 conceptual depth interval used by ExperienceContext.
       */
      const pinnedFraction = clamp01(
        (sectionHeight - stickyHeight) / sectionHeight,
      );

      const nextReleaseDepth =
        WORK_START_DEPTH +
        (WORK_NEXT_SECTION_DEPTH - WORK_START_DEPTH) *
          pinnedFraction;

      setMetrics((current) => {
        const offsetsChanged =
          current.cardOffsets.length !== nextOffsets.length ||
          current.cardOffsets.some(
            (offset, index) =>
              Math.abs(offset - (nextOffsets[index] ?? 0)) > 0.5,
          );

        const releaseChanged =
          Math.abs(current.releaseDepth - nextReleaseDepth) > 0.5;

        if (!offsetsChanged && !releaseChanged) {
          return current;
        }

        return {
          cardOffsets: nextOffsets,
          releaseDepth: nextReleaseDepth,
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

  const pinnedDepthSpan = Math.max(
    1,
    metrics.releaseDepth - WORK_START_DEPTH,
  );

  const pinnedProgress = clamp01(
    (rawDepth - WORK_START_DEPTH) / pinnedDepthSpan,
  );

  const projectCount = site.work.projects.length;

  const projectPosition = getProjectPosition(
    pinnedProgress,
    projectCount,
  );

  const lowerIndex = Math.min(
    projectCount - 1,
    Math.floor(projectPosition),
  );

  const upperIndex = Math.min(
    projectCount - 1,
    lowerIndex + 1,
  );

  const localCardProgress = projectPosition - lowerIndex;

  const lowerOffset =
    metrics.cardOffsets[lowerIndex] ?? 0;

  const upperOffset =
    metrics.cardOffsets[upperIndex] ?? lowerOffset;

  const translateX =
    lowerOffset +
    (upperOffset - lowerOffset) * localCardProgress;

  const activeIndex = Math.min(
    projectCount - 1,
    Math.max(0, Math.round(projectPosition)),
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-labelledby="work-title"
      className="work-showcase relative scroll-mt-24"
    >
      <div
        ref={stickyRef}
        className="work-showcase__sticky"
      >
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

              <span className="readout text-tide/55">
                /
              </span>

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
