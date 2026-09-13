import type {
  DepthState,
  ExperienceMotionStore,
} from "./experience-types";

type MotionListener = (
  state: DepthState,
) => void;

export interface MutableExperienceMotionStore
  extends ExperienceMotionStore {
  publish: (
    state: DepthState,
  ) => void;
}

export function createExperienceMotionStore(
  initialState: DepthState,
): MutableExperienceMotionStore {
  let state = initialState;

  const listeners =
    new Set<MotionListener>();

  return {
    getState: () => state,

    subscribe: (
      listener: MotionListener,
    ) => {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },

    publish: (
      nextState: DepthState,
    ) => {
      state = nextState;

      for (
        const listener
        of listeners
      ) {
        listener(state);
      }
    },
  };
}
