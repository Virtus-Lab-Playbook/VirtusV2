"use client";

import { useEffect, useRef } from "react";
import { useSceneQuality } from "./hooks/useSceneQuality";

/**
 * ImmersiveExperience (Phase 1 Baseline)
 *
 * Establishes the single continuous Three.js foundation:
 * - One WebGL renderer
 * - One PerspectiveCamera
 * - One Scene
 * - One RAF render loop
 * - Quality-tiered DPR capping (1.5 / 1.25 / 1.0)
 * - Tab visibility detection & reduced-motion gating
 * - Guaranteed aria-hidden & pointer-events-none layering
 */
export function ImmersiveExperience() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { quality, maxDpr, isStatic } = useSceneQuality();

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // Reduced motion or unsupported WebGL: maintain pure CSS fallback ground
    if (isStatic) return;

    let cancelled = false;
    let cleanup = () => {};

    import("three")
      .then((THREE) => {
        if (cancelled || !el) return;

        let renderer: import("three").WebGLRenderer;
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
        renderer.domElement.style.zIndex = "-20";
        el.appendChild(renderer.domElement);

        // --- Single Scene & Camera ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
          55,
          initW / initH,
          0.1,
          100,
        );
        camera.position.set(0, 0, 8);

        // --- Phase 1 Baseline Object: Subtle Abyssal Particle Veil ---
        // Intentionally lightweight (160 particles) so as not to overload before migration
        const PARTICLE_COUNT = quality === "LOW" ? 60 : 160;
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const drift = new Float32Array(PARTICLE_COUNT);

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 16;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
          drift[i] = 0.08 + Math.random() * 0.16;
        }

        const particlesGeo = new THREE.BufferGeometry();
        particlesGeo.setAttribute(
          "position",
          new THREE.BufferAttribute(positions, 3),
        );

        const particlesMat = new THREE.PointsMaterial({
          color: new THREE.Color(0x31e0be), // biolume accent
          size: quality === "LOW" ? 0.04 : 0.05,
          transparent: true,
          opacity: 0.18,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const particleField = new THREE.Points(particlesGeo, particlesMat);
        scene.add(particleField);

        // --- Pointer & Scroll Listeners ---
        const mouse = new THREE.Vector2(0, 0);
        const mouseTarget = new THREE.Vector2(0, 0);
        let rafId = 0;
        let running = true;
        let lastTime = performance.now();

        const onPointerMove = (e: PointerEvent) => {
          mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
          mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };
        window.addEventListener("pointermove", onPointerMove, { passive: true });

        const onResize = () => {
          const { width: nw, height: nh } = getViewport();
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
        };
        window.addEventListener("resize", onResize, { passive: true });

        // --- Single Render Loop ---
        const render = (now: number) => {
          const dt = Math.min((now - lastTime) / 1000, 0.05);
          lastTime = now;

          // Smooth pointer interpolation
          mouse.x += (mouseTarget.x - mouse.x) * 0.04;
          mouse.y += (mouseTarget.y - mouse.y) * 0.04;

          camera.position.x = mouse.x * 0.35;
          camera.position.y = mouse.y * 0.25;
          camera.lookAt(0, 0, 0);

          // Subtle ambient particle drift
          const posArray = particlesGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            posArray[i * 3 + 1] -= drift[i] * dt;
            if (posArray[i * 3 + 1] < -6) {
              posArray[i * 3 + 1] = 6;
            }
          }
          particlesGeo.attributes.position.needsUpdate = true;
          particleField.rotation.y += 0.015 * dt;

          renderer.render(scene, camera);
        };

        const loop = (time: number) => {
          if (!running) return;
          render(time);
          rafId = requestAnimationFrame(loop);
        };

        // --- Tab Visibility Guard ---
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

        // --- Complete Cleanup Routine ---
        cleanup = () => {
          running = false;
          cancelAnimationFrame(rafId);
          window.removeEventListener("pointermove", onPointerMove);
          window.removeEventListener("resize", onResize);
          document.removeEventListener("visibilitychange", onVisibilityChange);

          if (renderer.domElement && renderer.domElement.parentNode) {
            renderer.domElement.remove();
          }

          particlesGeo.dispose();
          particlesMat.dispose();
          renderer.dispose();
        };
      })
      .catch(() => {
        // Dynamic import failure fallback
      });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [isStatic, maxDpr, quality]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 -z-20 pointer-events-none overflow-hidden bg-transparent"
    />
  );
}
