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
 * The wrapper itself is the permanent section surface and NEVER moves or fades.
 * Only the inner motion layer animates. This prevents transparent "holes"
 * between sections from exposing the global Three.js canvas.
 *
 * No extra scroll listener or RAF is created here; the component only consumes
 * the existing centralized depth state.
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

  const motionDepth =
    rawDepth + (smoothedDepth - rawDepth) * 0.42;

  let enter = 1;

  if (!isStatic && depth > previousDepth) {
    const incomingSpan = Math.max(1, depth - previousDepth);
    const enterStart = depth - incomingSpan * 0.38;
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
    const leaveStart = depth + outgoingSpan * 0.62;
    const leaveEnd = depth + outgoingSpan * 0.94;
    const leaveRange = Math.max(1, leaveEnd - leaveStart);

    leave = smootherstep(
      (motionDepth - leaveStart) / leaveRange,
    );
  }

  /**
   * Keep the visual language of #28 without moving content far enough to leave
   * obvious empty bands. The outer surface remains fixed.
   */
  const translateY =
    (1 - enter) * 7 - leave * 4.5;

  const scale =
    0.992 + enter * 0.008 - leave * 0.004;

  const opacity = clamp01(
    0.72 + enter * 0.28 - leave * 0.14,
  );

  const safeOpacity = clamp01(
    0.82 + enter * 0.18 - leave * 0.08,
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
