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
    rawDepth + (smoothedDepth - rawDepth) * 0.30;

  let enter = 1;

  if (!isStatic && depth > previousDepth) {
    const incomingSpan = Math.max(1, depth - previousDepth);
    const enterStart = depth - incomingSpan * 0.34;
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
    const leaveStart = depth + outgoingSpan * 0.66;
    const leaveEnd = depth + outgoingSpan * 0.96;
    const leaveRange = Math.max(1, leaveEnd - leaveStart);

    leave = smootherstep(
      (motionDepth - leaveStart) / leaveRange,
    );
  }

  /*
   * IMPORTANT:
   * Incoming content begins slightly ABOVE its natural slot.
   * Outgoing content moves slightly DOWN toward the next section.
   *
   * This closes the boundary instead of pulling adjacent sections apart.
   */
  const translateY =
    -(1 - enter) * 2.25 + leave * 1.75;

  const scale =
    0.996 + enter * 0.004 - leave * 0.002;

  const opacity = clamp01(
    0.86 + enter * 0.14 - leave * 0.08,
  );

  const safeOpacity = clamp01(
    0.92 + enter * 0.08 - leave * 0.04,
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
