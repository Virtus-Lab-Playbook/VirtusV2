"use client";

import { useEffect, useRef, useState } from "react";
import type { DepthState } from "../experience-types";
import {
  DEPTH_DAMPING_FACTOR,
  MAX_DEPTH_METERS,
} from "../experience-config";

/**
 * Calculates raw and smoothed scroll progress, current descent depth in meters,
 * and scroll velocity without external animation libraries.
 *
 * Implements lerp damping in a throttled requestAnimationFrame loop
 * and pauses when motion settles to maximize battery & GPU efficiency.
 */
export function useDepthProgress(): DepthState {
  const [depthState, setDepthState] = useState<DepthState>({
    rawProgress: 0,
    smoothedProgress: 0,
    currentDepth: 0,
    velocity: 0,
  });

  const stateRef = useRef<DepthState>({
    rawProgress: 0,
    smoothedProgress: 0,
    currentDepth: 0,
    velocity: 0,
  });

  const targetProgressRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const isReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const computeRawProgress = (): number => {
      const doc = document.documentElement;
      const totalScrollable = doc.scrollHeight - window.innerHeight;
      if (totalScrollable <= 0) return 0;
      const scrollY = window.scrollY || doc.scrollTop || 0;
      return Math.min(1, Math.max(0, scrollY / totalScrollable));
    };

    const tick = (now: number) => {
      const dt = lastTimeRef.current > 0 ? (now - lastTimeRef.current) / 1000 : 0.016;
      lastTimeRef.current = now;

      const target = targetProgressRef.current;
      const current = stateRef.current.smoothedProgress;
      const diff = target - current;

      if (isReduced || Math.abs(diff) < 0.0001) {
        // Settled state or reduced-motion instant snap
        const settled = target;
        stateRef.current = {
          rawProgress: target,
          smoothedProgress: settled,
          currentDepth: Math.round(settled * MAX_DEPTH_METERS),
          velocity: 0,
        };
        setDepthState({ ...stateRef.current });
        rafRef.current = 0;
        return;
      }

      // Smooth damped approach
      const nextSmoothed = current + diff * DEPTH_DAMPING_FACTOR;
      const velocity = (nextSmoothed - current) / Math.max(0.001, dt);

      stateRef.current = {
        rawProgress: target,
        smoothedProgress: nextSmoothed,
        currentDepth: Math.round(nextSmoothed * MAX_DEPTH_METERS),
        velocity,
      };

      setDepthState({ ...stateRef.current });

      rafRef.current = requestAnimationFrame(tick);
    };

    const requestTick = () => {
      targetProgressRef.current = computeRawProgress();
      if (!rafRef.current) {
        lastTimeRef.current = performance.now();
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    // Initialize immediate state
    targetProgressRef.current = computeRawProgress();
    stateRef.current.rawProgress = targetProgressRef.current;
    stateRef.current.smoothedProgress = targetProgressRef.current;
    stateRef.current.currentDepth = Math.round(targetProgressRef.current * MAX_DEPTH_METERS);
    setDepthState({ ...stateRef.current });

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });

    return () => {
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return depthState;
}
