import type { DepthMilestone, SceneQuality } from "./experience-types";

/**
 * Maximum abyssal depth in meters at the ocean floor (footer).
 */
export const MAX_DEPTH_METERS = 3800;

/**
 * Conceptual depth milestones matching the Virtus Lab Platform Blueprint.
 * Designed so that DOM elements can eventually define or interpolate exact depth.
 */
export const DEPTH_MILESTONES: readonly DepthMilestone[] = [
  { id: "hero", name: "Hero", targetDepth: 0, selector: "#top" },
  { id: "services", name: "Services", targetDepth: 210, selector: "#services" },
  { id: "process", name: "Process", targetDepth: 1200, selector: "#process" },
  { id: "work", name: "Work", targetDepth: 1600, selector: "#work" },
  { id: "why-us", name: "Why Virtus", targetDepth: 2400, selector: "#why-us" },
  { id: "brief", name: "Brief Builder", targetDepth: 2800, selector: "#brief" },
  { id: "packages", name: "Packages", targetDepth: 3100, selector: "#packages" },
  { id: "faq", name: "FAQ", targetDepth: 3600, selector: "#faq" },
  { id: "final-cta", name: "Final CTA", targetDepth: 3780, selector: "#final-cta" },
  { id: "footer", name: "Footer", targetDepth: 3800, selector: "footer" },
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
 * Damping factor for smooth scroll-driven camera motion.
 * Lower = more viscous/inertia-heavy damping, Higher = snappier tracking.
 */
export const DEPTH_DAMPING_FACTOR = 0.055;
