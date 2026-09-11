"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  DepthState,
  DepthZone,
  ExperienceContextValue,
} from "./experience-types";
import {
  DEPTH_DAMPING_FACTOR,
  DEPTH_MILESTONES,
  MAX_DEPTH_METERS,
} from "./experience-config";
import { useSceneQuality } from "./hooks/useSceneQuality";

interface MeasuredMilestone {
  id: string;
  name: string;
  targetDepth: number;
  zone: DepthZone;
  topY: number;
}

const initialDepthState: DepthState = {
  rawProgress: 0,
  smoothedProgress: 0,
  rawDepth: 0,
  smoothedDepth: 0,
  velocity: 0,
  currentZone: "SURFACE",
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const qualityConfig = useSceneQuality();
  const [depthState, setDepthState] = useState<DepthState>(initialDepthState);

  const stateRef = useRef<DepthState>(initialDepthState);
  const measuredMilestonesRef = useRef<MeasuredMilestone[]>([]);
  const targetDepthRef = useRef<number>(0);
  const targetProgressRef = useRef<number>(0);
  const activeZoneRef = useRef<DepthZone>("SURFACE");
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const isReduced = qualityConfig.isStatic;

    /**
     * Measures and caches document Y positions of all milestone sections.
     * Invoked on mount and resize — NEVER in the animation frame loop.
     */
    const measureMilestones = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const measured: MeasuredMilestone[] = [];

      for (const ms of DEPTH_MILESTONES) {
        const el = document.querySelector(ms.selector);
        if (el) {
          const rect = el.getBoundingClientRect();
          measured.push({
            id: ms.id,
            name: ms.name,
            targetDepth: ms.targetDepth,
            zone: ms.zone,
            topY: Math.max(0, rect.top + scrollY),
          });
        }
      }

      // Sort by vertical position ascending
      measured.sort((a, b) => a.topY - b.topY);
      measuredMilestonesRef.current = measured;
    };

    /**
     * Calculates section-aware depth by interpolating between nearest DOM milestone anchors.
     */
    const calculateSectionDepth = (scrollY: number): { depth: number; zone: DepthZone } => {
      const milestones = measuredMilestonesRef.current;
      if (milestones.length === 0) {
        const doc = document.documentElement;
        const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
        const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
        return { depth: progress * MAX_DEPTH_METERS, zone: "SURFACE" };
      }

      // Above or at first section (Hero)
      if (scrollY <= milestones[0].topY) {
        return { depth: milestones[0].targetDepth, zone: milestones[0].zone };
      }

      // Below or at last section (Footer)
      const last = milestones[milestones.length - 1];
      if (scrollY >= last.topY) {
        return { depth: last.targetDepth, zone: last.zone };
      }

      // Interpolate between bounding milestone sections
      for (let i = 0; i < milestones.length - 1; i++) {
        const current = milestones[i];
        const next = milestones[i + 1];

        if (scrollY >= current.topY && scrollY <= next.topY) {
          const span = Math.max(1, next.topY - current.topY);
          const t = Math.min(1, Math.max(0, (scrollY - current.topY) / span));
          const depth = current.targetDepth + t * (next.targetDepth - current.targetDepth);
          const zone = t < 0.5 ? current.zone : next.zone;
          return { depth, zone };
        }
      }

      return { depth: 0, zone: "SURFACE" };
    };

    const tick = (now: number) => {
      const dt = lastTimeRef.current > 0 ? (now - lastTimeRef.current) / 1000 : 0.016;
      lastTimeRef.current = now;

      const targetDepth = targetDepthRef.current;
      const targetProgress = targetProgressRef.current;
      const currentSmoothed = stateRef.current.smoothedDepth;
      const diff = targetDepth - currentSmoothed;

      if (isReduced || Math.abs(diff) < 0.25) {
        // Motion settled or reduced motion instant snap
        stateRef.current = {
          rawProgress: targetProgress,
          smoothedProgress: targetDepth / MAX_DEPTH_METERS,
          rawDepth: targetDepth,
          smoothedDepth: targetDepth,
          velocity: 0,
          currentZone: activeZoneRef.current,
        };
        setDepthState({ ...stateRef.current });
        rafRef.current = 0;
        return;
      }

      // Damped lerp movement
      const nextSmoothed = currentSmoothed + diff * DEPTH_DAMPING_FACTOR;
      const velocity = (nextSmoothed - currentSmoothed) / Math.max(0.001, dt);

      stateRef.current = {
        rawProgress: targetProgress,
        smoothedProgress: nextSmoothed / MAX_DEPTH_METERS,
        rawDepth: targetDepth,
        smoothedDepth: nextSmoothed,
        velocity,
        currentZone: activeZoneRef.current,
      };

      setDepthState({ ...stateRef.current });
      rafRef.current = requestAnimationFrame(tick);
    };

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);

      targetProgressRef.current = Math.min(1, Math.max(0, scrollY / maxScroll));
      const { depth, zone } = calculateSectionDepth(scrollY);
      targetDepthRef.current = depth;
      activeZoneRef.current = zone;

      if (!rafRef.current) {
        lastTimeRef.current = performance.now();
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    const handleResize = () => {
      measureMilestones();
      handleScroll();
    };

    // Initial measurement after mount and post-paint layout pass
    measureMilestones();
    handleScroll();

    const settleTimer = setTimeout(() => {
      measureMilestones();
      handleScroll();
    }, 150);

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      clearTimeout(settleTimer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [qualityConfig.isStatic]);

  const value: ExperienceContextValue = {
    ...depthState,
    qualityConfig,
  };

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience(): ExperienceContextValue {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error("useExperience must be used within an <ExperienceProvider>");
  }
  return context;
}
