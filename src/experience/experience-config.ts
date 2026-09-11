import type { DepthMilestone, SceneQuality } from "./experience-types";

/**
 * Maximum abyssal depth in meters at the ocean floor (footer).
 */
export const MAX_DEPTH_METERS = 3800;

/**
 * Conceptual depth milestones matching the Virtus Lab Platform Blueprint.
 * Section-aware depth interpolates between the measured document offsets of these selectors.
 */
export const DEPTH_MILESTONES: readonly DepthMilestone[] = [
  { id: "hero", name: "Hero", targetDepth: 0, selector: "#top", zone: "SURFACE" },
  { id: "services", name: "Services", targetDepth: 210, selector: "#services", zone: "CONTINENTAL_SHELF" },
  { id: "process", name: "Process", targetDepth: 1200, selector: "#process", zone: "DESCENT" },
  { id: "work", name: "Work", targetDepth: 1600, selector: "#work", zone: "BATHYPELAGIC" },
  { id: "why-us", name: "Why Virtus", targetDepth: 2400, selector: "#why-us", zone: "ABYSSAL" },
  { id: "brief", name: "Brief Builder", targetDepth: 2800, selector: "#brief", zone: "BRIEF" },
  { id: "packages", name: "Packages", targetDepth: 3100, selector: "#packages", zone: "FLOOR_APPROACH" },
  { id: "faq", name: "FAQ", targetDepth: 3600, selector: "#faq", zone: "NEAR_FLOOR" },
  { id: "final-cta", name: "Final CTA", targetDepth: 3780, selector: "#final-cta", zone: "NEAR_FLOOR" },
  { id: "footer", name: "Footer", targetDepth: 3800, selector: "#footer", zone: "FLOOR" },
] as const;

/**
 * Device Pixel Ratio caps per quality tier to ensure performance on high-density screens.
 */
export const QUALITY_DPR_CAPS: Record<SceneQuality, number> = {
  HIGH: 1.5,
  MEDIUM: 1.25,
  LOW: 1.0,
  STATIC: 1.0,
};

/**
 * Damping factor for smooth scroll-driven camera & visual depth motion.
 * Lower = more viscous/inertia-heavy damping, Higher = snappier tracking.
 */
export const DEPTH_DAMPING_FACTOR = 0.055;
