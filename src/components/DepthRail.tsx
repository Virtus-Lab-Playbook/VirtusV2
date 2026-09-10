"use client";

import { useEffect, useRef, useState } from "react";

const FLOOR = 3800; // metres — abyssal plain, at the footer

export function DepthRail() {
  const [progress, setProgress] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      raf.current = 0;
    };
    const onScroll = () => {
      if (!raf.current) raf.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const depth = Math.round((progress * FLOOR) / 10) * 10;
  const ticks = [0, 1000, 2000, 3000, FLOOR];

  return (
    <aside
      aria-hidden
      className="fixed left-0 top-0 z-30 hidden h-screen w-[var(--rail-w)] flex-col items-center justify-between border-r border-shelf-dim bg-abyss/70 py-6 backdrop-blur-sm lg:flex"
    >
      <span className="readout rotate-180 [writing-mode:vertical-rl] text-[0.6rem] tracking-[0.2em]">
        depth
      </span>

      <div className="relative flex-1 my-4 w-px bg-shelf-dim origin-top [animation:rail-rise_1.1s_cubic-bezier(0.22,1,0.36,1)]">
        <div
          className="absolute left-0 top-0 w-px bg-biolume-dim"
          style={{ height: `${progress * 100}%` }}
        />
        {ticks.map((t) => (
          <span
            key={t}
            className="absolute -left-1 h-px w-2 bg-shelf"
            style={{ top: `${(t / FLOOR) * 100}%` }}
          />
        ))}
        <span
          className="absolute -left-[3px] h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-biolume shadow-[0_0_10px_2px_var(--color-biolume)] transition-[top] duration-150 ease-out"
          style={{ top: `${progress * 100}%` }}
        />
      </div>

      <span className="flex flex-col items-center leading-tight">
        <span className="readout tabular-nums text-[0.66rem] text-biolume">
          {depth}
        </span>
        <span className="readout text-[0.58rem] text-tide">m</span>
      </span>
    </aside>
  );
}
