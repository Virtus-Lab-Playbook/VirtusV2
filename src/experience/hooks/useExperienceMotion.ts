"use client";

import {
  useEffect,
  useRef,
} from "react";
import type {
  DepthState,
} from "../experience-types";
import {
  useExperience,
} from "../ExperienceContext";

export function useExperienceMotion(
  listener: (
    state: DepthState,
  ) => void,
) {
  const { motionStore } =
    useExperience();

  const listenerRef =
    useRef(listener);

  useEffect(() => {
    listenerRef.current =
      listener;
  });

  useEffect(() => {
    const notify = (
      state: DepthState,
    ) => {
      listenerRef.current(
        state,
      );
    };

    notify(
      motionStore.getState(),
    );

    return motionStore.subscribe(
      notify,
    );
  }, [motionStore]);
}
