"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useExperience } from "./ExperienceContext";
import type { SignalState } from "./experience-types";
import { getEnvironmentState } from "./environment/environment-config";
import { createDeepAtmosphere } from "./environment/DeepAtmosphere";
import { createMarineSnow } from "./environment/MarineSnow";
import { createAbyssFloor } from "./environment/AbyssFloor";
import { createVirtusCommandHub } from "./objects/VirtusCommandHub";

/**
 * Three subtle environmental project beacons at bathypelagic depth (1600 m).
 * Nearly invisible baseline, softly illuminating when corresponding Work card is inspected.
 */
function createWorkBeacons() {
  const group = new THREE.Group();
  group.name = "WorkBeacons";

  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(49, 224, 190, 1)");
    grad.addColorStop(0.4, "rgba(49, 224, 190, 0.35)");
    grad.addColorStop(1, "rgba(49, 224, 190, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
  }
  const texture = new THREE.CanvasTexture(canvas);

  // 3 project beacons corresponding to Tidewater (0420m), Meridian (0980m), Harbor Freight (1600m)
  const positions = [
    [-2.2, 0.35, -2.4],
    [0.0, 0.65, -3.0],
    [2.2, 0.15, -2.5],
  ];

  const items = positions.map((pos) => {
    const mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.06,
      color: 0x31e0be,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(pos[0], pos[1], pos[2]);
    sprite.scale.set(0.35, 0.35, 1);
    group.add(sprite);
    return { sprite, mat };
  });

  const update = (dt: number, smoothedDepth: number, signalState?: SignalState) => {
    // Only visible in bathypelagic depth window (around 900m to 2500m)
    const depthVisibility =
      THREE.MathUtils.smoothstep(smoothedDepth, 900, 1400) *
      (1.0 - THREE.MathUtils.smoothstep(smoothedDepth, 2100, 2600));

    items.forEach(({ mat, sprite }, i) => {
      const isActive =
        signalState?.activeSignal === "work" &&
        signalState.activeSignalIndex === i;
      const targetOpacity = (isActive ? 0.48 : 0.06) * depthVisibility;
      const targetScale = isActive ? 0.48 : 0.35;
      mat.opacity += (targetOpacity - mat.opacity) * Math.min(1, dt * 4.0);
      sprite.scale.x += (targetScale - sprite.scale.x) * Math.min(1, dt * 4.0);
      sprite.scale.y = sprite.scale.x;
    });
  };

  const dispose = () => {
    items.forEach(({ mat, sprite }) => {
      mat.dispose();
      group.remove(sprite);
    });
    texture.dispose();
  };

  return { group, update, dispose };
}

/**
 * ImmersiveExperience (Phase 3 Foundation + Phase 6 Polish)
 *
 * Consolidates the global spatial and atmospheric Three.js layer:
 * - One WebGL renderer (alpha, autoClear: false, high-performance)
 * - Two-pass unified pipeline
 * - Adaptive runtime performance guard
 * - Bathypelagic Work project beacons
 * - Virtus Core supplementary signal integration
 */
export function ImmersiveExperience() {
  const mountRef = useRef<HTMLDivElement>(null);
  const experience = useExperience();
  const { quality, maxDpr, isStatic } = experience.qualityConfig;

  // Maintain latest depthState in a ref to avoid recreating RAF on state updates
  const depthStateRef = useRef(experience);
  useEffect(() => {
    depthStateRef.current = experience;
  }, [experience]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // Reduced motion or WebGL disabled: skip continuous 3D rendering
    if (isStatic) return;

    let cleanup = () => {};

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: quality === "HIGH",
        powerPreference: "high-performance",
      });
    } catch {
      // Graceful fallback to CSS
      return;
    }

    const getViewport = () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const { width: initW, height: initH } = getViewport();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    renderer.setSize(initW, initH);
    renderer.autoClear = false;
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.zIndex = "-10";
    el.appendChild(renderer.domElement);

    // --- 1. Pass 1: Fullscreen Procedural Atmosphere ---
    const atmosphere = createDeepAtmosphere(quality, initW, initH);

    // --- 2. Pass 2: Main 3D Perspective Scene ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, initW / initH, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // --- 3. Lighting Rig (Oceanic & Restrained Edge Readability) ---
    // Soft cool key light from front-top-right
    const keyLight = new THREE.DirectionalLight(0xdcebf0, 0.95);
    keyLight.position.set(3.5, 4.5, 5.0);
    scene.add(keyLight);

    // Deep oceanic fill light from lower left
    const fillLight = new THREE.DirectionalLight(0x0b2e3a, 0.50);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    // Rear-right rim light: skims outer ring and trunnion thickness from behind
    const rimLight = new THREE.DirectionalLight(0xa5d8e6, 0.70);
    rimLight.position.set(4.5, 2.5, -3.0);
    scene.add(rimLight);

    // Restrained warm brass accent reflection
    const brassLight = new THREE.PointLight(0xc8a24a, 0.35, 12);
    brassLight.position.set(-3.0, -2.5, 3.5);
    scene.add(brassLight);

    // Low ambient to preserve deep contrast and shadow depth
    const ambientLight = new THREE.AmbientLight(0x04171e, 0.28);
    scene.add(ambientLight);

    // --- 4. Signature Virtus Command Hub Object ---
    const core = createVirtusCommandHub(quality);
    scene.add(core.group);

    // --- 5. Atmospheric Marine Snow Particle Field ---
    const marineSnow = createMarineSnow(quality);
    scene.add(marineSnow.points);

    // --- 6. Bathymetric Abyssal Seafloor ---
    const abyssFloor = createAbyssFloor(quality);
    scene.add(abyssFloor.mesh);

    // --- 7. Bathypelagic Work Project Beacons ---
    const workBeacons = createWorkBeacons();
    scene.add(workBeacons.group);

    // --- 8. Shared Pointer & Resize Listeners ---
    const pointer = { x: 0, y: 0 };
    const pointerTarget = { x: 0, y: 0 };
    let rafId = 0;
    let running = true;
    let lastTime = performance.now();

    // --- 9. Adaptive Runtime Performance Guard ---
    let activeQuality = quality;
    let activeDprCap = maxDpr;
    let frameSamples = 0;
    let accumulatedDt = 0;
    let hasDowngraded = false;
    const SAMPLE_WINDOW = 75; // sample 75 frames (~1.25s at 60fps)

    const onPointerMove = (e: PointerEvent) => {
      pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    if (quality === "HIGH" || quality === "MEDIUM") {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    const onResize = () => {
      const { width: nw, height: nh } = getViewport();
      atmosphere.resize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, activeDprCap));
    };
    window.addEventListener("resize", onResize);

    // --- 10. Unified Render Loop ---
    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Runtime Performance Guard: one-time graceful downgrade if device struggles (< 30 FPS)
      if (!hasDowngraded && frameSamples < 150 && dt > 0) {
        accumulatedDt += dt;
        frameSamples++;
        if (frameSamples >= SAMPLE_WINDOW) {
          const avgFrameTime = accumulatedDt / frameSamples;
          if (avgFrameTime > 0.0333) {
            hasDowngraded = true;
            if (activeQuality === "HIGH") {
              activeQuality = "MEDIUM";
              activeDprCap = 1.25;
            } else if (activeQuality === "MEDIUM") {
              activeQuality = "LOW";
              activeDprCap = 1.0;
            }
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, activeDprCap));
          } else {
            accumulatedDt = 0;
            frameSamples = 0;
          }
        }
      }

      const currentDepth = depthStateRef.current;
      const vp = getViewport();
      const env = getEnvironmentState(currentDepth.smoothedDepth);

      // Smooth pointer interpolation
      pointer.x += (pointerTarget.x - pointer.x) * Math.min(1, dt * 3.5);
      pointer.y += (pointerTarget.y - pointer.y) * Math.min(1, dt * 3.5);

      // Subtle camera parallax and vertical descent choreography
      const baseY = env.cameraY;
      const baseZ = env.cameraZ;
      if (activeQuality === "HIGH") {
        camera.position.x = pointer.x * 0.16;
        camera.position.y = baseY + pointer.y * 0.12;
        camera.position.z = baseZ;
      } else {
        camera.position.x = 0;
        camera.position.y = baseY;
        camera.position.z = baseZ;
      }
      camera.lookAt(0, baseY * 0.4, 0);

      // Update atmospheric shader pass
      atmosphere.update(now * 0.001, env, pointer, vp);

      // Update marine snow particles
      marineSnow.update(dt, now * 0.001, env);

      // Update bathymetric seafloor
      abyssFloor.update(now * 0.001, env);

      // Update Bathypelagic Work project beacons
      workBeacons.update(dt, currentDepth.smoothedDepth, currentDepth.signalState);

      // Update Virtus Core with supplementary scene signals
      core.update(dt, now * 0.001, currentDepth, pointer, vp, currentDepth.signalState);

      // Dynamic lighting response based on depth & terminal state
      keyLight.intensity = 0.95 * env.topLight;
      fillLight.intensity = 0.50 * (1.0 - env.darknessMix * 0.3);
      rimLight.intensity = (0.60 + env.abyssRays * 0.40) * Math.max(0.2, env.coreVisibility);
      brassLight.intensity = (0.25 + env.abyssEmber * 0.35) * env.coreVisibility;
      ambientLight.intensity = 0.28 * (1.0 - env.darknessMix * 0.4);

      // Two-pass rendering on ONE WebGLRenderer
      renderer.clear();
      renderer.render(atmosphere.scene, atmosphere.camera);
      renderer.render(scene, camera);
    };

    const loop = (time: number) => {
      if (!running) return;
      render(time);
      rafId = requestAnimationFrame(loop);
    };

    // Tab visibility guard
    const onVisibilityChange = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(rafId);
      } else if (!running) {
        running = true;
        lastTime = performance.now();
        rafId = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Start render loop
    rafId = requestAnimationFrame(loop);

    // --- 11. Complete Resource Disposal ---
    cleanup = () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.remove();
      }

      workBeacons.dispose();
      atmosphere.dispose();
      marineSnow.dispose();
      abyssFloor.dispose();
      core.dispose();
      keyLight.dispose();
      fillLight.dispose();
      rimLight.dispose();
      brassLight.dispose();
      ambientLight.dispose();
      renderer.dispose();
    };

    return () => {
      cleanup();
    };
  }, [isStatic, maxDpr, quality]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-transparent"
    />
  );
}
