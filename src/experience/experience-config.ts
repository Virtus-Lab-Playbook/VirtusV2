import type { DepthMilestone, SceneQuality } from "./experience-types";

export const MAX_DEPTH_METERS = 3800;

/**
 * Homepage section depths.
 *
 * These numbers are conceptual coordinates for the single global immersive
 * experience. ExperienceContext measures real DOM section positions and
 * interpolates between them, so visual depth stays aligned with the page even
 * when responsive section heights change.
 */
export const SECTION_DEPTHS = {
  hero: 0,
  work: 650,
  services: 1700,
  products: 2050,
  whyUs: 2400,
  process: 2750,
  engagements: 3100,
  brief: 3350,
  faq: 3600,
  finalCta: 3770,
  footer: 3800,
} as const;

export const DEPTH_MILESTONES: readonly DepthMilestone[] = [
  {
    id: "hero",
    name: "Hero",
    targetDepth: SECTION_DEPTHS.hero,
    selector: "#top",
    zone: "SURFACE",
  },
  {
    id: "work",
    name: "Selected Work",
    targetDepth: SECTION_DEPTHS.work,
    selector: "#work",
    zone: "BATHYPELAGIC",
  },
  {
    id: "services",
    name: "Services",
    targetDepth: SECTION_DEPTHS.services,
    selector: "#services",
    zone: "DESCENT",
  },
  {
    id: "products",
    name: "Digital Products",
    targetDepth: SECTION_DEPTHS.products,
    selector: "#products",
    zone: "ABYSSAL",
  },
  {
    id: "why-us",
    name: "Why Virtus",
    targetDepth: SECTION_DEPTHS.whyUs,
    selector: "#why-us",
    zone: "ABYSSAL",
  },
  {
    id: "process",
    name: "How We Work",
    targetDepth: SECTION_DEPTHS.process,
    selector: "#process",
    zone: "ABYSSAL",
  },
  {
    id: "engagements",
    name: "Ways to Work With Us",
    targetDepth: SECTION_DEPTHS.engagements,
    selector: "#engagements",
    zone: "FLOOR_APPROACH",
  },
  {
    id: "brief",
    name: "Brief Builder",
    targetDepth: SECTION_DEPTHS.brief,
    selector: "#brief",
    zone: "BRIEF",
  },
  {
    id: "faq",
    name: "FAQ",
    targetDepth: SECTION_DEPTHS.faq,
    selector: "#faq",
    zone: "NEAR_FLOOR",
  },
  {
    id: "final-cta",
    name: "Final CTA",
    targetDepth: SECTION_DEPTHS.finalCta,
    selector: "#final-cta",
    zone: "NEAR_FLOOR",
  },
  {
    id: "footer",
    name: "Footer",
    targetDepth: SECTION_DEPTHS.footer,
    selector: "#footer",
    zone: "FLOOR",
  },
] as const;

export const QUALITY_DPR_CAPS: Record<SceneQuality, number> = {
  HIGH: 1.5,
  MEDIUM: 1.25,
  LOW: 1.0,
  STATIC: 1.0,
};

export const DEPTH_DAMPING_LAMBDA = 3.5;
export const DEPTH_DAMPING_FACTOR = 0.055;
