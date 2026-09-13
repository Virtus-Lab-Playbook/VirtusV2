"use client";

import { useEffect, useState } from "react";
import type { QualityConfig, SceneQuality } from "../experience-types";
import { QUALITY_DPR_CAPS } from "../experience-config";

/**
 * Evaluates device capabilities, user preferences, and viewport metrics
 * to classify the 3D scene into an optimal quality tier.
 */
function resolveQuality(): QualityConfig {
  if (typeof window === "undefined") {
    return {
      quality: "HIGH",
      maxDpr: QUALITY_DPR_CAPS.HIGH,
      antialias: true,
      isStatic: false,
    };
  }

  // 1. Accessibility check: reduced motion always forces STATIC mode
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    return {
      quality: "STATIC",
      maxDpr: QUALITY_DPR_CAPS.STATIC,
      antialias: false,
      isStatic: true,
    };
  }

  // 2. Hardware WebGL support check
  const hasWebGL = (() => {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
      );
    } catch {
      return false;
    }
  })();

  if (!hasWebGL) {
    return {
      quality: "STATIC",
      maxDpr: QUALITY_DPR_CAPS.STATIC,
      antialias: false,
      isStatic: true,
    };
  }

  // 3. Viewport width heuristic
  const width = window.innerWidth;
  const cores = navigator.hardwareConcurrency ?? 8;

  let quality: SceneQuality = "HIGH";

  if (width < 640) {
    quality = "LOW";
  } else if (width < 1024) {
    quality = cores < 4 ? "LOW" : "MEDIUM";
  } else {
    quality = cores < 4 ? "MEDIUM" : "HIGH";
  }

  return {
    quality,
    maxDpr: QUALITY_DPR_CAPS[quality],
    antialias: quality === "HIGH",
    isStatic: false,
  };
}

export function useSceneQuality(): QualityConfig {
  const [config, setConfig] = useState<QualityConfig>(() => resolveQuality());

  useEffect(() => {
    const updateQuality = () => {
      setConfig(resolveQuality());
    };

    const mediaMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    mediaMotion.addEventListener("change", updateQuality);
    window.addEventListener("resize", updateQuality);

    return () => {
      mediaMotion.removeEventListener("change", updateQuality);
      window.removeEventListener("resize", updateQuality);
    };
  }, []);

  return config;
}
