/**
 * Interim wordmark. TODO(Brand Pod): swap for the locked mark at L8 (§3.4).
 * "Virtus" set in the display serif, "Lab" in the mono — classical standards, modern tools.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-1.5 ${className}`}>
      <span className="font-display text-[1.35rem] leading-none tracking-tight">
        Virtus
      </span>
      <span className="readout text-[0.72rem] text-brass">Lab</span>
    </span>
  );
}
