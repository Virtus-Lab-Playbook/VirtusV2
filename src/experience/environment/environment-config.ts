/**
 * Environment Configuration
 *
 * Implements the continuous 0 m -> 3,800 m depth progression:
 * 1. SURFACE (0 – 210 m): Brightest underwater state, strong caustics, rays, biolume.
 * 2. TWILIGHT (210 – 1,200 m): Gradual transition, reducing surface light, increasing haze.
 * 3. DESCENT (1,200 – 1,600 m): Weak surface illumination, darker water, caustics fading.
 * 4. DEEP (1,600 – 2,400 m): Predominantly abyss palette, negative space, Core recedes.
 * 5. ABYSS (2,400 – 2,800 m): Quiet, vast, sparse marine snow.
 * 6. FOCUS (2,800 – 3,100 m): Brief focus state, subdued background, zero distraction.
 * 7. FLOOR_APPROACH (3,100 – 3,600 m): Seafloor bathymetric contours begin emerging.
 * 8. NEAR_FLOOR (3,600 – 3,780 m): Seafloor established, terminal rays, Core returning.
 * 9. FLOOR (3,780 – 3,800 m): Final destination, resting Core, warm ember, calm arrival.
 */

export interface EnvironmentState {
  topLight: number;        // Surface illumination (1.0 -> 0.0)
  causticStrength: number; // Surface caustics (0.24 -> 0.0)
  rayStrength: number;     // Surface god rays (0.16 -> 0.0)
  bloomStrength: number;   // Surface pointer bloom (0.32 -> 0.05)
  darknessMix: number;     // Blend into dark abyss palette (0.0 -> 1.0)
  particleSpeed: number;   // Marine snow drift speed (1.0 -> 0.3)
  particleOpacity: number; // Marine snow opacity (0.62 -> 0.15)
  coreVisibility: number;  // Virtus Core visual opacity/prominence (1.0 -> 0.12 -> 0.88)
  coreZOffset: number;     // Core position along Z axis (0.0 -> -4.8 -> +0.2)
  coreResting: number;     // Settling factor into resting orientation (0.0 -> 1.0)
  floorOpacity: number;    // Bathymetric seafloor visibility (0.0 -> 0.9)
  abyssRays: number;       // Terminal god-rays from zenith (0.0 -> 0.26)
  abyssEmber: number;      // Warm pointer ember strength (0.0 -> 0.24)
  cameraY: number;         // Subtle camera elevation shift (0.0 -> -0.4)
  cameraZ: number;         // Subtle camera distance shift (7.5 -> 7.0)
}

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
    coreResting: lerp(a.coreResting, b.coreResting, t),
    floorOpacity: lerp(a.floorOpacity, b.floorOpacity, t),
    abyssRays: lerp(a.abyssRays, b.abyssRays, t),
    abyssEmber: lerp(a.abyssEmber, b.abyssEmber, t),
    cameraY: lerp(a.cameraY, b.cameraY, t),
    cameraZ: lerp(a.cameraZ, b.cameraZ, t),
  };
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
  coreResting: 0.0,
  floorOpacity: 0.0,
  abyssRays: 0.0,
  abyssEmber: 0.0,
  cameraY: 0.0,
  cameraZ: 7.5,
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
  coreResting: 0.0,
  floorOpacity: 0.0,
  abyssRays: 0.0,
  abyssEmber: 0.0,
  cameraY: 0.0,
  cameraZ: 7.5,
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
  coreResting: 0.0,
  floorOpacity: 0.0,
  abyssRays: 0.0,
  abyssEmber: 0.0,
  cameraY: -0.05,
  cameraZ: 7.5,
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
  coreResting: 0.0,
  floorOpacity: 0.0,
  abyssRays: 0.0,
  abyssEmber: 0.0,
  cameraY: -0.1,
  cameraZ: 7.45,
};

const STATE_ABYSS: EnvironmentState = {
  topLight: 0.0,
  causticStrength: 0.0,
  rayStrength: 0.0,
  bloomStrength: 0.05,
  darknessMix: 1.0,
  particleSpeed: 0.35,
  particleOpacity: 0.18,
  coreVisibility: 0.12,
  coreZOffset: -4.8,
  coreResting: 0.0,
  floorOpacity: 0.0,
  abyssRays: 0.0,
  abyssEmber: 0.0,
  cameraY: -0.15,
  cameraZ: 7.4,
};

const STATE_FOCUS: EnvironmentState = {
  topLight: 0.0,
  causticStrength: 0.0,
  rayStrength: 0.0,
  bloomStrength: 0.04,
  darknessMix: 1.0,
  particleSpeed: 0.25,
  particleOpacity: 0.12,
  coreVisibility: 0.1,
  coreZOffset: -4.8,
  coreResting: 0.0,
  floorOpacity: 0.02,
  abyssRays: 0.0,
  abyssEmber: 0.0,
  cameraY: -0.2,
  cameraZ: 7.35,
};

const STATE_FLOOR_APPROACH: EnvironmentState = {
  topLight: 0.0,
  causticStrength: 0.0,
  rayStrength: 0.0,
  bloomStrength: 0.08,
  darknessMix: 0.96,
  particleSpeed: 0.38,
  particleOpacity: 0.25,
  coreVisibility: 0.55,
  coreZOffset: -2.2,
  coreResting: 0.3,
  floorOpacity: 0.45,
  abyssRays: 0.08,
  abyssEmber: 0.06,
  cameraY: -0.28,
  cameraZ: 7.2,
};

const STATE_NEAR_FLOOR: EnvironmentState = {
  topLight: 0.0,
  causticStrength: 0.0,
  rayStrength: 0.0,
  bloomStrength: 0.12,
  darknessMix: 0.92,
  particleSpeed: 0.45,
  particleOpacity: 0.35,
  coreVisibility: 0.82,
  coreZOffset: -0.6,
  coreResting: 0.75,
  floorOpacity: 0.75,
  abyssRays: 0.2,
  abyssEmber: 0.18,
  cameraY: -0.35,
  cameraZ: 7.08,
};

const STATE_FLOOR: EnvironmentState = {
  topLight: 0.0,
  causticStrength: 0.0,
  rayStrength: 0.0,
  bloomStrength: 0.15,
  darknessMix: 0.9,
  particleSpeed: 0.32,
  particleOpacity: 0.38,
  coreVisibility: 0.88,
  coreZOffset: +0.15,
  coreResting: 1.0,
  floorOpacity: 0.88,
  abyssRays: 0.26,
  abyssEmber: 0.24,
  cameraY: -0.4,
  cameraZ: 7.0,
};

/**
 * Calculates continuous, smoothly interpolated environment parameters
 * based on the current smoothed depth in meters (0 to 3800 m).
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

  // 4. Deep: 1,600 to 2,400 m
  if (depth <= 2400) {
    const t = (depth - 1600) / (2400 - 1600);
    return lerpState(STATE_DEEP, STATE_ABYSS, t);
  }

  // 5. Abyss: 2,400 to 2,800 m
  if (depth <= 2800) {
    const t = (depth - 2400) / (2800 - 2400);
    return lerpState(STATE_ABYSS, STATE_FOCUS, t);
  }

  // 6. Brief Focus: 2,800 to 3,100 m
  if (depth <= 3100) {
    const t = (depth - 2800) / (3100 - 2800);
    return lerpState(STATE_FOCUS, STATE_FLOOR_APPROACH, t);
  }

  // 7. Floor Approach: 3,100 to 3,600 m
  if (depth <= 3600) {
    const t = (depth - 3100) / (3600 - 3100);
    return lerpState(STATE_FLOOR_APPROACH, STATE_NEAR_FLOOR, t);
  }

  // 8. Near Floor: 3,600 to 3,780 m
  if (depth <= 3780) {
    const t = (depth - 3600) / (3780 - 3600);
    return lerpState(STATE_NEAR_FLOOR, STATE_FLOOR, t);
  }

  // 9. Floor: 3,780 to 3,800 m
  return STATE_FLOOR;
}
