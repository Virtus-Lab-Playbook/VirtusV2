import * as THREE from "three";
import type { EnvironmentState } from "./environment-config";
import type { SceneQuality } from "../experience-types";

const FLOOR_VERT = `
varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;

  // Undulating bathymetric ridges matching nautical contours
  vec3 pos = position;
  float wave1 = sin(pos.x * 0.28 + 0.4) * cos(pos.y * 0.35);
  float wave2 = sin(pos.x * 0.55 + 1.2) * sin(pos.y * 0.22) * 0.5;
  float elevation = wave1 + wave2;

  pos.z += elevation * 0.65;
  vElevation = pos.z;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const FLOOR_FRAG = `
precision highp float;
varying vec2 vUv;
varying float vElevation;

uniform vec3 uColorAbyss;
uniform vec3 uColorShelf;
uniform vec3 uColorBrass;
uniform float uOpacity;

void main() {
  // Edge soft fades to melt seamlessly into the dark ocean volume
  float depthFade = smoothstep(1.0, 0.15, vUv.y);
  float sideFade = smoothstep(0.0, 0.12, vUv.x) * smoothstep(1.0, 0.88, vUv.x);

  // Bathymetric contour iso-lines at regular elevation intervals
  float freq = 3.2;
  float dist = abs(fract(vElevation * freq) - 0.5);
  float line = 1.0 - smoothstep(0.0, 0.08, dist);

  // Signature brass contour line near baseline elevation
  float brassDist = abs(vElevation - 0.15);
  float brassLine = 1.0 - smoothstep(0.0, 0.06, brassDist);

  vec3 col = uColorAbyss;
  col = mix(col, uColorShelf, line * 0.65);
  col = mix(col, uColorBrass, brassLine * 0.85);

  float alpha = (0.3 + line * 0.5 + brassLine * 0.35) * uOpacity * depthFade * sideFade;

  gl_FragColor = vec4(col, alpha);
}
`;

export interface AbyssFloorInstance {
  mesh: THREE.Mesh;
  update: (time: number, env: EnvironmentState) => void;
  dispose: () => void;
}

export function createAbyssFloor(quality: SceneQuality): AbyssFloorInstance {
  let segX = 64;
  let segY = 48;
  if (quality === "MEDIUM") {
    segX = 36;
    segY = 28;
  } else if (quality === "LOW") {
    segX = 18;
    segY = 14;
  }

  const geo = new THREE.PlaneGeometry(32, 22, segX, segY);

  const mat = new THREE.ShaderMaterial({
    vertexShader: FLOOR_VERT,
    fragmentShader: FLOOR_FRAG,
    uniforms: {
      uColorAbyss: { value: new THREE.Color(0x0f1b2a) },
      uColorShelf: { value: new THREE.Color(0x435a76) },
      uColorBrass: { value: new THREE.Color(0xe0e1dc) },
      uOpacity: { value: 0.0 },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI * 0.42;
  mesh.position.set(0, -2.6, -1.0);

  const update = (time: number, env: EnvironmentState) => {
    mat.uniforms.uOpacity.value = env.floorOpacity;
    // Spatial breathing of floor contours settles into quiet stillness at terminal depth
    const breathingAmplitude = 0.04 * (1.0 - env.coreResting * 0.85);
    mesh.position.y = -2.6 + Math.sin(time * 0.15) * breathingAmplitude;
  };

  const dispose = () => {
    geo.dispose();
    mat.dispose();
  };

  return {
    mesh,
    update,
    dispose,
  };
}
