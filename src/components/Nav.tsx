"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { Wordmark } from "./Wordmark";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        lifted
          ? "border-shelf-dim bg-abyss/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[74rem] items-center justify-between px-5 py-4 sm:px-8 lg:pl-[calc(var(--rail-w)+2rem)] lg:pr-10">
        <a href="#top" className="shrink-0" aria-label={`${site.name} — home`}>
          <Wordmark />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {site.nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="relative py-1 text-sm text-tide transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-biolume after:transition-all after:duration-300 hover:text-seaglass hover:after:w-full"
            >
              {l.label}
            </a>
          ))}
          <a
            href={site.nav.action.href}
            className="inline-flex min-h-11 items-center rounded-full bg-biolume px-5 py-2 text-sm font-medium text-abyss transition-all duration-300 hover:bg-seaglass hover:shadow-[0_0_24px_-6px_var(--color-biolume)]"
          >
            {site.nav.action.label}
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 block h-px w-5 bg-seaglass transition-transform duration-200 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-px w-5 bg-seaglass transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-5 bg-seaglass transition-transform duration-200 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-shelf-dim bg-abyss md:hidden">
          <nav className="flex flex-col px-5 py-3 sm:px-8">
            {site.nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-shelf-dim py-3.5 text-tide"
              >
                {l.label}
              </a>
            ))}
            <a
              href={site.nav.action.href}
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-biolume px-5 py-3 text-sm font-medium text-abyss"
            >
              {site.nav.action.label}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
