import * as THREE from "three";
import type { DepthState, SceneQuality } from "../experience-types";

export interface VirtusCoreInstance {
  group: THREE.Group;
  update: (
    dt: number,
    time: number,
    depthState: DepthState,
    pointer: { x: number; y: number },
    viewport: { width: number; height: number },
  ) => void;
  dispose: () => void;
}

/**
 * Procedural Virtus Core
 *
 * Represents precision, technology, oceanographic instrumentation,
 * and high-craft industrial design.
 *
 * Visual balance:
 * - 85% Dark metallic (abyss/deep tones)
 * - 10% Instrument brass detail
 * - 5% Biolume cold glow emission
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

  // Gimbal axle pivots (brass connectors)
  const pivotGeo = trackGeo(new THREE.CylinderGeometry(0.018, 0.018, 0.18, 12));
  const topPivot = new THREE.Mesh(pivotGeo, brassMat);
  topPivot.position.set(0, 1.25, 0);
  innerRingGroup.add(topPivot);

  const btmPivot = new THREE.Mesh(pivotGeo, brassMat);
  btmPivot.position.set(0, -1.25, 0);
  innerRingGroup.add(btmPivot);

  // Initial tilt on gimbal
  innerRingGroup.rotation.x = Math.PI * 0.28;
  group.add(innerRingGroup);

  // --- 3. Central Smoky Faceted Core ---
  const coreGroup = new THREE.Group();

  const coreGeo = trackGeo(new THREE.OctahedronGeometry(0.48, 0));
  const coreMesh = new THREE.Mesh(coreGeo, smokyFacetMat);
  coreGroup.add(coreMesh);

  // Inner bioluminescent spark
  const innerSparkGeo = trackGeo(new THREE.OctahedronGeometry(0.2, 0));
  const innerSparkMesh = new THREE.Mesh(innerSparkGeo, biolumeInnerMat);
  coreGroup.add(innerSparkMesh);

  group.add(coreGroup);

  // --- Animation & Motion State ---
  let velocityLag = 0;
  const enablePointer = quality === "HIGH" || quality === "MEDIUM";

  /**
   * Per-frame update routine:
   * - Very slow idle mechanical rotation
   * - Damped pointer orientation reaction (HIGH / MEDIUM only)
   * - Inertial scroll velocity lag
   * - Hero positioning & depth-based recession
   */
  const update = (
    dt: number,
    time: number,
    depthState: DepthState,
    pointer: { x: number; y: number },
    viewport: { width: number; height: number },
  ) => {
    // 1. Scroll velocity reaction (subtle inertial ring deflection)
    const targetLag = Math.min(0.25, Math.max(-0.25, depthState.velocity * 0.0003));
    velocityLag += (targetLag - velocityLag) * Math.min(1, dt * 4.0);

    // 2. Idle mechanical motion (slow, restrained, continuous)
    outerRingGroup.rotation.y = time * 0.038 + velocityLag;
    innerRingGroup.rotation.x = time * -0.024 - velocityLag * 0.6;
    innerRingGroup.rotation.z = Math.sin(time * 0.018) * 0.08;

    coreGroup.rotation.y = time * -0.014;
    coreGroup.rotation.x = Math.sin(time * 0.022) * 0.04;
    innerSparkMesh.rotation.y = time * 0.06;

    // 3. Responsive base placement & Hero framing
    // Desktop: positioned in the right visual third (x ~ +2.1), leaving text clear.
    // Tablet: smaller and pushed slightly back.
    // Mobile: centered, backgrounded, non-intrusive.
    let baseX = 2.15;
    let baseY = 0.25;
    let baseZ = 0.5;
    let baseScale = 1.0;

    if (viewport.width < 640) {
      // Mobile
      baseX = 0.0;
      baseY = 0.4;
      baseZ = -2.4;
      baseScale = 0.55;
    } else if (viewport.width < 1024) {
      // Tablet
      baseX = 0.85;
      baseY = 0.15;
      baseZ = -1.4;
      baseScale = 0.72;
    } else if (viewport.width < 1280) {
      // Modest desktop
      baseX = 1.85;
      baseScale = 0.88;
    }

    // 4. Depth-based recession (0 m to 3800 m)
    // 0 - 600 m: Core prominent in Hero
    // 600 - 1500 m: Core smoothly recedes back into the abyss
    // > 1500 m: Sits deep in background with subdued presence
    const depth = depthState.smoothedDepth;
    let depthRecedeZ = 0;
    let depthScaleMult = 1.0;
    let depthOpacity = 1.0;

    if (depth > 500) {
      const recedeT = Math.min(1, (depth - 500) / 1100);
      depthRecedeZ = -recedeT * 4.5;
      depthScaleMult = 1.0 - recedeT * 0.35;
      depthOpacity = Math.max(0.12, 1.0 - recedeT * 0.75);
    }

    // Apply scale & position
    const currentScale = baseScale * depthScaleMult;
    group.scale.set(currentScale, currentScale, currentScale);
    group.position.set(baseX, baseY, baseZ + depthRecedeZ);

    smokyFacetMat.opacity = 0.78 * depthOpacity;
    biolumeInnerMat.opacity = 0.85 * depthOpacity;

    // 5. Pointer reaction (±3° yaw, ±2.5° pitch max; Desktop only)
    if (enablePointer) {
      const targetYaw = pointer.x * 0.06;
      const targetPitch = -pointer.y * 0.045;
      group.rotation.y += (targetYaw - group.rotation.y) * Math.min(1, dt * 3.5);
      group.rotation.x += (targetPitch - group.rotation.x) * Math.min(1, dt * 3.5);
    } else {
      group.rotation.y = 0;
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
