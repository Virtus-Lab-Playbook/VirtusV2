/**
 * Experience Types
 * Core type definitions for the continuous immersive Three.js experience.
 */

export type SceneQuality = "HIGH" | "MEDIUM" | "LOW" | "STATIC";

export type DepthZone =
  | "SURFACE"
  | "CONTINENTAL_SHELF"
  | "DESCENT"
  | "BATHYPELAGIC"
  | "ABYSSAL"
  | "BRIEF"
  | "FLOOR_APPROACH"
  | "NEAR_FLOOR"
  | "FLOOR";

export interface DepthMilestone {
  id: string;
  name: string;
  targetDepth: number; // in meters (0 to 3800)
  selector: string;    // DOM selector for element-bound measurement
  zone: DepthZone;     // Conceptual zone associated with this milestone
}

export interface DepthState {
  rawProgress: number;      // 0.0 to 1.0 (unfiltered scroll progress)
  smoothedProgress: number; // 0.0 to 1.0 (damped/interpolated progress)
  rawDepth: number;         // Section-aware calculated depth in meters
  smoothedDepth: number;    // Damped depth in meters
  velocity: number;         // Rate of depth change per second
  currentZone: DepthZone;   // Active conceptual depth zone
}

export interface QualityConfig {
  quality: SceneQuality;
  maxDpr: number;
  antialias: boolean;
  isStatic: boolean;
}

export type ExperienceSignalType =
  | "discipline"
  | "service"
  | "why"
  | "process"
  | "work"
  | "brief-pulse"
  | "package"
  | null;

export interface SignalState {
  activeSignal: ExperienceSignalType;
  activeSignalIndex: number;
  signalSource: "pointer" | "keyboard" | null;
}

export interface ExperienceContextValue extends DepthState {
  qualityConfig: QualityConfig;
  signalState: SignalState;
  triggerSignal: (type: ExperienceSignalType, index?: number) => void;
  resetSignal: () => void;
}
