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
 * Data-driven Core Choreography Pose Definition.
 * Defines spatial position, scale, 3D orientation, and motion intensity
 * across key environmental depth milestones.
 */
export interface CorePoseDefinition {
  depth: number;
  x: number;       // Base X on standard desktop
  y: number;       // Base Y on standard desktop
  z: number;       // Base Z (depth into/out of screen)
  scale: number;   // Scale factor
  euler: [number, number, number]; // [pitch (X), yaw (Y), roll (Z)] in radians
  motionIntensity: number; // Idle motion & velocity reaction multiplier (0.0 to 1.0)
}

/**
 * Centralized Core Choreography Path (0 m -> 3,800 m)
 *
 * Designed to support HTML content layout without obscuring primary text:
 * 1. 0 m / Hero: Right side, close, prominent, luminous 3/4 presentation
 * 2. 210 m / Services: Right side, slightly lower, slightly farther
 * 3. 1200 m / Process: Move toward center-right, recede into twilight
 * 4. 1600 m / Work: Traverse toward left-center background, smaller companion to project cards
 * 5. 2400 m / Why Virtus: Far background, quiet and expansive
 * 6. 2800 m / BriefBuilder: Almost stationary, very distant, subdued (rest zone)
 * 7. 3100 m / Packages: Begin returning from abyss as seafloor approaches
 * 8. 3600 m / FAQ: Closer, shifting toward right margin
 * 9. 3780 m / Final CTA: Right side, full readable silhouette opposite CTA copy
 * 10. 3800 m / Footer: Calibrated zero resting destination
 */
export const CORE_CHOREOGRAPHY_POSES: readonly CorePoseDefinition[] = [
  { depth: 0,    x: 2.20,  y: 0.25,  z: 0.50,  scale: 0.94, euler: [0.175, -0.220, 0.050], motionIntensity: 1.00 },
  { depth: 210,  x: 2.05,  y: -0.15, z: -0.20, scale: 0.85, euler: [0.140, -0.160, 0.035], motionIntensity: 0.95 },
  { depth: 1200, x: 1.40,  y: 0.05,  z: -2.20, scale: 0.65, euler: [0.220, -0.080, 0.080], motionIntensity: 0.75 },
  { depth: 1600, x: -1.20, y: 0.30,  z: -4.20, scale: 0.45, euler: [0.100, 0.180, -0.060], motionIntensity: 0.60 },
  { depth: 2400, x: -0.60, y: -0.20, z: -4.80, scale: 0.38, euler: [0.080, 0.050, 0.020],  motionIntensity: 0.40 },
  { depth: 2800, x: 0.00,  y: 0.10,  z: -4.80, scale: 0.32, euler: [0.050, 0.000, 0.000],  motionIntensity: 0.15 },
  { depth: 3100, x: 1.20,  y: 0.20,  z: -2.40, scale: 0.58, euler: [0.180, -0.150, 0.040], motionIntensity: 0.65 },
  { depth: 3600, x: 1.90,  y: -0.10, z: -0.60, scale: 0.80, euler: [0.220, -0.180, 0.060], motionIntensity: 0.50 },
  { depth: 3780, x: 2.15,  y: 0.20,  z: 0.45,  scale: 0.92, euler: [0.240, -0.140, 0.030], motionIntensity: 0.18 },
  { depth: 3800, x: 2.20,  y: 0.25,  z: 0.50,  scale: 0.94, euler: [0.255, -0.100, 0.020], motionIntensity: 0.06 },
] as const;

// Precomputed target quaternions for all milestones
const POSE_QUATERNIONS = CORE_CHOREOGRAPHY_POSES.map((p) => {
  const q = new THREE.Quaternion();
  q.setFromEuler(new THREE.Euler(p.euler[0], p.euler[1], p.euler[2], "YXZ"));
  return q;
});

function smoothstep(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

/**
 * Effective scroll progress mapping depth (0 -> 3800m) to normalized progress (0.0 -> 1.0).
 *
 * Designed for continuous, noticeable mechanical gyroscope rotation throughout the descent:
 * - Linear region from 0 m to 3500 m (Hero through Packages)
 * - Continuous C1 quadratic deceleration between 3500 m and 3800 m
 * - Reaches exactly s(3800) = 1.0 with s'(3800) = 0, gently locking into calibrated zero alignment
 * - Monotonically non-decreasing: strictly reverses when scrolling up, never bounces backward
 */
export function getEffectiveScrollProgress(depth: number): number {
  if (depth <= 0) return 0;
  if (depth >= 3800) return 1;

  const x0 = 3500;
  const m = 2 / (3800 + x0); // 1 / 3650 ≈ 0.00027397
  if (depth <= x0) {
    return depth * m;
  }

  // Smooth quadratic ease-out into 3800m calibration
  const a = 1 / ((3800 - x0) * (3800 + x0)); // 1 / 2,190,000
  const dist = 3800 - depth;
  return 1 - a * dist * dist;
}

/**
 * Procedural Virtus Core: Precision Marine Chronometer & Gyroscope
 *
 * Art-directed precision marine instrument:
 * - Data-driven 0-3800m scroll choreography following the visitor through depth
 * - Three-quarter default presentation revealing machined ring thickness & Z-layering
 * - Non-coplanar inner gimbal ring reading as an elegant 3D ellipse
 * - Asymmetric calibration scale: 1 elongated primary zenith datum + 3 cardinal markers + 20 minor ticks
 * - Thick machined outer housing with stepped concentric inner bezel
 * - 4 substantial structural spider struts and brass clamp brackets
 * - Machined central jewel retaining collar with brass clips
 * - Smoked optical crystal shell housing a luminous teal (#31E0BE) energy seed
 * - Internal focal point lighting casting physical luminescence outward
 * - Differentiated material system: cold titanium, graphite-blue alloy, brushed steel, champagne brass
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

  const dummy = new THREE.Object3D();

  // --- 1. Differentiated Machined Material System ---
  // Outer housing: darkest, most metallic cold titanium / deep abyss finish
  const outerMetalMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x04131a),
      metalness: 0.94,
      roughness: 0.24,
    }),
  );

  // Inner gimbal: slightly lighter graphite-blue marine anodized alloy
  const innerGimbalMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x0c2733),
      metalness: 0.84,
      roughness: 0.30,
    }),
  );

  // Structural spider struts: brushed satin structural steel
  const strutMetalMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x081f2a),
      metalness: 0.90,
      roughness: 0.36,
    }),
  );

  // Champagne brass: marine instrument accent (#C8A24A)
  const brassMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xc8a24a),
      metalness: 0.92,
      roughness: 0.22,
    }),
  );

  // Smoked faceted shell: dark optical crystal with clear specular facets
  const smokyFacetMat = trackMat(
    quality === "LOW"
      ? new THREE.MeshStandardMaterial({
          color: new THREE.Color(0x082832),
          metalness: 0.40,
          roughness: 0.20,
          transparent: true,
          opacity: 0.65,
        })
      : new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(0x082832),
          metalness: 0.20,
          roughness: 0.12,
          transmission: 0.60,
          thickness: 0.45,
          clearcoat: 0.70,
          clearcoatRoughness: 0.10,
          transparent: true,
          opacity: 0.68,
        }),
  );

  // Inner bioluminescent energy seed (#31E0BE) — radiant focal point
  const biolumeInnerMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x31e0be),
      emissive: new THREE.Color(0x31e0be),
      emissiveIntensity: 1.15,
      roughness: 0.12,
      metalness: 0.05,
    }),
  );

  // Micro-fastener material
  const fastenerMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x030f14),
      metalness: 0.95,
      roughness: 0.18,
    }),
  );

  // Geometry segmentation by quality tier
  const outerRadial = quality === "LOW" ? 12 : quality === "MEDIUM" ? 18 : 24;
  const outerTubular = quality === "LOW" ? 44 : quality === "MEDIUM" ? 72 : 96;
  const innerRadial = quality === "LOW" ? 10 : quality === "MEDIUM" ? 14 : 16;
  const innerTubular = quality === "LOW" ? 44 : quality === "MEDIUM" ? 72 : 96;
  const gimbalRadial = quality === "LOW" ? 12 : quality === "MEDIUM" ? 16 : 20;
  const gimbalTubular = quality === "LOW" ? 36 : quality === "MEDIUM" ? 60 : 80;

  // --- 2. Outer Structural Housing & Instrument Bezel ---
  const outerRingGroup = new THREE.Group();
  outerRingGroup.name = "OuterRingAssembly";

  // Machined primary housing ring (radius 1.42, tube thickness 0.052)
  const outerRingGeo = trackGeo(
    new THREE.TorusGeometry(1.42, 0.052, outerRadial, outerTubular),
  );
  const outerRingMesh = new THREE.Mesh(outerRingGeo, outerMetalMat);
  outerRingGroup.add(outerRingMesh);

  // Concentric stepped inner bezel ring (creates datum groove profile at Z = -0.008)
  const innerBezelGeo = trackGeo(
    new THREE.TorusGeometry(1.36, 0.014, innerRadial, innerTubular),
  );
  const innerBezelMesh = new THREE.Mesh(innerBezelGeo, innerGimbalMat);
  innerBezelMesh.position.z = -0.008;
  outerRingGroup.add(innerBezelMesh);

  // Segmented champagne-brass inlays: 4 cardinal arcs (~10% brass coverage)
  const brassInlayArcGeo = trackGeo(
    new THREE.TorusGeometry(1.42, 0.054, 16, 20, Math.PI * 0.05),
  );
  const brassInlays = new THREE.InstancedMesh(brassInlayArcGeo, brassMat, 4);
  for (let i = 0; i < 4; i++) {
    const centerAngle = (i * Math.PI) / 2;
    dummy.position.set(0, 0, 0.002);
    dummy.rotation.set(0, 0, centerAngle - Math.PI * 0.025);
    dummy.updateMatrix();
    brassInlays.setMatrixAt(i, dummy.matrix);
  }
  brassInlays.instanceMatrix.needsUpdate = true;
  outerRingGroup.add(brassInlays);

  // --- Asymmetrical Calibration Scale (24 Ticks Total) ---
  // 1 Primary Zenith Datum Marker (top 12 o'clock, angle = π/2, index = 6): elongated brass rule + datum pip
  // 3 Cardinal Major Markers (indices 0, 12, 18): standard major brass markers
  // 20 Minor Graduations: dark metal / shelf-tone instrument ticks
  const datumMajorGeo = trackGeo(new THREE.BoxGeometry(0.018, 0.110, 0.042));
  const datumPipGeo = trackGeo(new THREE.CylinderGeometry(0.014, 0.014, 0.020, 12));
  const tickMajorGeo = trackGeo(new THREE.BoxGeometry(0.014, 0.065, 0.035));
  const tickMinorGeo = trackGeo(new THREE.BoxGeometry(0.008, 0.038, 0.024));

  // 1 Zenith Datum
  const zenithRule = new THREE.Mesh(datumMajorGeo, brassMat);
  zenithRule.position.set(0, 1.40, 0.050);
  outerRingGroup.add(zenithRule);

  const zenithPip = new THREE.Mesh(datumPipGeo, brassMat);
  zenithPip.position.set(0, 1.28, 0.046);
  zenithPip.rotation.x = Math.PI / 2;
  outerRingGroup.add(zenithPip);

  // 3 Cardinal Major Ticks
  const majorTicks = new THREE.InstancedMesh(tickMajorGeo, brassMat, 3);
  const cardinalIndices = [0, 12, 18];
  cardinalIndices.forEach((idx, i) => {
    const angle = (idx / 24) * Math.PI * 2;
    dummy.position.set(
      Math.cos(angle) * 1.42,
      Math.sin(angle) * 1.42,
      0.048,
    );
    dummy.rotation.set(0, 0, angle + Math.PI / 2);
    dummy.updateMatrix();
    majorTicks.setMatrixAt(i, dummy.matrix);
  });
  majorTicks.instanceMatrix.needsUpdate = true;
  outerRingGroup.add(majorTicks);

  // 20 Minor Graduations
  if (quality !== "LOW") {
    const minorTicks = new THREE.InstancedMesh(tickMinorGeo, outerMetalMat, 20);
    let minIdx = 0;
    for (let i = 0; i < 24; i++) {
      if (i === 6 || cardinalIndices.includes(i)) continue;
      const angle = (i / 24) * Math.PI * 2;
      dummy.position.set(
        Math.cos(angle) * 1.42,
        Math.sin(angle) * 1.42,
        0.048,
      );
      dummy.rotation.set(0, 0, angle + Math.PI / 2);
      dummy.updateMatrix();
      minorTicks.setMatrixAt(minIdx++, dummy.matrix);
    }
    minorTicks.instanceMatrix.needsUpdate = true;
    outerRingGroup.add(minorTicks);
  }

  group.add(outerRingGroup);

  // --- 3. Inner Gimbal Assembly with Bearing Trunnions ---
  const innerRingGroup = new THREE.Group();
  innerRingGroup.name = "InnerGimbalAssembly";

  // Machined inner gimbal ring (radius 1.14, tube thickness 0.038)
  const gimbalGeo = trackGeo(
    new THREE.TorusGeometry(1.14, 0.038, gimbalRadial, gimbalTubular),
  );
  const gimbalMesh = new THREE.Mesh(gimbalGeo, innerGimbalMat);
  innerRingGroup.add(gimbalMesh);

  // Mechanical bearing pivot assemblies at top and bottom (y = ±1.26)
  const axleGeo = trackGeo(new THREE.CylinderGeometry(0.016, 0.016, 0.22, 16));
  const collarGeo = trackGeo(new THREE.CylinderGeometry(0.042, 0.042, 0.08, 16));
  const capGeo = trackGeo(new THREE.CylinderGeometry(0.044, 0.044, 0.018, 16));
  const washerGeo = trackGeo(new THREE.CylinderGeometry(0.030, 0.030, 0.012, 16));

  [-1.26, 1.26].forEach((yPos) => {
    const isTop = yPos > 0;
    const axle = new THREE.Mesh(axleGeo, outerMetalMat);
    axle.position.set(0, yPos, 0);
    innerRingGroup.add(axle);

    const collar = new THREE.Mesh(collarGeo, outerMetalMat);
    collar.position.set(0, isTop ? yPos - 0.02 : yPos + 0.02, 0);
    innerRingGroup.add(collar);

    const cap = new THREE.Mesh(capGeo, brassMat);
    cap.position.set(0, isTop ? yPos + 0.04 : yPos - 0.04, 0);
    innerRingGroup.add(cap);

    const washer = new THREE.Mesh(washerGeo, brassMat);
    washer.position.set(0, isTop ? yPos - 0.08 : yPos + 0.08, 0);
    innerRingGroup.add(washer);
  });

  // --- Machined Central Jewel Retaining Collar (Z = +0.04 offset) ---
  const hubGroup = new THREE.Group();
  hubGroup.position.z = 0.04;

  const hubGeo = trackGeo(new THREE.TorusGeometry(0.48, 0.030, 16, 40));
  const hubMesh = new THREE.Mesh(hubGeo, innerGimbalMat);
  hubGroup.add(hubMesh);

  const hubBezelGeo = trackGeo(new THREE.TorusGeometry(0.43, 0.015, 12, 40));
  const hubBezelMesh = new THREE.Mesh(hubBezelGeo, outerMetalMat);
  hubGroup.add(hubBezelMesh);

  // 4 Brass retaining clips at cardinal positions of the central collar
  const clipGeo = trackGeo(new THREE.BoxGeometry(0.024, 0.024, 0.032));
  [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5].forEach((angle) => {
    const clip = new THREE.Mesh(clipGeo, brassMat);
    clip.position.set(Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, 0.015);
    clip.rotation.z = angle;
    hubGroup.add(clip);
  });

  innerRingGroup.add(hubGroup);

  // --- 4 Machined Structural Spider Struts (Radius 0.026) ---
  // Substantial machined braces connecting central hub (0.48) to gimbal ring (1.14)
  // Diagonal 45°/135°/225°/315° mounting avoids collision with vertical pivots
  const strutGeo = trackGeo(new THREE.CylinderGeometry(0.026, 0.026, 0.66, 12));
  const clampGeo = trackGeo(new THREE.BoxGeometry(0.044, 0.034, 0.048));
  const strutMesh = new THREE.InstancedMesh(strutGeo, strutMetalMat, 4);
  const clampMesh = new THREE.InstancedMesh(clampGeo, brassMat, 4);
  const armAngles = [
    Math.PI * 0.25,
    Math.PI * 0.75,
    Math.PI * 1.25,
    Math.PI * 1.75,
  ];
  const midSpanR = (0.48 + 1.14) / 2; // 0.81

  armAngles.forEach((angle, i) => {
    // Structural strut spanning with slight forward angle into hub (Z = 0.02)
    dummy.position.set(Math.cos(angle) * midSpanR, Math.sin(angle) * midSpanR, 0.02);
    dummy.rotation.set(0, 0, angle - Math.PI / 2);
    dummy.updateMatrix();
    strutMesh.setMatrixAt(i, dummy.matrix);

    // Outer brass bracket clamp locking onto gimbal ring (Z = 0)
    dummy.position.set(Math.cos(angle) * 1.14, Math.sin(angle) * 1.14, 0);
    dummy.rotation.set(0, 0, angle);
    dummy.updateMatrix();
    clampMesh.setMatrixAt(i, dummy.matrix);
  });
  strutMesh.instanceMatrix.needsUpdate = true;
  clampMesh.instanceMatrix.needsUpdate = true;
  innerRingGroup.add(strutMesh);
  innerRingGroup.add(clampMesh);

  // Micro-fasteners on HIGH tier (8 hex bolt rivets on structural joints)
  if (quality === "HIGH") {
    const fastenerGeo = trackGeo(new THREE.CylinderGeometry(0.010, 0.010, 0.008, 6));
    const fasteners = new THREE.InstancedMesh(fastenerGeo, fastenerMat, 8);
    let fIdx = 0;

    // 4 on trunnion collars
    [-1.26, 1.26].forEach((yPos) => {
      [-0.022, 0.022].forEach((xOff) => {
        dummy.position.set(xOff, yPos, 0.044);
        dummy.rotation.set(Math.PI / 2, 0, 0);
        dummy.updateMatrix();
        fasteners.setMatrixAt(fIdx++, dummy.matrix);
      });
    });

    // 4 on outer clamp brackets
    armAngles.forEach((angle) => {
      dummy.position.set(
        Math.cos(angle) * 1.14,
        Math.sin(angle) * 1.14,
        0.024,
      );
      dummy.rotation.set(0, 0, angle);
      dummy.updateMatrix();
      fasteners.setMatrixAt(fIdx++, dummy.matrix);
    });

    fasteners.instanceMatrix.needsUpdate = true;
    innerRingGroup.add(fasteners);
  }

  // Initial natural gyroscopic tilt (inner ring visibly crosses as an ellipse)
  innerRingGroup.rotation.x = Math.PI * 0.28;
  group.add(innerRingGroup);

  // --- 4. Central Faceted Core & Luminous Energy Seed (Z = +0.04) ---
  const coreGroup = new THREE.Group();
  coreGroup.name = "CentralCoreAssembly";
  coreGroup.position.z = 0.04;

  // Smoked faceted crystal shell (crisp geometric octahedron)
  const shellGeo = trackGeo(new THREE.OctahedronGeometry(0.42, 0));
  const shellMesh = new THREE.Mesh(shellGeo, smokyFacetMat);
  coreGroup.add(shellMesh);

  // Inner bioluminescent energy seed (#31E0BE) — controlled radiant focal point
  const seedGeo = trackGeo(new THREE.OctahedronGeometry(0.18, 0));
  const seedMesh = new THREE.Mesh(seedGeo, biolumeInnerMat);
  seedMesh.scale.set(1.0, 1.40, 1.0); // Elongated faceted seed
  coreGroup.add(seedMesh);

  // Internal focal point light casting physical teal luminescence through the crystal
  const coreInnerLight = new THREE.PointLight(0x31e0be, 0.75, 2.8);
  coreGroup.add(coreInnerLight);

  group.add(coreGroup);

  // --- 5. Choreography State & Tracking Variables ---
  // Initial position and orientation matching Hero pose
  const currentPos = new THREE.Vector3(
    CORE_CHOREOGRAPHY_POSES[0].x,
    CORE_CHOREOGRAPHY_POSES[0].y,
    CORE_CHOREOGRAPHY_POSES[0].z,
  );
  let currentScale = CORE_CHOREOGRAPHY_POSES[0].scale;
  const currentQuat = POSE_QUATERNIONS[0].clone();

  const targetPos = new THREE.Vector3();
  const targetQuat = new THREE.Quaternion();
  const rotOffsetQuat = new THREE.Quaternion();
  const eulerHelper = new THREE.Euler(0, 0, 0, "YXZ");
  const interpolatedQuat = new THREE.Quaternion();

  const sampledPose = {
    x: CORE_CHOREOGRAPHY_POSES[0].x,
    y: CORE_CHOREOGRAPHY_POSES[0].y,
    z: CORE_CHOREOGRAPHY_POSES[0].z,
    scale: CORE_CHOREOGRAPHY_POSES[0].scale,
    motionIntensity: CORE_CHOREOGRAPHY_POSES[0].motionIntensity,
  };

  /**
   * Continuous interpolation across the data-driven Core Choreography Poses
   * using smoothstep easing and Quaternion slerp.
   */
  const sampleChoreography = (depth: number) => {
    const poses = CORE_CHOREOGRAPHY_POSES;
    if (depth <= poses[0].depth) {
      sampledPose.x = poses[0].x;
      sampledPose.y = poses[0].y;
      sampledPose.z = poses[0].z;
      sampledPose.scale = poses[0].scale;
      sampledPose.motionIntensity = poses[0].motionIntensity;
      interpolatedQuat.copy(POSE_QUATERNIONS[0]);
      return;
    }

    const lastIdx = poses.length - 1;
    if (depth >= poses[lastIdx].depth) {
      sampledPose.x = poses[lastIdx].x;
      sampledPose.y = poses[lastIdx].y;
      sampledPose.z = poses[lastIdx].z;
      sampledPose.scale = poses[lastIdx].scale;
      sampledPose.motionIntensity = poses[lastIdx].motionIntensity;
      interpolatedQuat.copy(POSE_QUATERNIONS[lastIdx]);
      return;
    }

    for (let i = 0; i < lastIdx; i++) {
      const p1 = poses[i];
      const p2 = poses[i + 1];
      if (depth >= p1.depth && depth <= p2.depth) {
        const rawT = (depth - p1.depth) / (p2.depth - p1.depth);
        const t = smoothstep(rawT);
        sampledPose.x = p1.x + (p2.x - p1.x) * t;
        sampledPose.y = p1.y + (p2.y - p1.y) * t;
        sampledPose.z = p1.z + (p2.z - p1.z) * t;
        sampledPose.scale = p1.scale + (p2.scale - p1.scale) * t;
        sampledPose.motionIntensity =
          p1.motionIntensity + (p2.motionIntensity - p1.motionIntensity) * t;
        interpolatedQuat.copy(POSE_QUATERNIONS[i]).slerp(POSE_QUATERNIONS[i + 1], t);
        return;
      }
    }
  };

  let velocityLag = 0;
  const enablePointer = quality === "HIGH" || quality === "MEDIUM";

  // Supplementary UI Interaction Lerp Offsets (smooth return to baseline)
  let signalGimbalOffset = 0;
  let signalYawOffset = 0;
  let signalBiolumeBoost = 0;
  let signalBrassWarmth = 0;
  let briefPulseTimer = 0;

  // --- Gyroscope Scroll-Spin State Variables ---
  // Cumulative angles tracked separately from group pose choreography
  let outerCurrentAngle = 0;
  let innerCurrentAngle = 0;
  let centerCurrentAngle = 0;
  let gyroInitialized = false;

  // Gyroscope turn configuration across 0 -> 3800m
  const OUTER_TURNS = 3.0;   // Outer bezel completes 3 full clockwise turns (+6π)
  const INNER_TURNS = -5.0;  // Inner gimbal completes 5 full counter-turns (-10π)
  const CENTER_TURNS = 1.5;  // Central faceted assembly completes 1.5 turns (+3π, symmetry-aligned)
  const GYRO_DAMPING_LAMBDA = 6.5; // Exponential damping lambda (settles in ~200-500ms)

  // Initialize group orientation from Hero quaternion
  group.position.copy(currentPos);
  group.scale.set(currentScale, currentScale, currentScale);
  group.quaternion.copy(currentQuat);

  const update = (
    dt: number,
    time: number,
    depthState: DepthState,
    pointer: { x: number; y: number },
    viewport: { width: number; height: number },
    signalState?: SignalState,
  ) => {
    const env = getEnvironmentState(depthState.smoothedDepth);
    const dtClamped = Math.min(dt, 0.1);

    // 1. Sample continuous data-driven choreography pose at smoothedDepth
    sampleChoreography(depthState.smoothedDepth);

    // 2. Responsive lateral travel and scale compression
    let xMult = 1.0;
    let yMult = 1.0;
    let scaleMult = 1.0;

    if (viewport.width < 640) {
      // Mobile: centered, zero horizontal sweep under readable text, focus on depth & scale
      xMult = 0.0;
      yMult = 0.90;
      scaleMult = 0.52;
    } else if (viewport.width < 1024) {
      // Tablet: reduce X travel by ~40%
      xMult = 0.60;
      yMult = 0.85;
      scaleMult = 0.68;
    } else if (viewport.width < 1280) {
      // Narrow desktop
      xMult = 0.85;
      yMult = 0.92;
      scaleMult = 0.84;
    }

    // Target position and scale with depth-driven visibility scaling
    targetPos.set(sampledPose.x * xMult, sampledPose.y * yMult, sampledPose.z);
    const targetScale =
      sampledPose.scale * scaleMult * (0.50 + env.coreVisibility * 0.50);

    // Time-correct physical exponential damping for position and scale (lambda = 3.8)
    const posAlpha = 1 - Math.exp(-3.8 * dtClamped);
    currentPos.lerp(targetPos, posAlpha);
    currentScale += (targetScale - currentScale) * posAlpha;

    group.position.copy(currentPos);
    group.scale.set(currentScale, currentScale, currentScale);

    // 3. Scroll velocity reaction (scaled by motionIntensity so rest zones are protected)
    const targetLag =
      Math.min(0.20, Math.max(-0.20, depthState.velocity * 0.0002)) *
      sampledPose.motionIntensity;
    velocityLag += (targetLag - velocityLag) * Math.min(1, dtClamped * 4.0);

    const velPitch =
      Math.min(0.035, Math.max(-0.035, -depthState.velocity * 0.00004)) *
      sampledPose.motionIntensity;

    // 4. Evaluate Supplementary Scene Signals
    let targetGimbal = 0;
    let targetYaw = 0;
    let targetBiolume = 0;
    let targetBrass = 0;

    if (signalState) {
      const { activeSignal, activeSignalIndex } = signalState;

      if (activeSignal === "service") {
        // Services: subtle ring tilt & gentle biolume shift
        const idx = activeSignalIndex >= 0 ? activeSignalIndex : 0;
        targetGimbal = (idx - 1.5) * 0.045;
        targetYaw = (idx - 1.5) * 0.03;
        targetBiolume = 0.20;
      } else if (activeSignal === "process") {
        // Process: small precision instrument tick
        const idx = activeSignalIndex >= 0 ? activeSignalIndex : 0;
        targetGimbal = Math.sin(idx * 1.2) * 0.035;
        targetBiolume = 0.08;
      } else if (activeSignal === "work") {
        // Work: subtle orientation response toward bathypelagic project beacon
        const idx = activeSignalIndex >= 0 ? activeSignalIndex : 1;
        targetYaw = (idx - 1) * 0.05;
        targetBiolume = 0.12;
      } else if (activeSignal === "package") {
        // Packages: subtle warm brass response in instrument edges
        targetBrass = 0.40;
        targetBiolume = 0.06;
      } else if (activeSignal === "brief-pulse") {
        // BriefBuilder: gentle biolume pulse triggered on answer selection
        briefPulseTimer = 1.2;
      }
    }

    if (briefPulseTimer > 0) {
      briefPulseTimer = Math.max(0, briefPulseTimer - dtClamped);
      targetBiolume += (briefPulseTimer / 1.2) * 0.35;
    }

    // Smooth lerping of all signal offsets back to baseline
    signalGimbalOffset += (targetGimbal - signalGimbalOffset) * Math.min(1, dtClamped * 3.2);
    signalYawOffset += (targetYaw - signalYawOffset) * Math.min(1, dtClamped * 3.2);
    signalBiolumeBoost += (targetBiolume - signalBiolumeBoost) * Math.min(1, dtClamped * 3.5);
    signalBrassWarmth += (targetBrass - signalBrassWarmth) * Math.min(1, dtClamped * 3.5);

    // 5. Layered Orientation: Choreography Pose -> Velocity Bias -> Signal Offset -> Pointer Parallax
    targetQuat.copy(interpolatedQuat);

    // Pointer response: strictly subordinate to scroll pose (max yaw ±2.6°, pitch ±2.0°)
    const pointerYaw =
      pointer.x * 0.045 * sampledPose.motionIntensity * (enablePointer ? 1 : 0);
    const pointerPitch =
      -pointer.y * 0.035 * sampledPose.motionIntensity * (enablePointer ? 1 : 0);

    eulerHelper.set(
      pointerPitch + velPitch,
      pointerYaw + signalYawOffset * sampledPose.motionIntensity,
      0,
      "YXZ",
    );
    rotOffsetQuat.setFromEuler(eulerHelper);
    targetQuat.multiply(rotOffsetQuat);

    // Time-correct physical rotational damping (lambda = 2.8) via Quaternion slerp
    const rotAlpha = 1 - Math.exp(-2.8 * dtClamped);
    currentQuat.slerp(targetQuat, rotAlpha);
    group.quaternion.copy(currentQuat);

    // 6. Scroll-Linked Gyroscope Rotation System
    // Accessibility: disable continuous scroll-spin if user prefers reduced motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // Responsive spin multiplier (desktop: 100%, tablet: 80%, mobile: 60%, reduced: 0%)
    let deviceSpinMult = 1.0;
    if (prefersReduced) {
      deviceSpinMult = 0.0;
    } else if (viewport.width < 640) {
      deviceSpinMult = 0.60;
    } else if (viewport.width < 1024) {
      deviceSpinMult = 0.80;
    }

    // Continuous scroll progress across 0 -> 3800m (eases into 3800m calibration)
    const scrollProgress = getEffectiveScrollProgress(depthState.smoothedDepth);

    // Target angles derived directly from cumulative scroll depth (reverses naturally when scrolling up)
    const outerTarget = scrollProgress * Math.PI * 2 * OUTER_TURNS * deviceSpinMult;
    const innerTarget = scrollProgress * Math.PI * 2 * INNER_TURNS * deviceSpinMult;
    const centerTarget = scrollProgress * Math.PI * 2 * CENTER_TURNS * deviceSpinMult;

    if (!gyroInitialized) {
      outerCurrentAngle = outerTarget;
      innerCurrentAngle = innerTarget;
      centerCurrentAngle = centerTarget;
      gyroInitialized = true;
    } else {
      // Framerate-independent exponential damping: alpha = 1 - exp(-lambda * dt)
      const gyroAlpha = 1 - Math.exp(-GYRO_DAMPING_LAMBDA * dtClamped);
      outerCurrentAngle += (outerTarget - outerCurrentAngle) * gyroAlpha;
      innerCurrentAngle += (innerTarget - innerCurrentAngle) * gyroAlpha;
      centerCurrentAngle += (centerTarget - centerCurrentAngle) * gyroAlpha;
    }

    // Whisper-quiet idle mechanical drift (~0.005 - 0.010 rad/s), ~300x slower than scroll
    const outerIdle = prefersReduced ? 0 : time * 0.008;
    const innerIdle = prefersReduced ? 0 : time * -0.010;
    const centerIdle = prefersReduced ? 0 : time * 0.005;

    // Mechanical component rotation assignments:
    // A. Outer Ring: rotates around local Z (roll), spinning dial graduations & zenith datum
    outerRingGroup.rotation.z = outerCurrentAngle + outerIdle;
    outerRingGroup.rotation.y = 0;
    outerRingGroup.rotation.x = 0;

    // B. Inner Gimbal: rotates around local X (pitch), tumbling through the outer ring with opposing spin
    innerRingGroup.rotation.x =
      innerCurrentAngle +
      innerIdle -
      velocityLag * 0.4 +
      env.coreResting * (Math.PI * 0.20);
    innerRingGroup.rotation.y = 0;
    innerRingGroup.rotation.z =
      (prefersReduced ? 0 : Math.sin(time * 0.015) * 0.04) + signalGimbalOffset;

    // C. Central Faceted Crystal Shell & Luminous Seed: rotates around local Y (yaw)
    coreGroup.rotation.y = centerCurrentAngle + centerIdle;
    coreGroup.rotation.x = prefersReduced ? 0 : Math.sin(time * 0.012) * 0.020;
    seedMesh.rotation.y = prefersReduced ? 0 : time * 0.035;
    seedMesh.rotation.z = prefersReduced ? 0 : Math.sin(time * 0.025) * 0.025;

    // 7. Dynamic Material Opacities & Emissives
    smokyFacetMat.opacity = 0.68 * env.coreVisibility;
    biolumeInnerMat.emissiveIntensity =
      (1.15 + signalBiolumeBoost * 0.6) * env.coreVisibility;
    coreInnerLight.intensity =
      (0.75 + signalBiolumeBoost * 0.8) * env.coreVisibility;

    // Warm brass edge response on package inspection
    brassMat.emissive.setHex(0xc8a24a);
    brassMat.emissiveIntensity = signalBrassWarmth * env.coreVisibility;
  };

  const dispose = () => {
    for (const geo of geometries) {
      geo.dispose();
    }
    for (const mat of materials) {
      mat.dispose();
    }
    coreInnerLight.dispose();
  };

  return {
    group,
    update,
    dispose,
  };
}
