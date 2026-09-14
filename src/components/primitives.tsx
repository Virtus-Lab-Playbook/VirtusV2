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
      className={`mx-auto w-full max-w-[74rem] px-5 sm:px-8 lg:px-10 ${className}`}
    >
      {children}
    </div>
  );
}

/** Quiet structural rule used at section headers. */
export function GoldRule({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`block h-px w-10 bg-tide ${className}`}
    />
  );
}

export function SectionHeader({
  title,
  intro,
  depth,
  id,
  eyebrow,
  light = false,
  "data-reveal": dataReveal,
}: {
  title: string;
  intro?: string;
  depth?: string;
  id?: string;
  eyebrow?: string;
  light?: boolean;
  "data-reveal"?: boolean;
}) {
  const headingColor = light ? "text-abyss" : "text-seaglass";
  const bodyColor = light ? "text-deep-2" : "text-tide";

  return (
    <header
      className="mb-12 max-w-[52rem] sm:mb-16"
      id={id}
      data-reveal={dataReveal ? "" : undefined}
    >
      {eyebrow || depth ? (
        <div className="mb-5 flex items-center gap-4">
          <GoldRule className={light ? "bg-deep-2" : ""} />
          <span
            className={`readout readout-caps ${light ? "text-deep-2" : "text-tide"}`}
          >
            {eyebrow ?? depth}
          </span>
        </div>
      ) : null}

      <h2 className={`text-h2 ${headingColor}`}>{title}</h2>

      {intro ? (
        <p
          className={`mt-4 max-w-[54ch] text-[1.02rem] leading-relaxed ${bodyColor}`}
        >
          {intro}
        </p>
      ) : null}
    </header>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "inverse";
  className?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  const base =
    "group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide";

  const styles =
    variant === "primary"
      ? "bg-seaglass text-abyss hover:bg-tide"
      : variant === "inverse"
        ? "bg-abyss text-seaglass hover:bg-deep-2"
        : "border border-shelf/80 bg-transparent text-seaglass hover:border-tide hover:bg-deep-2/25";

  return (
    <a href={href} className={`${base} ${styles} ${className}`}>
      {children}
      {variant !== "primary" ? (
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
