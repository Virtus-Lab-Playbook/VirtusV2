export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-1.5 ${className}`}>
      <span className="font-display text-[1.35rem] leading-none tracking-tight text-seaglass">
        Virtus
      </span>
      <span className="readout text-[0.72rem] text-tide">Lab</span>
    </span>
  );
}
