"use client";

import { useExperience } from "@/experience/ExperienceContext";
import { MAX_DEPTH_METERS } from "@/experience/experience-config";

export function DepthRail() {
  const { rawDepth } = useExperience();

  const progress = Math.min(1, Math.max(0, rawDepth / MAX_DEPTH_METERS));
  const depth = Math.round(rawDepth / 10) * 10;
  const ticks = [0, 1000, 2000, 3000, MAX_DEPTH_METERS];

  return (
    <aside
      aria-hidden
      className="fixed left-0 top-0 z-30 hidden h-screen w-[var(--rail-w)] flex-col items-center justify-between border-r border-shelf/55 bg-abyss/78 py-6 backdrop-blur-sm lg:flex"
    >
      <span className="readout rotate-180 text-[0.6rem] tracking-[0.2em] [writing-mode:vertical-rl]">
        depth
      </span>

      <div className="relative my-4 w-px flex-1 origin-top bg-shelf/45 [animation:rail-rise_1.1s_cubic-bezier(0.22,1,0.36,1)]">
        <div
          className="absolute left-0 top-0 w-px bg-tide"
          style={{ height: `${progress * 100}%` }}
        />

        {ticks.map((tick) => (
          <span
            key={tick}
            className="absolute -left-1 h-px w-2 bg-shelf"
            style={{ top: `${(tick / MAX_DEPTH_METERS) * 100}%` }}
          />
        ))}

        <span
          className="absolute -left-[3px] h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-seaglass shadow-[0_0_10px_1px_rgba(224,225,220,0.28)]"
          style={{ top: `${progress * 100}%` }}
        />
      </div>

      <span className="flex flex-col items-center leading-tight">
        <span className="readout tabular-nums text-[0.66rem] text-seaglass">
          {depth}
        </span>
        <span className="readout text-[0.58rem] text-tide">m</span>
      </span>
    </aside>
  );
}
