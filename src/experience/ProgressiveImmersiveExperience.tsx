"use client";

import {
  useEffect,
  useState,
  type ComponentType,
} from "react";

type ExperienceComponent =
  ComponentType;

type IdleWindow =
  Window & {
    requestIdleCallback?: (
      callback: () => void,
      options?: {
        timeout?: number;
      },
    ) => number;
    cancelIdleCallback?: (
      handle: number,
    ) => void;
  };

export function ProgressiveImmersiveExperience() {
  const [
    Experience,
    setExperience,
  ] =
    useState<ExperienceComponent | null>(
      null,
    );

  useEffect(() => {
    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

    if (reducedMotion) {
      return;
    }

    let cancelled =
      false;

    const load = async () => {
      const expModule =
        await import(
          "./ImmersiveExperience"
        );

      if (!cancelled) {
        setExperience(
          () =>
            expModule.ImmersiveExperience,
        );
      }
    };

    const idleWindow =
      window as IdleWindow;

    let idleHandle = 0;
    let timeoutHandle = 0;

    if (
      idleWindow.requestIdleCallback
    ) {
      idleHandle =
        idleWindow.requestIdleCallback(
          () => {
            void load();
          },
          {
            timeout: 900,
          },
        );
    } else {
      timeoutHandle =
        window.setTimeout(
          () => {
            void load();
          },
          240,
        );
    }

    return () => {
      cancelled = true;

      if (
        idleHandle &&
        idleWindow
          .cancelIdleCallback
      ) {
        idleWindow.cancelIdleCallback(
          idleHandle,
        );
      }

      if (
        timeoutHandle
      ) {
        window.clearTimeout(
          timeoutHandle,
        );
      }
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="immersive-css-fallback fixed inset-0 -z-20 pointer-events-none"
      />

      {Experience ? (
        <Experience />
      ) : null}
    </>
  );
}
