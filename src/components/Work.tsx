"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { site } from "@/content/site";
import { useExperience } from "@/experience/ExperienceContext";
import { SECTION_DEPTHS } from "@/experience/experience-config";
import { Container } from "./primitives";

const WORK_START_DEPTH = SECTION_DEPTHS.work;
const WORK_NEXT_SECTION_DEPTH = SECTION_DEPTHS.services;

/**
 * #34 Horizontal Parallax Gallery adaptation.
 *
 * The reference uses a horizontally scrolling gallery whose items sit at
 * different Z-depths, so some appear to travel slower and others faster.
 *
 * Virtus keeps native vertical page scrolling. Existing centralized depth
 * drives one horizontal track; CSS perspective + per-card translateZ creates
 * the differential parallax.
 */
const WORK_DEPTH_SMOOTHING = 0.22;
const MOTION_FINISH_FRACTION = 0.94;

const PARALLAX_LAYERS = [
  { z: -120, scale: 1.12, y: "1.5vh" },
  { z: 65, scale: 0.94, y: "-1.5vh" },
  { z: -180, scale: 1.18, y: "2.2vh" },
  { z: 90, scale: 0.91, y: "-1vh" },
  { z: -80, scale: 1.08, y: "1.4vh" },
] as const;

type WorkMetrics = {
  travelDistance: number;
  releaseDepth: number;
};

type WorkCardStyle = CSSProperties & {
  "--work-z": string;
  "--work-y": string;
  "--work-scale": number;
};

const initialMetrics: WorkMetrics = {
  travelDistance: 0,
  releaseDepth: WORK_NEXT_SECTION_DEPTH - 60,
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function Work() {
  const { rawDepth, smoothedDepth } = useExperience();

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

      const lastCard = cards.at(-1);
      const viewportWidth = Math.max(1, viewport.clientWidth);

      /**
       * End with the last project near the left side of the stage instead of
       * merely making its right edge visible.
       */
      const nextTravelDistance = lastCard
        ? Math.max(
            0,
            lastCard.offsetLeft - viewportWidth * 0.08,
          )
        : 0;

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
        const travelChanged =
          Math.abs(
            current.travelDistance - nextTravelDistance,
          ) > 0.5;

        const releaseChanged =
          Math.abs(
            current.releaseDepth - nextReleaseDepth,
          ) > 0.5;

        if (!travelChanged && !releaseChanged) {
          return current;
        }

        return {
          travelDistance: nextTravelDistance,
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

  const motionDepth =
    rawDepth +
    (smoothedDepth - rawDepth) * WORK_DEPTH_SMOOTHING;

  const motionDepthSpan = Math.max(
    1,
    pinnedDepthSpan * MOTION_FINISH_FRACTION,
  );

  const progress = clamp01(
    (motionDepth - WORK_START_DEPTH) / motionDepthSpan,
  );

  const trackX = metrics.travelDistance * progress;

  const projectCount = site.work.projects.length;
  const activeIndex = Math.min(
    projectCount - 1,
    Math.max(
      0,
      Math.round(progress * (projectCount - 1)),
    ),
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

          <div
            ref={viewportRef}
            className="work-showcase__viewport mt-6 min-h-0 flex-1 sm:mt-7"
          >
            <div
              ref={trackRef}
              className="work-showcase__track"
              style={{
                transform: `translate3d(${-trackX}px, 0, 0)`,
              }}
            >
              {site.work.projects.map((project, index) => {
                const layer =
                  PARALLAX_LAYERS[
                    index % PARALLAX_LAYERS.length
                  ];

                const cardStyle: WorkCardStyle = {
                  "--work-z": `${layer.z}px`,
                  "--work-y": layer.y,
                  "--work-scale": layer.scale,
                };

                return (
                  <article
                    key={project.id}
                    data-work-card
                    data-experience-signal="work"
                    data-experience-index={index}
                    className="work-showcase__card"
                    style={cardStyle}
                  >
                    <div className="work-showcase__media">
                      <Image
                        src={project.image}
                        alt={project.imageAlt}
                        fill
                        sizes="(max-width: 767px) 86vw, (max-width: 1279px) 58vw, 46rem"
                        className="work-showcase__image object-cover"
                      />

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

                    <div className="work-showcase__meta mt-4 grid gap-4 border-t border-shelf/60 pt-4 sm:grid-cols-[1fr_auto] sm:items-start">
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
