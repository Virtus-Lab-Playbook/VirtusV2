"use client";

import Image from "next/image";
import Link from "next/link";
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
 * Pure #34 postcard-wall gallery.
 *
 * IMPORTANT:
 * This packet changes project navigation only.
 * The scroll / perspective mechanics remain the current implementation.
 */
const WORK_DEPTH_SMOOTHING = 0.08;
const MOTION_FINISH_FRACTION = 1;

const GALLERY_LAYOUTS = [
  {
    z: -150,
    scale: 1.15,
    y: "-7vh",
    width: "clamp(20rem, 29vw, 29rem)",
    aspect: "4 / 3",
  },
  {
    z: 80,
    scale: 0.92,
    y: "5vh",
    width: "clamp(16rem, 22vw, 22rem)",
    aspect: "4 / 5",
  },
  {
    z: -230,
    scale: 1.22,
    y: "-1vh",
    width: "clamp(22rem, 34vw, 34rem)",
    aspect: "16 / 10",
  },
  {
    z: 110,
    scale: 0.88,
    y: "6vh",
    width: "clamp(17rem, 24vw, 24rem)",
    aspect: "3 / 4",
  },
  {
    z: -90,
    scale: 1.1,
    y: "-8vh",
    width: "clamp(20rem, 30vw, 30rem)",
    aspect: "3 / 2",
  },
] as const;

type WorkMetrics = {
  travelDistance: number;
  releaseDepth: number;
};

type WorkCardStyle = CSSProperties & {
  "--work-z": string;
  "--work-y": string;
  "--work-scale": number;
  "--work-width": string;
  "--work-aspect": string;
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
        track.querySelectorAll<HTMLElement>(
          "[data-work-card]",
        ),
      );

      const lastCard = cards.at(-1);
      const viewportWidth = Math.max(
        1,
        viewport.clientWidth,
      );

      const nextTravelDistance = lastCard
        ? Math.max(
            0,
            lastCard.offsetLeft +
              lastCard.offsetWidth / 2 -
              viewportWidth * 0.66,
          )
        : 0;

      const sectionHeight = Math.max(
        1,
        section.offsetHeight,
      );

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
        const changed =
          Math.abs(
            current.travelDistance -
              nextTravelDistance,
          ) > 0.5 ||
          Math.abs(
            current.releaseDepth -
              nextReleaseDepth,
          ) > 0.5;

        if (!changed) return current;

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
    (smoothedDepth - rawDepth) *
      WORK_DEPTH_SMOOTHING;

  const motionDepthSpan = Math.max(
    1,
    pinnedDepthSpan * MOTION_FINISH_FRACTION,
  );

  const progress = clamp01(
    (motionDepth - WORK_START_DEPTH) /
      motionDepthSpan,
  );

  const trackX =
    metrics.travelDistance * progress;

  const projectCount =
    site.work.projects.length;

  const activeIndex = Math.min(
    projectCount - 1,
    Math.max(
      0,
      Math.round(
        progress * (projectCount - 1),
      ),
    ),
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
        <Container className="work-showcase__header">
          <header
            data-reveal
            className="flex items-end justify-between gap-8"
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

              <Link
                href="/work"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-tide transition-colors hover:text-seaglass md:hidden"
              >
                View all work
                <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="hidden shrink-0 flex-col items-end gap-3 pb-1 md:flex">
              <div
                className="flex items-baseline gap-2"
                aria-label={`Project ${activeIndex + 1} of ${projectCount}`}
              >
                <span className="font-mono text-2xl font-semibold tabular-nums text-seaglass">
                  {formatIndex(activeIndex)}
                </span>

                <span className="readout text-shelf">
                  /
                </span>

                <span className="readout tabular-nums text-tide">
                  {String(projectCount).padStart(
                    2,
                    "0",
                  )}
                </span>
              </div>

              <Link
                href="/work"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-tide transition-colors hover:text-seaglass"
              >
                View all work
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </header>
        </Container>

        <div
          ref={viewportRef}
          className="work-showcase__viewport"
        >
          <div
            ref={trackRef}
            className="work-showcase__track"
            style={{
              transform: `translate3d(${-trackX}px, 0, 0)`,
            }}
          >
            {site.work.projects.map(
              (project, index) => {
                const layout =
                  GALLERY_LAYOUTS[
                    index %
                      GALLERY_LAYOUTS.length
                  ];

                const cardStyle: WorkCardStyle = {
                  "--work-z": `${layout.z}px`,
                  "--work-y": layout.y,
                  "--work-scale": layout.scale,
                  "--work-width": layout.width,
                  "--work-aspect": layout.aspect,
                };

                return (
                  <article
                    key={project.id}
                    data-work-card
                    data-experience-signal="work"
                    data-experience-index={index}
                    data-has-live-url={
                      project.liveUrl
                        ? "true"
                        : "false"
                    }
                    className="work-showcase__card"
                    style={cardStyle}
                  >
                    <Link
                      href={`/work/${project.id}`}
                      className="work-showcase__project-link"
                      aria-label={`View ${project.name} case study`}
                    >
                      <div className="work-showcase__media">
                        <Image
                          src={project.image}
                          alt={project.imageAlt}
                          fill
                          sizes="(max-width: 767px) 82vw, (max-width: 1279px) 34vw, 32rem"
                          className="work-showcase__image object-cover"
                        />

                        <div
                          aria-hidden
                          className="work-showcase__image-shade"
                        />

                        <div className="work-showcase__credit">
                          <span className="readout text-[0.56rem] uppercase tracking-[0.12em] text-tide">
                            {project.visualCredit}
                          </span>
                        </div>

                        <div className="work-showcase__case-action">
                          <span className="readout readout-caps text-seaglass">
                            View case study →
                          </span>
                        </div>

                        <div className="work-showcase__title-overlay">
                          <div className="flex items-center gap-2.5">
                            <span className="readout text-[0.58rem] uppercase tracking-[0.12em] text-seaglass/78">
                              {formatIndex(index)}
                            </span>

                            <span
                              aria-hidden
                              className="h-px w-4 bg-seaglass/45"
                            />

                            <span className="readout text-[0.58rem] uppercase tracking-[0.12em] text-seaglass/72">
                              {project.pillar}
                            </span>
                          </div>

                          <h3 className="mt-1.5 font-display text-[clamp(1.2rem,1.7vw,1.75rem)] leading-none tracking-[-0.02em] text-seaglass">
                            {project.name}
                          </h3>
                        </div>
                      </div>
                    </Link>

                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="work-showcase__live-link"
                        aria-label={`Visit ${project.name} live site`}
                      >
                        Live site ↗
                      </a>
                    ) : null}
                  </article>
                );
              },
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
