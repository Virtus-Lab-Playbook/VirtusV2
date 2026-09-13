import * as THREE from "three";
import type { EnvironmentState } from "./environment-config";
import type { SceneQuality } from "../experience-types";

export interface MarineSnowInstance {
  points: THREE.Points;
  update: (dt: number, time: number, env: EnvironmentState) => void;
  dispose: () => void;
}

export function createMarineSnow(quality: SceneQuality): MarineSnowInstance {
  let count = 850;
  if (quality === "MEDIUM") count = 450;
  if (quality === "LOW") count = 180;
  if (quality === "STATIC") count = 0;

  const positions = new Float32Array(count * 3);
  const baseSpeed = new Float32Array(count);
  const phase = new Float32Array(count);
  const freq = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = Math.random() * 6 - 3.5;
    baseSpeed[i] = 0.12 + Math.random() * 0.36;
    phase[i] = Math.random() * Math.PI * 2;
    freq[i] = 0.2 + Math.random() * 0.6;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // Soft bioluminescent particulate sprite texture
  const spriteCanvas = document.createElement("canvas");
  spriteCanvas.width = 64;
  spriteCanvas.height = 64;
  const sctx = spriteCanvas.getContext("2d")!;
  const grd = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(240, 244, 243, 0.95)");
  grd.addColorStop(0.35, "rgba(169, 191, 196, 0.38)");
  grd.addColorStop(1, "rgba(169, 191, 196, 0.0)");
  sctx.fillStyle = grd;
  sctx.fillRect(0, 0, 64, 64);

  const sprite = new THREE.CanvasTexture(spriteCanvas);

  const mat = new THREE.PointsMaterial({
    size: quality === "LOW" ? 0.07 : 0.085,
    map: sprite,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 0.62,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geo, mat);

  const update = (dt: number, time: number, env: EnvironmentState) => {
    if (count === 0) return;

    mat.opacity = env.particleOpacity;
    const speedMult = env.particleSpeed;

    const pos = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= baseSpeed[i] * speedMult * dt;
      if (pos[i * 3 + 1] < -7) {
        pos[i * 3 + 1] = 7;
      }
      pos[i * 3] += Math.sin(time * freq[i] + phase[i]) * (0.0015 * dt * 60);
    }
    geo.attributes.position.needsUpdate = true;

    points.rotation.y = Math.sin(time * 0.03) * 0.05;
  };

  const dispose = () => {
    geo.dispose();
    mat.dispose();
    sprite.dispose();
  };

  return {
    points,
    update,
    dispose,
  };
}
