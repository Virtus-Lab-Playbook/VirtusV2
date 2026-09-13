"use client";

import type { DepthState } from "../experience-types";
import { useExperience } from "../ExperienceContext";

/**
 * Hook providing access to the centralized, section-aware depth state
 * managed by the root ExperienceProvider.
 */
export function useDepthProgress(): DepthState {
  const { motionStore } = useExperience();
  return motionStore.getState();
}
