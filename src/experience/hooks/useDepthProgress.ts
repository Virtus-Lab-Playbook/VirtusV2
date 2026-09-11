"use client";

import type { DepthState } from "../experience-types";
import { useExperience } from "../ExperienceContext";

/**
 * Hook providing access to the centralized, section-aware depth state
 * managed by the root ExperienceProvider.
 */
export function useDepthProgress(): DepthState {
  const experience = useExperience();
  return {
    rawProgress: experience.rawProgress,
    smoothedProgress: experience.smoothedProgress,
    rawDepth: experience.rawDepth,
    smoothedDepth: experience.smoothedDepth,
    velocity: experience.velocity,
    currentZone: experience.currentZone,
  };
}
