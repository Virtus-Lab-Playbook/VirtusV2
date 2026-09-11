"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { useExperience } from "@/experience/ExperienceContext";
import { Wordmark } from "./Wordmark";

export function Nav() {
  const [open, setOpen] = useState(false);
  const { smoothedDepth, rawDepth, resetSignal } = useExperience();

  // Unified scroll state derived directly from centralized depth system (no duplicate scroll listener)
  const lifted = rawDepth > 15;

  // Derive active navigation section from depth architecture
  let activeNavHref: string | null = null;
  if (smoothedDepth >= 80 && smoothedDepth < 650) {
    activeNavHref = "#services";
  } else if (smoothedDepth >= 650 && smoothedDepth < 1350) {
    activeNavHref = "#process";
  } else if (smoothedDepth >= 1350 && smoothedDepth < 2100) {
    activeNavHref = "#work";
  } else if (smoothedDepth >= 2900 && smoothedDepth < 3500) {
    activeNavHref = "#packages";
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      resetSignal();
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKeyDown);
      };
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, resetSignal]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        lifted
          ? "border-b border-shelf-dim/80 bg-abyss/90 backdrop-blur-md shadow-[0_8px_32px_-12px_rgba(4,23,30,0.9)]"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[74rem] items-center justify-between px-5 py-3.5 sm:px-8 lg:pl-[calc(var(--rail-w)+2rem)] lg:pr-10">
        <a
          href="#top"
          className="shrink-0 transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-biolume"
          aria-label={`${site.name} — home`}
        >
          <Wordmark />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {site.nav.links.map((l) => {
            const isActive = l.href === activeNavHref;
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={isActive ? "location" : undefined}
                className={`relative py-1 text-sm tracking-tight transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-px after:bg-biolume after:transition-all after:duration-250 ${
                  isActive
                    ? "text-seaglass after:w-full font-semibold"
                    : "text-tide after:w-0 hover:text-seaglass hover:after:w-full font-medium"
                }`}
              >
                {l.label}
              </a>
            );
          })}
          <a
            href={site.nav.action.href}
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-biolume px-5 py-2 text-sm font-medium tracking-tight text-abyss transition-all duration-200 hover:bg-seaglass hover:shadow-[0_0_20px_-4px_var(--color-biolume)] active:scale-[0.98]"
          >
            {site.nav.action.label}
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-12 w-12 items-center justify-center rounded-full text-seaglass transition-colors hover:text-biolume focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-biolume md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-200 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-px w-5 bg-current transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-5 bg-current transition-transform duration-200 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-shelf-dim/80 bg-abyss/95 backdrop-blur-xl md:hidden animate-in fade-in duration-200">
          <nav className="flex flex-col px-5 py-4 sm:px-8">
            {site.nav.links.map((l) => {
              const isActive = l.href === activeNavHref;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={isActive ? "location" : undefined}
                  onClick={() => setOpen(false)}
                  className={`border-b border-shelf-dim/60 py-3.5 text-[0.95rem] transition-colors flex items-center justify-between ${
                    isActive
                      ? "text-seaglass font-medium"
                      : "text-tide hover:text-seaglass"
                  }`}
                >
                  <span>{l.label}</span>
                  {isActive ? (
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-biolume shadow-[0_0_8px_1px_var(--color-biolume)]"
                    />
                  ) : null}
                </a>
              );
            })}
            <a
              href={site.nav.action.href}
              onClick={() => setOpen(false)}
              className="mt-5 inline-flex min-h-12 items-center justify-center rounded-full bg-biolume px-5 py-3 text-sm font-medium tracking-tight text-abyss transition-all duration-200 hover:bg-seaglass"
            >
              {site.nav.action.label}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
