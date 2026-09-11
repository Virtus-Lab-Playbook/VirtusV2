import * as THREE from "three";
import type { DepthState, SceneQuality, SignalState } from "../experience-types";
import { getEnvironmentState } from "../environment/environment-config";

export interface VirtusCoreInstance {
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

/**
 * Procedural Virtus Core
 *
 * Signature oceanographic instrument object:
 * - Outer instrument ring with cardinal brass ticks
 * - Inner tilted gimbal ring with axle pivots
 * - Central smoky faceted octahedron with inner biolume spark
 *
 * Phase 4 Full Descent Journey:
 * - Surface (0–210 m): Prominent in Hero right visual area
 * - Descent/Abyss (500–3100 m): Recedes deep into distance
 * - Floor Approach (3100–3600 m): Returns gradually
 * - Final CTA / Floor (3780–3800 m): Arrives at final resting orientation opposite CTA text
 */
export function createVirtusCore(quality: SceneQuality): VirtusCoreInstance {
  const group = new THREE.Group();
  group.name = "VirtusCore";

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

  // --- Shared Materials ---
  const darkMetalMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x082530),
      metalness: 0.88,
      roughness: 0.32,
    }),
  );

  const innerDarkMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x051a22),
      metalness: 0.82,
      roughness: 0.38,
    }),
  );

  const brassMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xc8a24a),
      metalness: 0.85,
      roughness: 0.28,
    }),
  );

  const smokyFacetMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x04171e),
      metalness: 0.65,
      roughness: 0.2,
      transparent: true,
      opacity: 0.78,
    }),
  );

  const biolumeInnerMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x31e0be),
      emissive: new THREE.Color(0x31e0be),
      emissiveIntensity: 0.55,
      transparent: true,
      opacity: 0.85,
      roughness: 0.3,
    }),
  );

  // --- 1. Outer Instrument Ring ---
  const outerRingGroup = new THREE.Group();
  const outerSegments = quality === "LOW" ? 36 : 64;
  const outerRingGeo = trackGeo(
    new THREE.TorusGeometry(1.4, 0.02, 16, outerSegments),
  );
  const outerRingMesh = new THREE.Mesh(outerRingGeo, darkMetalMat);
  outerRingGroup.add(outerRingMesh);

  // Precision brass tick marks along the outer ring
  if (quality !== "LOW") {
    const tickCount = 8;
    const tickGeo = trackGeo(new THREE.BoxGeometry(0.016, 0.07, 0.028));
    for (let i = 0; i < tickCount; i++) {
      const angle = (i / tickCount) * Math.PI * 2;
      const tick = new THREE.Mesh(tickGeo, brassMat);
      tick.position.set(Math.cos(angle) * 1.4, Math.sin(angle) * 1.4, 0);
      tick.rotation.z = angle + Math.PI / 2;
      outerRingGroup.add(tick);
    }
  }

  group.add(outerRingGroup);

  // --- 2. Inner Gimbal Ring ---
  const innerRingGroup = new THREE.Group();
  const innerRingGeo = trackGeo(
    new THREE.TorusGeometry(1.12, 0.016, 16, outerSegments),
  );
  const innerRingMesh = new THREE.Mesh(innerRingGeo, innerDarkMat);
  innerRingGroup.add(innerRingMesh);

  // Gimbal axle pivots
  const pivotGeo = trackGeo(new THREE.CylinderGeometry(0.018, 0.018, 0.18, 12));
  const topPivot = new THREE.Mesh(pivotGeo, brassMat);
  topPivot.position.set(0, 1.25, 0);
  innerRingGroup.add(topPivot);

  const btmPivot = new THREE.Mesh(pivotGeo, brassMat);
  btmPivot.position.set(0, -1.25, 0);
  innerRingGroup.add(btmPivot);

  innerRingGroup.rotation.x = Math.PI * 0.28;
  group.add(innerRingGroup);

  // --- 3. Central Smoky Faceted Core ---
  const coreGroup = new THREE.Group();

  const coreGeo = trackGeo(new THREE.OctahedronGeometry(0.48, 0));
  const coreMesh = new THREE.Mesh(coreGeo, smokyFacetMat);
  coreGroup.add(coreMesh);

  const innerSparkGeo = trackGeo(new THREE.OctahedronGeometry(0.2, 0));
  const innerSparkMesh = new THREE.Mesh(innerSparkGeo, biolumeInnerMat);
  coreGroup.add(innerSparkMesh);

  group.add(coreGroup);

  // --- Animation & Motion State ---
  let velocityLag = 0;
  const enablePointer = quality === "HIGH" || quality === "MEDIUM";

  // Supplementary UI Interaction Lerp Offsets (Never jarring, smoothly returning)
  let signalGimbalOffset = 0;
  let signalYawOffset = 0;
  let signalBiolumeBoost = 0;
  let signalBrassWarmth = 0;
  let briefPulseTimer = 0;

  const update = (
    dt: number,
    time: number,
    depthState: DepthState,
    pointer: { x: number; y: number },
    viewport: { width: number; height: number },
    signalState?: SignalState,
  ) => {
    const env = getEnvironmentState(depthState.smoothedDepth);

    // 1. Scroll velocity reaction (subtle ring deflection)
    const targetLag = Math.min(0.25, Math.max(-0.25, depthState.velocity * 0.0003));
    velocityLag += (targetLag - velocityLag) * Math.min(1, dt * 4.0);

    // 2. Motion speed throttled by resting state near floor
    const motionSpeed = 1.0 - env.coreResting * 0.82;

    // 3. Evaluate Supplementary Scene Signals
    let targetGimbal = 0;
    let targetYaw = 0;
    let targetBiolume = 0;
    let targetBrass = 0;

    if (signalState) {
      const { activeSignal, activeSignalIndex } = signalState;

      if (activeSignal === "service") {
        // Services: subtle ring tilt (3-4 deg) & gentle biolume shift
        const idx = activeSignalIndex >= 0 ? activeSignalIndex : 0;
        targetGimbal = (idx - 1.5) * 0.045;
        targetYaw = (idx - 1.5) * 0.03;
        targetBiolume = 0.16;
      } else if (activeSignal === "process") {
        // Process: very small instrument tick
        const idx = activeSignalIndex >= 0 ? activeSignalIndex : 0;
        targetGimbal = Math.sin(idx * 1.2) * 0.035;
        targetBiolume = 0.05;
      } else if (activeSignal === "work") {
        // Work: subtle orientation response toward project beacon
        const idx = activeSignalIndex >= 0 ? activeSignalIndex : 1;
        targetYaw = (idx - 1) * 0.05;
        targetBiolume = 0.10;
      } else if (activeSignal === "package") {
        // Packages: subtle warm brass response in Core instrument edges
        targetBrass = 0.35;
        targetBiolume = 0.04;
      } else if (activeSignal === "brief-pulse") {
        // BriefBuilder: one-time gentle biolume pulse triggered on answer selection
        briefPulseTimer = 1.2;
      }
    }

    if (briefPulseTimer > 0) {
      briefPulseTimer = Math.max(0, briefPulseTimer - dt);
      targetBiolume += (briefPulseTimer / 1.2) * 0.28;
    }

    // Smooth lerping of all signal offsets back to baseline
    signalGimbalOffset += (targetGimbal - signalGimbalOffset) * Math.min(1, dt * 3.2);
    signalYawOffset += (targetYaw - signalYawOffset) * Math.min(1, dt * 3.2);
    signalBiolumeBoost += (targetBiolume - signalBiolumeBoost) * Math.min(1, dt * 3.5);
    signalBrassWarmth += (targetBrass - signalBrassWarmth) * Math.min(1, dt * 3.5);

    // Idle mechanical motion + signal modulations
    outerRingGroup.rotation.y = time * 0.038 * motionSpeed + velocityLag;
    innerRingGroup.rotation.x =
      time * -0.024 * motionSpeed -
      velocityLag * 0.6 +
      env.coreResting * (Math.PI * 0.22);
    innerRingGroup.rotation.z =
      Math.sin(time * 0.018 * motionSpeed) * 0.08 + signalGimbalOffset;

    coreGroup.rotation.y = time * -0.014 * motionSpeed;
    coreGroup.rotation.x = Math.sin(time * 0.022 * motionSpeed) * 0.04;
    innerSparkMesh.rotation.y = time * 0.06 * motionSpeed;

    // 4. Responsive base placement & Hero framing
    let baseX = 2.15;
    let baseY = 0.25;
    let baseScale = 1.0;

    if (viewport.width < 640) {
      // Mobile: centered, non-intrusive
      baseX = 0.0;
      baseY = 0.35;
      baseScale = 0.52;
    } else if (viewport.width < 1024) {
      // Tablet
      baseX = 0.85;
      baseY = 0.15;
      baseScale = 0.72;
    } else if (viewport.width < 1280) {
      // Narrow desktop
      baseX = 1.85;
      baseScale = 0.88;
    }

    // 5. Depth-driven position and scale modulation
    const depthZ = 0.5 + env.coreZOffset;
    const depthScale = baseScale * (0.45 + env.coreVisibility * 0.55);

    group.scale.set(depthScale, depthScale, depthScale);
    group.position.set(baseX, baseY, depthZ);

    // Material opacities & biolume emissions
    smokyFacetMat.opacity = 0.78 * env.coreVisibility;
    biolumeInnerMat.opacity = 0.85 * env.coreVisibility;
    biolumeInnerMat.emissiveIntensity =
      (0.55 + signalBiolumeBoost) * env.coreVisibility;

    // Warm brass edge response on package inspection
    brassMat.emissive.setHex(0xc8a24a);
    brassMat.emissiveIntensity = signalBrassWarmth * env.coreVisibility;

    // 6. Pointer reaction (Desktop only, damped down in focus and resting states)
    if (enablePointer) {
      const pointerFactor = 1.0 - env.coreResting * 0.65;
      const targetPointerYaw = pointer.x * 0.06 * pointerFactor + signalYawOffset;
      const targetPointerPitch = -pointer.y * 0.045 * pointerFactor;
      group.rotation.y += (targetPointerYaw - group.rotation.y) * Math.min(1, dt * 3.5);
      group.rotation.x += (targetPointerPitch - group.rotation.x) * Math.min(1, dt * 3.5);
    } else {
      group.rotation.y = signalYawOffset;
      group.rotation.x = 0;
    }
  };

  const dispose = () => {
    for (const geo of geometries) {
      geo.dispose();
    }
    for (const mat of materials) {
      mat.dispose();
    }
  };

  return {
    group,
    update,
    dispose,
  };
}
