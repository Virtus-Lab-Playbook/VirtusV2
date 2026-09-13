"use client";

import {
  useRef,
  type ReactNode,
} from "react";
import {
  useExperience,
} from "@/experience/ExperienceContext";
import {
  useExperienceMotion,
} from "@/experience/hooks/useExperienceMotion";

type GlobalScrollSceneMode =
  | "slide"
  | "sticky-safe"
  | "terminal";

type GlobalScrollSceneProps = {
  children: ReactNode;
  previousDepth: number;
  depth: number;
  nextDepth: number;
  mode?: GlobalScrollSceneMode;
  className?: string;
};

function clamp01(
  value: number,
): number {
  return Math.min(
    1,
    Math.max(0, value),
  );
}

function smootherstep(
  value: number,
): number {
  const t = clamp01(value);

  return (
    t *
    t *
    t *
    (
      t *
        (t * 6 - 15) +
      10
    )
  );
}

export function GlobalScrollScene({
  children,
  previousDepth,
  depth,
  nextDepth,
  mode = "slide",
  className = "",
}: GlobalScrollSceneProps) {
  const motionRef =
    useRef<HTMLDivElement>(
      null,
    );

  const {
    qualityConfig,
  } = useExperience();

  const isStatic =
    qualityConfig.isStatic;

  useExperienceMotion(
    ({
      rawDepth,
      smoothedDepth,
    }) => {
      const element =
        motionRef.current;

      if (!element) return;

      if (isStatic) {
        element.style.setProperty(
          "--scene-y",
          "0vh",
        );
        element.style.setProperty(
          "--scene-scale",
          "1",
        );
        element.style.setProperty(
          "--scene-opacity",
          "1",
        );
        element.style.setProperty(
          "--scene-safe-opacity",
          "1",
        );
        return;
      }

      const motionDepth =
        rawDepth +
        (
          smoothedDepth -
          rawDepth
        ) *
          0.3;

      let enter = 1;

      if (
        depth >
        previousDepth
      ) {
        const incomingSpan =
          Math.max(
            1,
            depth -
              previousDepth,
          );

        const enterStart =
          depth -
          incomingSpan *
            0.34;

        const enterRange =
          Math.max(
            1,
            depth -
              enterStart,
          );

        enter =
          smootherstep(
            (
              motionDepth -
              enterStart
            ) /
              enterRange,
          );
      }

      let leave = 0;

      if (
        mode !==
          "terminal" &&
        nextDepth > depth
      ) {
        const outgoingSpan =
          Math.max(
            1,
            nextDepth -
              depth,
          );

        const leaveStart =
          depth +
          outgoingSpan *
            0.66;

        const leaveEnd =
          depth +
          outgoingSpan *
            0.96;

        leave =
          smootherstep(
            (
              motionDepth -
              leaveStart
            ) /
              Math.max(
                1,
                leaveEnd -
                  leaveStart,
              ),
          );
      }

      const translateY =
        -(1 - enter) *
          2.25 +
        leave * 1.75;

      const scale =
        0.996 +
        enter * 0.004 -
        leave * 0.002;

      const opacity =
        clamp01(
          0.86 +
            enter * 0.14 -
            leave * 0.08,
        );

      const safeOpacity =
        clamp01(
          0.92 +
            enter * 0.08 -
            leave * 0.04,
        );

      element.style.setProperty(
        "--scene-y",
        `${translateY}vh`,
      );

      element.style.setProperty(
        "--scene-scale",
        String(scale),
      );

      element.style.setProperty(
        "--scene-opacity",
        String(opacity),
      );

      element.style.setProperty(
        "--scene-safe-opacity",
        String(
          safeOpacity,
        ),
      );
    },
  );

  return (
    <div
      data-global-scroll-scene
      className={[
        "global-scroll-scene",
        `global-scroll-scene--${mode}`,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        ref={motionRef}
        className="global-scroll-scene__motion"
      >
        {children}
      </div>
    </div>
  );
}
