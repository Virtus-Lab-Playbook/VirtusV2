import * as THREE from "three";
import type { DepthState, SceneQuality, SignalState } from "../experience-types";
import { getEnvironmentState } from "../environment/environment-config";

export interface VirtusCommandHubInstance {
  group: THREE.Group;
  update: (
    dt: number,
    time: number,
    depthState: DepthState,
    pointer: { x: number; y: number },
    viewport: { width: number; height: number },
    signalState?: SignalState,
  ) => void;
  dispose: () => void;
}

const MAX_DEPTH = 3800;
const FINAL_LOCK_START = 3600;
const TAU = Math.PI * 2;

const DESKTOP_OUTER_TURNS = 3.0;
const DESKTOP_INNER_TURNS = -5.0;
const DESKTOP_CORE_TURNS = 1.5;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * Linear through most of the page, then smoothly reduces rotational velocity
 * from 3600 m -> 3800 m while preserving position and first-derivative
 * continuity at 3600 m. At 3800 m the derivative reaches zero, so the
 * mechanism feels as if it mechanically locks into calibration.
 */
function getSpinProgress(depth: number): number {
  const d = THREE.MathUtils.clamp(depth, 0, MAX_DEPTH);
  if (d <= FINAL_LOCK_START) return d / MAX_DEPTH;

  const x = clamp01((d - FINAL_LOCK_START) / (MAX_DEPTH - FINAL_LOCK_START));
  const p0 = FINAL_LOCK_START / MAX_DEPTH;

  // f(0)=0, f'(0)=1, f(1)=1, f'(1)=0
  const matchedEaseOut = x + x * x - x * x * x;
  return p0 + (1 - p0) * matchedEaseOut;
}

function dampScalar(
  current: number,
  target: number,
  lambda: number,
  dt: number,
  maxSpeed: number,
): number {
  const alpha = 1 - Math.exp(-lambda * dt);
  const desiredStep = (target - current) * alpha;
  const maxStep = maxSpeed * dt;
  return current + THREE.MathUtils.clamp(desiredStep, -maxStep, maxStep);
}

function viewportTurnMultiplier(width: number): number {
  if (width < 640) return 0.6;
  if (width < 1024) return 0.8;
  return 1.0;
}

/**
 * Virtus Command Hub
 *
 * Mechanical hierarchy:
 * - Presentation root: overall placement + restrained pointer tilt
 * - Primary rotor: main ring + 8 spokes + 8 orbiting node housings
 * - Secondary rotor: inner mechanical ring, counter-rotates with scroll
 * - Core rotor: central faceted shell + biolume seed, rotates more slowly
 * - Node housings: orbit with primary rotor but locally counter-rotate to stay
 *   visually stabilized
 *
 * Scroll relationship across full desktop descent:
 * - Primary rotor: +3 turns
 * - Secondary rotor: -5 turns
 * - Core rotor: +1.5 turns
 */
export function createVirtusCommandHub(
  quality: SceneQuality,
): VirtusCommandHubInstance {
  const group = new THREE.Group();
  group.name = "VirtusCommandHub";

  const assembly = new THREE.Group();
  assembly.name = "CommandHubAssembly";
  group.add(assembly);

  const primaryRotor = new THREE.Group();
  primaryRotor.name = "PrimaryRotor";
  assembly.add(primaryRotor);

  const secondaryRotor = new THREE.Group();
  secondaryRotor.name = "SecondaryRotor";
  assembly.add(secondaryRotor);

  const coreRotor = new THREE.Group();
  coreRotor.name = "CoreRotor";
  assembly.add(coreRotor);

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(geo: T): T => {
    geometries.push(geo);
    return geo;
  };

  const trackMat = <T extends THREE.Material>(mat: T): T => {
    materials.push(mat);
    return mat;
  };

  const segments = quality === "LOW" ? 40 : quality === "MEDIUM" ? 64 : 88;
  const nodeSegments = quality === "LOW" ? 24 : quality === "MEDIUM" ? 32 : 48;

  // ---------------------------------------------------------------------------
  // Materials
  // ---------------------------------------------------------------------------
  const housingMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0a242c,
      metalness: 0.92,
      roughness: 0.27,
    }),
  );

  const innerMetalMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x12333b,
      metalness: 0.86,
      roughness: 0.34,
    }),
  );

  const supportMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x0d2b33,
      metalness: 0.8,
      roughness: 0.42,
    }),
  );

  const brassMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xc8a24a,
      emissive: 0xc8a24a,
      emissiveIntensity: 0,
      metalness: 0.9,
      roughness: 0.26,
    }),
  );

  const smokyCoreMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x04171e,
      metalness: 0.58,
      roughness: 0.18,
      transparent: true,
      opacity: 0.82,
    }),
  );

  const biolumeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x31e0be,
      emissive: 0x31e0be,
      emissiveIntensity: 0.62,
      transparent: true,
      opacity: 0.9,
      roughness: 0.28,
    }),
  );

  // ---------------------------------------------------------------------------
  // Primary rotor: outer ring + 8 spokes + orbiting node housings
  // ---------------------------------------------------------------------------
  const mainRingGeo = trackGeo(
    new THREE.TorusGeometry(1.04, quality === "LOW" ? 0.045 : 0.055, 12, segments),
  );
  const mainRing = new THREE.Mesh(mainRingGeo, housingMat);
  mainRing.name = "MainOuterRing";
  primaryRotor.add(mainRing);

  // Four cardinal brass datum segments. These rotate with the primary rotor.
  const datumGeo = trackGeo(new THREE.BoxGeometry(0.035, 0.11, 0.04));
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * TAU;
    const datum = new THREE.Mesh(datumGeo, brassMat);
    datum.position.set(Math.cos(angle) * 1.04, Math.sin(angle) * 1.04, 0.015);
    datum.rotation.z = angle;
    primaryRotor.add(datum);
  }

  const spokeStartRadius = 0.46;
  const nodeOrbitRadius = 1.55;
  const spokeEndRadius = 1.35;
  const spokeLength = spokeEndRadius - spokeStartRadius;
  const spokeMidRadius = (spokeStartRadius + spokeEndRadius) * 0.5;
  const spokeThickness = quality === "LOW" ? 0.035 : 0.045;
  const spokeDepth = quality === "LOW" ? 0.035 : 0.05;
  const spokeGeo = trackGeo(
    new THREE.BoxGeometry(spokeLength, spokeThickness, spokeDepth),
  );

  const collarGeo = trackGeo(
    new THREE.CylinderGeometry(0.065, 0.065, 0.11, quality === "LOW" ? 10 : 16),
  );

  const nodeRingGeo = trackGeo(
    new THREE.TorusGeometry(0.205, 0.035, 10, nodeSegments),
  );
  const nodeCoreGeo = trackGeo(
    new THREE.IcosahedronGeometry(0.145, quality === "LOW" ? 0 : 1),
  );
  const nodeDatumGeo = trackGeo(new THREE.BoxGeometry(0.028, 0.07, 0.024));

  const nodeGroups: THREE.Group[] = [];

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * TAU;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const spoke = new THREE.Mesh(spokeGeo, supportMat);
    spoke.name = `Spoke-${i + 1}`;
    spoke.position.set(cos * spokeMidRadius, sin * spokeMidRadius, -0.01);
    spoke.rotation.z = angle;
    primaryRotor.add(spoke);

    // Small mount at the outer end of each structural arm.
    const mount = new THREE.Mesh(collarGeo, i % 2 === 0 ? brassMat : innerMetalMat);
    mount.position.set(cos * spokeEndRadius, sin * spokeEndRadius, 0);
    mount.rotation.z = angle + Math.PI / 2;
    primaryRotor.add(mount);

    const node = new THREE.Group();
    node.name = `OuterNode-${i + 1}`;
    node.position.set(cos * nodeOrbitRadius, sin * nodeOrbitRadius, 0.06);

    const nodeRing = new THREE.Mesh(nodeRingGeo, housingMat);
    node.add(nodeRing);

    const nodeCore = new THREE.Mesh(nodeCoreGeo, innerMetalMat);
    nodeCore.scale.set(1, 1, 0.72);
    node.add(nodeCore);

    // A tiny datum makes stabilization visually legible.
    const nodeDatum = new THREE.Mesh(nodeDatumGeo, brassMat);
    nodeDatum.position.set(0, 0.235, 0.025);
    node.add(nodeDatum);

    primaryRotor.add(node);
    nodeGroups.push(node);
  }

  // ---------------------------------------------------------------------------
  // Secondary rotor: independent inner mechanical ring
  // ---------------------------------------------------------------------------
  const innerRingGeo = trackGeo(
    new THREE.TorusGeometry(0.7, quality === "LOW" ? 0.028 : 0.035, 10, segments),
  );
  const innerRing = new THREE.Mesh(innerRingGeo, innerMetalMat);
  secondaryRotor.add(innerRing);

  // Bearing collars at the cardinal points make the secondary mechanism read
  // as mounted rather than floating.
  const bearingGeo = trackGeo(
    new THREE.CylinderGeometry(0.045, 0.045, 0.12, quality === "LOW" ? 10 : 14),
  );
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * TAU;
    const bearing = new THREE.Mesh(bearingGeo, i === 0 ? brassMat : supportMat);
    bearing.position.set(Math.cos(angle) * 0.7, Math.sin(angle) * 0.7, 0.02);
    bearing.rotation.z = angle + Math.PI / 2;
    secondaryRotor.add(bearing);
  }

  // Fixed mechanical tilt: the secondary ring is never perfectly coplanar with
  // the outer wheel, preserving real 3D depth while it counter-rotates.
  secondaryRotor.rotation.x = 0.36;
  secondaryRotor.rotation.y = -0.16;

  // ---------------------------------------------------------------------------
  // Central bearing + core rotor
  // ---------------------------------------------------------------------------
  const centerCollarGeo = trackGeo(
    new THREE.TorusGeometry(0.39, 0.038, 10, segments),
  );
  const centerCollar = new THREE.Mesh(centerCollarGeo, supportMat);
  centerCollar.position.z = 0.06;
  assembly.add(centerCollar);

  const coreShellGeo = trackGeo(
    new THREE.IcosahedronGeometry(0.34, quality === "LOW" ? 0 : 1),
  );
  const coreShell = new THREE.Mesh(coreShellGeo, smokyCoreMat);
  coreShell.scale.set(1, 1, 0.8);
  coreRotor.add(coreShell);

  const seedGeo = trackGeo(new THREE.OctahedronGeometry(0.125, 0));
  const seed = new THREE.Mesh(seedGeo, biolumeMat);
  seed.position.z = 0.035;
  coreRotor.add(seed);

  coreRotor.position.z = 0.13;

  // ---------------------------------------------------------------------------
  // Motion state
  // ---------------------------------------------------------------------------
  let outerAngle = 0;
  let innerAngle = 0;
  let coreAngle = 0;

  let outerIdlePhase = 0;
  let innerIdlePhase = 0;
  let coreIdlePhase = 0;

  let pointerYaw = 0;
  let pointerPitch = 0;
  let velocityLag = 0;
  let signalGimbalOffset = 0;
  let signalYawOffset = 0;
  let signalBiolumeBoost = 0;
  let signalBrassWarmth = 0;
  let briefPulseTimer = 0;

  const enablePointer = quality === "HIGH" || quality === "MEDIUM";

  const update = (
    dt: number,
    time: number,
    depthState: DepthState,
    pointer: { x: number; y: number },
    viewport: { width: number; height: number },
    signalState?: SignalState,
  ) => {
    const env = getEnvironmentState(depthState.smoothedDepth);
    const turnMultiplier = viewportTurnMultiplier(viewport.width);

    // Use section-aware RAW depth to define the destination angle. Mechanical
    // damping below supplies the visible inertia, so the mechanism responds to
    // scrolling immediately without depending on an extra scroll listener.
    const spinProgress = getSpinProgress(depthState.rawDepth);

    const outerTarget = spinProgress * TAU * DESKTOP_OUTER_TURNS * turnMultiplier;
    const innerTarget = spinProgress * TAU * DESKTOP_INNER_TURNS * turnMultiplier;
    const coreTarget = spinProgress * TAU * DESKTOP_CORE_TURNS * turnMultiplier;

    // Scroll-linked mechanical rotation with physically bounded catch-up speed.
    outerAngle = dampScalar(outerAngle, outerTarget, 7.0, dt, 6.2);
    innerAngle = dampScalar(innerAngle, innerTarget, 7.8, dt, 9.0);
    coreAngle = dampScalar(coreAngle, coreTarget, 5.0, dt, 3.8);

    // Tiny scroll-velocity lag is secondary. It never determines the actual
    // accumulated mechanical orientation.
    const targetLag = THREE.MathUtils.clamp(depthState.velocity * 0.00012, -0.12, 0.12);
    velocityLag += (targetLag - velocityLag) * (1 - Math.exp(-5.0 * dt));

    // -----------------------------------------------------------------------
    // Existing UI -> 3D signals remain supplementary
    // -----------------------------------------------------------------------
    let targetGimbal = 0;
    let targetYaw = 0;
    let targetBiolume = 0;
    let targetBrass = 0;

    if (signalState) {
      const { activeSignal, activeSignalIndex } = signalState;

      if (activeSignal === "service") {
        const idx = activeSignalIndex >= 0 ? activeSignalIndex : 0;
        targetGimbal = (idx - 1.5) * 0.025;
        targetYaw = (idx - 1.5) * 0.018;
        targetBiolume = 0.12;
      } else if (activeSignal === "process") {
        const idx = activeSignalIndex >= 0 ? activeSignalIndex : 0;
        targetGimbal = Math.sin(idx * 1.2) * 0.02;
        targetBiolume = 0.04;
      } else if (activeSignal === "work") {
        const idx = activeSignalIndex >= 0 ? activeSignalIndex : 1;
        targetYaw = (idx - 1) * 0.035;
        targetBiolume = 0.08;
      } else if (activeSignal === "package") {
        targetBrass = 0.32;
        targetBiolume = 0.03;
      } else if (activeSignal === "brief-pulse") {
        briefPulseTimer = 1.1;
      }
    }

    if (briefPulseTimer > 0) {
      briefPulseTimer = Math.max(0, briefPulseTimer - dt);
      targetBiolume += (briefPulseTimer / 1.1) * 0.24;
    }

    const signalAlpha = 1 - Math.exp(-3.6 * dt);
    signalGimbalOffset += (targetGimbal - signalGimbalOffset) * signalAlpha;
    signalYawOffset += (targetYaw - signalYawOffset) * signalAlpha;
    signalBiolumeBoost += (targetBiolume - signalBiolumeBoost) * signalAlpha;
    signalBrassWarmth += (targetBrass - signalBrassWarmth) * signalAlpha;

    // -----------------------------------------------------------------------
    // Very slow idle motion. Scroll remains unmistakably dominant.
    // -----------------------------------------------------------------------
    const idleStrength = (1 - env.coreResting) * 0.22;
    outerIdlePhase += dt * 0.008;
    innerIdlePhase -= dt * 0.011;
    coreIdlePhase += dt * 0.004;

    const outerVisual = outerAngle + outerIdlePhase * idleStrength + velocityLag;
    const innerVisual = innerAngle + innerIdlePhase * idleStrength - velocityLag * 0.55;
    const coreVisual = coreAngle + coreIdlePhase * idleStrength;

    // Primary scroll-driven wheel. This is the dominant visible behavior.
    primaryRotor.rotation.z = outerVisual;

    // Counter-rotating inner mechanism. X/Y tilt stay fixed for dimensionality.
    secondaryRotor.rotation.z = innerVisual + signalGimbalOffset;

    // Slow central rotor hierarchy.
    coreRotor.rotation.z = coreVisual;
    seed.rotation.y = time * 0.09 * (1 - env.coreResting * 0.9);

    // Stabilize the eight outer nodes while their mounts orbit with the wheel.
    // 0.97 leaves a tiny 3% residual mechanical rotation so stabilization does
    // not feel mathematically sterile.
    for (let i = 0; i < nodeGroups.length; i++) {
      nodeGroups[i].rotation.z = -outerVisual * 0.97;
    }

    // -----------------------------------------------------------------------
    // Responsive overall placement, preserving the current site composition
    // -----------------------------------------------------------------------
    let baseX = 2.15;
    let baseY = 0.25;
    let baseScale = 0.88;

    if (viewport.width < 640) {
      baseX = 0;
      baseY = 0.35;
      baseScale = 0.47;
    } else if (viewport.width < 1024) {
      baseX = 0.75;
      baseY = 0.15;
      baseScale = 0.63;
    } else if (viewport.width < 1280) {
      baseX = 1.7;
      baseScale = 0.78;
    }

    const depthZ = 0.5 + env.coreZOffset;
    const depthScale = baseScale * (0.48 + env.coreVisibility * 0.52);

    group.position.set(baseX, baseY, depthZ);
    group.scale.setScalar(depthScale);

    // -----------------------------------------------------------------------
    // Presentation angle: separate from internal gyroscope rotation
    // -----------------------------------------------------------------------
    const pointerFactor = enablePointer ? (1 - env.coreResting * 0.8) : 0;
    const targetPointerYaw =
      -0.18 + pointer.x * 0.045 * pointerFactor + signalYawOffset;
    const targetPointerPitch = 0.12 - pointer.y * 0.032 * pointerFactor;
    const pointerAlpha = 1 - Math.exp(-3.0 * dt);

    pointerYaw += (targetPointerYaw - pointerYaw) * pointerAlpha;
    pointerPitch += (targetPointerPitch - pointerPitch) * pointerAlpha;

    group.rotation.y = pointerYaw;
    group.rotation.x = pointerPitch;
    group.rotation.z = 0.015;

    // -----------------------------------------------------------------------
    // Depth + signal material response
    // -----------------------------------------------------------------------
    smokyCoreMat.opacity = 0.82 * env.coreVisibility;
    biolumeMat.opacity = 0.9 * env.coreVisibility;
    biolumeMat.emissiveIntensity =
      (0.62 + signalBiolumeBoost) * env.coreVisibility;
    brassMat.emissiveIntensity = signalBrassWarmth * env.coreVisibility;
  };

  const dispose = () => {
    for (const geo of geometries) geo.dispose();
    for (const mat of materials) mat.dispose();
  };

  return {
    group,
    update,
    dispose,
  };
}
