import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[74rem] px-5 sm:px-8 lg:pl-[calc(var(--rail-w)+2rem)] lg:pr-10 ${className}`}
    >
      {children}
    </div>
  );
}

/** The Gold Rule — a short brass line that marks the start of a section (Blueprint §4.4). */
export function GoldRule({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`block h-px w-10 bg-brass ${className}`}
    />
  );
}

export function SectionHeader({
  title,
  intro,
  depth,
  id,
}: {
  title: string;
  intro?: string;
  depth?: string;
  id?: string;
}) {
  return (
    <header className="mb-14 max-w-[46ch]" id={id}>
      <div className="mb-6 flex items-center gap-4">
        <GoldRule />
        {depth ? (
          <span className="readout inline-flex items-center gap-2">
            <span aria-hidden className="h-1 w-1 rounded-full bg-tide/60" />
            {depth}
          </span>
        ) : null}
      </div>
      <h2 className="text-h2">{title}</h2>
      {intro ? (
        <p className="mt-5 text-[1.06rem] leading-relaxed text-tide">{intro}</p>
      ) : null}
    </header>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-300";
  const styles =
    variant === "primary"
      ? "bg-biolume text-abyss shadow-[0_0_0_0_var(--color-biolume)] hover:bg-seaglass hover:shadow-[0_0_28px_-6px_var(--color-biolume)]"
      : "border border-shelf text-seaglass hover:border-biolume hover:text-biolume";
  return (
    <a href={href} className={`${base} ${styles} ${className}`}>
      {children}
      {variant === "secondary" ? (
        <span
          aria-hidden
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      ) : null}
    </a>
  );
}
