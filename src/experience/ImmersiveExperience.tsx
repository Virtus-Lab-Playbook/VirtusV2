"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useExperience } from "./ExperienceContext";
import { createVirtusCore } from "./objects/VirtusCore";

/**
 * ImmersiveExperience (Phase 2 Foundation)
 *
 * Implements the continuous spatial layer:
 * - One WebGL renderer (alpha, high-performance)
 * - One PerspectiveCamera
 * - One Scene with restrained lighting
 * - The signature procedural VIRTUS CORE
 * - Subtle ambient particle veil in background
 * - Section-aware depth tracking from ExperienceContext
 * - Strict pointer-events-none & z-index: 1 layering (under HTML text, above hero mantle)
 * - Tab visibility guard & resource disposal
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
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.pointerEvents = "none";
    renderer.domElement.style.zIndex = "1";
    el.appendChild(renderer.domElement);

    // --- 1. Scene & Camera ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, initW / initH, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // --- 2. Lighting Rig (Minimal, oceanic, restrained) ---
    // Key light (cool neutral direction)
    const keyLight = new THREE.DirectionalLight(0xf0f4f3, 0.95);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    // Dim cool fill light (deep oceanic blue)
    const fillLight = new THREE.DirectionalLight(0x0b2e3a, 0.55);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    // Subtle warm rim light (instrument brass accent)
    const rimLight = new THREE.PointLight(0xc8a24a, 0.4, 14);
    rimLight.position.set(3, -2, 4);
    scene.add(rimLight);

    // Ambient ocean floor floor tone
    const ambientLight = new THREE.AmbientLight(0x04171e, 0.45);
    scene.add(ambientLight);

    // --- 3. The Signature Virtus Core Object ---
    const core = createVirtusCore(quality);
    scene.add(core.group);

    // --- 4. Ambient Deep-Sea Particle Veil ---
    const PARTICLE_COUNT = quality === "LOW" ? 40 : 120;
    const pPositions = new Float32Array(PARTICLE_COUNT * 3);
    const pDrift = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 16;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2.0;
      pDrift[i] = 0.06 + Math.random() * 0.12;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));

    const particlesMat = new THREE.PointsMaterial({
      color: new THREE.Color(0x31e0be),
      size: quality === "LOW" ? 0.035 : 0.045,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particlesField = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesField);

    // --- 5. Event Listeners (Pointer, Resize, Visibility) ---
    const pointer = { x: 0, y: 0 };
    const pointerTarget = { x: 0, y: 0 };
    let rafId = 0;
    let running = true;
    let lastTime = performance.now();

    const onPointerMove = (e: PointerEvent) => {
      // Normalized coordinates (-1 to +1)
      pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    if (quality === "HIGH" || quality === "MEDIUM") {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    const onResize = () => {
      const { width: nw, height: nh } = getViewport();
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
    };
    window.addEventListener("resize", onResize);

    // --- 6. Unified Render Loop ---
    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const currentDepth = depthStateRef.current;
      const vp = getViewport();

      // Damped pointer interpolation
      pointer.x += (pointerTarget.x - pointer.x) * Math.min(1, dt * 3.5);
      pointer.y += (pointerTarget.y - pointer.y) * Math.min(1, dt * 3.5);

      // Subtle camera parallax
      if (quality === "HIGH") {
        camera.position.x = pointer.x * 0.2;
        camera.position.y = pointer.y * 0.15;
      }
      camera.lookAt(0, 0, 0);

      // Update Virtus Core
      core.update(dt, now * 0.001, currentDepth, pointer, vp);

      // Subtle ambient particle drift
      const posArray = particlesGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        posArray[i * 3 + 1] -= pDrift[i] * dt;
        if (posArray[i * 3 + 1] < -6) {
          posArray[i * 3 + 1] = 6;
        }
      }
      particlesGeo.attributes.position.needsUpdate = true;
      particlesField.rotation.y += 0.01 * dt;

      renderer.render(scene, camera);
    };

    const loop = (time: number) => {
      if (!running) return;
      render(time);
      rafId = requestAnimationFrame(loop);
    };

    // Tab visibility guard: pause RAF loop when hidden to conserve GPU/battery
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

    // --- 7. Full Cleanup Routine ---
    cleanup = () => {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.remove();
      }

      core.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
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
      className="fixed inset-0 pointer-events-none overflow-hidden bg-transparent"
    />
  );
}
