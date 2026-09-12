"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { useExperience } from "@/experience/ExperienceContext";
import { useExperienceMotion } from "@/experience/hooks/useExperienceMotion";
import { SECTION_DEPTHS } from "@/experience/experience-config";
import { Wordmark } from "./Wordmark";

function getActiveHref(depth: number): string | null {
  if (depth >= SECTION_DEPTHS.work && depth < SECTION_DEPTHS.services) {
    return "#work";
  }

  if (depth >= SECTION_DEPTHS.services && depth < SECTION_DEPTHS.products) {
    return "#services";
  }

  if (depth >= SECTION_DEPTHS.products && depth < SECTION_DEPTHS.whyUs) {
    return "#products";
  }

  if (depth >= SECTION_DEPTHS.whyUs && depth < SECTION_DEPTHS.process) {
    return "#why-us";
  }

  if (depth >= SECTION_DEPTHS.process && depth < SECTION_DEPTHS.engagements) {
    return "#process";
  }

  return null;
}

type MotionNavState = {
  lifted: boolean;
  activeNavHref: string | null;
  briefActive: boolean;
};

export function Nav() {
  const [open, setOpen] = useState(false);
  const { resetSignal } = useExperience();

  const [motionNav, setMotionNav] = useState<MotionNavState>({
    lifted: false,
    activeNavHref: null,
    briefActive: false,
  });

  const motionNavRef = useRef(motionNav);

  useExperienceMotion(({ rawDepth, smoothedDepth }) => {
    const next: MotionNavState = {
      lifted: rawDepth > 15,
      activeNavHref: getActiveHref(smoothedDepth),
      briefActive:
        smoothedDepth >= SECTION_DEPTHS.brief &&
        smoothedDepth < SECTION_DEPTHS.faq,
    };

    const current = motionNavRef.current;

    if (
      current.lifted === next.lifted &&
      current.activeNavHref === next.activeNavHref &&
      current.briefActive === next.briefActive
    ) {
      return;
    }

    motionNavRef.current = next;
    setMotionNav(next);
  });

  const { lifted, activeNavHref, briefActive } = motionNav;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    if (open) {
      resetSignal();

      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") setOpen(false);
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
          ? "border-b border-shelf/55 bg-abyss/92 shadow-[0_8px_32px_-16px_rgba(15,27,42,0.9)] backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[74rem] items-center justify-between px-5 py-3.5 sm:px-8 lg:pl-[calc(var(--rail-w)+2rem)] lg:pr-10">
        <a
          href="#top"
          className="shrink-0 transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide"
          aria-label={`${site.name} — home`}
        >
          <Wordmark />
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {site.nav.links.map((link) => {
            const isActive = link.href === activeNavHref;

            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive ? "location" : undefined}
                className={`relative py-1 text-sm tracking-tight transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-px after:bg-tide after:transition-all after:duration-200 ${
                  isActive
                    ? "font-semibold text-seaglass after:w-full"
                    : "font-medium text-tide after:w-0 hover:text-seaglass hover:after:w-full"
                }`}
              >
                {link.label}
              </a>
            );
          })}

          <a
            href={site.nav.action.href}
            className={`inline-flex min-h-10 items-center justify-center rounded-full px-5 py-2 text-sm font-semibold tracking-tight transition-all duration-300 active:scale-[0.98] ${
              briefActive
                ? "bg-tide text-abyss shadow-[0_0_0_4px_rgba(121,141,168,0.12)]"
                : "bg-seaglass text-abyss hover:bg-tide"
            }`}
          >
            {site.nav.action.label}
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-12 w-12 items-center justify-center rounded-full text-seaglass transition-colors hover:text-tide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide lg:hidden"
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
        <div className="border-t border-shelf/55 bg-abyss/98 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col px-5 py-4 sm:px-8">
            {site.nav.links.map((link) => {
              const isActive = link.href === activeNavHref;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "location" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between border-b border-shelf/45 py-3.5 text-[0.95rem] transition-colors ${
                    isActive
                      ? "font-medium text-seaglass"
                      : "text-tide hover:text-seaglass"
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive ? (
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-seaglass"
                    />
                  ) : null}
                </a>
              );
            })}

            <a
              href={site.nav.action.href}
              onClick={() => setOpen(false)}
              className={`mt-5 inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-tight text-abyss transition-colors ${
                briefActive
                  ? "bg-tide"
                  : "bg-seaglass hover:bg-tide"
              }`}
            >
              {site.nav.action.label}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
