/**
 * Bathymetric contour divider — the page's structural device.
 * Concentric depth lines, like a nautical chart, marking the move between sections.
 */
export function Contour({ animate = false }: { animate?: boolean }) {
  const lines = [
    "M0 96 C 180 74, 360 74, 540 92 S 900 116, 1200 88",
    "M0 78 C 200 58, 380 60, 560 76 S 920 98, 1200 70",
    "M0 60 C 220 44, 400 48, 600 60 S 940 78, 1200 54",
    "M0 42 C 240 30, 420 36, 640 44 S 960 58, 1200 40",
  ];
  return (
    <div aria-hidden className="pointer-events-none w-full overflow-hidden">
      <svg
        viewBox="0 0 1200 120"
        className={`h-20 w-full sm:h-28 ${animate ? "contour-draw" : ""}`}
        fill="none"
        preserveAspectRatio="none"
      >
        {lines.map((d, i) => (
          <path
            key={d}
            d={d}
            stroke={i === 0 ? "var(--color-brass)" : "var(--color-shelf)"}
            strokeOpacity={i === 0 ? 0.75 : 0.55 - i * 0.1}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}
