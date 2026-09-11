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
    <header className="mb-12 sm:mb-16 max-w-[48ch]" id={id}>
      <div className="mb-5 flex items-center gap-4">
        <GoldRule />
        {depth ? (
          <span className="readout inline-flex items-center gap-2 text-tide/90">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-biolume shadow-[0_0_8px_1px_var(--color-biolume)]"
            />
            {depth}
          </span>
        ) : null}
      </div>
      <h2 className="text-h2 text-seaglass">{title}</h2>
      {intro ? (
        <p className="mt-4 text-[1.05rem] leading-relaxed text-tide max-w-[50ch]">{intro}</p>
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
    "group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-all duration-200 active:scale-[0.98]";
  const styles =
    variant === "primary"
      ? "bg-biolume text-abyss hover:bg-seaglass hover:shadow-[0_0_24px_-4px_var(--color-biolume)]"
      : "border border-shelf bg-deep/20 text-seaglass hover:border-biolume hover:text-biolume hover:bg-deep/40";
  return (
    <a href={href} className={`${base} ${styles} ${className}`}>
      {children}
      {variant === "secondary" ? (
        <span
          aria-hidden
          className="transition-transform duration-200 group-hover:translate-x-1"
        >
          →
        </span>
      ) : null}
    </a>
  );
}
