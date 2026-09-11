/**
 * Experience Types
 * Core type definitions for the continuous immersive Three.js experience.
 */

export type SceneQuality = "HIGH" | "MEDIUM" | "LOW" | "STATIC";

export interface DepthMilestone {
  id: string;
  name: string;
  targetDepth: number; // in meters (0 to 3800)
  selector?: string;   // DOM selector for element-bound interpolation
}

export interface DepthState {
  rawProgress: number;      // 0.0 to 1.0 (unfiltered scroll progress)
  smoothedProgress: number; // 0.0 to 1.0 (damped/interpolated progress)
  currentDepth: number;     // calculated depth in meters
  velocity: number;         // rate of progress change per frame
}

export interface QualityConfig {
  quality: SceneQuality;
  maxDpr: number;
  antialias: boolean;
  isStatic: boolean;
}
