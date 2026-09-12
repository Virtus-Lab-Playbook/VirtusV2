"use client";

import {
  useRef,
  useState,
} from "react";
import {
  DEPTH_MILESTONES,
  MAX_DEPTH_METERS,
} from "@/experience/experience-config";
import {
  useExperienceMotion,
} from "@/experience/hooks/useExperienceMotion";

const NAV_IDS =
  new Set([
    "work",
    "services",
    "products",
    "why-us",
    "process",
    "engagements",
    "brief",
  ]);

const navigationMilestones =
  DEPTH_MILESTONES.filter(
    (milestone) =>
      NAV_IDS.has(
        milestone.id,
      ),
  );

function nearestMilestoneId(
  depth: number,
): string {
  let closest =
    navigationMilestones[0];

  let distance =
    Math.abs(
      depth -
        closest.targetDepth,
    );

  for (
    let index = 1;
    index <
    navigationMilestones.length;
    index++
  ) {
    const candidate =
      navigationMilestones[
        index
      ];

    const candidateDistance =
      Math.abs(
        depth -
          candidate.targetDepth,
      );

    if (
      candidateDistance <
      distance
    ) {
      closest =
        candidate;
      distance =
        candidateDistance;
    }
  }

  return closest.id;
}

export function DepthRail() {
  const fillRef =
    useRef<HTMLDivElement>(
      null,
    );

  const markerRef =
    useRef<HTMLSpanElement>(
      null,
    );

  const depthTextRef =
    useRef<HTMLSpanElement>(
      null,
    );

  const activeIdRef =
    useRef(
      navigationMilestones[0]
        .id,
    );

  const [
    activeId,
    setActiveId,
  ] =
    useState(
      navigationMilestones[0]
        .id,
    );

  useExperienceMotion(
    ({ rawDepth }) => {
      const progress =
        Math.min(
          1,
          Math.max(
            0,
            rawDepth /
              MAX_DEPTH_METERS,
          ),
        );

      const percent =
        `${progress * 100}%`;

      if (
        fillRef.current
      ) {
        fillRef.current.style.height =
          percent;
      }

      if (
        markerRef.current
      ) {
        markerRef.current.style.top =
          percent;
      }

      if (
        depthTextRef.current
      ) {
        depthTextRef.current.textContent =
          String(
            Math.round(
              rawDepth / 10,
            ) * 10,
          );
      }

      const nextActive =
        nearestMilestoneId(
          rawDepth,
        );

      if (
        nextActive !==
        activeIdRef.current
      ) {
        activeIdRef.current =
          nextActive;

        setActiveId(
          nextActive,
        );
      }
    },
  );

  return (
    <aside
      className="depth-rail fixed left-0 top-0 z-30 hidden h-screen w-[var(--rail-w)] border-r border-shelf/55 bg-abyss/78 backdrop-blur-sm lg:block"
      aria-label="Page depth navigation"
    >
      <div
        aria-hidden
        className="absolute inset-0 flex flex-col items-center justify-between py-6"
      >
        <span className="readout rotate-180 text-[0.6rem] tracking-[0.2em] [writing-mode:vertical-rl]">
          depth
        </span>

        <div className="relative my-4 w-px flex-1 origin-top bg-shelf/45 [animation:rail-rise_1.1s_cubic-bezier(0.22,1,0.36,1)]">
          <div
            ref={
              fillRef
            }
            className="absolute left-0 top-0 w-px bg-tide"
            style={{
              height: "0%",
            }}
          />

          <span
            ref={
              markerRef
            }
            className="absolute -left-[3px] top-0 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-seaglass shadow-[0_0_10px_1px_rgba(224,225,220,0.28)]"
          />
        </div>

        <span className="flex flex-col items-center leading-tight">
          <span
            ref={
              depthTextRef
            }
            className="readout tabular-nums text-[0.66rem] text-seaglass"
          >
            0
          </span>

          <span className="readout text-[0.58rem] text-tide">
            m
          </span>
        </span>
      </div>

      <nav
        aria-label="Jump to page chapter"
        className="depth-rail__chapters"
      >
        {navigationMilestones.map(
          (milestone) => {
            const active =
              activeId ===
              milestone.id;

            return (
              <a
                key={
                  milestone.id
                }
                href={
                  milestone.selector
                }
                aria-current={
                  active
                    ? "location"
                    : undefined
                }
                aria-label={`Go to ${milestone.name}`}
                className={`depth-rail__chapter ${
                  active
                    ? "is-active"
                    : ""
                }`}
                style={{
                  top:
                    `${(
                      milestone.targetDepth /
                      MAX_DEPTH_METERS
                    ) *
                    100}%`,
                }}
              >
                <span
                  aria-hidden
                  className="depth-rail__chapter-dot"
                />

                <span className="depth-rail__chapter-label">
                  {
                    milestone.name
                  }
                </span>
              </a>
            );
          },
        )}
      </nav>
    </aside>
  );
}
