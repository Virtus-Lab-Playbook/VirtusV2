"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { useExperience } from "@/experience/ExperienceContext";
import { SECTION_DEPTHS } from "@/experience/experience-config";
import { Container } from "./primitives";

const WORK_START_DEPTH = SECTION_DEPTHS.work;
const WORK_NEXT_SECTION_DEPTH = SECTION_DEPTHS.services;

/**
 * Desktop Work choreography:
 *
 * #34 Horizontal Parallax Gallery
 * + #28 Slider Transitions
 * + subtle #26 image breathing
 * + soft #38-inspired magnetic dwell
 *
 * Every integer project position is a deliberate rest point.
 * Timing is scroll-distance based only.
 */
const OPENING_HOLD = 0.055;
const FINAL_HOLD = 0.075;
const SEGMENT_TRANSITION_START = 0.18;
const SEGMENT_TRANSITION_END = 0.82;

/**
 * Mostly raw depth keeps the stage attached to the user's wheel/trackpad.
 * The smaller smoothed contribution removes harsh wheel stepping without
 * creating a long catch-up after input stops.
 */
const WORK_DEPTH_SMOOTHING = 0.35;

/**
 * Finish the project sequence before physical sticky release so Project 05
 * receives a final dwell.
 */
const MOTION_FINISH_FRACTION = 0.88;

/**
 * Desktop layered-slider geometry.
 */
const INCOMING_START_X = 94;
const OUTGOING_END_X = -44;

/**
 * Image shell is 120% wide. 7.5% shell counter-motion gives about 9% of
 * card-width relative parallax, inside the locked 8–12% range.
 */
const IMAGE_PARALLAX_PERCENT = 7.5;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function smootherstep(value: number): number {
  const t = clamp01(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

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

  return segment + smootherstep(transitionProgress);
}

type WorkMetrics = {
  releaseDepth: number;
};

const initialMetrics: WorkMetrics = {
  releaseDepth: WORK_NEXT_SECTION_DEPTH - 80,
};

export function Work() {
  const { rawDepth, smoothedDepth } = useExperience();

  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const [metrics, setMetrics] =
    useState<WorkMetrics>(initialMetrics);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;

    if (!section || !sticky) return;

    const measure = () => {
      const sectionHeight = Math.max(1, section.offsetHeight);
      const stickyHeight = Math.min(
        sectionHeight,
        Math.max(1, sticky.offsetHeight),
      );

      const pinnedFraction = clamp01(
        (sectionHeight - stickyHeight) / sectionHeight,
      );

      const nextReleaseDepth =
        WORK_START_DEPTH +
        (WORK_NEXT_SECTION_DEPTH - WORK_START_DEPTH) *
          pinnedFraction;

      setMetrics((current) => {
        if (
          Math.abs(current.releaseDepth - nextReleaseDepth) <= 0.5
        ) {
          return current;
        }

        return {
          releaseDepth: nextReleaseDepth,
        };
      });
    };

    measure();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(measure);
    observer.observe(section);
    observer.observe(sticky);

    return () => {
      observer.disconnect();
    };
  }, []);

  const pinnedDepthSpan = Math.max(
    1,
    metrics.releaseDepth - WORK_START_DEPTH,
  );

  const motionDepth =
    rawDepth +
    (smoothedDepth - rawDepth) * WORK_DEPTH_SMOOTHING;

  const motionDepthSpan = Math.max(
    1,
    pinnedDepthSpan * MOTION_FINISH_FRACTION,
  );

  const pinnedProgress = clamp01(
    (motionDepth - WORK_START_DEPTH) / motionDepthSpan,
  );

  const projectCount = site.work.projects.length;

  const projectPosition = getProjectPosition(
    pinnedProgress,
    projectCount,
  );

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
      <div ref={stickyRef} className="work-showcase__sticky">
        <Container className="flex h-full min-h-0 flex-col pt-16 pb-6 sm:pt-20 sm:pb-8">
          <header
            data-reveal
            className="flex shrink-0 items-end justify-between gap-8"
          >
            <div className="max-w-[50rem]">
              <span className="readout readout-caps text-tide">
                Portfolio
              </span>

              <h2
                id="work-title"
                className="mt-3 font-display text-[clamp(2.8rem,5.4vw,5.6rem)] leading-[0.92] tracking-[-0.035em] text-seaglass"
              >
                {site.work.title}
              </h2>

              <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-tide sm:text-base">
                {site.work.intro}
              </p>

              <p className="mt-2 max-w-[66ch] text-[0.72rem] leading-relaxed text-tide/65">
                {site.work.note}
              </p>
            </div>

            <div
              className="hidden shrink-0 items-baseline gap-2 pb-1 md:flex"
              aria-label={`Project ${activeIndex + 1} of ${projectCount}`}
            >
              <span className="font-mono text-2xl font-semibold tabular-nums text-seaglass">
                {formatIndex(activeIndex)}
              </span>

              <span className="readout text-shelf">/</span>

              <span className="readout tabular-nums text-tide">
                {String(projectCount).padStart(2, "0")}
              </span>
            </div>
          </header>

          <div className="work-showcase__viewport mt-6 min-h-0 flex-1 sm:mt-7">
            <div className="work-showcase__stage">
              {site.work.projects.map((project, index) => {
                const rawDelta = index - projectPosition;
                const delta = clamp(rawDelta, -1, 1);
                const distance = Math.min(1, Math.abs(rawDelta));

                const isIncoming = delta >= 0;

                const slideX = isIncoming
                  ? delta * INCOMING_START_X
                  : Math.abs(delta) * OUTGOING_END_X;

                const slideOpacity =
                  rawDelta > 1.05 || rawDelta < -1.05
                    ? 0
                    : isIncoming
                      ? 0.72 + (1 - distance) * 0.28
                      : Math.max(0.08, 1 - distance * 0.92);

                const slideScale =
                  isIncoming
                    ? 0.985 + (1 - distance) * 0.015
                    : 1 - distance * 0.018;

                const zIndex =
                  Math.abs(rawDelta) < 0.001
                    ? 30
                    : rawDelta > 0
                      ? 20
                      : 10;

                const imageParallax =
                  -delta * IMAGE_PARALLAX_PERCENT;

                const imageScale =
                  isIncoming
                    ? 1 + distance * 0.035
                    : 1 + distance * 0.025;

                const metaOpacity =
                  isIncoming
                    ? 0.5 + (1 - distance) * 0.5
                    : Math.max(0.24, 1 - distance * 0.76);

                const metaY = delta * 10;

                return (
                  <article
                    key={project.id}
                    data-work-card
                    data-experience-signal="work"
                    data-experience-index={index}
                    className="work-showcase__card"
                    style={{
                      opacity: slideOpacity,
                      transform: `translate3d(${slideX}%, 0, 0) scale(${slideScale})`,
                      zIndex,
                    }}
                  >
                    <div className="work-showcase__media">
                      <div
                        className="work-showcase__image-shell"
                        style={{
                          transform: `translate3d(${imageParallax}%, 0, 0) scale(${imageScale})`,
                        }}
                      >
                        <Image
                          src={project.image}
                          alt={project.imageAlt}
                          fill
                          sizes="(max-width: 767px) 86vw, (max-width: 1279px) 72vw, 58rem"
                          className="object-cover"
                        />
                      </div>

                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-abyss/65 via-transparent to-transparent"
                      />

                      <div className="absolute bottom-3 right-3 bg-abyss/78 px-2.5 py-1 backdrop-blur-sm">
                        <span className="readout text-[0.58rem] uppercase tracking-[0.12em] text-tide">
                          {project.visualCredit}
                        </span>
                      </div>
                    </div>

                    <div
                      className="work-showcase__meta work-showcase__meta-motion mt-4 grid gap-4 border-t border-shelf/60 pt-4 sm:grid-cols-[1fr_auto] sm:items-start"
                      style={{
                        opacity: metaOpacity,
                        transform: `translate3d(0, ${metaY}px, 0)`,
                      }}
                    >
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2.5">
                          <span className="readout text-[0.66rem] uppercase tracking-[0.12em] text-tide">
                            {formatIndex(index)}
                          </span>

                          <span
                            aria-hidden
                            className="h-px w-4 bg-shelf"
                          />

                          <span className="readout text-[0.66rem] uppercase tracking-[0.12em] text-tide/80">
                            {project.pillar}
                          </span>

                          <span className="readout text-[0.62rem] uppercase tracking-[0.12em] text-seaglass/65">
                            {project.kind}
                          </span>
                        </div>

                        <h3 className="font-display text-[clamp(1.65rem,2.7vw,2.8rem)] leading-[0.98] tracking-[-0.025em] text-seaglass">
                          {project.name}
                        </h3>

                        <p className="mt-2 max-w-[56ch] text-[0.9rem] leading-relaxed text-tide">
                          {project.statement}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                          {project.capabilities.map((capability) => (
                            <span
                              key={capability}
                              className="text-[0.75rem] font-medium text-seaglass/72"
                            >
                              {capability}
                            </span>
                          ))}
                        </div>
                      </div>

                      <span className="readout self-start text-tide/65">
                        {formatIndex(index)} /{" "}
                        {String(projectCount).padStart(2, "0")}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
