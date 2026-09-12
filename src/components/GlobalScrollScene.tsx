"use client";

import type { CSSProperties, ReactNode } from "react";
import { useExperience } from "@/experience/ExperienceContext";

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

type SceneStyle = CSSProperties & {
  "--scene-y": string;
  "--scene-scale": number;
  "--scene-opacity": number;
  "--scene-safe-opacity": number;
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function smootherstep(value: number): number {
  const t = clamp01(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * Global #28-inspired section transition.
 *
 * IMPORTANT:
 * - does NOT create another scroll listener
 * - does NOT create another RAF loop
 * - consumes the existing centralized depth system
 * - leaves sticky-heavy sections transform-free via "sticky-safe"
 *
 * The CodePen reference uses a vertical slider with parallax-enabled inner
 * layers. Here we preserve native document scrolling and adapt the same visual
 * language: incoming sections rise into place, settle, then retreat as the next
 * section takes over.
 */
export function GlobalScrollScene({
  children,
  previousDepth,
  depth,
  nextDepth,
  mode = "slide",
  className = "",
}: GlobalScrollSceneProps) {
  const {
    rawDepth,
    smoothedDepth,
    qualityConfig,
  } = useExperience();

  const isStatic = qualityConfig.isStatic;

  /**
   * Keep the global transition responsive to actual scroll while borrowing
   * enough of the site's existing smoothing to remove wheel stepping.
   */
  const motionDepth =
    rawDepth + (smoothedDepth - rawDepth) * 0.48;

  let enter = 1;

  if (!isStatic && depth > previousDepth) {
    const incomingSpan = Math.max(1, depth - previousDepth);
    const enterStart = depth - incomingSpan * 0.42;
    const enterRange = Math.max(1, depth - enterStart);

    enter = smootherstep(
      (motionDepth - enterStart) / enterRange,
    );
  }

  let leave = 0;

  if (
    !isStatic &&
    mode !== "terminal" &&
    nextDepth > depth
  ) {
    const outgoingSpan = Math.max(1, nextDepth - depth);
    const leaveStart = depth + outgoingSpan * 0.58;
    const leaveEnd = depth + outgoingSpan * 0.94;
    const leaveRange = Math.max(1, leaveEnd - leaveStart);

    leave = smootherstep(
      (motionDepth - leaveStart) / leaveRange,
    );
  }

  const translateY =
    (1 - enter) * 14 - leave * 10;

  const scale =
    0.985 + enter * 0.015 - leave * 0.008;

  const opacity = clamp01(
    0.38 + enter * 0.62 - leave * 0.28,
  );

  /**
   * Sticky-safe sections cannot have a transformed ancestor without risking
   * their sticky choreography. They therefore participate in the global
   * transition through opacity only.
   */
  const safeOpacity = clamp01(
    0.58 + enter * 0.42 - leave * 0.16,
  );

  const style: SceneStyle = {
    "--scene-y": `${translateY}vh`,
    "--scene-scale": scale,
    "--scene-opacity": opacity,
    "--scene-safe-opacity": safeOpacity,
  };

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
      style={style}
    >
      <div className="global-scroll-scene__motion">
        {children}
      </div>
    </div>
  );
}
