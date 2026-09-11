/**
 * Environment Configuration
 *
 * Centralizes the 4 conceptual depth progression states from the surface to the deep:
 * 1. SURFACE (0 – 210 m): Brightest underwater state, strong caustics, rays, biolume.
 * 2. TWILIGHT (210 – 1,200 m): Gradual transition, reducing surface light, increasing haze.
 * 3. DESCENT (1,200 – 1,600 m): Weak surface illumination, darker water, caustics nearly gone.
 * 4. DEEP (1,600 – 2,400+ m): Predominantly abyss/deep palette, negative space, sparse biolume.
 */

export interface EnvironmentState {
  topLight: number;        // Surface illumination intensity (1.0 -> 0.0)
  causticStrength: number; // Caustic network brightness (0.24 -> 0.0)
  rayStrength: number;     // Descending god-ray visibility (0.16 -> 0.0)
  bloomStrength: number;   // Pointer-reactive biolume bloom (0.32 -> 0.08)
  darknessMix: number;     // Blend factor into dark abyss palette (0.0 -> 1.0)
  particleSpeed: number;   // Marine snow vertical drift multiplier (1.0 -> 0.45)
  particleOpacity: number; // Marine snow base opacity (0.65 -> 0.22)
  coreVisibility: number;  // Virtus Core visual dominance (1.0 -> 0.15)
  coreZOffset: number;     // Core depth recession along Z axis (0.0 -> -4.8)
}

const STATE_SURFACE: EnvironmentState = {
  topLight: 1.0,
  causticStrength: 0.24,
  rayStrength: 0.16,
  bloomStrength: 0.32,
  darknessMix: 0.0,
  particleSpeed: 1.0,
  particleOpacity: 0.62,
  coreVisibility: 1.0,
  coreZOffset: 0.0,
};

const STATE_TWILIGHT: EnvironmentState = {
  topLight: 0.42,
  causticStrength: 0.08,
  rayStrength: 0.05,
  bloomStrength: 0.22,
  darknessMix: 0.45,
  particleSpeed: 0.75,
  particleOpacity: 0.48,
  coreVisibility: 0.75,
  coreZOffset: -1.6,
};

const STATE_DESCENT: EnvironmentState = {
  topLight: 0.12,
  causticStrength: 0.015,
  rayStrength: 0.01,
  bloomStrength: 0.14,
  darknessMix: 0.82,
  particleSpeed: 0.55,
  particleOpacity: 0.32,
  coreVisibility: 0.4,
  coreZOffset: -3.4,
};

const STATE_DEEP: EnvironmentState = {
  topLight: 0.0,
  causticStrength: 0.0,
  rayStrength: 0.0,
  bloomStrength: 0.08,
  darknessMix: 1.0,
  particleSpeed: 0.42,
  particleOpacity: 0.22,
  coreVisibility: 0.15,
  coreZOffset: -4.8,
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

function lerpState(a: EnvironmentState, b: EnvironmentState, t: number): EnvironmentState {
  return {
    topLight: lerp(a.topLight, b.topLight, t),
    causticStrength: lerp(a.causticStrength, b.causticStrength, t),
    rayStrength: lerp(a.rayStrength, b.rayStrength, t),
    bloomStrength: lerp(a.bloomStrength, b.bloomStrength, t),
    darknessMix: lerp(a.darknessMix, b.darknessMix, t),
    particleSpeed: lerp(a.particleSpeed, b.particleSpeed, t),
    particleOpacity: lerp(a.particleOpacity, b.particleOpacity, t),
    coreVisibility: lerp(a.coreVisibility, b.coreVisibility, t),
    coreZOffset: lerp(a.coreZOffset, b.coreZOffset, t),
  };
}

/**
 * Calculates continuous, smoothly interpolated environment parameters
 * based on the current smoothed depth in meters.
 */
export function getEnvironmentState(depth: number): EnvironmentState {
  // 1. Surface: 0 to 210 m
  if (depth <= 210) {
    const t = depth / 210;
    return lerpState(STATE_SURFACE, STATE_TWILIGHT, t * 0.35);
  }

  // 2. Twilight: 210 to 1,200 m
  if (depth <= 1200) {
    const t = (depth - 210) / (1200 - 210);
    return lerpState(STATE_TWILIGHT, STATE_DESCENT, t);
  }

  // 3. Descent: 1,200 to 1,600 m
  if (depth <= 1600) {
    const t = (depth - 1200) / (1600 - 1200);
    return lerpState(STATE_DESCENT, STATE_DEEP, t);
  }

  // 4. Deep: 1,600 m and beyond
  return STATE_DEEP;
}
