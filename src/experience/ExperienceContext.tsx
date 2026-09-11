"use client";

import {
  createContext,
  useCallback,
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
  ExperienceSignalType,
  SignalState,
} from "./experience-types";
import {
  DEPTH_DAMPING_LAMBDA,
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

const initialSignalState: SignalState = {
  activeSignal: null,
  activeSignalIndex: -1,
  signalSource: null,
};

const ExperienceContext = createContext<ExperienceContextValue | null>(null);

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const qualityConfig = useSceneQuality();
  const [depthState, setDepthState] = useState<DepthState>(initialDepthState);
  const [signalState, setSignalState] = useState<SignalState>(initialSignalState);

  const triggerSignal = useCallback((type: ExperienceSignalType, index: number = -1) => {
    setSignalState({
      activeSignal: type,
      activeSignalIndex: index,
      signalSource: null,
    });
  }, []);

  const resetSignal = useCallback(() => {
    setSignalState(initialSignalState);
  }, []);

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

      // Time-correct exponential damping: framerate-independent across 60Hz, 120Hz, 144Hz
      const alpha = 1 - Math.exp(-DEPTH_DAMPING_LAMBDA * Math.min(dt, 0.1));
      const nextSmoothed = currentSmoothed + diff * alpha;
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

    let measureRaf = 0;
    const scheduleMeasure = () => {
      if (!measureRaf) {
        measureRaf = requestAnimationFrame(() => {
          measureMilestones();
          handleScroll();
          measureRaf = 0;
        });
      }
    };

    const handleResize = () => {
      scheduleMeasure();
    };

    // Initial measurement
    scheduleMeasure();

    // Re-measure once web fonts have fully resolved
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        scheduleMeasure();
      });
    }

    // Dynamic layout size changes (e.g. FAQ accordion toggle, BriefBuilder expansion)
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      const target = document.getElementById("main") || document.body;
      if (target) {
        ro = new ResizeObserver(() => {
          scheduleMeasure();
        });
        ro.observe(target);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      if (ro) ro.disconnect();
      if (measureRaf) cancelAnimationFrame(measureRaf);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [qualityConfig.isStatic]);

  // Delegated Scene-Signal System (Pointer & Keyboard Parity) + Section Entry Reveals
  useEffect(() => {
    if (typeof document === "undefined") return;

    // 1. Delegated pointer interactions (Desktop / Mouse only, touch protected)
    const handlePointerOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // Touch protection
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-experience-signal]");
      if (!target) return;

      const signal = (target.getAttribute("data-experience-signal") as ExperienceSignalType) || null;
      const indexAttr = target.getAttribute("data-experience-index");
      const index = indexAttr !== null ? parseInt(indexAttr, 10) : -1;

      setSignalState((prev) => {
        if (prev.activeSignal === signal && prev.activeSignalIndex === index && prev.signalSource === "pointer") {
          return prev;
        }
        return {
          activeSignal: signal,
          activeSignalIndex: index,
          signalSource: "pointer",
        };
      });
    };

    const handlePointerOut = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const current = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-experience-signal]");
      const next = (e.relatedTarget as HTMLElement | null)?.closest<HTMLElement>("[data-experience-signal]");

      if (current && (!next || next !== current)) {
        if (!next) {
          setSignalState(initialSignalState);
        }
      }
    };

    // 2. Keyboard Parity (focusin / focusout)
    const handleFocusIn = (e: FocusEvent) => {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-experience-signal]");
      if (!target) return;

      const signal = (target.getAttribute("data-experience-signal") as ExperienceSignalType) || null;
      const indexAttr = target.getAttribute("data-experience-index");
      const index = indexAttr !== null ? parseInt(indexAttr, 10) : -1;

      setSignalState({
        activeSignal: signal,
        activeSignalIndex: index,
        signalSource: "keyboard",
      });
    };

    const handleFocusOut = (e: FocusEvent) => {
      const current = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-experience-signal]");
      const next = (e.relatedTarget as HTMLElement | null)?.closest<HTMLElement>("[data-experience-signal]");

      if (current && (!next || next !== current)) {
        if (!next) {
          setSignalState(initialSignalState);
        }
      }
    };

    // 3. Safety Cleanups: window blur, document mouseleave
    const handleSafeReset = () => {
      setSignalState(initialSignalState);
    };

    document.addEventListener("pointerover", handlePointerOver, { passive: true });
    document.addEventListener("pointerout", handlePointerOut, { passive: true });
    document.addEventListener("focusin", handleFocusIn, { passive: true });
    document.addEventListener("focusout", handleFocusOut, { passive: true });
    document.addEventListener("mouseleave", handleSafeReset);
    window.addEventListener("blur", handleSafeReset);

    // 4. Section Entry Reveal Observer
    let revealObserver: IntersectionObserver | null = null;
    const isReduced = qualityConfig.isStatic;

    const revealTargets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (isReduced) {
      revealTargets.forEach((el) => el.classList.add("is-revealed"));
    } else if (typeof IntersectionObserver !== "undefined") {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-revealed");
              revealObserver?.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -40px 0px", threshold: 0.1 },
      );
      revealTargets.forEach((el) => revealObserver?.observe(el));
    }

    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
      document.removeEventListener("mouseleave", handleSafeReset);
      window.removeEventListener("blur", handleSafeReset);
      if (revealObserver) {
        revealObserver.disconnect();
      }
    };
  }, [qualityConfig.isStatic]);

  const value: ExperienceContextValue = {
    ...depthState,
    qualityConfig,
    signalState,
    triggerSignal,
    resetSignal,
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
