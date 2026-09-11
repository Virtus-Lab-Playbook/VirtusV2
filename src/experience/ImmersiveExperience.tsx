"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useExperience } from "./ExperienceContext";
import { getEnvironmentState } from "./environment/environment-config";
import { createDeepAtmosphere } from "./environment/DeepAtmosphere";
import { createMarineSnow } from "./environment/MarineSnow";
import { createVirtusCore } from "./objects/VirtusCore";

/**
 * ImmersiveExperience (Phase 3 Foundation)
 *
 * Consolidates the global spatial and atmospheric Three.js layer:
 * - One WebGL renderer (alpha, autoClear: false, high-performance)
 * - Two-pass unified pipeline:
 *   1. Procedural DeepAtmosphere background shader (caustics, rays, topLight, pointer bloom)
 *   2. Perspective 3D Scene with Marine Snow particles, Virtus Core, and 3-point lighting
 * - Smooth depth-driven environment states: Surface -> Twilight -> Descent -> Deep
 * - Shared pointer and resize listeners
 * - Safe z-index: -10 and pointer-events: none layering
 * - Tab visibility detection & resource disposal
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

    // --- 3. Lighting Rig (Oceanic & Restrained) ---
    const keyLight = new THREE.DirectionalLight(0xf0f4f3, 0.95);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x0b2e3a, 0.55);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xc8a24a, 0.4, 14);
    rimLight.position.set(3, -2, 4);
    scene.add(rimLight);

    const ambientLight = new THREE.AmbientLight(0x04171e, 0.45);
    scene.add(ambientLight);

    // --- 4. Signature Virtus Core Object ---
    const core = createVirtusCore(quality);
    scene.add(core.group);

    // --- 5. Atmospheric Marine Snow Particle Field ---
    const marineSnow = createMarineSnow(quality);
    scene.add(marineSnow.points);

    // --- 6. Shared Pointer & Resize Listeners ---
    const pointer = { x: 0, y: 0 };
    const pointerTarget = { x: 0, y: 0 };
    let rafId = 0;
    let running = true;
    let lastTime = performance.now();

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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    };
    window.addEventListener("resize", onResize);

    // --- 7. Unified Render Loop ---
    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const currentDepth = depthStateRef.current;
      const vp = getViewport();
      const env = getEnvironmentState(currentDepth.smoothedDepth);

      // Smooth pointer interpolation
      pointer.x += (pointerTarget.x - pointer.x) * Math.min(1, dt * 3.5);
      pointer.y += (pointerTarget.y - pointer.y) * Math.min(1, dt * 3.5);

      // Subtle camera parallax (Desktop HIGH only)
      if (quality === "HIGH") {
        camera.position.x = pointer.x * 0.16;
        camera.position.y = pointer.y * 0.12;
      }
      camera.lookAt(0, 0, 0);

      // Update atmospheric shader pass
      atmosphere.update(now * 0.001, env, pointer, vp);

      // Update marine snow particles
      marineSnow.update(dt, now * 0.001, env);

      // Update Virtus Core
      core.update(dt, now * 0.001, currentDepth, pointer, vp);

      // Dynamic lighting response based on depth
      keyLight.intensity = 0.95 * env.topLight;
      fillLight.intensity = 0.55 * (1.0 - env.darknessMix * 0.3);

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

    // --- 8. Complete Resource Disposal ---
    cleanup = () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.remove();
      }

      atmosphere.dispose();
      marineSnow.dispose();
      core.dispose();
      keyLight.dispose();
      fillLight.dispose();
      rimLight.dispose();
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
